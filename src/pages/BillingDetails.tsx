import { IonContent, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonText } from '@ionic/react';
import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Portals from '@ionic/portals';
import InputMask from 'react-input-mask';

import BasicHeader from '../components/BasicHeader';
import ButtonsFooter from '../components/ButtonsFooter';

// import './ProfileBilling.css';
import '../styles/index.css';
import '../styles/text.css';

type Props = {
  fourDigits?: string;
} 

const BillingDetails: React.FC<Props> = ({ fourDigits }) => {

  let history = useHistory();
  const { t } = useTranslation();
  
  const [placeholder, setPlaceholder] = useState(true);

  return (
    <IonPage>
        <IonHeader translucent style={{position: 'relative', top: '0px', zIndex: 20}}>
          {/*}<IonToolbar>
            <div className="two-side-container toolbar-profile-container">
              <IonButton color="light" className='small-grey-icon-button' onClick={() => {history.goBack();}}><IonIcon icon={chevronBackOutline} className="toolbar-icon"></IonIcon></IonButton>
              <IonText className='my-profile'>Billing Details</IonText>
              <div style={{width: '30px'}}></div>
            </div>
          </IonToolbar><IonInput className='card-field' id='card-number' type="tel" inputmode="numeric" maxlength={19} autocomplete="cc-number" pattern="[0-9]*" autofocus ></IonInput>*/}
          <BasicHeader title={'Billing Details'} onClick={ async () => {await Portals.publish({ topic: 'subscription', data: {type: 'dismiss', data: null } });}} />
        </IonHeader>
        <IonContent>
          <div style={{height: 'calc(100vh - 120px)', backgroundColor: '#F9F9F9'}}>
            <div style={{margin: '20px'}}>
              <div className='credit-card'>
                <div style={{padding: '15px', paddingRight: '50px'}}>
                  <IonLabel className='EGymText-12x-0'>Card Number</IonLabel>
                  {fourDigits ?
                          <div className='card-field'>
                              <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot'></div>
                              <div className='black-separator-dot'></div>
                              <IonText style={{marginLeft: '8px'}}>{fourDigits}</IonText>
                          </div> :
                        <div className='card-field'></div>}
                </div>
                <div style={{padding: '15px', paddingRight: '50px', paddingTop: '30px'}}>
                  <div className='two-side-container'>
                    <div style={{width: '50%'}}>
                      <IonLabel className='EGymText-12x-0'>Valid Thru</IonLabel>
                        {fourDigits ?
                            <div className='two-side-container'>
                              <div className='card-field' style={{marginRight: '10px'}}>
                                <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                                <div className='black-separator-dot'></div>
                              </div>
                              <div className='card-field'>
                                <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                                <div className='black-separator-dot'></div>
                              </div>
                            </div> :
                            <div className='two-side-container'>
                              <div className='card-field' style={{marginRight: '10px'}}>
                              </div>
                              <div className='card-field' style={{marginRight: '10px'}}>
                              </div>
                            </div>}
                      </div>
                    <div style={{width: '20%'}}>
                      <IonLabel className='EGymText-12x-0'>CVV</IonLabel>
                      {fourDigits ?
                          <div className='card-field'>
                            <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                            <div className='black-separator-dot'></div>
                            <div className='black-separator-dot'></div>
                          </div> :
                          <div className='card-field'>
                          </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <IonList style={{backgroundColor: '#F9F9F9'}}>
              <IonItemGroup>
                <IonItemDivider style={{backgroundColor: '#F9F9F9', border: '0px', paddingTop: '16px', paddingBottom: '10px'}}>
                  <IonLabel>{t('menu.manage_addresses')}</IonLabel>
                </IonItemDivider>

                <IonItem lines="none" className="profile-action" onClick={() => {history.push('/billing_address')}}>
                  <IonIcon size='large' src='/assets/icon/billing_address.svg' style={{padding: '15px 0px'}}/>
                  <IonLabel style={{marginLeft: '10px'}}>{t('menu.billing_address')}</IonLabel>
                </IonItem>

                {/*<IonItem lines="none" className="profile-action">
                  <IonIcon size='large' src='/assets/icon/shipping_address.svg' style={{padding: '15px 0px'}}/>
                  <IonLabel style={{marginLeft: '10px'}}>{t('menu.shipping_address')}</IonLabel>
                        </IonItem>*/}

                <IonItemDivider style={{backgroundColor: '#F9F9F9', border: '0px', paddingTop: '14px', paddingBottom: '10px'}}>
                  <IonLabel>{t('menu.transaction_history')}</IonLabel>
                </IonItemDivider>

                <IonItem lines="none" className="profile-action" onClick={() => {history.push('/past_purchases')}}>
                  <IonIcon size='large' src='/assets/icon/past_purchases.svg' style={{padding: '15px 0px'}}/>
                  <IonLabel style={{marginLeft: '10px'}}>{t('menu.past_purchases')}</IonLabel>
                </IonItem>
              </IonItemGroup>
            </IonList>
          </div>
        </IonContent>
        <ButtonsFooter text={t('footer.save_billing_details')}/>
    </IonPage>
  );
};

export default BillingDetails;
