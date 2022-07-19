import { IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { barcodeOutline, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { get, set } from '../utils/IonicStorage';
import { TrainerActivity } from '../utils/data';

import BasicFooter from '../components/BasicFooter';

import '../styles/index.css';
import '../styles/text.css';


const ServiceDetail: React.FC = () => {

  const { t } = useTranslation();
  let history = useHistory();

  const [currentService, setCurrentService] = useState<TrainerActivity>();
  const [classDateAndTime, setClassDateAndTime] = useState<Date>();
  const [timezone, setTimezone] = useState<string>('');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getService = async () => {
      let service = await get('current_service');
      await setCurrentService(service[0]);
      console.log(service);
      setShowLoading(false);
    }

    getService();
  }, []);

  return (
    <IonPage className='text'>

      {currentService && <IonContent className='classes-body' force-overscroll scroll-events>
      <IonHeader className='background-header' style={{position: 'fixed'}}>
          <div className='background-header-image' style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 100%,  rgba(0, 0, 0, 0.5) 100%), url(${currentService.service.service_image_url ? currentService.service.service_image_url : '/assets/icon/club_image.jpg'})`}}>
            <IonToolbar className='class-toolbar'>
              <IonButton className="small-grey-icon-button class-page-toolbar-button" onClick={() => {history.goBack();}}><IonIcon icon={chevronBackOutline} className="toolbar-icon"></IonIcon></IonButton>
            </IonToolbar>
          </div>
        </IonHeader>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        <div className='body detail-body' style={{paddingBottom: '67px', height: 'fit-content'}}>
          <IonText className='EGymText-28px-1' style={{paddingTop: '38px'}}>{currentService.service.service_title}</IonText>
          {/*}<div className='two-side' style={{paddingTop: '8px'}}>
            <IonChip className='chip'>Spot Booking</IonChip>
          </div>*/}
          {currentService.service.declaration && <div className='EGymText-16px-032' style={{display: 'flex', flexDirection: 'column', paddingTop: '32px', paddingRight: '10px'}}>
            <IonText className='subheader'>{t('service_description')}</IonText>
            <IonText  style={{paddingTop: '4px'}}>{currentService.service.declaration}</IonText>
          </div>}
        </div>
      </IonContent>}
      <BasicFooter text={t('book')} onClick={ async () => {
            // await set('current_tab_name', currentService.service_title);
            history.push('/pt_timeslots');
          }}/>
    </IonPage>
  );
};

export default ServiceDetail;
