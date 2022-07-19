import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItemDivider, IonRippleEffect, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { chevronForwardOutline } from 'ionicons/icons';

import { currency_symbols, currency_decimals, ServicePackage } from '../utils/data';
import { set, remove } from '../utils/IonicStorage';

import '../styles/index.css';
import '../styles/text.css';

type Props = {
  currentProduct: ServicePackage;
  item_key: number;
};

const ProductItem: React.FC<Props> = ({ currentProduct, item_key }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const clearFilters = async () => {
    await remove('classes');
    await remove('locations');
    await remove('location_ids');
    await remove('class_types');
    await remove('instructors');
  }

 return (
   <IonCard button className='class-booking-card' key={item_key} onClick={async () => {
     await clearFilters();
     await set('current_product_id', currentProduct.id);
     history.push('/pt_product_detail');
   }}>
     <IonCardHeader className='class-booking-header'>
       <div>
         <IonCardTitle className='class-booking-title EGymText-16px-032' style={{fontWeight: 600}}>{currentProduct.name}</IonCardTitle>
       </div>
        <IonItemDivider mode='md' style={{minHeight: '0px'}}/>
     </IonCardHeader>
     <IonCardContent style={{paddingTop: '14px'}}>
     <div className='two-side-container'>
       <div style={{display: 'flex', flexDirection: 'column'}}>
         <IonText className='EGymText-14px-0' style={{fontWeight: 600}}>{(currentProduct.price && currentProduct.price.currency_code) && currency_symbols[currentProduct.price.currency_code] + (currentProduct.custom_price.amount / currency_decimals[currentProduct.custom_price.currency_code]).toFixed(2)}</IonText>
         <IonText className='EGymText-14px-0'>{currentProduct.subscribable ? t('payment.subscription') : t('payment.one_off_purchase')}</IonText>
       </div>
       <IonIcon icon={chevronForwardOutline} className='section-icon' style={{fontSize: '20px'}}></IonIcon>
     </div>
     </IonCardContent>
     <IonRippleEffect type="bounded" />
   </IonCard>
 );
};

export default ProductItem;
