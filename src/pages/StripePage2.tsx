import { IonButton, IonContent, IonHeader, IonLoading, IonPage, IonText } from '@ionic/react';
import { useState, useEffect } from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import { get, set } from '../utils/IonicStorage';
import { ServicePackage, ServicePackageShow } from '../utils/data';
import { apiPostFetch } from '../utils/requests';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Props = {
  name: string;
  fourDigits?: string;
}

const CheckoutForm: React.FC<Props> = ({ name, fourDigits }) => {

  let history = useHistory();
  const { t } = useTranslation();
  
  const stripe = useStripe();
  const elements = useElements();
  const [flow, setFlow] = useState('');
  const [orderId, setOrderId] = useState<number>();
  const [confirmed, setConfirmed] = useState<boolean>();
  const [currentProduct, setCurrentProduct] = useState<ServicePackage | ServicePackageShow>();
  const [cardNumber, setCardNumber] = useState<string>();
  const [expMonth, setExpMonth] = useState<number>();
  const [expYear, setExpYear] = useState<number>();
  const [cvc, setCvc] = useState<string>();
  const [stripeData, setStripeData] = useState<any>('test');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [stripe3Ds, setStripe3Ds] = useState<string>();
  const [showLoading, setShowLoading] = useState(true);
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const getProduct = async () => {
      let current_flow = await get('payment_flow');
      let order_id = await get('order_id');
      setOrderId(order_id);
      console.log(order_id);
      await setFlow(current_flow);
      let current_product = await get('current_product');
      await setCurrentProduct(current_product);
      console.log(current_product);
      setShowLoading(false);
      console.log(fourDigits);
    }

    getProduct();
  }, []);

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    console.log('test');
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    try {
      // stripe.createToken(card).then(async (response: any) => {
      //   // setStripeData(response.card);
      //   let body = {
      //     stripe: {
      //       order_id: order_id,
      //       payment_method_token: response.token.id.split('_')[1]
      //     }
      //   };
      //   let res = await apiPostFetch('/api/unified/shop/payments/stripe/checkout', body, true);
      //   console.log(res);
      // });
      console.log('test');
      
      if(elements && elements.getElement(CardElement)) {
        console.log('test');
        stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
            billing_details: {
            name: name,
            },
        })
        .then( async (response: any) => {
            let body = {
            stripe: {
                order_id: orderId,
                payment_method_token: response.paymentMethod.id,
                return_url: 'https://localhost:3000/stripe_success'
            }
            };
            let res = await apiPostFetch('/api/unified/shop/payments/stripe/checkout', body, true);
            if(res.errors.length !== 0) {
            let ind = res.errors.findIndex((err: any) => { return err.type === 'requires_action'; });
            console.log(ind);
            if(ind >= 0) {
                console.log(res.errors[ind].options.stripe_url);
                await set('stripe_3ds', res.errors[ind].options.stripe_url);
                history.push('/stripe_3ds')
            }
            }
            console.log(res);
        });
        }
    }
    catch (e) {
      setStripeData(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ hidePostalCode: true }}/>
      <IonButton disabled={!stripe} type="submit">Submit</IonButton>
    </form>
  )
};

export default CheckoutForm;