import { IonActionSheet, IonAlert, IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonText, IonToolbar } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 

import { TrainerData, ServicePackage, TrainerActivity } from '../utils/data';
import { apiPostFetch } from '../utils/requests';
import { fetchTrainerData, fetchPackages } from '../utils/utils';
import { get, set } from '../utils/IonicStorage';

import ButtonsFooter from '../components/ButtonsFooter';
import BookAndBuyModal from '../components/BookAndBuyModal';

import '../styles/index.css';
import '../styles/text.css';

type Props = {
  cover_photo: string;
  client_id: number;
}

const TrainerProfile: React.FC<Props> = ({ cover_photo, client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [currentTrainerId, setCurrentTrainerId] = useState<number>();
  const [currentTrainer, setCurrentTrainer] = useState<TrainerData>();
  const [classDateAndTime, setClassDateAndTime] = useState<Date>();
  const [timezone, setTimezone] = useState<string>('');
  const [flow, setFlow] = useState<string>();
  const [currentPackage, setCurrentPackage] = useState<ServicePackage[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState('Success');
  const [alertMessage, setAlertMessage] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardId, setCardId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getTrainer = async () => {
      let flow_current = await get('flow');
      setFlow(flow_current);
      let current_trainer_id = await get('current_trainer_id');
      setCurrentTrainerId(current_trainer_id);
      let trainer = await fetchTrainerData(current_trainer_id);
      return trainer;
    }

    getTrainer().then((trainer) => {
      setCurrentTrainer(trainer);
      setShowLoading(false);
    })
  }, []);

  const serviceBooking = async () => {
    let selectedService = await get('current_service');
    selectedService = await selectedService.find((item: TrainerActivity) => { return item.trainer.id === currentTrainerId; })
    let selectedTime = await get('since');
    let endTime = await get('till');
    try {
      let body = {
          appointment: {
              client_ids: [client_id],
              location_id: selectedService && selectedService.location.id,
              trainer_activity_id: selectedService && selectedService.id,
              reccurrence_attributes: {
                  starts_at: selectedTime && new Date(selectedTime).toISOString(),
                  ends_at: endTime && endTime.toISOString(),
                  template: "single"
              }
          }
      };
      let response = await apiPostFetch('/api/unified/schedule/appointments', body, true);
      if(response.appointment.errors.length === 0) {
        await setAlertHeader(t('alert.success'));
        await setAlertMessage(t('alert.you_have_booked') + ' ' + selectedService && selectedService.trainer.name + '. ' + t('alert.enjoy_your_workout'));
        setShowAlert(true);
      }
      else if(response.appointment.errors && response.appointment.errors.find((error: any) => {return (error.on === "time_frame" && error.type === "invalid") || (error.on === "occurrences" && error.type === "advance_time_restriction");})) {
        await setAlertHeader(t('alert.invalid_time'));
        await setAlertMessage(t('alert.chosen_time_can_not'));
        setShowAlert(true);
      }
      else if(response.appointment.errors && response.appointment.errors.find((error: any) => {return error.type === "not_enough_credits";})) {
        let service_category = await get('current_service_category');
        let params = `?unified_filters[trainer_id]=${selectedService && selectedService.trainer.id}&unified_filters[location_id]=${selectedService && selectedService.location.id}&unified_filters[service_category_id]=${service_category}&unified_filters[credit_service_ids]=${selectedService && [selectedService.service.id]}&unified_sorting[position] = true&limit[start]=0&limit[count]=1`;
        let fetchedPackage = await fetchPackages(params);
        await setCurrentPackage(fetchedPackage);
        setModalOpen(true);
      }
      else {
        await setAlertHeader(t('alert.error'));
        await setAlertMessage(t('alert.an_error_occured') + ' type:' + response.appointment.errors[0].type);
        setShowAlert(true);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  return (
    <IonPage style={{minHeight: '100vh'}}>
      <IonContent>
        <IonHeader className='background-header' style={{position: 'fixed'}}>
          <div className='background-header-image' style={{backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 100%,  rgba(0, 0, 0, 0.5) 100%), url(${cover_photo})`}}>
            <IonToolbar className='class-toolbar'>
              <IonButton className="small-grey-icon-button class-page-toolbar-button" onClick={() => {history.goBack();}}><IonIcon icon={chevronBackOutline} className="toolbar-icon"></IonIcon></IonButton>
            </IonToolbar>
          </div>
        </IonHeader>
        <IonLoading
         cssClass='loading'
         isOpen={showLoading}
         onDidDismiss={() => setShowLoading(false)}
       />
       {currentPackage && <BookAndBuyModal flow={'service'} setPaymentMethod={setPaymentMethod} setCardId={setCardId} isOpen={modalOpen} setOnClose={setModalOpen} setShowActionSheet={setShowActionSheet} client_id={client_id} currentPackage={currentPackage[0]} />}
       <IonAlert
           isOpen={showAlert}
           onDidDismiss={() => {setShowAlert(false);
             if(alertHeader === t('alert.success')) {
                history.push('/my_bookings')
             }
           }}
           cssClass='my-custom-class'
           mode='ios'
           header={alertHeader}
           message={alertMessage}
           buttons={['OK']}
         />
         {currentPackage && <IonActionSheet
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            cssClass='my-custom-class'
            header={t('payment.choose_payment_provider')}
            buttons={[{
              text: t('payment.pay_by_cash'),
              data: 0,
              handler: async () => {
                await set('current_product', currentPackage[0]);
                await set('payment_flow', null);
                history.push('/payment');
              }
            }, {
              text: t('payment.pay_by_credit_card') + ' (' + paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) + ')',
              data: 1,
              handler: async () => {
                await set('current_product', currentPackage[0]);
                await set('payment_flow', paymentMethod);
                await set('card_id', cardId);
                // if(paymentMethod.localeCompare('stripe') === 0 || paymentMethod === 'stripe') {
                //   history.push('/stripe');
                // } 
                // else {
                //   history.push('/payment');
                // }
                history.push('/payment');
              }
            }, {
              text: t('payment.cancel'),
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }]}
        >
        </IonActionSheet>}
        {currentTrainer && <div className='body detail-body' style={{paddingBottom: '151px', height: 'fit-content'}}>
          <IonAvatar>
            <img src={currentTrainer.image ? currentTrainer.image : '/assets/icon/profile_image.png'} className='trainer-avatar' />
          </IonAvatar>
          <IonText className='EGymText-28px-1' style={{padding: '0px'}}>{currentTrainer.name}</IonText>
          {/*}<div className='two-side' style={{paddingTop: '8px'}}>
            <IonChip className='chip'>Spot Booking</IonChip>
          </div>*/}
          <div className='EGymText-16px-032' style={{display: 'flex', flexDirection: 'column', paddingTop: '32px', paddingRight: '10px'}}>
            <IonText className='subheader'>{t('biography')}</IonText>
            <IonText dangerouslySetInnerHTML={{ __html: currentTrainer.bio }}></IonText>
          </div>
          {currentTrainer.qualifications && <div className='EGymText-16px-032' style={{paddingTop: '32px', paddingRight: '10px', display: 'flex', flexDirection: 'column'}}>
            <IonText className='subheader'>{t('qualifications')}</IonText>
            <IonText dangerouslySetInnerHTML={{ __html: currentTrainer.qualifications }}></IonText>
          </div>}
        </div>}
      </IonContent>
      {currentTrainer && (flow === 'trainers' ? 
          <ButtonsFooter text={t('book') + ' ' + currentTrainer.name.split(' ')[0]} onClick={ async () => {
            await set('current_tab_name', currentTrainer.name.split(' ')[0]);
            history.push('/trainer_services');
          }} secondButtonText={t('footer.buy_products')} onClickSecond={() => history.push('/pt_products_list')}/>
           : 
          <ButtonsFooter text={t('book') + ' ' + currentTrainer.name.split(' ')[0]} onClick={serviceBooking} secondButtonText={t('footer.buy_products')} onClickSecond={() => history.push('/pt_products_list')}/>)
        }
    </IonPage>
  );
};

export default TrainerProfile;
