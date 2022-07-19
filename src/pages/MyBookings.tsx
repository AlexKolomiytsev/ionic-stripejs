import React, { useState, useEffect } from 'react';
import { IonAvatar, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonText, IonToolbar } from '@ionic/react';
import { addDays, format, subDays } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { Occurrence } from '../utils/data';
import { fetchOccurrences } from '../utils/utils';
import { get, set, remove } from '../utils/IonicStorage';

import ClassBookingItemWithTags from '../components/ClassBookingItemWithTags';
import NoClassesPlaceholder from '../components/NoClassesPlaceholder';

// import './BookingListPage.css';
import '../styles/ClassesTab.css';
import '../styles/index.css';
import '../styles/text.css';
import Portals from '@ionic/portals';
import BasicHeader from '../components/BasicHeader';

type Props = {
  userPicture: string;
  client_id: number;
}

const daysNum = 27;

const today = new Date();
today.setHours(0, 0, 0, 0);

// let currenDayOfWeek = today.getDay();
//
// const allDays1 = Array.from({ length: (daysNum + 1) }).map((_, dayNumber) => {
//   const date =
//     addDays(today, dayNumber);
//
//     date.setHours(0, 0, 0, 0);
//     return date;
// });

const currenDayOfWeek = Number(format(today, 'e')) - 2;

const allDays = Array.from({ length: (daysNum + 1) }).map((_, dayNumber) => {
  const date =
    currenDayOfWeek >= dayNumber
      ? subDays(today, currenDayOfWeek - dayNumber)
      : addDays(today, dayNumber - currenDayOfWeek);

  date.setHours(0, 0, 0, 0);
  return date;
});

