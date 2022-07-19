import React, { useState } from 'react';
import { IonBreadcrumbs, IonBreadcrumb, IonButton, IonContent, IonFooter, IonModal, IonSlide, IonSlides, IonText, IonTextarea } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import ButtonsFooter from './ButtonsFooter';

import '../styles/index.css';
import { t } from 'i18next';

type Props = {
  isOpen: boolean;
  setOnClose: (value: boolean) => void;
}

const ThankYouModal: React.FC<Props> = ({ isOpen, setOnClose }) => {

  const { t } = useTranslation();

  return(
    <IonModal
      className='modal-rounded'
      isOpen={isOpen}
      breakpoints={[0.5]}
      initialBreakpoint={0.5}
    >
      <IonContent>
        <div className='modal-body'>
          <IonText className='modal-section-header' style={{paddingTop: '28px'}}>{t('thank_you') + '!'}</IonText>
          <IonText className='modal-text' style={{paddingTop: '30px'}}>{t('your_feedback')}</IonText>
        </div>
        <div className='modal-footer-one-button'>
          <ButtonsFooter text={t('close')} onClick={() => {setOnClose(false);}}/>
        </div>
      </IonContent>
    </IonModal>
  );
}
export default ThankYouModal;
