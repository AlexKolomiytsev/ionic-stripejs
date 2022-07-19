import React from 'react';
import { IonText } from '@ionic/react';

import '../styles/index.css';

type Props = {
  src?: string;
  title: string;
  subtitle: string;
};

const NoClassesPlaceholder: React.FC<Props> = ({ src='/assets/icon/no_classes_image.svg', title, subtitle }) => {
  return (
    <div className='centered-container' style={{flexDirection: 'column'}}>
        <img src={src} alt='Icon'/>
        <IonText className='title' style={{paddingTop: '24px', paddingBottom: '8px'}}>{title}</IonText>
        <IonText className='subtitle' style={{textAlign: 'center'}}>{subtitle}</IonText>
    </div>
  );
};

export default NoClassesPlaceholder;