const MyBookings: React.FC<Props> = ({ userPicture, client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const itemsRef = React.useRef<(HTMLDivElement | null)[]>(Array(daysNum).fill(null));
  const [bookedOccurrences, setBookedOccurrences] = useState<Occurrence[]>();
  const [startIndex, setStartIndex] = useState<number>(allDays.findIndex((day) => {return String(day) === String(today);}));
  const [chosenDayIndex, setChosenDayIndex] = useState<number>(startIndex);
  const [showLoading, setShowLoading] = useState(true);
  const [bookedOccurencesByDates, setBookedOccurencesByDates] = useState<{ [id: string]: Occurrence[] }>(Object.fromEntries(allDays.map(i => [String(i), []])));
  const [swiper, setSwiper] = useState<any>();

  const [prev, setPrev] = useState(0);

  useEffect(() => {
    const getOccurrences = async () => {
      if(client_id !== -1) {
        const since = new Date();
        const till = new Date();
        till.setDate(till.getDate() + daysNum - startIndex);
        const prev = new Date();
        prev.setDate(prev.getDate() - 7);
        let booked = await fetchOccurrences("?unified_filters[client_id]=" + client_id + "&unified_filters[visible_on_schedule]=true&unified_filters[since]=" + since.toISOString() + "&unified_filters[till]=" + till.toISOString());
        setBookedOccurrences(booked);
        setShowLoading(false);
      }
    }

    set('entry_point', { classes: true, locations: true, class_types: true, instructors: true, services: false });
    getOccurrences();
  }, []);

  useEffect(() => {
    var options = {
    root: document.querySelector("body"),
    rootMargin: '0px 0px -350px 0px',
    threshold: [0]
    };

    var callback = function(entries: any, observer: any) {
        entries.forEach(function(entry: IntersectionObserverEntry) {
            if (entry.isIntersecting) {
              console.log(entry.target.id);
              setChosenDayIndex(parseInt(entry.target.id.split('\\')[1]));
              // observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);

    var targets = document.querySelectorAll('.sticky-date');

    targets.forEach(function(target) {
        observer.observe(target)
    });
  }, [bookedOccurencesByDates]);

  useEffect(() => {
    if(swiper && prev < chosenDayIndex && chosenDayIndex % 7 === 0) {
      //Number(format(chosenDay, 'e')) === 1
      swiper.slideTo(chosenDayIndex);
    }
    if(swiper && prev > chosenDayIndex && chosenDayIndex % 7 === 6) {
      //Number(format(chosenDay, 'e')) === 7
      swiper.slideTo(chosenDayIndex - 6);
    }
    if(swiper && prev > chosenDayIndex && chosenDayIndex % 7 === 5) {
      //Number(format(chosenDay, 'e')) === 7
      swiper.slideTo(chosenDayIndex - 5);
    }
    setPrev(chosenDayIndex);
  }, [swiper, chosenDayIndex]);

  useEffect(() => {
    if(bookedOccurrences){
      mapOccurencesToDates(bookedOccurrences).then((byDates) => {
        if(byDates) {
          setBookedOccurencesByDates(byDates);
          setStartIndex(allDays.findIndex((day) => {return String(day) === Object.keys(byDates)[Object.values(byDates).findIndex((value: Occurrence[]) => { return value.length > 0; })];}));
          setChosenDayIndex(allDays.findIndex((day) => {return String(day) === Object.keys(byDates)[Object.values(byDates).findIndex((value: Occurrence[]) => { return value.length > 0; })];}));
          console.log(byDates);
          console.log(allDays.findIndex((day) => {return String(day) === Object.keys(byDates)[Object.values(byDates).findIndex((value: Occurrence[]) => { return value.length > 0; })];}))
          console.log(Object.values(byDates).findIndex((value: Occurrence[]) => { return value.length > 0; }));
        }
      });
    }
  }, [bookedOccurrences]);

  const mapOccurencesToDates = async ( arr: Occurrence[] ) => {
    let days = allDays.slice(chosenDayIndex);
    let byDates: { [id: string]: Occurrence[] } = Object.fromEntries(days.map(i => { return [String(i), []]; }));
    await arr.forEach((item, index) => {
      let date = new Date(item.occurs_at);
      date.setHours(0, 0, 0, 0);
      byDates[String(date)].push(item);
    })
    return byDates;
  }

  const scrollToDiv = (i: number) => {
    const { current } = itemsRef;
    if(i !== null && current[i]) {
      let content = document.querySelector("ion-content");
      if(content) {
        content.scrollToPoint(0, current[i]!.offsetTop! - 260);
      }
    }
  }

  return (
    <IonPage>
      <IonHeader translucent style={{position: 'relative', top: '0px', background: '#ffffff', zIndex: 20, border: 'none'}} className='header' id='header'>
        <BasicHeader title={t('classes_tab.upcoming') + ' ' + t('training')} onClick={ async () => {await Portals.publish({ topic: 'subscription', data: {type: 'dismiss', data: null } });}} />
        <div>
          <Swiper
            slidesPerView={7}
            onInit={(ev: any) => {
              setSwiper(ev);
            }}
          >
            {allDays.map(( date, i ) => {
              return (
                <SwiperSlide>
                <div
                  className={`weekDayItem ${chosenDayIndex === i ? "weekDayItemCurrent" : ""}`}
                  key={String(date) + '_slide'}
                  onClick={() => {
                    setChosenDayIndex(i);
                    scrollToDiv(i - startIndex);
                  }}
                >
                  <span style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 500 }}>{format(date, 'eee')}</span>
                  <span style={{ fontSize: '16px', lineHeight: '20px', fontWeight: 700 }}>{format(date, 'd')}</span>
                  {chosenDayIndex === i && (
                    <div className='weekDayItemCurrentDot'/>
                  )}
                </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </IonHeader>
        <IonLoading
          cssClass='loading'
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
        />
      <IonContent>
        <div style={{position: 'relative', background: '#F4F4F4', minHeight: '100vh'}} id='body'>
          {!showLoading && 
            (Object.values(bookedOccurencesByDates).find((val) => {return val.length > 0;}) ? Object.keys(bookedOccurencesByDates).map((key, i) => {
              if(bookedOccurencesByDates[key].length){
                let index = i + startIndex;
                return (
                  <div style={{paddingBottom: '5px'}} id={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')} key={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')} ref={el => itemsRef.current[i] = el}>
                    <div className='sticky-date' style={{position: 'sticky', top: '0px', zIndex: 10, background: '#F4F4F4', paddingTop: '15px', paddingBottom: '15px'}} id={key + '\\' + index} >{/*'stickyDate_' + format(new Date(key), 'MMM') + '_' + format(new Date(key), 'd')*/}
                      <IonText className='date'>{format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')}</IonText>
                    </div>
                    {bookedOccurencesByDates[key].map((item: Occurrence) => {
                      return <ClassBookingItemWithTags show='slots' currentClass={item} key={item.service_title + '_' + item.occurs_at}/>
                    })}
                  </div>
                )
              }
            }) :
            <div style={{paddingTop: '70px'}}>
              <NoClassesPlaceholder src='/assets/icon/no_filtered_classes_image.svg' title={t('no_placeholder.no_classes_found')} subtitle={t('no_placeholder.no_classes_different_filter')}/>
            </div>)
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyBookings;
