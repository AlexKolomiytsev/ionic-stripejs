import { IonContent,  IonHeader, IonItem, IonLoading, IonPage, IonText } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { currency_symbols, Transaction } from '../utils/data';
import { fetchTransactions } from '../utils/utils';
import { set } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

// import './PastPurchases.css';
import '../styles/index.css';
import '../styles/text.css';
import { t } from 'i18next';

const PastPurchases: React.FC = () => {

  let history = useHistory();
  const { t } = useTranslation();

  const [pastPurchases, setPastPurchases] = useState<{ [id: string]: Transaction[] }>({});
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getPastPurchases = async () => {
      let today = new Date();
      let data = await fetchTransactions('?unified_filters[till]=' + format(today, "yyyy-MM-dd") + '&unified_filters[since]=' + (today.getFullYear() - 1) + '-' + format(today, "MM-dd"));
      console.log(data);
      // data = await fetchClientPackages("?unified_filters[status]=inactive&unified_filters[status]=archived");
      data = await mapToDates(data);
      console.log(data);
      setPastPurchases(data);
      setShowLoading(false);
    }

    getPastPurchases();
  }, []);

  const mapToDates = async ( arr: Transaction[] ) => {
    let byDates: { [id: string]: Transaction[] } = {};
    arr.map((item) => {
      let paid_at = new Date(item.paid_at);
      paid_at.setHours(0, 0, 0, 0);
      if(Object.keys(byDates).find((string_date) => {
        let date = new Date(string_date);
        return date.getTime() === paid_at.getTime();
      })) {
        byDates[String(paid_at)].push(item);
      }
      else {
        byDates[String(paid_at)] = [item];
      }
    })
    return byDates;
  }

  return (
    <IonPage>
        <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
          <BasicHeader title={t('headers.past_purchases')} />
        </IonHeader>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
       <IonContent>
        <div style={{display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '100px', backgroundColor: '#F4F4F4', minHeight: '100vh'}}>
          {Object.keys(pastPurchases).map((key, i) => {
            return (
              <div key={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')}>
                <div className='sticky-date' style={{position: 'sticky', top: '0px', zIndex: 10, background: '#F4F4F4', paddingTop: '8px', paddingBottom: '8px'}}>
                  <IonText className='date'>{format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd') + ' ' + format(new Date(key), 'yyyy')}</IonText>
                </div>
                {pastPurchases[key].map((item: Transaction) => {
                  return (<IonItem lines="none" className='package-item' onClick={() => {
                    set('receipt_url', item.receipt_url);
                    history.push('/receipt');
                  }}>
                    <div className='package-padding'>
                      <div className='two-side-container package-card' style={{margin: 'auto'}}>
                        <IonText className='EGymText-16px-032' style={{fontWeight: 600, marginTop: 'auto', marginBottom: 'auto'}}>{item.product_name}</IonText>
                        <div style={{display: 'flex', flexDirection: 'column', alignSelf: 'flex-end'}}>
                          <IonText className='EGymText-14px-032'>{t('quantity') + ': ' + item.quantity}</IonText>
                          <IonText className='EGymText-14px-032'>{item.total ? currency_symbols[item.total.currency_code] + (item.total.amount * (-1)) : ' '}</IonText>
                        </div>
                      </div>
                    </div>
                  </IonItem>);
                })}
              </div>
            )
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PastPurchases;
