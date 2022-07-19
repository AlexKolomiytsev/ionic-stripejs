import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonChip, IonContent, IonHeader, IonLabel, IonLoading, IonSearchbar, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';   
import { isPlatform } from '@ionic/react';

import { Trainer, TrainerActivity } from '../utils/data';
import { compareObjects, fetchTrainers } from '../utils/utils';
import { get, set, remove } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

import '../styles/index.css'
import '../styles/TrainersPage.css';

const TrainersPage: React.FC = () => {

  let history = useHistory();
  const { t } = useTranslation();

  const [tabName, setTabName] = useState<string>();
  const [trainers, setTrainers] = useState<any>([]);
  const [serviceFilters, setServiceFilters] = useState<string[]>();
  const [locationFilters, setLocationFilters] = useState<number[]>();
  const [flow, setFlow] = useState<string>('trainers');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const fetching = async (service_category: number, services: number[], locations: number[]) => {
      try{
        let data: Trainer[] = [];
        let resp: Trainer[] | undefined = [];
        if(services && services.length && locations && locations.length) {
          await Promise.all(
            services.map(async (service: number) => {
              await Promise.all(
                locations.map(async (location: number) => {
                  resp = await fetchTrainers('?unified_filters[service_category_id]=' + service_category + '&unified_filters[location_ids]=' + location + '&unified_filters[service_id]=' + service);
                  if(resp) {
                    data.push(...resp);
                  }
                })
              )
            })
          );
          data = await [...new Map(data.map(item => [item['name'], item])).values()];
          console.log(data);
        }
        else if(services && services.length) {
          await Promise.all(
            services.map(async (service: number) => {
              resp = await fetchTrainers('?unified_filters[service_category_id]=' + service_category + '&unified_filters[service_id]=' + service);
              if(resp) {
                data.push(...resp);
              }
            })
          );
          data = [...new Map(data.map(item => [item['name'], item])).values()];
        }
        else if(locations && locations.length) {
          await Promise.all(
            locations.map(async (location: number) => {
              resp = await fetchTrainers('?unified_filters[service_category_id]=' + service_category + '&unified_filters[location_ids]=' + location);
              if(resp) {
                data.push(...resp);
              }
            })
          );
          data = [...new Map(data.map(item => [item['name'], item])).values()];
        }
        else {
          data = await fetchTrainers('?unified_filters[service_category_id]=' + service_category) || [];
        }
        return data;
      }
      catch(e) {
        console.log(e);
      }
    }

    const getTrainers = async () => {
      setShowLoading(true);
      let data: any = [];
      let current_flow = await get('flow');

      await setFlow(current_flow);
      console.log(current_flow === 'trainers');
      if(current_flow === 'trainers') {
        let service_category = await get('current_service_category');
        let services = await get('classes');
        let locations = await get('location_ids');
        await setServiceFilters(services);
        await setLocationFilters(locations);
        data = await fetching(service_category, services, locations);
      }
      else if(current_flow === 'services') {
        setTabName(await get('current_tab_name'));
        let current_services = await get('current_service');
        console.log(current_services);
        await Promise.all(
          current_services.map((item: TrainerActivity) => {
            data.push(item.trainer);
          })
        );
      }
      if(data) {
        console.log(data);
        await setTrainers(data.sort((item1: any, item2: any) => {return compareObjects(item1, item2, 'name');}));
      }
      setShowLoading(false);
    }

    getTrainers();
    set('entry_point', { classes: false, locations: true, class_types:false, instructors: false, services: true });
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
      <IonLoading
       cssClass='loading'
       isOpen={showLoading}
       onDidDismiss={() => setShowLoading(false)}
      />
      <IonHeader style={{position: 'relative', top: '0px'}}>
      {flow === 'trainers' ? <BasicHeader title={t('headers.personal_trainers')} onClick={clearFilters} /> :
        <BasicHeader title={t('book') +  ' ' + tabName} onClick={clearFilters} />}
        {flow === 'trainers' ?
          <div>
            <div className='scrollable' style={{backgroundColor: '#ffffff'}}>
              <div className='chip EGymText-12x-0072' key='filters-chip-div'>
                <IonChip color="dark" className='chip EGymText-12x-0072' onClick={() => {
                  history.push("/filters");
                }} key='filters-chip'>
                  <ReactSVG src='/assets/icon/filters.svg' className='color-icon' style={{fontSize: '24px', marginRight: '4px'}}/>
                  <IonLabel>{t('filter.filters')}</IonLabel>
                </IonChip>
              </div>
              <div className='chip EGymText-12x-0072' key='classes-chip-div'>
                <IonChip className={`chip ${(serviceFilters && serviceFilters.length) ? "color-chip" : "white-chip"}`} key='classes-chip'>
                  <IonLabel>{(serviceFilters && serviceFilters.length) ? (serviceFilters.length === 1 ? serviceFilters.length + ' ' + t('filter.service') : serviceFilters.length + ' ' + t('filter.services')) : t('filter.all_services')}</IonLabel>
                </IonChip>
              </div>
              <div className='chip EGymText-12x-0072' key='locations-chip-div'>
                <IonChip className={`chip ${(locationFilters && locationFilters.length) ? "color-chip" : "white-chip"}`} key='locations-chip'>
                  <IonLabel>{(locationFilters && locationFilters.length) ? (locationFilters.length === 1 ? locationFilters.length + ' ' + t('filter.location') : locationFilters.length + ' ' + t('filter.locations')) : t('filter.all_locations')}</IonLabel>
                </IonChip>
              </div>
            </div>
          </div>
            :
          <IonSearchbar className='searchbar'></IonSearchbar>
        }
      </IonHeader>
      <IonContent>{/* className='body' style={{position: 'absolute', top: `${isPlatform('android') ? '55px' : '0px'}`}}*/}
        <div style={{display: 'flex', overflowY: 'scroll', flexDirection: 'column', position: 'relative', paddingBottom: `${flow === 'trainers' ? '65px' : '80px'}`, backgroundColor: '#F4F4F4', minHeight: '100vh'}}>{/*top: `${flow === 'trainers' ? '65px' : '80px'}`, */}
          <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginLeft: '10px', marginRight: '10px'}}>
            {trainers && trainers.map((trainer: Trainer, index: number) => (
              <IonCard key={trainer.id} className='trainer-card' onClick={ async () => {
                await set('current_trainer_id', trainer.id);
                // await clearFilters();
                history.push('/trainer_profile');
              }}>
              <IonCardContent className='trainer-card-content'>
                <img src={trainer.image ? trainer.image : '/assets/icon/profile_image.png'} className='trainer-img' alt='Trainer'/>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <IonCardTitle className='EGymText-16px-032'>{trainer.name.split(' ')[0]}</IonCardTitle>
                </div>
                </IonCardContent>
            </IonCard>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TrainersPage;
