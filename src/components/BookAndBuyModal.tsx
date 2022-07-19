import React, { useState, useEffect } from 'react';
import { IonAlert, IonButton, IonContent, IonFooter, IonInput, IonModal, IonPage,  IonText, IonToolbar, isPlatform } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { set } from '../utils/IonicStorage';
import { useTranslation } from 'react-i18next';

import { currency_symbols, currency_decimals, ServicePackage, ServicePackageShow } from '../utils/data';
import { apiPut, apiPostFetch } from '../utils/requests';

import '../styles/index.css';
import '../styles/modal.css';
import '../styles/text.css';

type Props = {
  flow: string;
  setPaymentMethod: (value: string) => void;
  setCardId: (value: number | null) => void; 
  isOpen: boolean;
  setOnClose: (value: boolean) => void;
  setShowActionSheet: (value: boolean) => void;
  client_id: number;
  currentPackage: ServicePackage | ServicePackageShow;
}

const BookAndBuyModal: React.FC<Props> = ({ flow, setPaymentMethod, setCardId, isOpen, setOnClose, setShowActionSheet, client_id, currentPackage }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [promocode, setPromocode] = useState<string>();
  const [message, setMessage] = useState<string[]>();
  const [price, setPrice] = useState<number>();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setPrice(currentPackage.custom_price.amount / currency_decimals[currentPackage.custom_price.currency_code]);
  }, [currentPackage]);

  const applyPromocode = async () => {
    let body = {
      purchases: [{
        quantity: 1,
        product_type: 'service_package',
        product_id: currentPackage.id,
        target_user_id: client_id
      }],
      promocode: promocode
    };
    let result = await apiPut('/api/unified/users/promocodes/apply', body, true);
    console.log(result);
    if(result.discount.percentage_off) {
      setMessage([result.discount.name + ': ' + result.discount.percentage_off + '% percent off', '#3FAF96']);
      setPrice( result.discount.percentage_off! / 100 * price! )
    }
    else {
      setMessage([t('alert.no_such_promocode_available'), '#E53935']);
      setPromocode('');
    }
  }

  const selectMethod = async () => {
    await setOnClose(false);
    await setShowActionSheet(true);
  }

  const placeOrder = async () => {
    let body = {};
    if(promocode !== '') {
      body = {
        purchases: [{
          quantity: 1,
          product_type: 'service_package',
          product_id: currentPackage.id,
          target_user_id: client_id
        }],
        target_user_id: client_id,
        promocode: promocode
      }
    }
    else {
      body = {
        purchases: [{
          quantity: 1,
          product_type: 'service_package',
          product_id: currentPackage.id,
          target_user_id: client_id
        }],
        target_user_id: client_id
      }
    }
    let response = await apiPostFetch('/api/unified/shop/shop/purchase', body, true);
    console.log(response);
    if(response) {
      await set('order_id', response.payment_intent.order_id);
      await setPaymentMethod(response.payment_intent.flow);
      if(response.payment_intent.flow === 'stripe') {
        setCardId(await response.payment_intent.payment_layouts.find((item: any) => {return item.flow === 'stripe'}).credit_card_id)
      }
      await setOnClose(false);
      await setShowActionSheet(true);
      // setShowAlert(true);
    }
  }

  return (<IonModal
    className='modal-rounded'
    isOpen={isOpen}
    canDismiss={true}
    breakpoints={flow === 'product' ? [0.4] : [0.4]}
    initialBreakpoint={flow === 'product' ? 0.4 : 0.4}
    onDidDismiss={() => setOnClose(false)}
  >
    <IonPage style={{height: `${flow === 'product' ? '40vh' : '40vh'}`}}>
      <IonAlert
          isOpen={showAlert}
          onDidDismiss={ async () => {
            await setShowAlert(false);
            await setOnClose(false);
            history.push('/flow_selection');
          }}
          cssClass='my-custom-class'
          mode='ios'
          header={t('alert.success')}
          message={t('alert.payment_intent_created')}
          buttons={['OK']}
        />
      <IonContent>
        <div className='modal-body'>
          <div style={{ width: '100%', padding: '30px', paddingTop: '42px', paddingBottom: '0px', alignItems: 'center'}}>
            <div className='two-side-container package-card' style={{ width: '100%'}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <IonText className='EGymText-16px-032' style={{fontWeight: 600, marginTop: 'auto', marginBottom: 'auto'}}>{currentPackage.name}</IonText>
                <IonText className='EGymText-14px-032' >{t('paid_by_stored_card')}</IonText>
              </div>
              <IonText className='EGymText-16px-032' style={{fontWeight: 600, marginTop: 'auto', marginBottom: 'auto'}}>{currentPackage.custom_price && price ? currency_symbols[currentPackage.custom_price.currency_code] + price.toFixed(2) : ' '}</IonText>
            </div>
            <div className='two-side-container package-card' style={{width: '100%', marginTop: '30px', backgroundColor: '#F4F4F4', borderRadius: '10px'}}>
              <IonInput value={promocode} placeholder={t('got_a_promo_code')} onIonChange={e => setPromocode(e.detail.value!)} style={{ paddingLeft: '10px' }}></IonInput>
              <IonButton className='apply-button' onClick={applyPromocode}>{t('apply')}</IonButton>
            </div>
            {message && <IonText className='EGymText-14px-032' style={{color: message[1]}}>{message[0]}</IonText>}
          </div>
        </div>
        {flow === 'product' ?
        <div className='modal-footer-div' style={{paddingBottom: `${isPlatform("ios") ? '40px' : '0px'}`}}> 
          <IonButton className='color-button' onClick={placeOrder}>{t('select_payment_method')}</IonButton>
        </div>
          :
        <div className='modal-footer-div' style={{paddingBottom: `${isPlatform("ios") ? '40px' : '0px'}`}}>
          <IonButton className='color-button' onClick={placeOrder}>{t('footer.purchase_and_book')}</IonButton>
          <IonButton className='white-button' onClick={ async () => {
            await setOnClose(false);
            history.push('/pt_products_list')}}>
              {t('footer.more_products')}
          </IonButton>
        </div>
      }
      </IonContent>
    </IonPage>
  </IonModal>);
};

export default BookAndBuyModal;
