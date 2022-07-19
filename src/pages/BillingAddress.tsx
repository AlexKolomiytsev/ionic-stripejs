import { IonContent, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';

import { compareObjects, fetchCountries } from '../utils/utils';
import { apiPut } from '../utils/requests';
import { UserData, Country } from '../utils/data';

import BasicHeader from '../components/BasicHeader';
import BasicFooter from '../components/BasicFooter';

// import './ProfileBillingAddress.css';
import '../styles/index.css';
import '../styles/text.css'

type Props = {
  userData?: UserData;
}

const BillingAddress: React.FC<Props> = ({ userData }) => {

  const { t } = useTranslation();
  // let history = useHistory();

  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [town, setTown] = useState('');
  const [postcode, setPostcode] = useState('');
  const [allCountries, setAllCountries] = useState<Country[]>();
  const [country, setCountry] = useState<number>();
  const [mobileNo, setMobileNo] = useState('');

  useEffect(() => {
    if(userData) {
      setTitle(userData.title);
      setFirstName(userData.name.split(' ')[0]);
      setLastName(userData.name.split(' ')[1]);
      setAddressLine1(userData.address_1);
      setAddressLine2(userData.address_2);
      setTown(userData.town);
      setPostcode(userData.postcode);
      fetchCountries().then((countries) => {
        if(countries) {
          setAllCountries(countries.sort((country1, country2) => {return compareObjects(country1, country2, 'name');}));
          let userCountry: any = countries!.find((country) => {return country.id === userData.country_id});
          console.log(userCountry);
          if(userCountry) {
            setCountry(userCountry.id);
          }
        }
      });
      setMobileNo(userData.mobile_no);
    }
  }, [userData]);

  const saveChanges = async () => {
    let newUserData = {user: userData};
    if(newUserData) {
      newUserData.user!.title = title.trim();
      newUserData.user!.name = firstName.trim() + ' ' + lastName.trim();
      newUserData.user!.address_1 = addressLine1.trim();
      newUserData.user!.address_2 = addressLine2.trim();
      newUserData.user!.town = town.trim();
      newUserData.user!.postcode = postcode.trim();
      newUserData.user!.country_id = country!;
      newUserData.user!.mobile_no = mobileNo.trim();
      let result = await apiPut('/api/unified/users/profile', newUserData, true);
      console.log(result);
    }
  }

  return (
    <IonPage>
      <IonHeader style={{position: 'relative', top: '0px', zIndex: 20}}>
        <BasicHeader title={t('headers.billing_address')} />
      </IonHeader>
      <IonContent>
        <div style={{display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: '100px', backgroundColor: '#F4F4F4', minHeight: 'calc(100vh - 160px)'}}>
          {/*<div style={{display: 'flex', justifyContent: 'center'}}>
          </div>*/}
          <IonList style={{backgroundColor: '#FFFFFF'}}>
            <IonItemGroup style={{width: '100vw'}}>
              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label'>{t('menu.title')}</IonLabel>
                 {/*<div className='input-right'>
                  <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} className='input-field'></IonInput>
                </div>*/}
                <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label'>{t('menu.first_name')}</IonLabel>
                <IonInput value={firstName} onIonChange={e => setFirstName(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label' >{t('menu.last_name')}</IonLabel>
                 <IonInput value={lastName} onIonChange={e => setLastName(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label' >{t('menu.address_line') + ' 1'}</IonLabel>
                 <IonInput value={addressLine1} onIonChange={e => setAddressLine1(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label' >{t('menu.address_line') + ' 2'}</IonLabel>
                 <IonInput value={addressLine2} onIonChange={e => setAddressLine2(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label' >{t('menu.town_city')}</IonLabel>
                 <IonInput value={town} onIonChange={e => setTown(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label' >{t('menu.postcode')}</IonLabel>
                 <IonInput value={postcode} onIonChange={e => setPostcode(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label' style={{maxWidth: '200px'}}>{t('menu.country')}</IonLabel>
                  <IonSelect className='country-select' value={country} onIonChange={e => {
                    setCountry(e.detail.value)
                    console.log(e.detail.value);
                    
                    }}>
                    {allCountries && allCountries.map((item) => (
                      <IonSelectOption value={item.id}>{item.name}</IonSelectOption>
                    ))}
                  </IonSelect>
              </IonItem>

              <IonItem className='input-item' style={{paddingTop: '7px', paddingBottom: '7px'}}>
                 <IonLabel className='input-label'>{t('menu.mobile_no')}</IonLabel>
                 <IonInput value={mobileNo} onIonChange={e => setMobileNo(e.detail.value!)} className='input-field'></IonInput>
              </IonItem>
            </IonItemGroup>
          </IonList>
        </div>
      </IonContent>
      <BasicFooter text={t('footer.save_address')} onClick={saveChanges}/>
    </IonPage>
  );
};

export default BillingAddress;
