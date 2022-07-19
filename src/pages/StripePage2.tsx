import { IonContent, IonHeader, IonLoading, IonPage, IonText } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@stripe/stripe-js';
// import { Stripe } from '@awesome-cordova-plugins/stripe';

import { ServicePackage, ServicePackageShow } from '../utils/data';
import { apiPostFetch } from '../utils/requests';
import { get, set } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import CreditCard from '../components/CreditCard';
import YourPurchase from '../components/YourPurchase';

import '../styles/index.css';
import '../styles/text.css';
import '../styles/Stripe.css';

declare var Stripe: any;

// var html = require('./spreedly/init_flow.html');
// import html from './init_flow.html';

type Props = {
  name: string;
  fourDigits?: string;
}

const StripePage: React.FC<Props> = ({ name, fourDigits }) => {

  const publishable_key = 'pk_test_MaMhlqv0uPa8mFSOKTJGYO8U';

  let history = useHistory();
  const { t } = useTranslation();

  var stripe = Stripe('pk_test_MaMhlqv0uPa8mFSOKTJGYO8U');

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

      try {
        var elements = stripe.elements();
        var card = elements.create("card", {
          hidePostalCode: true
        });
        card.mount("#card-element");
        card.on("change", function (event: any) {
          // Disable the Pay button if there are no card details in the Element
          if(document.querySelector("button")) {
            document.querySelector("button")!.disabled = event.empty;
          }
          if(document.querySelector("#card-error")) {
            document.querySelector("#card-error")!.textContent = event.error ? event.error.message : "";
          }
        });
        var form = document.getElementById("payment-form");
        if (form) {
          form.addEventListener("submit", function(event) {
            event.preventDefault();
            // Complete payment when the submit button is clicked
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
              console.log(card);
              stripe.createPaymentMethod({
                type: 'card',
                card: card,
                billing_details: {
                  name: name,
                },
              })
                .then( async (response: any) => {
                  let body = {
                    stripe: {
                      order_id: order_id,
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
            catch (e) {
              setStripeData(e);
            }
          });
        }
      }
      catch (e: any) {
        await setError(e);
      }

      setShowLoading(false);
      console.log(fourDigits);
    }

    getProduct();
  }, []);

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
        setConfirmed(true);
      }
    }
    else if(flow === 'stripe') {
      // Stripe.setPublishableKey('pk_test_MaMhlqv0uPa8mFSOKTJGYO8U');
      if(cardNumber && expMonth && expYear && cvc) {
        let card = {
          number: cardNumber,
          cvc: cvc,
          exp_month: expMonth,
          exp_year: expYear,
          address_zip: 'E12 3HU'
        };
        try {
          stripe.createToken(card).then((response: any) => {
            // setStripeData(response.card);
            console.log(response.card);
          });
        }
        catch (e) {
          setStripeData(e);
        }
        //  Stripe.createCardToken(card)
        //   .then(token => setStripeData(token))
        //   .catch(error => setStripeData(error));
      }

    }
  }

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
        {stripe3Ds ? <iframe src={stripe3Ds} ></iframe> : null}
        <form id="payment-form">
          <div id="card-element"></div>
          <button id="submit">
            <div className="spinner hidden" id="spinner"></div>
            <span id="button-text">Pay now</span>
          </button>
          <p id="card-error" role="alert"></p>
          <p>{error}</p>
          <p className="result-message hidden">
            Payment succeeded, see the result in your
            <a href="" target="_blank">Stripe dashboard.</a> Refresh the page to pay again.
          </p>
        </form>
      </IonContent>
    </IonPage>
  );

};

export default StripePage;
