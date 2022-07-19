

import React, { useState, useEffect } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonText } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Portals from '@ionic/portals';
import { useTranslation } from 'react-i18next';     

import { Section, Location, ServiceCategory, Service, Trainer, TrainerActivity, Occurrence } from '../utils/data';
import { fetchSections, fetchLocations, clearFilters, fetchTrainers, fetchTrainerActivities, mapToNames, fetchOccurrences } from '../utils/utils';
import { set } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import Segment from '../components/Segment';

import '../styles/index.css';
import '../styles/text.css';
import '../styles/FlowSelection.css';
import BasicClassBookingItem from '../components/BasicClassBookingItem';
import NoClassesPlaceholder from '../components/NoClassesPlaceholder';
import BasicImageCard from '../components/BasicImageCard';

type Category = {
    service_category: ServiceCategory;
    book_by_trainer: boolean;
    book_by_service: boolean;
    by_trainer_link: string;
    by_service_link: string;
    trainers: Trainer[];
    services: { [id: string]: TrainerActivity[] };
}

type Props = {
  client_id: number;
  default_location_id: number;
}

const PersonalTrainingBooking: React.FC<Props> = ({ client_id, default_location_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [sections, setSections] = useState<Section[]>();
  const [trainersSection, setTrainersSection] = useState<Section>();
  const [classesSection, setClassesSection] = useState<Section>();
  const [categories, setCategories] = useState<Category[]>();
  const [bookedOccurrences, setBookedOccurrences] = useState<Occurrence[]>();
  const [bookBy, setBookBy] = useState<string[]>([]);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getSections = async () => {
      setShowLoading(true);
      let data = await fetchSections();
      let trainersSection = await data.find((section: Section) => { return section.id === 2; });
      let classesSection = await data.find((section: Section) => { return section.id === 3; });
      data = []
      for(let i = 0; i < trainersSection.service_categories.length; i++) {
          let item: Category = { service_category: trainersSection.service_categories[i], book_by_trainer: true, book_by_service: false, by_trainer_link: '/trainers', by_service_link: '/trainer_services', trainers: [], services: {} };
          let trainers = await fetchTrainers('?unified_filters[service_category_id]=' + trainersSection.service_categories[i].id);
          if(trainers) {
            item.trainers = trainers;
          }
          let ind = await classesSection.service_categories.findIndex((item: ServiceCategory) => item.id === trainersSection.service_categories[i].id);
          console.log(ind);
          console.log(classesSection);
          if(ind > -1) {
            item.book_by_service = true;
            let services = await fetchTrainerActivities('?unified_filters[service_category_id]=' + trainersSection.service_categories[i].id);
            if(services) {
                let filtered_services = await mapToNames(services);
                item.services = filtered_services;
            }
            classesSection.service_categories.splice(ind, 1);
            console.log(classesSection.service_categories);
          }
          else {
            let item = { service_category: trainersSection.service_categories[i], book_by_trainer: true, book_by_service: false, by_trainer_link: '/trainers', by_service_link: '/trainer_services' };
          }
          data.push(item);
      }
      for(let i = 0; i < classesSection.service_categories.length; i++) {
        let services = await fetchTrainerActivities('?unified_filters[service_category_id]=' + trainersSection.service_categories[i].id);
        if(services) {
            let filtered_services = await mapToNames(services);
            data.push({ service_category: classesSection.service_categories[i], book_by_trainer: false, book_by_service: true, by_trainer_link: '/trainers', by_service_link: '/trainer_services', trainers: [], services: filtered_services });
        }
      }
      setCategories(data);
      setBookBy(await data.map((item: Category) => { return item.book_by_trainer ? 'trainer' : 'class'}));
      await clearFilters();
      if(client_id !== -1) {
        const since = new Date();
        const till = new Date();
        till.setDate(till.getDate() + 180);
        let data = await fetchOccurrences("?limit[start]=0&limit[count]=1&unified_filters[client_id]=" + client_id + "&unified_filters[visible_on_schedule]=true&unified_filters[since]=" + since.toISOString() + "&unified_filters[till]=" + till.toISOString());
        await setBookedOccurrences(data);
        console.log(data);
        setShowLoading(false);
      }
      setShowLoading(false);
      if(default_location_id) {
        set('location_ids', [default_location_id]); 
      }
      let locations = await fetchLocations();
      if(locations) {
        let default_location = await locations.find((item: Location) => { return item.id === default_location_id; });
        if(default_location) {
          set('locations', [default_location]); 
        }
      }
    }

    getSections();
  }, []);

  const viewAll = async (index: number, category: Category) => {
    if(bookBy[index] === 'trainer') {
      await set('flow', 'trainers');
      await set('current_service_category', category.service_category.id);
      history.push(category.by_trainer_link);
    }
    else {
        await set('flow', 'services');
        await set('current_service_category', category.service_category.id);
        await set('current_tab_name', category.service_category.name);
        history.push(category.by_service_link);
    }
    }

  const onClickTrainer = async (id: number) => {
    await set('flow', 'trainers');
    await set('current_trainer_id', id);
    history.push('/trainer_profile');
  }

  const onClickService = async (service: TrainerActivity[]) => {
    await set('flow', 'services');
    await set('current_service', service);
    history.push('/service_detail');
  }

  return (
    <IonPage>
      <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        <IonHeader style={{position: 'relative', top: '0px'}}>
          <BasicHeader title={t('headers.make_a_booking')} onClick={ async () => {await Portals.publish({ topic: 'subscription', data: {type: 'dismiss', data: null } });}} />
        </IonHeader>
        <IonContent>
        {!showLoading && <> <div style={{background: '#F4F4F4', height: 'fit-content', paddingBottom: '100px'}}>{/* className='body' */}
            {categories && categories.map((category: Category, index: number) => {
                if(category.book_by_trainer && category.book_by_service) {
                    return (
                        <>
                            <div className=' two-side-container' style={{padding: '20px', paddingTop: '32px', paddingBottom: '8px', alignItems: 'center'}}>
                                <IonText className='EGymText-20px-048'>{category.service_category.name}</IonText>
                                <IonButton fill='clear' className='EGymText-16px-03 view-all' onClick={() => {viewAll(index, category)}}>{t('classes_tab.view_all') + ' '} <IonIcon icon={chevronForwardOutline}></IonIcon></IonButton>
                            </div>
                            <Segment values={['trainer', 'class']} names={[t('book_by_trainer'), t('book_by_service')]} tab={bookBy[index]} setTab={async (val) => {
                                setBookBy(bookBy=>({
                                  ...bookBy,
                                  [index]: val
                               }));
                            }} />
                            <div className='scrollable' style={{backgroundColor: 'inherit', border: 'none'}}>
                              {bookBy[index] === 'trainer' ? 
                                category.trainers && category.trainers.map((trainer: Trainer, index: number) => (
                                  <BasicImageCard image={trainer.image} text={trainer.name.split(' ')[0]} onClick={() => {onClickTrainer(trainer.id)}}/>
                                ))
                              :
                                category.services && Object.keys(category.services).map((key) => (
                                  <BasicImageCard image={category.services[key][0].service.service_image_url} text={category.services[key][0].service.service_title} onClick={() => {onClickService(category.services[key])}}/>
                                ))
                              }
                            </div>
                        </>
                    )
                }
                else if(category.book_by_trainer) {
                    return (
                        <>
                            <div className=' two-side-container' style={{padding: '20px', paddingTop: '32px', paddingBottom: '8px', alignItems: 'center'}}>
                                <IonText className='EGymText-20px-048'>{category.service_category.name}</IonText>
                                <IonButton fill='clear' className='EGymText-16px-03 view-all' onClick={() => {history.push(bookBy[index] === 'trainer' ? category.by_trainer_link : category.by_service_link);}}>{t('classes_tab.view_all') + ' '} <IonIcon icon={chevronForwardOutline}></IonIcon></IonButton>
                            </div>
                            <div className='scrollable' style={{backgroundColor: 'inherit', border: 'none'}}>
                                {category.trainers && category.trainers.map((trainer: Trainer, index: number) => (
                                 <BasicImageCard image={trainer.image} text={trainer.name.split(' ')[0]} onClick={() => {onClickTrainer(trainer.id)}}/>
                                ))}
                            </div>
                        </>
                    )
                }
                else if(category.book_by_service) {
                    return (
                        <>
                            <div className=' two-side-container' style={{padding: '20px', paddingTop: '32px', paddingBottom: '8px', alignItems: 'center'}}>
                                <IonText className='EGymText-20px-048'>{category.service_category.name}</IonText>
                                <IonButton fill='clear' className='EGymText-16px-03 view-all' onClick={() => {history.push(bookBy[index] === 'trainer' ? category.by_trainer_link : category.by_service_link);}}>{t('classes_tab.view_all') + ' '} <IonIcon icon={chevronForwardOutline}></IonIcon></IonButton>
                            </div>
                            <div className='scrollable' style={{backgroundColor: 'inherit', border: 'none'}}>
                              {category.services && Object.keys(category.services).map((key) => (
                                    <BasicImageCard image={category.services[key][0].service.service_image_url} text={category.services[key][0].service.service_title} onClick={() => {onClickService(category.services[key])}}/>
                                ))
                              }
                            </div>
                        </>
                    )
                }
            })}
            
            <div className='two-side-container' style={{padding: '20px', paddingTop: '32px', paddingBottom: '8px', alignItems: 'center'}}>
                <IonText className='EGymText-20px-048'>{t('next') + ' ' + t('training')}</IonText>
                <IonButton fill='clear' className='EGymText-16px-03 view-all' onClick={() => {history.push('/my_bookings');}}><IonText className='EGymText-16px-03 view-all' style={{color: 'var(--ion-primary-color)'}}>{t('classes_tab.view_all') + ' '}</IonText><IonIcon icon={chevronForwardOutline}></IonIcon></IonButton>{/* onClick={() => {history.push("/classes/booking_list");}}*/}
            </div>
            {bookedOccurrences ? bookedOccurrences.map((item) => (
                <BasicClassBookingItem show='booked' currentClass={item} key={item.service_title + '_' + item.occurs_at} />
            ))
                : <NoClassesPlaceholder title={t('no_placeholder.no_booked_classes')} subtitle={t('no_placeholder.go_check_latest')} />}

          </div></>}
          <IonText>{window.location.href}</IonText>
      </IonContent>
    </IonPage>
  );
};

export default PersonalTrainingBooking;