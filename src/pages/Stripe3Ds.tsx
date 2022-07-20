import {IonContent, IonHeader, IonLoading, IonPage, IonText} from '@ionic/react';
import {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import '@stripe/stripe-js';
// import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import {Browser} from '@capacitor/browser';

import {ServicePackage, ServicePackageShow} from '../utils/data';
import {apiPostFetch} from '../utils/requests';
import {get, set} from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

import '../styles/index.css';
import '../styles/text.css';
import '../styles/Stripe.css';

declare var Stripe: any;

const Stripe3Ds: React.FC = () => {

  const publishable_key = 'pk_test_MaMhlqv0uPa8mFSOKTJGYO8U';

  let history = useHistory();
  const { t } = useTranslation();

  const [stripe3Ds, setStripe3Ds] = useState<string>();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getStripe3DsUrl = async () => {
      let url: string = await get('stripe_3ds');
      await setStripe3Ds(url);

      console.log('stripe url', url);

      // await Browser.open({ url: url, presentationStyle: 'popover' });
      // browser.executeScript(...);
      // browser.insertCSS(...);
      // browser.on('loadstart').subscribe( async (event) => {
      //     if(event.url.includes('localhost')) {
      //         browser.close();{/*.includes('localhost') */}
      //         await set('response_url', event.url);
      //         history.push('/stripe_result');
      //     }
      // });

      // browser.close();

      setShowLoading(false);
    }

    getStripe3DsUrl();
  }, []);

//   new MutationObserver(function(mutations) {
//     mutations.some(function(mutation) {
//       if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
//         console.log(mutation);
//         console.log('Old src: ', mutation.oldValue);
//         console.log('New src: ', mutation.target);
//         return true;
//       }

//       return false;
//     });
//   }).observe(document.body, {
//     attributes: true,
//     attributeFilter: ['src'],
//     attributeOldValue: true,
//     characterData: false,
//     characterDataOldValue: false,
//     childList: false,
//     subtree: true
//   });

  const unloadHandler = (iframe: HTMLIFrameElement, callback: (value: string) => void) => {
    // Timeout needed because the URL changes immediately after
    // the `unload` event is dispatched.

    setTimeout(function () {
      if (iframe.contentWindow) {
        callback(iframe.contentWindow.location.href);
      }
    }, 0);
  };

  // const attachUnload = (iframe: HTMLIFrameElement, callback: (value: string) => void) => {
  //     // Remove the unloadHandler in case it was already attached.
  //     // Otherwise, the change will be dispatched twice.
  //     if(iframe.contentWindow) {
  //         iframe.contentWindow.removeEventListener("unload", unloadHandler(iframe, callback));
  //         iframe.contentWindow.addEventListener("unload", unloadHandler(iframe, callback));
  //     }
  // }

  // const iframeURLChange = (iframe: HTMLIFrameElement, callback: (value: string) => void) => {

  //     iframe.addEventListener("load", attachUnload);
  //     attachUnload();
  // }

  // iframeURLChange(document.getElementById("mainframe") as HTMLIFrameElement, (newURL: string) => {
  //     console.log("URL changed:", newURL);
  // });

  return (
    <IonPage>
      <IonContent>
        {/*<IonHeader style={{position: 'fixed', top: '0px', zIndex: 20}}>
          <BasicHeader title={flow === 'cash' ? t('headers.pay_by_cash') : t('headers.add_a_payment_card')} />
        </IonHeader>*/}
        <IonLoading
          cssClass='loading'
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
        />
        {stripe3Ds ?
          <iframe
            id="mainframe"
            src={stripe3Ds}
            style={{ width: '100vw', height: '100vh' }}
            onLoad={() => {
              unloadHandler(document.getElementById("mainframe") as HTMLIFrameElement, (newURL: string) => {
                console.log("URL changed:", newURL);
                alert(newURL);
              });
            }}
          ></iframe>
          : null
        }
      </IonContent>
    </IonPage>
  );

};

export default Stripe3Ds;
