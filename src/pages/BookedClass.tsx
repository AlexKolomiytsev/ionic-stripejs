import { IonAlert, IonAvatar, IonButton, IonCard, IonChip, IonContent, IonHeader, IonIcon, IonLoading, IonModal, IonPage, IonText, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import { addOutline, barcodeOutline, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';

import { Occurrence } from '../utils/data';
import { apiFetch, apiPostFetch, apiPut } from '../utils/requests';
import { fetchOccurrences, deleteOccurence } from '../utils/utils';
import { get, clear } from '../utils/IonicStorage';

import BasicClassBookingItem from '../components/BasicClassBookingItem';
import Segment from '../components/Segment';
import QRModal from '../components/QRModal';
import NoClassesPlaceholder from '../components/NoClassesPlaceholder';
import SpotsLeft from '../components/SpotsLeft';
import BasicFooter from '../components/BasicFooter';

import '../styles/index.css';
import { executeQuotaErrorCallbacks } from 'workbox-core/_private';

type Props = {
  firstName: string;
  userPicture: string;
  client_id: number;
}

const BookedClass: React.FC<Props> = ({ firstName, userPicture, client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [currentClass, setCurrentClass] = useState<Occurrence>();
  const [classDateAndTime, setClassDateAndTime] = useState<Date>();
  const [timezone, setTimezone] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState<string>(t('alert.success'));
  const [alertMessage, setAlertMessage] = useState<string>(t('alert.you_were_enrolled'));
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getClass = async () => {
      let current_class = await get('current_class');
      console.log(current_class);
      return current_class;
    }

    getClass().then((current_class) => {
      setTimezone(new Date(current_class.occurs_at).toLocaleDateString(undefined, {day:'2-digit',timeZoneName: 'long' }).substring(4).split(' ').map(word => word[0]).join(''));
      setCurrentClass(current_class);
      setClassDateAndTime(new Date(current_class.occurs_at));
      setShowLoading(false);
    })
  }, []);

  const cancelBooking = async () => {
      if(currentClass) {
        let data = await deleteOccurence(currentClass.id, client_id);
        console.log(data);
      }
  }

  return (
    <IonPage>
      <IonLoading
       cssClass='loading'
       isOpen={showLoading}
       onDidDismiss={() => setShowLoading(false)}
     />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={ async () => {
          await setShowAlert(false);
          if(alertHeader === t('alert.success')) {
            history.push('/flow_selection');
          }
        }}
        cssClass='my-custom-class'
        mode='ios'
        header={alertHeader}
        message={alertMessage}
        buttons={['OK']}
      />
      <IonContent>
        <IonHeader className='background-header' style={{position: 'fixed'}}>
          <div className='background-header-image' style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 100%,  rgba(0, 0, 0, 0.5) 100%), url(${currentClass && currentClass.service_logo_url ? currentClass.service_logo_url : '/assets/icon/club_image.jpg'})`}}>
            <IonToolbar className='class-toolbar'>
              <IonButton className='small-grey-icon-button class-page-toolbar-button' onClick={() => {history.goBack();}}><IonIcon icon={chevronBackOutline} className="toolbar-icon"></IonIcon></IonButton>
            </IonToolbar>
          </div>
        </IonHeader>
        {currentClass && classDateAndTime && (
          <div className='body detail-body'>
            <IonText className='EGymText-28px-1'>{currentClass.service_title}</IonText>
            <div className='two-side-container' style={{paddingTop: '8px'}}>
              {currentClass.is_joined ? <IonChip className='EGymText-12x-0072 status-chip'>{t('booked')}</IonChip> : (currentClass.is_waiting ? <IonChip className='EGymText-12x-0072 status-chip'>{t('waitlisted')}</IonChip> : <IonChip className='chip'>{t('class.spot_booking')}</IonChip>)}
              <SpotsLeft left={currentClass.service_group_size - currentClass.attended_clients_count} size={currentClass.service_group_size} outOf={true} />
            </div>
            <div style={{paddingTop: '20px'}}>
              <IonText className='EGymText-16px-03'>{t('schedule').charAt(0).toUpperCase() + t('schedule').slice(1)}</IonText>
              <IonCard className='schedule-item'>
                <div className='date-container'>
                  <div className='centered-date'>
                    <IonText className='EGymText-12x-0072' style={{margin: 'auto', }}>{format(classDateAndTime, 'eee')}</IonText>
                    <IonText className='EGymText-12x-0072' style={{fontWeight: 600, margin: 'auto'}}>{format(classDateAndTime, 'd')}</IonText>
                  </div>
                </div>
                <div className='two-side-container' style={{padding: '10px', paddingLeft: '15px', paddingRight: '12px'}}>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <IonText className='EGymText-16px-03'>{classDateAndTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + ' - ' + new Date(classDateAndTime.getTime() + (60*60*1000)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + ' ' + timezone}</IonText>
                    <div style={{display: 'flex'}}>
                      <IonIcon src='/assets/icon/clock.svg' style={{fontSize: '16px'}}></IonIcon>
                      <IonText className='EGymText-12x-0072' style={{paddingLeft: '3px', marginTop: 'auto'}}>{currentClass.duration_in_hours * 60 + currentClass.duration_in_minutes + ' ' + t('min')}</IonText>
                    </div>
                  </div>
                    <IonButton className="color-icon-button"><ReactSVG src='/assets/icon/service_filter.svg' className='color-icon'/></IonButton>
                </div>
              </IonCard>
            </div>
            <div className='two-side-container EGymText-16px-03' style={{paddingTop: '32px', paddingRight: '10px'}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <IonText className='subheader'>{t('filter.location').charAt(0).toUpperCase() + t('filter.location').slice(1)}</IonText>
                <IonText style={{paddingTop: '4px'}}>{currentClass.sub_location_name}</IonText>
              </div>
              <IonButton className="color-icon-button"><ReactSVG src='/assets/icon/arrow_right.svg' className='color-icon'/></IonButton>
            </div>
            <div className='EGymText-16px-03' style={{paddingTop: '32px', paddingRight: '10px', display: 'flex', flexDirection: 'column'}}>
              <IonText className='subheader'>{t('filter.instructor').charAt(0).toUpperCase() + t('filter.instructor').slice(1)}</IonText>
              <IonText style={{paddingTop: '4px'}}>{currentClass.trainer_name}</IonText>
            </div>
            <div className='EGymText-16px-03' style={{paddingTop: '32px', paddingRight: '10px', display: 'flex', flexDirection: 'column'}}>
              <IonText className='subheader'>{t('class.class_description')}</IonText>
              <IonText style={{paddingTop: '4px'}}>{currentClass.service_description}</IonText>
            </div>
          </div>
        )}
      </IonContent>
      {currentClass && 
          <BasicFooter text={t('footer.cancel_booking')} onClick={cancelBooking}/>
        }
    </IonPage>
  );
};

export default BookedClass;
