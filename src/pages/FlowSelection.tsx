import React, { useState, useEffect } from 'react';
import { IonCard, IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonText } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Portals from '@ionic/portals';
import { useTranslation } from 'react-i18next';     

import { Section, Location } from '../utils/data';
import { fetchSections, fetchLocations } from '../utils/utils';
import { set } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

import '../styles/index.css';
import '../styles/text.css';
import '../styles/FlowSelection.css';

type Props = {
  default_location_id: number;
}

const FlowSelection: React.FC<Props> = ({ default_location_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [trainersSection, setTrainersSection] = useState<Section>();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getSections = async () => {
      setShowLoading(true);
      let data = await fetchSections();
      let trainers = await data.find((section: Section) => { return section.section === "trainers"; })
      if(trainers) {
        setTrainersSection(trainers);
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

  return (
    <IonPage>
      <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        <IonHeader style={{position: 'relative', top: '0px'}}>
          <BasicHeader title={t('headers.personal_training')} onClick={ async () => {await Portals.publish({ topic: 'subscription', data: {type: 'dismiss', data: null } });}} />
        </IonHeader>
        <IonContent>
          <div style={{background: '#F4F4F4', height: '100vh'}}>{/* className='body' */}

            <div className='book-title'>
              <IonText className='EGymText-16px-048'>{t('book_by_trainer')}</IonText>
            </div>

            {trainersSection && trainersSection.service_categories.map((item) => (
              <IonCard className='sections-card' key={"trainers " + item.name}
                style={{backgroundImage: `linear-gradient(180deg, rgba(11, 11, 11, 0.0001) -36.16%, rgba(0, 0, 0, 0.983486) 126.5%, #000000 126.55%, #000000 126.55%, #000000 126.55%), url(${item.logo_url})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
                onClick={async () => {
                  await set('flow', 'trainers');
                  await set('current_service_category', item.id);
                  history.push('/trainers');
                }}
              >
                <div className='two-side-container section-card-text'>
                  <IonText className='EGymText-16px-048' style={{color: '#FFFFFF'}}>{item.name}</IonText>
                  <IonIcon icon={chevronForwardOutline}></IonIcon>
                </div>
              </IonCard>
            ))}

            <div className='book-title'  style={{paddingTop: '22px'}}>
              <IonText className='EGymText-16px-048'>{t('book_by_service')}</IonText>
            </div>

            {trainersSection && trainersSection.service_categories.map((item) => (
              <IonCard className='sections-card' key={"classes " + item.name}
                style={{backgroundImage: `linear-gradient(180deg, rgba(11, 11, 11, 0.0001) -36.16%, rgba(0, 0, 0, 0.983486) 126.5%, #000000 126.55%, #000000 126.55%, #000000 126.55%), url(${item.logo_url})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
                onClick={async () => {
                  await set('flow', 'services');
                  await set('current_service_category', item.id);
                  await set('current_tab_name', item.name);
                  history.push('/trainer_services');
                }}
              >
                <div className='two-side-container section-card-text'>
                  <IonText className='EGymText-16px-048' style={{color: '#FFFFFF'}}>{item.name}</IonText>
                  <IonIcon icon={chevronForwardOutline}></IonIcon>
                </div>
              </IonCard>
            ))}
            <IonText>{window.location.href}</IonText>

          </div>
      </IonContent>
    </IonPage>
  );
};

export default FlowSelection;
