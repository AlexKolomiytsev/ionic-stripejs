import { IonContent, IonHeader, IonLoading, IonPage, IonText } from '@ionic/react';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@stripe/stripe-js';
// import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';

import { ServicePackage, ServicePackageShow } from '../utils/data';
import { apiPostFetch } from '../utils/requests';
import { get } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

import '../styles/index.css';
import '../styles/text.css';
import '../styles/Stripe.css';

declare var Stripe: any;

const Stripe3Ds: React.FC = () => {

  const publishable_key = 'pk_test_MaMhlqv0uPa8mFSOKTJGYO8U';

  let history = useHistory();
  const { t } = useTranslation();

  const [responseUrl, setResponseUrl] = useState<string>();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getResponseUrl = async () => {
        let url: string = await get('response_url');
        await setResponseUrl(url);
        setShowLoading(false);
    }

    getResponseUrl();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
          <BasicHeader title='Stripe Results' />
        </IonHeader>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        {/*stripe3Ds ? 
            <iframe 
                id="mainframe"
                src={stripe3Ds} 
                style={{width: '100vw', height: '100vh'}}
                onLoad={ () => {
                    unloadHandler(document.getElementById("mainframe") as HTMLIFrameElement, (newURL: string) => {
                        console.log("URL changed:", newURL);
                    });
                }}
            ></iframe> 
            : null
            */}
            {responseUrl ? <IonText style={{margin: 'auto'}}>{responseUrl}</IonText> : <IonText>No response url</IonText>}
      </IonContent>
    </IonPage>
  );

};

export default Stripe3Ds;
