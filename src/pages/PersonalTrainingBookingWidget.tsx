import React, { useState, useEffect } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLoading, IonPage, IonText } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Portals from '@ionic/portals';
import { useTranslation } from 'react-i18next';     

import { Section, Location, ServiceCategory, Service, Trainer, TrainerActivity } from '../utils/data';
import { fetchSections, fetchLocations, clearFilters, fetchTrainers } from '../utils/utils';
import { set } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import Segment from '../components/Segment';

import '../styles/index.css';
import '../styles/text.css';
import '../styles/FlowSelection.css';

type Category = {
    service_category: ServiceCategory;
    book_by_trainer: boolean;
    book_by_service: boolean;
}

type Props = {
  default_location_id: number;
}

const PersonalTrainingBookingWidget: React.FC<Props> = ({ default_location_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [sections, setSections] = useState<Section[]>();
  const [trainersSection, setTrainersSection] = useState<Section>();
  const [classesSection, setClassesSection] = useState<Section>();
  const [categories, setCategories] = useState<Category[]>();
  const [viewAllLink, setViewAllLink] = useState<string>('/classes/booking_list');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getSections = async () => {
      setShowLoading(true);
      let data = await fetchSections();
      let trainersSection = await data.find((section: Section) => { return section.section === "trainers"; });
      let classesSection = await data.find((section: Section) => { return section.section === "classes"; });
      data = []
      for(let i = 0; i < trainersSection.service_categories.length; i++) {
          let item = { service_category: trainersSection.service_categories[i], book_by_trainer: true, book_by_service: false };
          let ind = await classesSection.service_categories.findIndex((item: ServiceCategory) => item.id === trainersSection.service_categories[i].id);
          if(ind > -1) {
            item = { service_category: trainersSection.service_categories[i], book_by_trainer: true, book_by_service: true };
            classesSection.service_categories.splice(ind);
          }
          data.push(item);
      }
      for(let i = 0; i < classesSection.service_categories.length; i++) {
          data.push({ service_category: classesSection.service_categories[i], book_by_trainer: false, book_by_service: true })
      }
      console.log(data);
      await setCategories(data);
      await clearFilters();
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

  return (
    <IonPage>
      <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        <IonContent>
          <div style={{background: '#FFFFFF'}}>
            {categories && categories.map((category: Category, index: number) => {
              return (
                <div style={{margin: '20px'}}>
                  <IonText className='EGymText-20px-048'>{t('book') + ' ' + category.service_category.name}</IonText>
                  {category.book_by_trainer && 
                    <IonCard style={{position: 'relative', height: '100px', margin: '0px', marginTop: '11px', borderRadius: '8px'}}
                      onClick={async () => {
                        await set('flow', 'trainers');
                        await set('current_service_category', category.service_category.id);
                        history.push('/trainers');
                      }}>
                       <div className='two-side-container' style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', paddingLeft: '16px', paddingRight: '34px'}}>
                         <div style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', alignContent: 'center'}}>
                            <IonText className='EGymText-16px-048' style={{fontWeight: 500, marginTop: 'auto', marginBottom: 'auto'}}>{t('select_trainer')}</IonText>
                            <IonIcon icon={chevronForwardOutline} style={{marginTop: 'auto', marginBottom: 'auto', fontSize: '24px', paddingLeft: '23px'}}></IonIcon>
                          </div>
                          <img src={'/assets/icon/select_trainer.svg'}/>
                        </div>
                    </IonCard>
                  }
                  {category.book_by_service && 
                    <IonCard style={{position: 'relative', height: '100px', margin: '0px', marginTop: '11px', borderRadius: '8px'}}
                      onClick={async () => {
                        await set('flow', 'services');
                        await set('current_service_category', category.service_category.id);
                        await set('current_tab_name', category.service_category.name);
                        history.push('/trainer_services');
                      }}>
                       <div className='two-side-container' style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', paddingLeft: '16px', paddingRight: '34px'}}>
                         <div style={{marginTop: 'auto', marginBottom: 'auto', display: 'flex', alignContent: 'center'}}>
                            <IonText className='EGymText-16px-048' style={{fontWeight: 500, marginTop: 'auto', marginBottom: 'auto'}}>{t('select_service')}</IonText>
                            <IonIcon icon={chevronForwardOutline} style={{marginTop: 'auto', marginBottom: 'auto', fontSize: '24px', paddingLeft: '23px'}}></IonIcon>
                          </div>
                          <img src={'/assets/icon/select_service.svg'}/>
                        </div>
                    </IonCard>
                  }
                </div>
              );
            })}
          </div>
      </IonContent>
    </IonPage>
  );
};

export default PersonalTrainingBookingWidget;
