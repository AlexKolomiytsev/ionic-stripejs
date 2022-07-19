import React, { useState, useEffect } from 'react';
import { IonAvatar, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonText, IonToolbar } from '@ionic/react';
import { addDays, format, subDays } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'react-i18next';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { Occurrence } from '../../utils/data';
import { fetchOccurrences } from '../../utils/utils';
import { get, set, remove } from '../../utils/IonicStorage';

import ClassBookingItemWithTags from '../../components/ClassBookingItemWithTags';
import NoClassesPlaceholder from '../../components/NoClassesPlaceholder';

// import './BookingListPage.css';
import '../../styles/ClassesTab.css';
import '../../styles/index.css';
import '../../styles/text.css';

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

const BookingListPage: React.FC<Props> = ({ userPicture, client_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const itemsRef = React.useRef<(HTMLDivElement | null)[]>(Array(daysNum).fill(null));
  const [showBooked, setShowBooked] = useState(false);
  const [occurrences, setOccurrences] = useState<Occurrence[]>();
  const [bookedOccurrences, setBookedOccurrences] = useState<Occurrence[]>();
  const [chosenDay, setChosenDay] = useState<Date>(new Date());
  const [startIndex, setStartIndex] = useState(allDays.findIndex((day) => {return String(day) === String(today);}))
  const [chosenDayIndex, setChosenDayIndex] = useState<number>(startIndex);
  const [showLoading, setShowLoading] = useState(true);
  const [classFilters, setClassFilters] = useState<string[]>();
  const [locationFilters, setLocationFilters] = useState<string[]>();
  const [classTypeFilters, setClassTypeFilters] = useState<number[]>();
  const [instructorsFilters, setInstructorsFilters] = useState<number[]>();
  const [occurencesByDates, setOccurencesByDates] = useState<{ [id: string]: Occurrence[] }>(Object.fromEntries(allDays.map(i => [String(i), []])));
  const [bookedOccurencesByDates, setBookedOccurencesByDates] = useState<{ [id: string]: Occurrence[] }>(Object.fromEntries(allDays.map(i => [String(i), []])));
  const [swiper, setSwiper] = useState<any>();

  const [prev, setPrev] = useState(0);

  useEffect(() => {
    console.log(allDays);
    const getOccurrences = async () => {
      await set('entry_point', { classes: true, locations: true, class_types: true, instructors: true, services: false });
      if(client_id !== -1) {
        const since = new Date();
        const till = new Date();
        till.setDate(till.getDate() + daysNum - startIndex);
        const prev = new Date();
        prev.setDate(prev.getDate() - 7);
        let data = await fetchOccurrences("?unified_filters[visible_on_schedule]=true&unified_filters[since]=" + since.toISOString() + "&unified_filters[till]=" + till.toISOString());
        let booked = await fetchOccurrences("?unified_filters[client_id]=" + client_id + "&unified_filters[visible_on_schedule]=true&unified_filters[since]=" + since.toISOString() + "&unified_filters[till]=" + till.toISOString());
        let classFilter = await get("classes");
        let locationFilter = await get("locations");
        let classTypeFilter = await get("class_types");
        let instructorsFilter = await get("instructors");
        setClassFilters(classFilter);
        setLocationFilters(locationFilter);
        setClassTypeFilters(classTypeFilter);
        setInstructorsFilters(instructorsFilter);
        if(classFilter || locationFilter || classTypeFilter || instructorsFilter) {
          if(data){
            let filteredOccurences = await data.filter((item: Occurrence) => {
            return ((classFilter && classFilter.length !== 0) ? classFilter.includes(item.service_id) : true)
              && ((locationFilter && locationFilter.length !== 0) ? locationFilter.includes(item.location_name) : true)
              && ((classTypeFilter && classTypeFilter.length !== 0) ? classTypeFilter.includes(item.activity_category_id) : true)
              && ((instructorsFilter && instructorsFilter.length !== 0) ? instructorsFilter.includes(item.trainer_id) : true);
          });
            setOccurrences(filteredOccurences);
          }
          if(booked){
            let filteredBookedOccurences = await booked.filter((item: Occurrence) => {
            return ((locationFilter && locationFilter.length !== 0) ? locationFilter.includes(item.location_name) : true)
              && ((classTypeFilter && classTypeFilter.length !== 0) ? classTypeFilter.includes(item.activity_category_id) : true)
              && ((instructorsFilter && instructorsFilter.length !== 0) ? instructorsFilter.includes(item.trainer_id) : true);
          });
            setBookedOccurrences(filteredBookedOccurences);
          }
          // setChosenDay(new Date());
          setShowLoading(false);
        }
        else {
          setOccurrences(data);
          setBookedOccurrences(booked);
          setShowLoading(false);
        }
      }
    }

    getOccurrences();
  }, []);

  useEffect(() => {
    var options = {
    root: document.querySelector("body"),
    rootMargin: '270px 0px -350px 0px',
    threshold: [0]
    };

    var callback = function(entries: any, observer: any) {
        entries.forEach(function(entry: IntersectionObserverEntry) {
            if (entry.isIntersecting) {
              setChosenDayIndex(parseInt(entry.target.id.split('\\')[1]));
              setChosenDay(new Date(entry.target.id.split('\\')[0]));
              // observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);

    var targets = document.querySelectorAll('.sticky-date');

    targets.forEach(function(target) {
        observer.observe(target)
    });
  }, [occurencesByDates]);

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
    if(occurrences){
      mapOccurencesToDates(occurrences).then((byDates) => {
        if(byDates) {
          setOccurencesByDates(byDates);
        }
      });
    }
  }, [occurrences])

  useEffect(() => {
    if(bookedOccurrences){
      mapOccurencesToDates(bookedOccurrences).then((byDates) => {
        if(byDates) {
          setBookedOccurencesByDates(byDates);
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

  const clearFilters = () => {
    remove('classes');
    remove('locations');
    remove('class_types');
    remove('instructors');
  }

  return (
    <IonPage>
      <IonContent>
        <IonHeader translucent style={{position: 'fixed', top: '0px', background: '#ffffff', zIndex: 20, border: 'none'}} className='header' id='header'>
          <IonToolbar className="top-section-background">
            <div className='toolbar-padding'>
              <div className="two-side-container">
                <div>
                  <IonAvatar className='avatar avatar-circle white-border-circle' onClick={() => {
                    clearFilters();
                    history.push("/profile_navigation");
                  }}>
                    <img src={userPicture} alt='User' />
                  </IonAvatar>
                </div>
              </div>
            </div>
          </IonToolbar>
          <div>
            <div className='scrollable'>
              <div className='chip' key='filters-chip-div'>
                <IonChip color="dark" className='chip' onClick={() => {history.push("/filters");}} key='filters-chip'>
                  <ReactSVG src='/assets/icon/filters.svg' className='color-icon' style={{fontSize: '24px', marginRight: '4px'}}/>
                  <IonLabel>{t('filter.filters')}</IonLabel>
                </IonChip>
              </div>
              <div className='chip' key='classes-chip-div'>
                <IonChip className={`chip ${(classFilters && classFilters.length) ? "color-chip" : "white-chip"}`} key='classes-chip'>
                  <IonLabel>{(classFilters && classFilters.length) ? (classFilters.length === 1 ? classFilters.length + ' ' + t('filter.class') : classFilters.length + ' ' + t('filter.classes')) : t('filter.all_classes')}</IonLabel>
                </IonChip>
              </div>
              <div className='chip' key='locations-chip-div'>
                <IonChip className={`chip ${(locationFilters && locationFilters.length) ? "color-chip" : "white-chip"}`} key='locations-chip'>
                  <IonLabel>{(locationFilters && locationFilters.length) ? (locationFilters.length === 1 ? locationFilters.length + ' ' + t('filter.location') : locationFilters.length + ' ' + t('filter.locations')) : t('filter.all_locations')}</IonLabel>
                </IonChip>
              </div>
              <div className='chip' key='class-types-chip-div'>
                <IonChip className={`chip ${(classTypeFilters && classTypeFilters.length) ? "color-chip" : "white-chip"}`} key='class-types-chip'>
                  <IonLabel>{(classTypeFilters && classTypeFilters.length) ? (classTypeFilters.length === 1 ? classTypeFilters.length + ' ' + t('filter.activity') : classTypeFilters.length + ' ' + t('filter.activities')) : t('filter.all_activities')}</IonLabel>
                </IonChip>
              </div>
              <div className='chip' key='instructors-chip-div'>
                <IonChip className={`chip ${(instructorsFilters && instructorsFilters.length) ? "color-chip" : "white-chip"}`} key='instructors-chip'>
                  <IonLabel>{(instructorsFilters && instructorsFilters.length) ? (instructorsFilters.length === 1 ? instructorsFilters.length + ' ' + t('filter.instructor') : instructorsFilters.length + ' ' + t('filter.instructors')) : t('filter.all_instructors')}</IonLabel>
                </IonChip>
              </div>
              <div className='chip' key='bookings-chip-div'>
                <IonChip className={`chip ${showBooked ? "white-chip" : "color-chip"}`} onClick={() => {setShowBooked(!showBooked);}} key='bookings-chip'>
                  <IonLabel>{t('my_bookings')}</IonLabel>
                </IonChip>
              </div>
            </div>
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
                      setChosenDay(date);
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
        <div style={{paddingTop: '270px', background: '#F4F4F4', minHeight: '100vh'}} id='body'>
          {!showLoading && (showBooked ?
            (Object.values(bookedOccurencesByDates).find((val) => {return val.length > 0;}) ? Object.keys(bookedOccurencesByDates).map((key, i) => {
              if(bookedOccurencesByDates[key].length){
                let index = i + startIndex;
                return (
                  <div style={{paddingBottom: '5px'}} id={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')} key={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')} ref={el => itemsRef.current[i] = el}>
                    <div className='sticky-date' style={{position: 'sticky', top: '271px', zIndex: 10, background: '#F4F4F4', paddingTop: '15px', paddingBottom: '15px'}} id={key + '\\' + index} >{/*'stickyDate_' + format(new Date(key), 'MMM') + '_' + format(new Date(key), 'd')*/}
                      <IonText className='date'>{format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')}</IonText>
                    </div>
                    {bookedOccurencesByDates[key].map((item: Occurrence) => {
                      return <ClassBookingItemWithTags show='slots' currentClass={item} key={item.service_title + '_' + item.occurs_at}/>
                    })}
                  </div>
                )
              }
            }) :
            <div style={{paddingTop: '70px'}}><NoClassesPlaceholder src='/assets/icon/no_filtered_classes_image.svg' title={t('no_placeholder.no_classes_found')} subtitle={t('no_placeholder.no_classes_different_filter')}/></div>)
             :
            (Object.values(occurencesByDates).find((val) => {return val.length > 0;}) ? Object.keys(occurencesByDates).map((key, i) => {
              if(occurencesByDates[key].length){
                let index = i + startIndex;
                return (
                  <div style={{paddingBottom: '5px'}} id={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')} key={format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')} ref={el => itemsRef.current[i] = el}>
                    <div className='sticky-date' style={{position: 'sticky', top: '271px', zIndex: 10, background: '#F4F4F4', paddingTop: '15px', paddingBottom: '15px'}} id={key + '\\' + index} >{/*'stickyDate_' + format(new Date(key), 'MMM') + '_' + format(new Date(key), 'd')*/}
                      <IonText className='date'>{format(new Date(key), 'eee') + ', ' + format(new Date(key), 'MMM')  + ' ' + format(new Date(key), 'd')}</IonText>
                    </div>
                    {occurencesByDates[key].map((item: Occurrence) => {
                      return <ClassBookingItemWithTags show='slots' currentClass={item} key={item.service_title + '_' + item.occurs_at}/>
                    })}
                  </div>
                )
              }
            }) :
            <div style={{paddingTop: '70px'}}><NoClassesPlaceholder src='/assets/icon/no_filtered_classes_image.svg' title={t('no_placeholder.no_classes_found')} subtitle={t('no_placeholder.no_classes_different_filter')}/></div>)
          )}
      </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingListPage;
