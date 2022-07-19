import { IonContent, IonHeader, IonItem, IonLoading, IonPage, IonText } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import Portals from '@ionic/portals';
import { useTranslation } from 'react-i18next';

import { currency_symbols, ClientServicePackage } from '../utils/data';
import { fetchClientPackages } from '../utils/utils';

import BasicHeader from '../components/BasicHeader';
import BasicFooter from '../components/BasicFooter';

// import './ActiveProducts.css';
import '../styles/index.css';
import '../styles/text.css';

const MyProducts: React.FC = () => {

  let history = useHistory();
  const { t } = useTranslation();

  const [status, setStatus] = useState<string>('active');
  const [activeProducts, setActiveProducts] = useState<{ [id: string]: ClientServicePackage[] }>({});
  const [showLoading, setShowLoading] = useState(true);

  const getActiveProducts = async (status: string) => {
    let data = await fetchClientPackages("?unified_filters[status]=" + status);
    console.log(data);
    data = await mapToDates(data);
    console.log(data);
    await setActiveProducts(data);
    setShowLoading(false);
  }

  useEffect(() => {
    getActiveProducts(status);
  }, []);

  const mapToDates = async ( arr: ClientServicePackage[] ) => {
    let byDates: { [id: string]: ClientServicePackage[] } = {};
    arr.map((item) => {
      let assigned_at = new Date(item.assigned_at);
      assigned_at.setHours(0, 0, 0, 0);
      if(Object.keys(byDates).find((string_date) => {
        let date = new Date(string_date);
        return date.getTime() === assigned_at.getTime();
      })) {
        byDates[String(assigned_at)].push(item);
      }
      else {
        byDates[String(assigned_at)] = [item];
      }
    })
    return byDates;
  }

  return (
    <IonPage  style={{backgroundColor: '#F4F4F4'}}>
      <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
        <BasicHeader title={t('headers.my_products')} onClick={ async () => {await Portals.publish({ topic: 'subscription', data: {type: 'dismiss', data: null } });}} />
      </IonHeader>
      <IonLoading
        cssClass='loading'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
      />
      <IonContent style={{backgroundColor: '#F4F4F4'}}>
        <div style={{paddingBottom: '100px', backgroundColor: '#F4F4F4'}}>
          {Object.keys(activeProducts).map((key, i) => {
            return (
              <div key={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')}>
                <div className='sticky-date' style={{position: 'sticky', top: '0px', zIndex: 10, background: '#F4F4F4', paddingTop: '8px', paddingBottom: '8px'}}>
                  <IonText className='date'>{format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd') + ' ' + format(new Date(key), 'yyyy')}</IonText>
                </div>
                {activeProducts[key].map((item: ClientServicePackage) => {
                  return (<IonItem lines="none" className='package-item'>
                    <div className='package-padding'>
                      <div className='two-side-container package-card'>
                        <IonText className='EGymText-16px-032' style={{fontWeight: 600}}>{item.service_package.name}</IonText>
                        <IonText className='EGymText-14px-032'>{item.total_credits - item.used_credits + '/' + item.total_credits + ' ' + t('remaining')}</IonText>
                      </div>
                      <div className='two-side-container package-card'>
                        <IonText className='EGymText-14px-032'>{currency_symbols[item.service_package.price.currency_code] + item.service_package.price.amount}</IonText>
                        <IonText className='EGymText-14px-032'>{'Expires ' + format(new Date(item.expires_at), 'dd') + '/' + format(new Date(item.expires_at), 'MM') + '/' + format(new Date(item.expires_at), 'Y')}</IonText>
                      </div>
                    </div>
                  </IonItem>);
                })}
              </div>
            )
          })}
        </div>
      </IonContent>
      <BasicFooter text={t('footer.buy_a_package')} onClick={() => {history.push('/pt_products_list');}}/>
    </IonPage>
  );
};

export default MyProducts;
