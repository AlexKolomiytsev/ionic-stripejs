import { IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonText, IonToolbar } from '@ionic/react';
import { addOutline, barcodeOutline, chevronForwardOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Occurrence } from '../../utils/data';
import { apiFetch } from '../../utils/requests';
import { fetchOccurrences } from '../../utils/utils';
import { clear } from '../../utils/IonicStorage';

import BasicClassBookingItem from '../../components/BasicClassBookingItem';
import Segment from '../../components/Segment';
// import QRModal from '../../components/QRModal';
import RateYourSessionModal from '../../components/RateYourSessionModal';
import NoClassesPlaceholder from '../../components/NoClassesPlaceholder';

// import './BookingsHomepage.css';
import '../../styles/index.css';
import '../../styles/text.css';
import '../../styles/ClassesTab.css';

type Props = {
  firstName: string;
  userPicture: string;
  client_id: number;
  cover_photo: string;
}

const BookingsHomepage: React.FC<Props> = ({ firstName, userPicture, client_id, cover_photo }) => {

  let history = useHistory();
  const { t } = useTranslation();

  useEffect(() => { clear(); }, []);

  const [occurrenceType, setOccurenceType] = useState<string>('upcoming');
  const [upcomingOccurrences, setUpcomingOccurrences] = useState<Occurrence[]>();
  const [bookedOccurrences, setBookedOccurrences] = useState<Occurrence[]>();
  const [qrEnabled, setQrEnabled] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getOccurrences = async () => {
      if(client_id !== -1) {
        const since = new Date();
        const till = new Date();
        till.setDate(till.getDate() + 180);
        let data = await fetchOccurrences("?limit[start]=0&limit[count]=2&unified_filters[visible_on_schedule]=true&unified_filters[since]=" + since.toISOString() + "&unified_filters[till]=" + till.toISOString());
        console.log(data);
        setUpcomingOccurrences(data);
        setShowLoading(false);
        data = await fetchOccurrences("?limit[start]=0&limit[count]=2&unified_filters[client_id]=" + client_id + "&unified_filters[visible_on_schedule]=true&unified_filters[since]=" + since.toISOString() + "&unified_filters[till]=" + till.toISOString());
        console.log(data);
        setBookedOccurrences(data);
      }
      let data = await apiFetch('/api/unified/clubs/settings.json');
      setQrEnabled(data.settings.access_control_enabled);
      console.log(data);
    }

    getOccurrences();
  }, []);

  return (
    <IonPage>

      {/*}<QRModal isOpen={qrModalOpen} setOnClose={setQrModalOpen}/>*/}
      <RateYourSessionModal isOpen={rateModalOpen} setOnClose={setRateModalOpen}/>

      <IonContent>
        <IonHeader className='background-header' style={{position: 'fixed'}} translucent>
          <IonToolbar className="top-section-background">
            <div className='toolbar-padding'>
              <div className="two-side-container">
                <div>
                  <IonAvatar className='avatar avatar-circle' onClick={() => {history.push("/profile_navigation");}}>
                    <img src={userPicture} />
                  </IonAvatar>
                </div>

                <div>
                  <IonButton color="light" className="small-grey-icon-button" onClick={() => {setRateModalOpen(true);}}>
                    <IonIcon icon={addOutline} className="toolbar-icon"></IonIcon>
                  </IonButton>
                  {qrEnabled && <IonButton color="light" className="small-grey-icon-button" onClick={() => {setQrModalOpen(true);}} >
                    <IonIcon icon={barcodeOutline} className="toolbar-icon"></IonIcon>
                  </IonButton>}
                </div>
              </div>
              <div className="toolbar-text">
                <IonText className="EGymText-28px-1" style={{color: '#FFFFFF'}}>{t('hi') + ' ' + firstName + '!'}</IonText>
                <IonText className="EGymText-16px-032" style={{color: '#FFFFFF'}}>{t('classes_tab.ready_for_workout')}</IonText>
              </div>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        <div className='classes-tab-body' style={{marginTop: '223px'}}>
          <div className=' two-side-container' style={{padding: '20px', paddingTop: '32px', paddingBottom: '8px', alignItems: 'center'}}>
            <IonText className='EGymText-20px-048'>{t('filter.classes').charAt(0).toUpperCase() + t('filter.classes').slice(1)}</IonText>
            <IonButton fill='clear' className='EGymText-16px-03 view-all' onClick={() => {history.push("/classes/booking_list");}}>{t('classes_tab.view_all') + ' '} <IonIcon icon={chevronForwardOutline}></IonIcon></IonButton>{/* onClick={() => {history.push("/classes/booking_list");}}*/}
          </div>{/* routerLink='/classes/booking_list'*/}
          <Segment values={['upcoming', 'booked']} names={[t('classes_tab.upcoming'), t('classes_tab.booked')]} tab={occurrenceType} setTab={setOccurenceType} />
          {occurrenceType === 'upcoming' ?
            (upcomingOccurrences ? upcomingOccurrences.map((item) => (
            <BasicClassBookingItem show='upcoming' currentClass={item} key={item.service_title + '_' + item.occurs_at} />
          ))
            : <NoClassesPlaceholder title={t('no_placeholder.no_upcoming_classes')} subtitle={t('no_placeholder.we_are_working')} />)
          : (bookedOccurrences ? bookedOccurrences.map((item) => (
            <BasicClassBookingItem show='booked' currentClass={item} key={item.service_title + '_' + item.occurs_at} />
          ))
            : <NoClassesPlaceholder title={t('no_placeholder.no_booked_classes')} subtitle={t('no_placeholder.go_check_latest')} />)}
          <div style={{margin: '15px', paddingTop: '15px'}}>
            <IonText className='EGymText-20px-048'>{t('classes_tab.my_schedule')}</IonText>
            {/*}<div className='background-image'>*/}
              <IonButton fill='clear' className='background-image' style={{backgroundImage: `linear-gradient(180deg, rgba(11, 11, 11, 0.0001) 1.66%, rgba(0, 0, 0, 0.983486) 82.11%, #000000 82.13%, #000000 82.13%), url(${cover_photo ? cover_photo : '/assets/icon/club_image.jpg'})`}}>
              {/*}<img src={'club_image.jpg'} className='gradient' style={{width: '100%', height: '100%'}}/>*/}
              <IonText className='EGymText-20px-048' style={{position: 'absolute', left: '20px', color: '#FFFFFF', textTransform: 'none'}}>{t('classes_tab.explore_schedule') + ' '} <IonIcon icon={chevronForwardOutline}></IonIcon></IonText>
              </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingsHomepage;
