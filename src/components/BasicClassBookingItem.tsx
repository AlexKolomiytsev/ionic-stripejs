import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItemDivider, IonRippleEffect, IonText } from '@ionic/react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { set } from '../utils/IonicStorage';
import { Occurrence } from '../utils/data';

import SpotsLeft from './SpotsLeft';

import '../styles/Items.css';
import '../styles/index.css';
import '../styles/text.css';

type Props = {
  show: string;
  currentClass: Occurrence;
};

const BasicClassBookingItem: React.FC<Props> = ({ show='', currentClass }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const formatDate = (isoDate: string) => {
    let date = new Date(isoDate);
    return format(date, 'eee') + ', ' + format(date, 'MMM')  + ' ' + format(date, 'd') + ' at ' + date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  const daysDifference = (isoDate: string) => {
    let today = new Date();
    let service_date = new Date(isoDate);
    return Math.trunc((service_date.getTime() - today.getTime()) /  (1000 * 3600 * 24));
  }

  const goToClassPage = async () => {
    await set("current_class", currentClass);
    history.push('/class/' + currentClass.id);
  }

 return (
   <IonCard button className='class-booking-card' key={currentClass.service_title + '_' + currentClass.occurs_at} onClick={() => {goToClassPage();}}>
     <IonCardHeader className='class-booking-header'>
       <IonCardSubtitle style={{borderBottom: 'solid 1px #F4F4F4'}}>
          <div className='two-side-container class-booking-title'>
            <div style={{display: 'flex'}}><IonIcon src='/assets/icon/calendar.svg' style={{fontSize: '24px'}}></IonIcon>
            <IonText className='EGymText-12x-0072 date-and-time-text'>
              {formatDate(currentClass.occurs_at)}</IonText></div>
            {show === 'upcoming' ? <SpotsLeft left={currentClass.service_group_size - currentClass.attended_clients_count} size={currentClass.service_group_size} outOf={false} /> : <IonText className='green-text' color='success' >{t('start_in') + ' ' + daysDifference(currentClass.occurs_at) + ' ' + t('days')}</IonText>}
          </div>
       </IonCardSubtitle>
       <IonCardTitle className='class-booking-title EGymText-21px-032'>{currentClass.service_title}</IonCardTitle>
     </IonCardHeader>
     <IonCardContent className='EGymText-14px-0'>
       <p>{currentClass.duration_in_hours * 60 + currentClass.duration_in_minutes + ' ' + t('min') + ' ' + t('with') + ' ' + currentClass.trainer_name}</p>
       <p>{currentClass.sub_location_name}</p>
     </IonCardContent>
     <IonRippleEffect type="bounded" />
   </IonCard>
 );
};

export default BasicClassBookingItem;
