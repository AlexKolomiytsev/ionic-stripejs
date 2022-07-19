import { IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonLoading, IonPage } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';

import { ServicePackage } from '../utils/data';
import { compareObjects, fetchPackages } from '../utils/utils';
import { get, set, remove } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import ProductItem from '../components/ProductItem';

// import './ActiveProducts.css';
import '../styles/index.css';
import '../styles/text.css';

type Props = {
  default_location_id: number;
}

const PTProductsList: React.FC<Props> = ({ default_location_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [allProducts, setAllProducts] = useState<ServicePackage[]>([]);
  const [trainerFilters, setTrainerFilters] = useState<number[]>();
  const [locationFilters, setLocationFilters] = useState<number[]>();
  const [showLoading, setShowLoading] = useState(true);

  const fetching = async (trainers: number[], locations: number[]) => {
    try{
      let data: ServicePackage[] = [];
      let resp: ServicePackage[] | undefined = [];
      if(trainers && trainers.length && locations && locations.length) {
        await Promise.all(
          trainers.map(async (trainer: number) => {
            await Promise.all(
              locations.map(async (location: number) => {
              resp = await fetchPackages('?unified_filters[location_id]=' + location + '&unified_filters[trainer_id]=' + trainer);
              if(resp) {
                data.push(...resp);
              }
              console.log(data);
            })
            );
          })
        );
        data = await [...new Map(data.map(item => [item['name'], item])).values()];
        console.log(data);
      }
      else if(trainers && trainers.length) {
        await Promise.all(
          trainers.map(async (trainer: number) => {
            resp = await fetchPackages('?unified_filters[trainer_id]=' + trainer);
            if(resp) {
              data.push(...resp);
            }
            console.log(resp);
          })
        );
        data = [...new Map(data.map(item => [item['name'], item])).values()];
      }
      else if(locations && locations.length) {
        await Promise.all(
          locations.map(async (location: number) => {
            resp = await fetchPackages('?unified_filters[location_ids]=' + location);
            if(resp) {
              data.push(...resp);
            }
            console.log(resp);
          })
        );
        data = [...new Map(data.map(item => [item['name'], item])).values()];
      }
      else {
        data = await fetchPackages();
      }
      return data;
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const getAllProducts = async () => {
      let trainers = await get('instructors');
      let locations = await get('location_ids');
      if(!locations) {
        locations = [];
        locations.push(default_location_id);
      }
      await setTrainerFilters(trainers);
      await setLocationFilters(locations);
      let data = await fetching(trainers, locations);
      if(data) {
        data = await data.sort((item1: any, item2: any) => {return compareObjects(item1, item2, 'name');});
        console.log(data);
        await setAllProducts(data);
        setShowLoading(false);
      }
    }

    getAllProducts();
    set('entry_point', { classes: false, locations: true, class_types:false, instructors: true, services: false });
  }, []);

  const clearFilters = async () => {
    await remove('classes');
    await remove('locations');
    await remove('location_ids');
    await remove('class_types');
    await remove('instructors');
  }

  return (
    <IonPage>
      <IonHeader translucent style={{position: 'relative', top: '0px', backgroundColor: '#FFFFFF', zIndex: 20}}>
        <BasicHeader title={t('headers.products')} onClick={clearFilters} />
        <div style={{backgroundColor: '#FFFFFF'}}>
          <div className='scrollable'>
            <div className='chip' key='filters-chip-div'>
              <IonChip color="dark" className='chip' onClick={() => {history.push("/filters");}} key='filters-chip'>
                <ReactSVG src='/assets/icon/filters.svg' className='color-icon' style={{fontSize: '24px', marginRight: '4px'}}/>
                <IonLabel>{t('filter.filters')}</IonLabel>
              </IonChip>
            </div>
            {/*}<div className='chip' key='classes-chip-div'>
              <IonChip className={`chip ${(classFilters && classFilters.length) ? "color-chip" : "white-chip"}`} key='classes-chip'>
                <IonLabel>{(classFilters && classFilters.length) ? (classFilters.length === 1 ? classFilters.length + ' class' : classFilters.length + ' classes') : 'All classes'}</IonLabel>
              </IonChip>
            </div>*/}
            <div className='chip' key='locations-chip-div'>
              <IonChip className={`chip ${(locationFilters && locationFilters.length) ? "color-chip" : "white-chip"}`} key='locations-chip'>
                <IonLabel>{(locationFilters && locationFilters.length) ? (locationFilters.length === 1 ? locationFilters.length + ' ' + t('filter.location') : locationFilters.length + ' ' + t('filter.locations')) : t('filter.all_locations')}</IonLabel>
              </IonChip>
            </div>
            {/*}<div className='chip' key='class-types-chip-div'>
              <IonChip className={`chip ${(classTypeFilters && classTypeFilters.length) ? "color-chip" : "white-chip"}`} key='class-types-chip'>
                <IonLabel>{(classTypeFilters && classTypeFilters.length) ? (classTypeFilters.length === 1 ? classTypeFilters.length + ' activity' : classTypeFilters.length + ' activities') : 'All activities'}</IonLabel>
              </IonChip>
            </div>*/}
            <div className='chip' key='instructors-chip-div'>
              <IonChip className={`chip ${(trainerFilters && trainerFilters.length) ? "color-chip" : "white-chip"}`} key='instructors-chip'>
                <IonLabel>{(trainerFilters && trainerFilters.length) ? (trainerFilters.length === 1 ? trainerFilters.length + ' ' + t('filter.instructor') : trainerFilters.length + ' ' + t('filter.instructors')) : t('filter.all_instructors')}</IonLabel>
              </IonChip>
            </div>
          </div>
        </div>
      </IonHeader>
      <IonLoading
        cssClass='loading'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
      />
      <IonContent force-overscroll  style={{background: '#F4F4F4', height: '100%'}}>
        <div style={{paddingBottom: '50px'}}>
          {allProducts.map((item: ServicePackage) => {
            return (
              <ProductItem currentProduct={item} item_key={item.product_id}/>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PTProductsList;
