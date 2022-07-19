import React from 'react';
import { IonText } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { currency_symbols, currency_decimals, ServicePackage, ServicePackageShow } from '../utils/data';

// import '../BasicClassBookingItem/BasicClassBookingItem.css';
import '../styles/index.css';
import '../styles/text.css';

type Props = {
  currentProduct: ServicePackage | ServicePackageShow;
};

const YourPurchase: React.FC<Props> = ({ currentProduct }) => {

  const { t } = useTranslation();

  return (
    <div className='two-side-container'>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <IonText className='EGymText-16px-048 subheader' style={{fontWeight: 400, paddingBottom: '5px'}}>{t('payment.your_purchase')}</IonText>
        <IonText className='EGymText-16px-03'>{currentProduct.name}</IonText>
      </div>
      <IonText className='EGymText-16px-03' style={{ alignSelf: 'flex-end'}}>{(currentProduct.price && currentProduct.price.currency_code) && currency_symbols[currentProduct.price.currency_code] + (currentProduct.custom_price.amount / currency_decimals[currentProduct.custom_price.currency_code]).toFixed(2)}</IonText>
    </div>
  );
};

export default YourPurchase;
