import React, { useState, useEffect, useRef } from 'react';
import { IonButton, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage, IonText, IonToolbar } from '@ionic/react';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';

import { TrainerActivity } from '../utils/data';
import { fetchTrainerActivities } from '../utils/utils';
import { get, set, remove } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

// import './TrainerServiceList.css';
import '../styles/index.css'

export type Props = {
  client_id: number;
}

const TrainerServiceList: React.FC<Props> = ({ client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [tabName, setTabName] = useState<string>();
  const [services, setServices] = useState<{ [id: string]: TrainerActivity[] }>({});
  const [locationFilters, setLocationFilters] = useState<string[]>();
  const [flow, setFlow] = useState<string>('trainers');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      let locations = await get('location_ids');
      setLocationFilters(locations);
      let current_flow = await get('flow');
      setFlow(current_flow);
      let service_category_id = await get('current_service_category');
      setTabName(await get('current_tab_name'));
      let trainer_services: TrainerActivity[] | undefined = [];
      let params: string = '';
      if(current_flow === 'trainers') {
        let trainer_id = await get('current_trainer_id');
        params = '?unified_filters[service_category_id]=' + service_category_id + '&unified_filters[trainer_id]=' + trainer_id;
      }
      else {
        params = '?unified_filters[service_category_id]=' + service_category_id;
      }
      if(locations && locations.length) {
        let resp: TrainerActivity[] | undefined = [];
        await Promise.all(
          locations.map(async (location: number) => {
            resp = await fetchTrainerActivities(params + '&unified_filters[location_id]=' + location);
            if(resp) {
              trainer_services!.push(...resp);
            }
            console.log(resp);
          })
        );
      }
      else {
        trainer_services = await fetchTrainerActivities(params);
      }
      if(trainer_services) {
        console.log(trainer_services);
        await setServices(await mapToNames(trainer_services));
        setShowLoading(false);
      }
    }

    getServices();
    set('entry_point', { classes: false, locations: true, class_types:false, instructors: false, services: false });
  }, []);

  const mapToNames = async ( arr: TrainerActivity[] ) => {
    let byNames: { [id: string]: TrainerActivity[] } = {};
    arr.map((item) => {
      if(Object.keys(byNames).find((title) => {
        return title === item.service.service_title;
      })) {
        byNames[item.service.service_title].push(item);
      }
      else {
        byNames[item.service.service_title] = [item];
      }
    })
    return byNames;
  }

  return (
    <IonPage>
      <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
        <BasicHeader title={t('book') + ' ' + tabName} />
        <div className='top-border'>
          <div className='scrollable' style={{backgroundColor: '#ffffff'}}>
            <div className='chip' key='filters-chip-div'>
              <IonChip color="dark" className='chip' onClick={() => {
                set('entry_point', { classes: false, locations: true, class_types:false, instructors: false, services: false });
                history.push("/filters");
              }} key='filters-chip'>
                <ReactSVG src='/assets/icon/filters.svg' className='color-icon' style={{fontSize: '24px', marginRight: '4px'}}/>
                <IonLabel>{t('filter.filters')}</IonLabel>
              </IonChip>
            </div>
            {/*}<div className='chip' key='classes-chip-div'>
              <IonChip className={`chip ${(serviceFilters && serviceFilters.length) ? "black-chip" : "white-chip"}`} key='classes-chip'>
                <IonLabel>{(serviceFilters && serviceFilters.length) ? (serviceFilters.length === 1 ? serviceFilters.length + ' service' : serviceFilters.length + ' services') : 'All services'}</IonLabel>
              </IonChip>
            </div>*/}
            <div className='chip' key='locations-chip-div'>
              <IonChip className={`chip ${(locationFilters && locationFilters.length) ? "color-chip" : "white-chip"}`} key='locations-chip'>
                <IonLabel>{(locationFilters && locationFilters.length) ? (locationFilters.length === 1 ? locationFilters.length + ' ' + t('filter.location') : locationFilters.length + ' ' + t('filter.locations')) : t('filter.all_locations')}</IonLabel>
              </IonChip>
            </div>
            {/*}<div className='chip' key='instructors-chip-div'>
              <IonChip className={`chip ${(instructorsFilters && instructorsFilters.length) ? "black-chip" : "white-chip"}`} key='instructors-chip'>
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
      <IonContent>
        <div style={{background: '#F4F4F4', position: 'relative', width: '100%'}} id='body'>
          <IonList style={{padding: '0px'}}>
            {services && Object.keys(services).map((key) => (
              <IonItem lines="none" className='trainer-activity-card' key={key} onClick={ async () => {
                // await set('current_trainer_activity_id', services[key][0].id);
                // await set('current_service_id', services[key][0].service.id);
                // await set('current_location_id', services[key][0].location.id);
                await set('current_service', services[key]);
                console.log(services[key]);
                if(flow === 'trainers') {
                  history.push('/pt_timeslots');
                }
                else if(flow === 'services') {
                  history.push('/service_detail');
                }
              }}>
                <div className='two-side-container' style={{padding: '20px'}}>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <IonText className='EGymText-16px-032' style={{fontWeight: 600}}>{key}</IonText>
                    <IonText>{(services[key][0].service.duration_in_hours ? services[key][0].service.duration_in_hours + t('hr') + " " : "") + (services[key][0].service.duration_in_minutes ? services[key][0].service.duration_in_minutes + t('mins') : "")}</IonText>
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

export default TrainerServiceList;