import { IonContent, IonHeader, IonLoading, IonPage} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
// import ReactPDF from '@react-pdf/renderer';

import BasicHeader from '../components/BasicHeader';

import { get } from '../utils/IonicStorage';

import '../styles/index.css';
import '../styles/text.css';

const PastPurchases: React.FC = () => {

  let history = useHistory();

  const [receiptUrl, setReceiptUrl] = useState<string>();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getReceipt = async () => {
      let receipt_url = await get('receipt_url');
      console.log(receipt_url);
      await setReceiptUrl(receipt_url);
      setShowLoading(false);
    }

    getReceipt();
  }, []);

  return (
    <IonPage className='text'>
      <IonContent force-overscroll scroll-events style={{marginBottom: '100px'}}>
        <IonHeader translucent style={{position: 'fixed', top: '0px', zIndex: 20}}>
          <BasicHeader title={'Receipt'} />
        </IonHeader>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
        <div className='body' style={{paddingBottom: '100px'}}>
         <iframe src={receiptUrl} style={{width: '100vw', height: '100vh'}}></iframe>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PastPurchases;
