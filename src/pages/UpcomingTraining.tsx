import { IonButton, IonContent, IonIcon, IonLoading, IonPage, IonText } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Occurrence } from '../utils/data';
import { fetchOccurrences } from '../utils/utils';
import { clear } from '../utils/IonicStorage';

import BasicClassBookingItem from '../components/BasicClassBookingItem';
import NoClassesPlaceholder from '../components/NoClassesPlaceholder';

import '../styles/index.css';
import '../styles/text.css';

type Props = {
  client_id: number;
}

const UpcomingTraining: React.FC<Props> = ({ client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  useEffect(() => { clear(); }, []);

  const [bookedOccurrences, setBookedOccurrences] = useState<Occurrence[]>();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getOccurrences = async () => {
      if(client_id !== -1) {
        const since = new Date();
        const till = new Date();
        till.setDate(till.getDate() + 180);
        let data = await fetchOccurrences("?limit[start]=0&limit[count]=1&unified_filters[client_id]=" + client_id + "&unified_filters[visible_on_schedule]=true&unified_filters[since]=" + since.toISOString() + "&unified_filters[till]=" + till.toISOString());
        await setBookedOccurrences(data);
        console.log(data);
        setShowLoading(false);
      }
    }

    getOccurrences();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        <div>
          <div className='two-side-container' style={{padding: '20px', paddingTop: '32px', paddingBottom: '8px', alignItems: 'center'}}>
            <IonText className='EGymText-20px-048'>{t('classes_tab.upcoming') + ' ' + t('training')}</IonText>
            <IonButton fill='clear' className='EGymText-16px-03 view-all' onClick={() => {history.push('/my_bookings');}}><IonText className='EGymText-16px-03 view-all' style={{color: 'var(--ion-primary-color)'}}>{t('classes_tab.view_all') + ' '}</IonText><IonIcon icon={chevronForwardOutline}></IonIcon></IonButton>{/* onClick={() => {history.push("/classes/booking_list");}}*/}
          </div>
          {!showLoading && (bookedOccurrences ? bookedOccurrences.map((item) => (
            <BasicClassBookingItem show='booked' currentClass={item} key={item.service_title + '_' + item.occurs_at} />
          ))
            : <NoClassesPlaceholder title={t('no_placeholder.no_booked_classes')} subtitle={t('no_placeholder.go_check_latest')} />)}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UpcomingTraining;
