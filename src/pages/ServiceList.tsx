import React, { useState, useEffect } from 'react';
import { IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';

import { Service } from '../utils/data';
import { compareObjects, fetchServices } from '../utils/utils';
import { get, set, remove } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

import '../styles/index.css';
import '../styles/text.css';

const ServiceList: React.FC = () => {

  let history = useHistory();
  const { t } = useTranslation();

  const [tabName, setTabName] = useState<string>();
  const [services, setServices] = useState<Service[]>([]);
  const [locationFilters, setLocationFilters] = useState<string[]>();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      let locations = await get('location_ids');
      setLocationFilters(locations);
      let service_category_id = await get('current_service_category');
      setTabName(await get('current_tab_name'));
      let services: Service[] | undefined = [];
      let params = '?unified_filters[service_category_id]=' + service_category_id;
      // if(locations && locations.length) {
      //   let resp: Service[] | undefined = [];
      //   await Promise.all(
      //     locations.map(async (location: number) => {
      //       resp = await fetchServices(params + '&unified_filters[location_id]=' + location);
      //       if(resp) {
      //         services!.push(...resp);
      //       }
      //       console.log(resp);
      //     })
      //   );
      // }
      // else {
      services = await fetchServices(params);
      // }
      if (services) {
        console.log(services);
        await setServices(services.sort((item1: any, item2: any) => {return compareObjects(item1, item2, 'service_title');}));
        setShowLoading(false);
      }
    }

    getServices();
    set('entry_point', { classes: false, locations: true, class_types: false, instructors: false, services: false });
  }, []);

  // const mapToNames = async ( arr: TrainerActivity[] ) => {
  //   let byNames: { [id: string]: TrainerActivity[] } = {};
  //   arr.map((item) => {
  //     if(Object.keys(byNames).find((title) => {
  //       return title === item.service.service_title;
  //     })) {
  //       byNames[item.service.service_title].push(item);
  //     }
  //     else {
  //       byNames[item.service.service_title] = [item];
  //     }
  //   })
  //   return byNames;
  // }

  const clearFilters = async () => {
    await remove('classes');
    await remove('locations');
    await remove('location_ids');
    await remove('class_types');
    await remove('instructors');
  }

  return (
    <IonPage className='text'>
      <IonContent force-overscroll scroll-events
        className='background-color'
        onIonScroll={() => {

        }}
        onIonScrollEnd={() => { }}
      >
        <IonHeader style={{ position: 'fixed', top: '0px', zIndex: 20 }}>
          <BasicHeader title={t('filter.services').charAt(0).toUpperCase() + t('filter.services').slice(1)} />{/* onClick={clearFilters} */}
          <div className='top-border'>
            <div className='scrollable' style={{ backgroundColor: '#ffffff' }}>
              <div className='chip' key='filters-chip-div'>
                <IonChip color="dark" className='chip' onClick={() => {
                  set('entry_point', { classes: false, locations: true, class_types: false, instructors: false, services: false });
                  history.push("/filters");
                }} key='filters-chip'>
                  <ReactSVG src='/assets/icon/filters.svg' className='color-icon' style={{ fontSize: '24px', marginRight: '4px' }} />
                  <IonLabel>{t('filter.filters')}</IonLabel>
                </IonChip>
              </div>
              {/*}<div className='chip' key='classes-chip-div'>
                <IonChip className={`chip ${(serviceFilters && serviceFilters.length) ? "color-chip" : "white-chip"}`} key='classes-chip'>
                  <IonLabel>{(serviceFilters && serviceFilters.length) ? (serviceFilters.length === 1 ? serviceFilters.length + ' service' : serviceFilters.length + ' services') : 'All services'}</IonLabel>
                </IonChip>
              </div>*/}
              <div className='chip' key='locations-chip-div'>
                <IonChip className={`chip ${(locationFilters && locationFilters.length) ? "color-chip" : "white-chip"}`} key='locations-chip'>
                  <IonLabel>{(locationFilters && locationFilters.length) ? (locationFilters.length === 1 ? locationFilters.length + ' ' + t('filter.location') : locationFilters.length + ' ' + t('filter.locations')) : t('filter.all_locations')}</IonLabel>
                </IonChip>
              </div>
              {/*}<div className='chip' key='instructors-chip-div'>
                <IonChip className={`chip ${(instructorsFilters && instructorsFilters.length) ? "color-chip" : "white-chip"}`} key='instructors-chip'>
                  <IonLabel>{(instructorsFilters && instructorsFilters.length) ? (instructorsFilters.length === 1 ? instructorsFilters.length + ' trainer' : instructorsFilters.length + ' trainers') : 'All trainers'}</IonLabel>
                </IonChip>
              </div>*/}
            </div>
          </div>
        </IonHeader>
        <IonLoading
          cssClass='loading'
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
        />
        <div style={{ background: '#F4F4F4', position: 'relative', top: '119px', width: '100vw' }} id='body'>
          <IonList style={{ padding: '0px', display: 'flex', overflowY: 'scroll', flexDirection: 'column' }}>
            {services && services.map((service) => (
              <IonItem lines="none" className='trainer-activity-card' key={service.service_title} onClick={async () => {
                // await set('current_trainer_activity_id', services[key][0].id);
                // await set('current_service_id', services[key][0].service.id);
                // await set('current_location_id', services[key][0].location.id);
                // await clearFilters();
                // await set('current_service', [service]);
                set('classes', [service.id]);
                history.push('/find_a_class');
              }}>
                <div className='two-side-container' style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <IonText className='EGymText-16px-032' style={{ fontWeight: 600 }}>{service.service_title}</IonText>
                    <IonText>{(service.duration_in_hours ? service.duration_in_hours + t('hr') : "") + (service.duration_in_minutes ? service.duration_in_minutes + t('mins') : "")}</IonText>
                  </div>
                  <IonIcon icon={chevronForwardOutline} className='section-icon'></IonIcon>
                </div>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ServiceList;
