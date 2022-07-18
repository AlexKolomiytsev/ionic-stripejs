import {IonButton, IonContent, IonHeader, IonLoading, IonPage, IonText} from '@ionic/react';
import {useState, useEffect} from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

const StripePage: React.FC = () => {

  const stripe = useStripe();
  const elements = useElements();

  const [response, setResponse] = useState<string>();
  const [token, setToken] = useState<string>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      if (elements && elements.getElement(CardElement)) {

        const response = await fetch('https://capable-parfait-de86c8.netlify.app/.netlify/functions/create-payment-intent');
        const { clientSecret } = await response.json();

        const { paymentIntent } = await stripe
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
      console.log(e);
      setResponse(String(e));
    }
  };

  return (
    <IonPage>
      <IonContent style={{height: '100vh', width: '100vw'}}>
        <div style={{position: 'relative', top: '30%', width: '90%', margin: 'auto'}}>
          <form onSubmit={handleSubmit}>
            <CardElement options={{hidePostalCode: true}}/>
            <IonButton disabled={!stripe} type="submit">Submit</IonButton>
          </form>
          <div style={{paddingTop: '20px', display: 'flex', flexDirection: 'column'}}>
            <IonText>{response}</IonText>
            <IonText>{token}</IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default StripePage;