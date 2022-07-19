import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonItemDivider, IonRippleEffect, IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { set } from '../utils/IonicStorage';
import { Occurrence } from '../utils/data';

// import './ClassBookingItemWithTags.css';
import '../styles/Items.css';
import '../styles/index.css';
import '../styles/text.css';
import { t } from 'i18next';

type Props = {
  show: string;
  currentClass: Occurrence;
};

const ClassBookingItemWithTags: React.FC<Props> = ({ show, currentClass }) => {

  let history = useHistory();
  const { t } = useTranslation();
  
  const formatDate = (isoDate: string) => {
    let date = new Date(isoDate);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  const goToClassPage = async () => {
    await set("current_class", currentClass);
    history.push('/booked_class/' + currentClass.id);
  }

 return (
   <IonCard button className='class-booking-card' key={currentClass.service_title + '_' + currentClass.occurs_at} onClick={() => {goToClassPage();}}>
     <IonCardHeader className='class-booking-header'>
      <IonCardSubtitle style={{borderBottom: 'solid 1px #F4F4F4'}}>
        <div className='two-side-container class-booking-title' style={{ display: 'flex' }}>
          <div className='EGymText-14px-0' style={{display: 'flex'}}>
            <IonIcon src='/assets/icon/clock.svg' style={{fontSize: '16px'}}></IonIcon>
            <IonText style={{paddingTop: '1px', paddingLeft: '2px'}}>{formatDate(currentClass.occurs_at)}</IonText>
            <div className='separator-dot'></div>
            <IonText style={{paddingTop: '1px'}}>{currentClass.duration_in_hours * 60 + currentClass.duration_in_minutes + ' min'}</IonText>
          </div>
          {currentClass.is_joined ? <IonChip className='EGymText-12x-0072 status-chip'>{t('booked')}</IonChip> : (currentClass.is_waiting ? <IonChip className='EGymText-12x-0072 status-chip'>{t('waitlisted')}</IonChip> : null)}
        </div>
       </IonCardSubtitle>
       <IonCardTitle className='class-booking-title EGymText-21px-032'>{currentClass.service_title}</IonCardTitle>
     </IonCardHeader>
     <IonCardContent className='class-booking-title EGymText-14px-0' style={{paddingBottom: '13px'}}>
       <p>{t('with') + ' ' + currentClass.trainer_name}</p>
       <p>{currentClass.sub_location_name}</p>
     </IonCardContent>
     <IonRippleEffect type="bounded" />
   </IonCard>
 );
};

export default ClassBookingItemWithTags;
