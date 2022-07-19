import { IonText } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

// import './SpotsLeft.css';
import '../styles/index.css';
import '../styles/text.css';
import '../styles/Items.css';

type Props = {
  left: number;
  size: number;
  outOf: boolean;
};

const SpotsLeft: React.FC<Props> = ({ left, size, outOf }) => {

  const { t } = useTranslation();

  return (
    <div className='wrapper' >
      <IonText color='success' className='green-text'>{outOf ? left + ' ' + t('out of') + ' ' + size : left +' ' + t('spots_left')}</IonText>
      <div className='line'>
        <div className='progress' style={{width: `${(left * 100 / size)}%`}}/>
      </div>
    </div>
  );
};

export default SpotsLeft;
