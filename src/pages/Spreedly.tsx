import { IonContent, IonHeader, IonLoading, IonPage, IonText } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { useTranslation } from 'react-i18next';

import { auth } from '../utils/const';
// import { Browser } from '@capacitor/browser'; 

// var tough = require("tough-cookie");  

import { ServicePackage, ServicePackageShow } from '../utils/data';
import { apiPostFetch } from '../utils/requests';
import { fetchSpreedly } from '../utils/utils';
import { get } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import CreditCard from '../components/CreditCard';
import YourPurchase from '../components/YourPurchase';

const Payment: React.FC = () => {

  let history = useHistory();
  const { t } = useTranslation();

  const [flow, setFlow] = useState('');
  const [orderId, setOrderId] = useState<number>();
  const [paymentForm, setPaymentForm] = useState<string | undefined>();
  const [confirmed, setConfirmed] = useState<boolean>();
  const [currentProduct, setCurrentProduct] = useState<ServicePackage | ServicePackageShow>();
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const getPaymentForm = async () => {
      let order_id = await get('order_id');
      if(order_id) {
        let html = await fetchSpreedly(order_id, 'spreedly_test');
        console.log(html);
        if(html) {
          setPaymentForm(html);
        }
      }
      setShowLoading(false);
    }

    getPaymentForm();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
          <BasicHeader title={flow === 'cash' ? t('headers.pay_by_cash') : t('headers.add_a_payment_card')} />
        </IonHeader>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
       <div className='body' style={{width: '100vw', height: '100vh'}}>
            <iframe srcDoc={paymentForm} style={{width: '100vw', height: '100vh'}}></iframe>
       </div>
      </IonContent>
    </IonPage>
  );

};

export default Payment;
