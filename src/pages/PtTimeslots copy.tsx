import React, { useState, useEffect } from 'react';
import { IonButton, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonList, IonLoading, IonPage, IonText } from '@ionic/react';
import { chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import { addDays, format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReactSVG } from 'react-svg';

import { Timeslot, TrainerActivity, Service } from '../utils/data';
import { fetchTimeslots } from '../utils/utils';
import { get, set } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';

// import './PtTimeslots.css';
import '../styles/index.css'

export type Props = {
  client_id: number;
}

const daysNum = 7;

const today = new Date();
today.setHours(0, 0, 0, 0);

let initDays = Array.from({ length: (daysNum + 1) }).map((_, dayNumber) => {
  const date =
    addDays(today, dayNumber);
    date.setHours(0, 0, 0, 0);
    return date;
});

const PtTimeslots: React.FC<Props> = ({ client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [tabName, setTabName] = useState<string>();
  const [firstDay, setFirstDay] = useState<number>(today.getTime());
  const [allDays, setAllDays] = useState(initDays);
  const [timeslots, setTimeslots] = useState<{ [id: string]: Timeslot[] }>({});
  // const [timeslots, setTimeslots] = useState<{ [id: string]: { [id: string]: Timeslot[] }}>({});
  // const [flow, setFlow] = useState<string>('trainers');
  const [showLoading, setShowLoading] = useState(true);

  const organizeTimeslots = async (service_timeslots: Timeslot[]) => {
    let serviceTimeslots = service_timeslots.sort( (a,b) => {
      return (new Date(b.since) > new Date(a.since)) ? -1 : 1;
    });
  }

  useEffect(() => {
    const getAnotherWeek = async () => {
      // setShowLoading(true);
      initDays = Array.from({ length: (daysNum + 1) }).map((_, dayNumber) => {
        const date =
          addDays(new Date(firstDay), dayNumber);
          date.setHours(0, 0, 0, 0);
          return date;
      });
      const since = new Date(initDays[0]);
      const till = new Date(initDays[initDays.length - 1]);
      let flow = await get('flow');
      let service = await get('current_service');
      setTabName(await get('current_tab_name'));
      let service_timeslots: any[] = []
      console.log(service);
      if(service[0].service) {
        await Promise.all(
          service.map( async (item: TrainerActivity) => {
            let params = '?since=' + since.toISOString() + '&till=' + till.toISOString() + '&service_id=' + item.service.id + '&location_id=' + item.location.id  + '&trainer_activity_id=' + item.id + '&client_id=' + client_id;
            let resp = await fetchTimeslots(params);
            if(resp) {
              service_timeslots.push(...resp);
            }
          })
        );
      }
      else {
        let locations = await get('location_ids');
        await Promise.all(
          locations.map( async (item: number) => {
            let params = '?since=' + since.toISOString() + '&till=' + till.toISOString() + '&service_id=' + service[0].id + '&location_id=' + item   + '&client_id=' + client_id;
            let resp = await fetchTimeslots(params);
            if(resp) {
              service_timeslots.push(...resp);
            }
          })
        );
      }
      service_timeslots = service_timeslots.sort( (a,b) => {
        return (new Date(b.since) > new Date(a.since)) ? -1 : 1;
      });
      // service_timeslots = await [...new Map(service_timeslots.map((item: Timeslot) => [item['since'].substring(0, item['since'].length - 4), item])).values()];
      let mapped_timeslots = await mapToDates(service_timeslots);
      console.log(mapped_timeslots);
      setTimeslots(mapped_timeslots);
      setShowLoading(false);
    }

    getAnotherWeek();
  }, [firstDay]);

  const mapToDates = async ( arr: any[] ) => {
    let byDates: { [id: string]: Timeslot[] } = Object.fromEntries(initDays.map(i => { return [String(i), []]; }));
    // debugger
    // await Promise.all(
    //
    // );
    await arr.map((item, index) => {
      let date = new Date(item.since);
      date.setHours(0, 0, 0, 0);
      // byDates[String(date)].push(item);
      if(byDates[String(date)].length){
        let ind = byDates[String(date)].findIndex((timeslot: Timeslot) => {
          return new Date(timeslot.since) <= new Date(item.since) && new Date(timeslot.till) >= new Date(item.since);
        });
        if(ind !== -1) {
          byDates[String(date)][ind].trainer_activity = [...byDates[String(date)][ind].trainer_activity, item.trainer_activity[0]];
          if(new Date(item.till) > new Date(byDates[String(date)][ind].till)) {
            byDates[String(date)][ind].till = item.till
          }
        }
        else {
          byDates[String(date)].push(item);
        }
      }
      else {
        byDates[String(date)].push(item);
      }
    });
    return byDates;
  }

  return (
    <IonPage className='text'>
      <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
        <BasicHeader title={t('book') + ' ' + tabName} />
        <div className='top-border weeks-list'>
          <IonButton fill='clear' className='week-switch' disabled={firstDay === today.getTime() ? true : false} onClick={async () => {
            let day = new Date(firstDay);
            day.setDate(new Date(firstDay).getDate() - daysNum);
            day.setHours(0, 0, 0, 0);
            await setFirstDay(day.getTime());
          }}><IonIcon icon={chevronBackOutline} /></IonButton>
          <div className='week-text'>
            <IonText className='EGymText-14px-032' style={{fontWeight: 500}}>{t('week_of') + ' ' + format(new Date(firstDay), 'P')}</IonText>
          </div>
          <IonButton fill='clear' className='week-switch' onClick={async () => {
            let day = new Date(firstDay);
            day.setDate(new Date(firstDay).getDate() + daysNum);
            day.setHours(0, 0, 0, 0);
            await setFirstDay(day.getTime());
          }}>
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
          <IonChip color="dark" className='chip EGymText-12x-0072' onClick={async () => {
            let day = new Date();
            day.setHours(0, 0, 0, 0);
            await setFirstDay(day.getTime());
          }}><ReactSVG src='/assets/icon/reset.svg' className='color-icon' style={{margin: 'auto'}} />{t('today')}</IonChip>
        </div>
      </IonHeader>
      <IonLoading
        cssClass='loading'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
      />
      <IonContent force-overscroll>
        <div style={{background: '#F4F4F4'}}>{/*, position: 'relative', top: '133px' */}
          <IonList style={{padding: '0px'}}>
            {(firstDay && timeslots) ? Object.keys(timeslots).map((key, ind) => {
              if(timeslots[key].length) {
                return (
                  <div>
                    <div className='sticky-date'>{/* style={{top: `${ind === 0 ? '0px' : '133px'}`}}*/}
                      <IonText className='date' style={{fontWeight: 600}}>{format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')}</IonText>{/* key={key}*/}
                    </div>
                    {timeslots[key].map((timeslot) => (
                      <IonItem lines="none" className='trainer-activity-card' onClick={ async () => {
                        await set('timeslot_since', timeslot.since);
                        await set('timeslot_till', timeslot.till);
                        await set('current_service', timeslot.trainer_activity);
                        console.log(timeslot.trainer_activity);
                        history.push('/pt_time_selector');
                      }}> {/* key={key + '_' + timeslot.since}*/}
                        <div className='two-side-container' style={{padding: '20px'}}>
                          <IonText>{format(new Date(timeslot.since), 'HH:mm') + ' - ' + format(new Date(timeslot.till), 'HH:mm')}</IonText>
                          <IonIcon icon={chevronForwardOutline} className='section-icon'></IonIcon>
                        </div>
                      </IonItem>
                    ))}
                  </div>
                )
              }
            }) : null}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PtTimeslots;
