import { IonAccordionGroup, IonAccordion, IonButton, IonCard, IonChip, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonPage } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReactSVG } from 'react-svg';
import { isPlatform } from '@ionic/react';

import { Service, Location, Basic, Trainer, EntryPoint } from '../utils/data';
import { fetchServices, fetchLocations, fetchRegions, fetchClassTypes, fetchTrainers, compareObjects } from '../utils/utils';
import { get, set } from '../utils/IonicStorage';

import BasicHeader from '../components/BasicHeader';
import ButtonsFooter from '../components/ButtonsFooter';

import '../styles/FiltersPage.css';
import '../styles/index.css';
import '../styles/text.css';

type Props = {
  default_location_id: number;
}

const FiltersPage: React.FC<Props> = ({ default_location_id }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [entryPoint, setEntryPoint] = useState<EntryPoint>({ classes: true, locations: true, class_types: true, instructors: true, services: false });
  const [classes, setClasses] = useState<Service[]>();
  const [classesChecked, setClassesChecked] = useState<boolean[]>([]);
  const [allClasses, setAllClasses] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>();
  const [locationsChecked, setLocationsChecked] = useState<boolean[]>([]);
  const [allLocations, setAllLocations] = useState<boolean>(false);
  const [classTypes, setClassTypes] = useState<Basic[]>();
  const [classTypesChecked, setClassTypesChecked] = useState<boolean[]>([]);
  const [allClassTypes, setAllClassTypes] = useState<boolean>(false);
  const [instructors, setInstructors] = useState<Trainer[]>();
  const [instructorsChecked, setInstructorsChecked] = useState<boolean[]>([]);
  const [allInstructors, setAllInstructors] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getEntryPoint = async () => {
      let entry = await get('entry_point');
      await setEntryPoint(entry);
    }

    getEntryPoint();
  }, []);

  useEffect(() => {
    const getClasses = async () => {
      let data = await fetchServices();
      if(data) {
        let classFilter = await get("classes");
        data = await data.sort((item1: any, item2: any) => {return compareObjects(item1, item2, 'service_title');});
        setClasses(data);
        let checked = classFilter ? await data.map((item: Service) => { return classFilter.includes(item.id)}) : (data ? Array(data.length).fill(false) : []);
        setClassesChecked(checked);
        return data;
      }
    }

    const getLocations = async () => {
      let data = await fetchLocations("?unified_filters[hidden]=false");
      if (data){
        let filtered_data: Location[] = [];
        await data.forEach((item: any) => {
          if (item.parent_id === null) {
            filtered_data.push(item);
          }
        });
        let locationFilter = await get("location_ids");
        console.log(locationFilter);
        console.log(filtered_data);
        filtered_data = await filtered_data.sort((item1: any, item2: any) => {return compareObjects(item1, item2, 'name');})
        setLocations(filtered_data);
        let checked = locationFilter ? await data.map((item: Location) => { return locationFilter.includes(item.id)}) : (data ? Array(filtered_data.length).fill(false) : []);
        setLocationsChecked(checked);
        return filtered_data;
      }
    }

    const getClassTypes = async () => {
      let data = await fetchClassTypes();
      if(data) {
        let classTypeFilter = await get("class_types");
        data = await data.sort((item1: any, item2: any) => {return compareObjects(item1, item2, 'name');});
        setClassTypes(data);
        let checked = classTypeFilter ? await data.map((item: Basic) => { return classTypeFilter.includes(item.id)}) : (data ? Array(data.length).fill(false) : []);
        setClassTypesChecked(checked);
        return data;
      }
    }

    const getTrainers = async () => {
      let data = await fetchTrainers();
      if(data) {
        let instructorsFilter = await get("instructors");
        data = await data.sort((item1: any, item2: any) => {return compareObjects(item1, item2, 'name');});
        setInstructors(data);
        let checked = instructorsFilter ? await data.map((item: Trainer) => { return instructorsFilter.includes(item.id)}) : (data ? Array(data.length).fill(false) : []);
        setInstructorsChecked(checked);
        return data;
      }
    }

    const getFilters = async () => {

      (entryPoint.classes || entryPoint.services) && await getClasses();
      entryPoint.locations && await getLocations();
      entryPoint.class_types && await getClassTypes();
      entryPoint.instructors && await getTrainers();
      // .then( async (data) => {
      //   if(data) {
      //     setLocationsChecked(data.map((item) => {
      //         return locationFilter ? locationFilter.includes(item.id) : item.id === default_location_id ;
      //     }));
      //   }
      // });

      setShowLoading(false);
    }

    getFilters().then((res) => {
      console.log(res);
    })
  }, [entryPoint]);

  const reset = () => {
    (entryPoint.classes || entryPoint.services) && setClassesChecked(Array(classesChecked.length).fill(false));
    entryPoint.locations && setLocationsChecked(Array(locationsChecked.length).fill(false));
    entryPoint.class_types && setClassTypesChecked(Array(classTypesChecked.length).fill(false));
    entryPoint.instructors && setInstructorsChecked(Array(instructorsChecked.length).fill(false));
    setAllClasses(false);
    setAllLocations(false);
    setAllClassTypes(false);
    setAllInstructors(false);
  }

  const passFilters = async () => {
    let passedClasses: number[] = [];
    let passedLocations: string[] = [];
    let passedLocationIds: number[] = [];
    let passedClassTypes: number[] = [];
    let passedInstructors: number[] = [];
    (entryPoint!.classes || entryPoint!.services) && await classesChecked.forEach((checked, index) => {
      if(checked && classes && classes[index]) {
        passedClasses.push(classes[index].id);
      }
    });
    entryPoint!.locations && await locationsChecked.forEach((checked, index) => {
      if(checked && locations && locations[index]) {
        passedLocations.push(locations[index].name);
        passedLocationIds.push(locations[index].id);
      }
    });
    entryPoint!.class_types && await classTypesChecked.forEach((checked, index) => {
      if(checked && classTypes && classTypes[index]) {
        passedClassTypes.push(classTypes[index].id);
      }
    });
    entryPoint!.instructors && await instructorsChecked.forEach((checked, index) => {
      if(checked && instructors && instructors[index]) {
        passedInstructors.push(instructors[index].id);
      }
    });
    (entryPoint!.classes || entryPoint!.services) && set("classes", passedClasses);
    entryPoint!.locations && set("locations", passedLocations);
    entryPoint!.locations && set('location_ids', passedLocationIds);
    entryPoint!.class_types && set("class_types", passedClassTypes);
    entryPoint!.instructors && set("instructors", passedInstructors);
    history.goBack();
  }

  return (
    <IonPage className='text'>
      <IonLoading
       cssClass='loading'
       isOpen={showLoading}
       onDidDismiss={() => setShowLoading(false)}
      />
      {entryPoint && <>
      <IonHeader style={{position: 'relative', top: '0px'}}>
        <BasicHeader title={t('filter.filters')} secondButtonType='text' secondButton='Reset' onClickSecond={reset} />
      </IonHeader>
      <IonContent style={{backgroundColor: '#F4F4F4'}}> {/*  style={{top: `${isPlatform('ios') ? '110px' : '64px'}`, height: `calc(100vh - ${isPlatform('ios') ? '187px' : '131px'})`}} */}
        <div style={{display: 'flex', flexDirection: 'column', position: 'relative', backgroundColor: '#F4F4F4', minHeight: '100vh', paddingTop: '20px'}}>
          {/*<div style={{padding: '10px'}}></div>*/}
          {(entryPoint.classes || entryPoint.services) && <IonAccordionGroup>
            <IonCard className='filter-card'>
              <IonAccordion value="colors">
                <IonItem slot="header" lines='none' style={{backgroundColor: '#FFFFFF'}}>
                  <ReactSVG src='/assets/icon/service_filter.svg' className='color-icon' />
                  <IonLabel className='EGymText-16px-032' style={{fontWeight: 600, paddingLeft: '16px', color: `${classesChecked.some((item) => {return item === true;}) ? 'var(--ion-color-primary)' : 'var(--ion-text-color)'}`}}>{entryPoint.services ? t('filter.service').charAt(0).toUpperCase() + t('filter.service').slice(1) : t('filter.class').charAt(0).toUpperCase() + t('filter.class').slice(1)}</IonLabel>
                  {classesChecked.filter(val => val===true).length ? <CustomChip checked={classesChecked} setChecked={setClassesChecked} /> : null}
                </IonItem>
                <IonList slot="content">
                  <IonItem className='filter-item' key={'all-classes'} onClick={(e) => {
                    setClassesChecked(Array(classesChecked.length).fill(!allClasses));
                    setAllClasses(!allClasses);
                  }}>
                    <IonLabel className='EGymText-16px-032'>{t('filter.all')}</IonLabel>
                    {classesChecked.every((el) => {return el;}) ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                  </IonItem>
                  {classes && classes.map((item, index) => (
                    <IonItem className='filter-item' key={item.id} onClick={(e) => {
                      setClassesChecked(classesChecked.map((val, ind) => { return ind===index ? !val : val; }));
                    }}>
                      <IonLabel className='EGymText-16px-032'>{item.service_title}</IonLabel>
                      {classesChecked[index] ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                    </IonItem>
                  ))}
                </IonList>
              </IonAccordion>
            </IonCard>
          </IonAccordionGroup>}

          {entryPoint.locations && <IonAccordionGroup>
            <IonCard className='filter-card'>
              <IonAccordion value="colors">
                <IonItem slot="header"  lines='none'>
                  <ReactSVG src='/assets/icon/location.svg' className='color-icon' />
                  <IonLabel className='EGymText-16px-032' style={{fontWeight: 600, paddingLeft: '16px', color: `${locationsChecked.some((item) => {return item === true;}) ? 'var(--ion-color-primary)' : 'var(--ion-text-color)'}`}}>{t('filter.location').charAt(0).toUpperCase() + t('filter.location').slice(1)}</IonLabel>
                  {locationsChecked.filter(val => val===true).length ? <CustomChip checked={locationsChecked} setChecked={setLocationsChecked} /> : null}
                </IonItem>
                <IonList slot="content">
                  <IonItem className='filter-item' key={'all-locations'} onClick={(e) => {
                    setLocationsChecked(Array(locationsChecked.length).fill(!allLocations));
                    setAllLocations(!allLocations);
                  }}>
                    <IonLabel className='EGymText-16px-032'> {t('filter.all')}</IonLabel>
                    {locationsChecked.every((el) => {return el;}) ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                  </IonItem>
                  {locations && locations.map((item, index) => (
                    <IonItem className='filter-item' key={item.id} onClick={(e) => {
                      setLocationsChecked(locationsChecked.map((val, ind) => { return ind===index ? !val : val; }));
                    }}>
                      <IonLabel className='EGymText-16px-032'>{item.name}</IonLabel>
                      {locationsChecked[index] ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                    </IonItem>
                  ))}
                </IonList>
              </IonAccordion>
            </IonCard>
          </IonAccordionGroup>}

          {entryPoint.class_types && <IonAccordionGroup>
            <IonCard className='filter-card'>
              <IonAccordion value="colors">
                <IonItem slot="header"  lines='none'>
                  <ReactSVG src='/assets/icon/class_type.svg' className='color-icon' />
                  <IonLabel className='EGymText-16px-032' style={{fontWeight: 600, paddingLeft: '16px', color: `${classTypesChecked.some((item) => {return item === true;}) ? 'var(--ion-color-primary)' : 'var(--ion-text-color)'}`}}>{t('filter.class_type').charAt(0).toUpperCase() + t('filter.class_type').slice(1)}</IonLabel>
                  {classTypesChecked.filter(val => val===true).length ? <CustomChip checked={classTypesChecked} setChecked={setClassTypesChecked} /> : null}
                </IonItem>
                <IonList slot="content">
                <IonItem className='filter-item' key={'all-class-types'} onClick={(e) => {
                  setClassTypesChecked(Array(classTypesChecked.length).fill(!allClassTypes));
                  setAllClassTypes(!allClassTypes);
                }}>
                  <IonLabel className='EGymText-16px-032'>{t('filter.all')}</IonLabel>
                  {classTypesChecked.every((el) => {return el;}) ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                </IonItem>
                {classTypes && classTypes.map((item, index) => (
                  <IonItem className='filter-item' key={item.id} onClick={(e) => {
                    setClassTypesChecked(classTypesChecked.map((val, ind) => { return ind===index ? !val : val; }));
                  }}>
                    <IonLabel className='EGymText-16px-032'>{item.name}</IonLabel>
                    {classTypesChecked[index] ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                  </IonItem>
                ))}
                </IonList>
              </IonAccordion>
            </IonCard>
          </IonAccordionGroup>}

          {entryPoint.instructors && <IonAccordionGroup>
            <IonCard className='filter-card'>
              <IonAccordion value="colors">
                <IonItem slot="header"  lines='none'>
                  <ReactSVG src='/assets/icon/instructor.svg' className='color-icon' />
                  <IonLabel className='EGymText-16px-032' style={{fontWeight: 600, paddingLeft: '16px', color: `${instructorsChecked.some((item) => {return item === true;}) ? 'var(--ion-color-primary)' : 'var(--ion-text-color)'}`}}>{t('filter.instructor').charAt(0).toUpperCase() + t('filter.instructor').slice(1)}</IonLabel>
                  {instructorsChecked.filter(val => val===true).length ? <CustomChip checked={instructorsChecked} setChecked={setInstructorsChecked} /> : null}
                </IonItem>
                <IonList slot="content">
                  <IonItem className='filter-item' key={'all-instructors'} onClick={(e) => {
                    setInstructorsChecked(Array(instructorsChecked.length).fill(!allInstructors));
                    setAllInstructors(!allInstructors);
                  }}>
                    <IonLabel className='EGymText-16px-032'>{t('filter.all')}</IonLabel>
                    {instructorsChecked.every((el) => {return el;}) ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                  </IonItem>
                  {instructors && instructors.map((item, index) => (
                    <IonItem className='filter-item' key={item.id} onClick={(e) => {
                      setInstructorsChecked(instructorsChecked.map((val, ind) => { return ind===index ? !val : val; }));
                    }}>
                      <IonLabel className='EGymText-16px-032'>{item.name}</IonLabel>
                      {instructorsChecked[index] ? <ReactSVG src='/assets/icon/tick.svg' size='small' className='color-icon' /> : null}
                    </IonItem>
                  ))}
                </IonList>
              </IonAccordion>
            </IonCard>
          </IonAccordionGroup>}
        </div>
      </IonContent>
        {/*<div className='footer-div-one-button' style={{bottom: '-80px'}} >*/}
          <ButtonsFooter text='Apply' onClick={passFilters}/>
        {/*</div>*/}
      </>}
    </IonPage>
  );
};

type ChipProps = {
  checked: boolean[];
  setChecked: (val: boolean[]) => void;
}

const CustomChip: React.FC<ChipProps> = ({ checked, setChecked }) => {
  return (
    <IonChip className='custom-chip'>
      {checked.filter(val => val===true).length + ' selected'}
      <IonButton fill='clear' className='close-button' onClick={(e) => {
        setChecked(checked.map((item) => {return false;}));
        console.log(checked);
      }}>
        <IonIcon icon={closeOutline}/>
      </IonButton>
    </IonChip>
  )
}

export default FiltersPage;
