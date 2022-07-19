import { IonActionSheet, IonButton, IonCard, IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonText, IonToolbar } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { get, set } from '../utils/IonicStorage';
import { currency_symbols, currency_decimals, ServicePackageShow } from '../utils/data';
import { fetchPackageShow } from '../utils/utils';

import BasicFooter from '../components/BasicFooter';
import BookAndBuyModal from '../components/BookAndBuyModal';

import '../styles/index.css';
import { apiPostFetch } from '../utils/requests';

type Props = {
  client_id: number;
}

const PTProductDetail: React.FC<Props> = ({ client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [currentProduct, setCurrentProduct] = useState<ServicePackageShow>();
  const [modalOpen, setModalOpen] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardId, setCardId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      let product_id = await get('current_product_id');
      let product = await fetchPackageShow(product_id);
      console.log(product);
      await setCurrentProduct(product);
      setShowLoading(false);
    }

    getProduct();
  }, []);

  return (
    <IonPage className='text'>
      <IonContent>
      {currentProduct && 
      <>
        <BookAndBuyModal flow={'product'} setPaymentMethod={setPaymentMethod} setCardId={setCardId} isOpen={modalOpen} setOnClose={setModalOpen} setShowActionSheet={setShowActionSheet} client_id={client_id} currentPackage={currentProduct} />
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          cssClass='my-custom-class'
          header={t('payment.choose_payment_provider')}
          buttons={[{
            text: t('payment.pay_by_cash'),
            data: 0,
            handler: async () => {
              await set('current_product', currentProduct);
              await set('payment_flow', null);
              history.push('/payment');
            }
          }, {
            text: t('payment.pay_by_credit_card') + ' (' + paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) + ')',
            data: 1,
            handler: async () => {
              // await set('stripe_3ds', 'https://hooks.stripe.com/3d_secure_2/hosted?merchant=acct_1KlFWwJQiUVT3F1L&payment_intent=pi_3LFzxcJQiUVT3F1L0PpBYN3f&payment_intent_client_secret=pi_3LFzxcJQiUVT3F1L0PpBYN3f_secret_DxHJjTD4fPFhUeKPrZkM8uXfo&publishable_key=pk_test_MaMhlqv0uPa8mFSOKTJGYO8U&source=src_1LFzxcJQiUVT3F1LuOUP2lCs&stripe_account=acct_1KlFWwJQiUVT3F1L');
              // history.push('/stripe_3ds')
              await set('current_product', currentProduct);
              await set('payment_flow', paymentMethod);
              await set('card_id', cardId);
              if(paymentMethod.localeCompare('stripe') === 0 || paymentMethod === 'stripe') {
                history.push('/stripe');
              } 
              else {
                history.push('/payment');
              }
              // history.push('/payment');
            }
          }, {
            text: t('payment.pay_by_credit_card') + ' (' + paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) + ') Stripe.js',
            data: 1,
            handler: async () => {
              await set('current_product', currentProduct);
              await set('payment_flow', paymentMethod);
              await set('card_id', cardId);
              history.push('/stripe');
            }
          }, {
            text: 'Test with Capacitor plugin' + t('payment.pay_by_credit_card') + ' (' + paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) + ')',
            data: 1,
            handler: async () => {
              await set('current_product', currentProduct);
              await set('payment_flow', paymentMethod);
              await set('card_id', cardId);
              // if(paymentMethod.localeCompare('stripe') === 0 || paymentMethod === 'stripe') {
              //   history.push('/stripe');
              // } 
              // else {
              //   history.push('/payment');
              // }
              history.push('/stripe_capacitor');
            }
          }, {
            text: t('payment.cancel'),
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }]}
        >
        </IonActionSheet>
      </>}
      {currentProduct && 
        <IonHeader style={{position: 'fixed', height: '288px', zIndex: 10}}>
          <div className='background-header-image' style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 100%,  rgba(0, 0, 0, 0.5) 100%), url(${currentProduct.logo_url ? currentProduct.logo_url : '/assets/icon/club_image.jpg'})`}}>
            <IonToolbar className='class-toolbar'>
              <IonButton className="small-grey-icon-button class-page-toolbar-button" onClick={() => {history.goBack();}}><IonIcon icon={chevronBackOutline} className="toolbar-icon"></IonIcon></IonButton>
            </IonToolbar>
          </div>
        </IonHeader>}
        <IonLoading
          cssClass='loading'
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
        />
        {currentProduct && <div className='body detail-body' style={{paddingBottom: '67px', height: 'fit-content'}}>
          <IonText className='EGymText-28px-1' style={{paddingTop: '38px'}}>{currentProduct.name}</IonText>
          {/*}<div className='two-side' style={{paddingTop: '8px'}}>
            <IonChip className='chip'>Spot Booking</IonChip>
          </div>*/}
          <IonCard className='schedule-item'>
            <div className='date-container' style={{width: 'fit-content'}}>
              <div className='centered-date'>
                <IonText className='EGymText-16px-032' style={{fontWeight: 600, margin: 'auto'}} >{currency_symbols[currentProduct.price.currency_code] + (currentProduct.custom_price.amount / currency_decimals[currentProduct.custom_price.currency_code]).toFixed(2)}</IonText>
              </div>
            </div>
            <div className='two-side-container' style={{padding: '10px', paddingLeft: '20px'}}>
                <IonText className='EGymText-16px-032'>{currentProduct.subscribable ? 'Subscription' : 'One-Off Purchase'}</IonText>
            </div>
          </IonCard>
          {currentProduct.expirable && <div className='EGymText-16px-03' style={{display: 'flex', flexDirection: 'column', paddingTop: '32px', paddingRight: '10px'}}>
            <IonText className='subheader'>{t('expiry_information')}</IonText>
            <IonText style={{paddingTop: '4px'}}>{currentProduct.expires_in + ' ' + currentProduct.expires_period_type + ' after date of purchase'}</IonText>
          </div>}
          <div className='EGymText-16px-03' style={{display: 'flex', flexDirection: 'column', paddingTop: '32px', paddingRight: '10px'}}>
            <IonText className='subheader'>{t('package_description')}</IonText>
            <IonText style={{paddingTop: '4px'}}>{currentProduct.description}</IonText>
          </div>
        </div>}
      </IonContent>
      <BasicFooter text={t('footer.purchase')} onClick={() => {setModalOpen(true);}} />
    </IonPage>
  );
};

export default PTProductDetail;
