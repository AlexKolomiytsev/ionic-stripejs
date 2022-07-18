import {IonButton, IonContent, IonPage, IonText, IonSpinner} from '@ionic/react';
import React, {useState} from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

const StripePage: React.FC = () => {

  const stripe = useStripe();
  const elements = useElements();

  const [intent, setIntent] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      if (elements && elements.getElement(CardElement)) {
        setLoading(true);

        const response = await fetch('https://capable-parfait-de86c8.netlify.app/.netlify/functions/create-payment-intent');
        const {clientSecret} = await response.json();

        await stripe
          .confirmCardPayment(clientSecret, {
            payment_method: {
              // @ts-ignore
              card: elements.getElement(CardElement),
              billing_details: {
                name: 'Audrey Hepburn',
              },
            },
          });

        const intent = await stripe.retrievePaymentIntent(clientSecret);

        console.log('intent', intent);

        setIntent(JSON.stringify(intent.paymentIntent, null, 2));

        // stripe.createPaymentMethod({
        //   type: 'card',
        //   card: elements.getElement(CardElement)!,
        //   billing_details: {
        //     name: 'Audrey Hepburn',
        //   },
        // })
        //   .then(async (response: any) => {
        //     if (response.paymentMethod) {
        //       setResponse('Success');
        //       setToken(response.paymentMethod.id);
        //     } else if (response.error) {
        //       setResponse(response.error.message);
        //       setToken('');
        //     }
        //     console.log('response', response);
        //   });
      }
    } catch (e) {
      console.log('error', e);
      setIntent(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent style={{height: '100vh', width: '100vw'}}>
        <div style={{position: 'relative', top: '30%', width: '90%', margin: 'auto'}}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <div style={{ border: '1px solid black', padding: '20px', width: '100%', marginBottom: '20px' }}>
              <CardElement options={{hidePostalCode: true}}/>
            </div>
            <IonButton
              disabled={!stripe || loading}
              style={{ minWidth: '120px' }}
              type="submit"
              onClick={handleSubmit}
            >
              {loading ? <IonSpinner name="dots" /> : <span>Submit</span>}
            </IonButton>
          </div>
          <div style={{paddingTop: '20px', display: 'flex', flexDirection: 'column'}}>
            <IonText>{intent}</IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default StripePage;