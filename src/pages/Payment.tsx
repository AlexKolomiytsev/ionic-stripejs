import { IonAlert, IonContent, IonHeader, IonLoading, IonPage, IonText } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import '@stripe/stripe-js';
// import { Stripe } from '@awesome-cordova-plugins/stripe';

import { ServicePackage, ServicePackageShow } from '../utils/data';
import { apiPostFetch } from '../utils/requests';
import { fetchSpreedly } from '../utils/utils';
import { SpreedlyJson } from '../utils/data';
import { get } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import CreditCard from '../components/CreditCard';
import YourPurchase from '../components/YourPurchase';
import ButtonsFooter from '../components/ButtonsFooter';

import '../styles/index.css';
import '../styles/text.css';

declare var Stripe: any;

// var html = require('./spreedly/init_flow.html');
// import html from './init_flow.html';

type Props = {
  fourDigits?: string;
}

const Payment: React.FC<Props> = ({ fourDigits }) => {

  const publishable_key = 'pk_test_MaMhlqv0uPa8mFSOKTJGYO8U';

  let history = useHistory();
  const { t } = useTranslation();

  var stripe = Stripe('pk_test_MaMhlqv0uPa8mFSOKTJGYO8U');

  const [flow, setFlow] = useState('');
  const [orderId, setOrderId] = useState<number>();
  const [paymentJson, setPaymentJson] = useState<SpreedlyJson>();
  const [confirmed, setConfirmed] = useState<boolean>();
  const [currentProduct, setCurrentProduct] = useState<ServicePackage | ServicePackageShow>();
  const [cardNumber, setCardNumber] = useState<string>();
  const [expMonth, setExpMonth] = useState<number>();
  const [expYear, setExpYear] = useState<number>();
  const [cvc, setCvc] = useState<string>();
  const [stripeData, setStripeData] = useState<any>('test');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      let current_flow = await get('payment_flow');
      let order_id = await get('order_id');
      setOrderId(order_id);
      await setFlow(current_flow);
      let current_product = await get('current_product');
      await setCurrentProduct(current_product);
      console.log(current_product);
      setShowLoading(false);
      console.log(fourDigits);
    }

    getProduct();
  }, []);

  const addCreditCard = async () => {
    if(flow === 'spreedly') {
      // history.push('/spreedly')
      if(orderId) {
        let json = await fetchSpreedly(orderId, 'spreedly_checkout');
        console.log(json);
        // console.log(html);
        if(json) {
          setPaymentJson(json);
          //  let html = _html.toString().replace("{key}", json.key)
        }
      }
    }
    if(flow === 'stripe') {
      let card_id = await get('card_id');
      // if(card_id) {}
      // else {
      // }
    }
  }

  const confirmPurchase = async () => {
    if(flow === 'cash') {
      let body = {
        cash: {
            order_id: orderId
        }
      };
      let response = await apiPostFetch('/api/unified/shop/payments/cash/checkout', body, true);
      console.log(response);
      if(response.errors.length === 0) {
        await setAlertHeader(t('alert.success'));
        await setAlertMessage(t('alert.you_have_purchased'));
        setShowAlert(true);
      }
      // else if(response.errors && response.appointment.errors.find((error: any) => {return (error.on === "time_frame" && error.type === "invalid") || (error.on === "occurrences" && error.type === "advance_time_restriction");})) {
      //   await setAlertHeader(t('alert.invalid_time'));
      //   await setAlertMessage(t('alert.chosen_time_can_not'));
      //   setShowAlert(true);
      // }
      // else if(response.appointment.errors && response.appointment.errors.find((error: any) => {return error.type === "not_enough_credits";})) {
      //   let service_category = await get('current_service_category');
      //   let params = `?unified_filters[trainer_id]=${selectedService && selectedService[0] && selectedService[0].trainer.id}&unified_filters[location_id]=${selectedService && selectedService[0] && selectedService[0].location.id}&unified_filters[service_category_id]=${service_category}&unified_filters[credit_service_ids]=${selectedService && selectedService[0] && [selectedService[0].service.id]}&unified_sorting[position] = true&limit[start]=0&limit[count]=1`;
      //   let fetchedPackage = await fetchPackages(params);
      //   await setCurrentPackage(fetchedPackage);
      //   console.log(currentPackage);
      //   setModalOpen(true);
      // }
      else {
        await setAlertHeader(t('alert.error'));
        await setAlertMessage(t('alert.an_error_occured') + ' type:' + response.errors[0].type);
        setShowAlert(true);
      }
    }
    // else if(flow === 'stripe') {
    //   // Stripe.setPublishableKey('pk_test_MaMhlqv0uPa8mFSOKTJGYO8U');
    //   if(cardNumber && expMonth && expYear && cvc) {
    //     let card = {
    //       number: cardNumber,
    //       cvc: cvc,
    //       exp_month: expMonth,
    //       exp_year: expYear,
    //       address_zip: 'E12 3HU'
    //      };
    //      try {
    //       stripe.createToken(card).then((response: any) => {
    //         // setStripeData(response.card);
    //         console.log(response.card);
    //       });
    //     }
    //     catch (e) {
    //       setStripeData(e);
    //     }
    //     //  Stripe.createCardToken(card)
    //     //   .then(token => setStripeData(token))
    //     //   .catch(error => setStripeData(error));  
    //   }

    // }
  }

  return (
    <IonPage>
      <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
        <BasicHeader title={flow === 'cash' ? t('headers.pay_by_cash') : t('headers.add_a_payment_card')} />
      </IonHeader>
      <IonLoading
        cssClass='loading'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
      />
      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            if(alertHeader === t('alert.success')) {
              history.push('/my_bookings');
            }
          }}
          cssClass='my-custom-class'
          mode='ios'
          header={alertHeader}
          message={alertMessage}
          buttons={['OK']}
        />
      <IonContent>
       {paymentJson ? <iframe src={`/init_flow.html?amount=${paymentJson.amount}&company_name=${paymentJson.company_name}&email=${paymentJson.email}&full_name=${paymentJson.full_name}&key=${paymentJson.key}&order_id=${paymentJson.order_id}&payment_provider=${paymentJson.payment_provider}&url_schema=${paymentJson.url_schema}`} style={{width: '100vw', height: '100vh', paddingTop: '62px'}}></iframe> : <div className='body' style={{paddingBottom: '100px'}}>
        {/*}<IonItem lines='none' style={{width: '100%'}}>*/}
          <div  style={{display: 'flex', flexDirection: 'column', width: '100%', padding: '20px', paddingBottom: '31px', backgroundColor: '#FFFFFF'}}>
            {flow === 'cash' ? <IonText className='EGymText-16px-03'>{t('payment.no_payment_taken')}</IonText> :
             fourDigits ? 
              (flow === 'stripe' ? <CreditCard fourDigits={fourDigits} cardNumber={cardNumber} setCardNumber={setCardNumber} expMonth={expMonth} setExpMonth={setExpMonth} expYear={expYear} setExpYear={setExpYear} cvc={cvc} setCvc={setCvc} /> : <CreditCard fourDigits={fourDigits} onClick={addCreditCard}/>)
               : 
              (flow === 'stripe' ? <CreditCard cardNumber={cardNumber} setCardNumber={setCardNumber} expMonth={expMonth} setExpMonth={setExpMonth} expYear={expYear} setExpYear={setExpYear} cvc={cvc} setCvc={setCvc} /> : <CreditCard onClick={addCreditCard}/>)} {/*<div dangerouslySetInnerHTML={{__html: paymentForm}}></div> <iframe srcDoc={paymentForm}></iframe>*/}
            {currentProduct &&
              <div style={{paddingTop: '61px'}}>
                <YourPurchase currentProduct={currentProduct} />
                <IonText>{flow}</IonText>
              </div>}
          </div>
        {/*<div className='buttons-footer'>
          <ButtonsFooter text={t('footer.confirm_purchase')} onClick={confirmPurchase} disabled={disabled} secondButtonText={t('payment.cancel')} onClickSecond={() => history.push('/classes')}/>{/* disabled={fourDigits ? false : true}
            </div>*/}
       </div>}
      </IonContent>
      <ButtonsFooter text={t('footer.confirm_purchase')} onClick={confirmPurchase} disabled={disabled} secondButtonText={t('payment.cancel')} onClickSecond={() => history.push('/classes')}/>
    </IonPage>
  );

};

export default Payment;
