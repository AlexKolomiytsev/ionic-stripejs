import React, { useState, useEffect } from 'react';
import { IonActionSheet, IonAlert, IonContent, IonDatetime, IonHeader, IonItem, IonLoading, IonPage, IonText } from '@ionic/react';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TrainerActivity, ServicePackage } from '../utils/data';
import { fetchPackages } from '../utils/utils';
import { apiPostFetch } from '../utils/requests';
import { get, set, remove } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import BasicFooter from '../components/BasicFooter';
import BookAndBuyModal from '../components/BookAndBuyModal';

// import './PTTimeSelector.css';
import '../styles/index.css';
import '../styles/text.css';

type Props = {
  client_id: number;
  minutes_interval: number;
}

const PtTimeslots: React.FC<Props> = ({ client_id, minutes_interval }) => {

  let history = useHistory();
  const { t } = useTranslation();

  let fetchedPackage: ServicePackage;

  const [tabName, setTabName] = useState<string>();
  const [since, setSince] = useState<Date>();
  const [till, setTill] = useState<Date>();
  const [hourValues, setHourValues] = useState<number[]>();
  const [minuteValues, setMinuteValues] = useState<number[]>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [endTime, setEndTime] = useState<Date>();
  const [selectedService, setSelectedService] = useState<TrainerActivity[]>();
  const [currentPackage, setCurrentPackage] = useState<ServicePackage[]>();
  const [modalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState('Success');
  const [alertMessage, setAlertMessage] = useState('');
  const [flow, setFlow] = useState('trainers');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardId, setCardId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getTimeslot = async () => {
      setTabName(await get('current_tab_name'));
      let since_date = new Date(await get('timeslot_since'));
      setSince(since_date);
      let till_date = new Date(await get('timeslot_till'));
      setTill(till_date);
      setHourValues(await mapToHours(since_date, till_date));
      if(since_date.getTime() === till_date.getTime()) {
        setMinuteValues([0]);
      }
      else {
        setMinuteValues(await mapToMinutes());
      }
      since_date.setMinutes(since_date.getMinutes() + 30);
      since_date.setMinutes(0);
      console.log(format(since_date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));
      setSelectedTime(format(since_date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));
      let service = await get('current_service');
      console.log(service);
      console.log(since_date.getTime());
      let date = new Date(since_date);
      date.setTime(date.getTime() + (service[0].service.duration_in_hours*60*60*1000) + (service[0].service.duration_in_minutes*60*1000));
      setEndTime(date);
      setSelectedService(service);
      let flow_selected = await get('flow');
      setFlow(flow_selected);
      setShowLoading(false);
    }

    getTimeslot();
    // setShowLoading(false);
  }, []);

  // useEffect(() => {
  //   console.log(selectedTime);
  // }, [selectedTime])

  useEffect(() => {
    console.log(since);
  }, [since])

  const mapToHours = async ( since: Date, till: Date ) => {
    let date = new Date(since);
    console.log(date);
    let hour_values = [];
    while(date.getTime() <= till.getTime()) {
      hour_values.push(date.getHours());
      date.setTime(date.getTime() + (60*60*1000));
    }

    return hour_values;
  }

  const mapToMinutes = async () => {
    let minutes = 0;
    let minute_values = [0];
    while(minutes < 60) {
      minutes += minutes_interval;
      minute_values.push(minutes);
    }
    return minute_values;
  }

  const getPackage = async () => {
    let service_category = await get('current_service_category');
    let params = `?unified_filters[trainer_id]=${selectedService && selectedService[0] && selectedService[0].trainer.id}&unified_filters[location_id]=${selectedService && selectedService[0] && selectedService[0].location.id}&unified_filters[service_category_id]=${service_category}&unified_filters[credit_service_ids]=${selectedService && selectedService[0] && [selectedService[0].service.id]}&unified_sorting[position] = true&limit[start]=0&limit[count]=1`;
    await setCurrentPackage(await fetchPackages(params));
  };


  const clearFilters = async () => {
    await remove('classes');
    await remove('locations');
    await remove('location_ids');
    await remove('class_types');
    await remove('instructors');
  }

  const serviceBooking = async () => {
    try {
      await clearFilters();
      let body = {
          appointment: {
              client_ids: [client_id],
              location_id: selectedService && selectedService[0] && selectedService[0].location.id,
              trainer_activity_id: selectedService && selectedService[0] && selectedService[0].id,
              reccurrence_attributes: {
                  starts_at: selectedTime && new Date(selectedTime).toISOString(),
                  ends_at: endTime && endTime.toISOString(),
                  template: "single"
              }
          }
      };
      let response = await apiPostFetch('/api/unified/schedule/appointments', body, true);
      console.log(body);
      console.log(response);
      if(response.appointment.errors.length === 0 && selectedService && selectedService[0]) {
        await setAlertHeader(t('alert.success'));
        await setAlertMessage(t('alert.you_have_booked') + ' ' + selectedService[0].trainer.name + '. ' + t('alert.enjoy_your_workout'));
        setShowAlert(true);
      }
      else if(response.appointment.errors && response.appointment.errors.find((error: any) => {return (error.on === "time_frame" && error.type === "invalid") || (error.on === "occurrences" && error.type === "advance_time_restriction");})) {
        await setAlertHeader(t('alert.invalid_time'));
        await setAlertMessage(t('alert.chosen_time_can_not'));
        setShowAlert(true);
      }
      else if(response.appointment.errors && response.appointment.errors.find((error: any) => {return error.type === "not_enough_credits";})) {
        let service_category = await get('current_service_category');
        let params = `?unified_filters[trainer_id]=${selectedService && selectedService[0] && selectedService[0].trainer.id}&unified_filters[location_id]=${selectedService && selectedService[0] && selectedService[0].location.id}&unified_filters[service_category_id]=${service_category}&unified_filters[credit_service_ids]=${selectedService && selectedService[0] && [selectedService[0].service.id]}&unified_sorting[position] = true&limit[start]=0&limit[count]=1`;
        let fetchedPackage = await fetchPackages(params);
        await setCurrentPackage(fetchedPackage);
        console.log(currentPackage);
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
    <IonPage className='text'>
      <IonLoading
        cssClass='loading'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
      />
      <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
        <BasicHeader title={t('book') + ' ' + tabName} />
        <div className='top-border weeks-list' style={{paddingLeft: '20px'}}>
          {since && till && <IonText>{format(since, 'eee') + ', ' + format(since, 'LLL') + ' ' + format(since, 'dd') + ' from ' + format(since, 'HH:mm') + ' - ' + format(till, 'HH:mm')}</IonText>}
        </div>
      </IonHeader>
      <IonContent force-overscroll>
        {currentPackage && <BookAndBuyModal flow={'service'} setPaymentMethod={setPaymentMethod} setCardId={setCardId} isOpen={modalOpen} setOnClose={setModalOpen} setShowActionSheet={setShowActionSheet} client_id={client_id} currentPackage={currentPackage[0]} />}
        <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => {
              setShowAlert(false);
              if(alertHeader === t('alert.success')) {
                history.push('/my_bookings');
              }
            }}
            cssClass='my-custom-class'
            mode='ios'
            header={alertHeader}
            message={alertMessage}
            buttons={['OK']}
          />
          {currentPackage &&<IonActionSheet
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
          {/*}<IonAlert
              isOpen={showInvalidTimeAlert}
              onDidDismiss={() => setShowInvalidTimeAlert(false)}
              cssClass='my-custom-class'
              mode='ios'
              header={'Invalid Time'}
              message={'Chosen timeslot can not be booked.'}
              buttons={['OK']}
            />*/}
        <div style={{background: '#F4F4F4', height: '100%'}} id='body'>
          <div style={{background: '#F4F4F4', paddingTop: '25px', paddingBottom: '15px'}} >
            <IonText className='date'>{t('start_time') + ':'}</IonText>
          </div>
          <div className='EGymText-20px-1 selector-background' style={{backgroundColor: '#FFFFFF'}}>
          {since && till &&  <IonDatetime
            color="dark"
            className='EGymText-20px-1'
            mode='md'
            value={selectedTime}
            hour-values={hourValues}
            hourCycle="h23"
            presentation="time"
            minute-values={minuteValues}
            style={{maxWidth: '100vw', background: '#FFFFFF', color: 'var(--ion-text-color)'}}
            onIonChange={ async (e) => {
              console.log(new Date(e.detail.value!).toISOString());
              setSelectedTime(e.detail.value!);
              if(selectedService && selectedService[0]) {
                let date = new Date(e.detail.value!);
                date.setTime(date.getTime() + (selectedService[0]!.service.duration_in_hours*60*60*1000) + (selectedService[0]!.service.duration_in_minutes*60*1000));
                await setEndTime(date);
                console.log(endTime && endTime.toISOString());
              }
            }}>
            </IonDatetime>}
          </div>
          <div style={{background: '#F4F4F4', paddingTop: '25px', paddingBottom: '15px'}} >
            <IonText className='date'>{t('end_time') + ':'}</IonText>
          </div>
          <IonItem lines="none" className='trainer-activity-card'>
            <div className='two-side' style={{padding: '20px'}}>
              <IonText className='EGymText-20px-1'>{endTime && format(endTime, 'HH:mm')}</IonText>
            </div>
          </IonItem>
        </div>
        <div className='buttons-footer'>
          {(flow === 'trainers' && <BasicFooter text={t('footer.complete_booking')} onClick={serviceBooking} secondButtonText={t('payment.cancel')} onClickSecond={() => {history.push('/flow_selection')}}/>)
           ||
           (flow === 'services' && <BasicFooter text={t('footer.find_a_trainer')} onClick={async () => { await set('since', selectedTime);
          await set('till', endTime);
          history.push('/trainers'); }} secondButtonText={t('payment.cancel')} onClickSecond={() => {history.push('/flow_selection')}}/>)}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PtTimeslots;
