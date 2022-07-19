import React, { useState, useEffect } from 'react';
import {createBrowserHistory} from 'history';
import './i18n';
import { Redirect, Route } from 'react-router-dom';
import {
  IonAlert,
  IonApp,
  IonButton,
  IonContent,
  IonIcon,
  IonLabel,
  IonLoading,
  IonModal,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { PortalsProvider } from './hooks/usePortalsContext';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import { auth } from './utils/const';
import { authorizeUser } from './utils/auth';
import { failedApiCall } from './utils/requests';
import { UserData, ClubSettings } from './utils/data';
import { fetchUserData, fetchSettings, fetchClient } from './utils/utils';
import { createStore } from './utils/IonicStorage';

// import Tab1 from './pages/Tab1';
// import Tab2 from './pages/Tab2';
// import Tab3 from './pages/Tab3';

import ClassesTab from './pages/ClassesTab/ClassesTab';
import ClassPage from './pages/ClassPage';
import FlowSelection from './pages/FlowSelection';
import PersonalTrainingBooking from './pages/PersonalTrainingBooking';
import PersonalTrainingBookingWidget from './pages/PersonalTrainingBookingWidget';
import MyBookings from './pages/MyBookings';
import BookedClass from './pages/BookedClass';
import TrainersPage from './pages/TrainersPage';
import TrainerProfile from './pages/TrainerProfile';
import TrainerServiceList from './pages/TrainerServiceList';
import ServiceDetail from './pages/ServiceDetail';
import PtTimeslots from './pages/PtTimeslots';
import PTTimeSelector from './pages/PTTimeSelector';
import ServiceList from './pages/ServiceList';
import FindAClass from './pages/FindAClass';
import FiltersPage from './pages/FiltersPage';
import ProfileNavigation from './pages/ProfileNavigation';
import BillingDetails from './pages/BillingDetails';
import BillingAddress from './pages/BillingAddress';
import Preferences from './pages/Preferences';
import MyProducts from './pages/MyProducts';
import PTProductsList from './pages/PTProductsList';
import PTProductDetail from './pages/PTProductDetail';
import PastPurchases from './pages/PastPurchases';
import Receipt from './pages/Receipt';
import Payment from './pages/Payment';
import StripePage from './pages/StripePage2';
import Stripe3Ds from './pages/Stripe3Ds';
import StripeResult from './pages/StripeResult';
import Spreedly from './pages/Spreedly';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import './styles/index.css';
import './styles/modal.css';
import StripeCapasitor from './pages/StripeCapasitor';
import UpcomingTraining from './pages/UpcomingTraining';
import Portals from '@ionic/portals';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

type AppProps = {
  context: {
    url: string;
    startingRoute: string;
    authToken: string;
    primaryColor: string;
    primaryTextColor: string;
    lightPrimaryColor: string;
    secondaryColor: string;
  };
}

const allHistory = createBrowserHistory();

setupIonicReact();

const App: React.FC<AppProps> = ({ context }) => {

  const [authorized, setAuthorized] = useState<boolean>();
  const [userData, setUserData] = useState<UserData | any>();
  const [clubSettings, setClubSettings] = useState<ClubSettings>();
  const [modalHeader, setModalHeader] = useState<string>();
  const [modalBody, setModalBody] = useState<string>();
  const [modalOpen, setModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const authorization = async () => {
      try {
        document.body.style.setProperty('--ion-color-primary', context.primaryColor.length % 2 === 0 ? '#' + context.primaryColor : context.primaryColor);
        document.body.style.setProperty('--ion-color-primary-rgb', hexToRgb(context.primaryColor));
        // document.body.style.setProperty('--ion-color-primary-shade', context.primaryColor.length % 2 === 0 ? shadeColor('#' + context.primaryColor, -60) : shadeColor(context.primaryColor, -60));
        document.body.style.setProperty('--ion-color-primary-shade', context.lightPrimaryColor.length % 2 === 0 ? '#' + context.lightPrimaryColor : context.lightPrimaryColor);
        document.body.style.setProperty('--ion-color-primary-tint', context.lightPrimaryColor.length % 2 === 0 ? '#' + context.lightPrimaryColor : context.lightPrimaryColor);
        // document.body.style.setProperty('--ion-text-color', context.primaryTextColor.length % 2 === 0 ? '#' + context.primaryTextColor.toLowerCase() : context.primaryTextColor.toLowerCase());
        // document.body.style.setProperty('--ion-text-color-rgb', hexToRgb(context.primaryTextColor));

        await createStore();
        let resp = await authorizeUser(context.authToken, context.url);
        resp = true;
        if(resp) {
          // await setModalHeader('Authorization success');
          // await setModalBody('');
          // setModalOpen(true);
          resp = await fetchUserData();
          if(resp !== false) {
            // console.log(resp);
            // await setModalHeader('ProfileFetch success');
            // await setModalBody('');
            // setModalOpen(true);
            await setUserData(resp);
            setShowLoading(false);
            await setClubSettings(await fetchSettings());
          }
          if(resp === false) {
            await setModalHeader('ProfileFetch error');
            await setModalBody('');
            setShowLoading(false);
            setModalOpen(true);
          }
        }
        else {
          await setModalHeader('Error');
          await setModalBody('Unable to authorize user.');
          setShowLoading(false);
          setModalOpen(true);
        }
        setAuthorized(resp);
      }
      catch(e) {
        console.log(e);
        await setModalHeader('Error');
        await setModalBody('Unable to authorize user.');
        setShowLoading(false);
        setModalOpen(true);
      }
    }

    authorization();
  }, [context]);

  const hexToRgb = (hex: string) => {
    let result = null;
    if(hex.length === 6 || hex.length === 7) {
      result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    }
    else if(hex.length === 8 || hex.length === 9) {
      result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    }
    return result ? parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) : null;
  }

  const shadeColor = (color: string, percent: number) => {

    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = Math.round(R * (100 + percent) / 100);
    G = Math.round(G * (100 + percent) / 100);
    B = Math.round(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
  }

  return(
      <IonApp>
        <IonLoading
          cssClass='loading'
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
        />

        {/*<IonModal
          isOpen={modalOpen}
        >
          <IonContent>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <IonText>
                <p className='modal-header' style={{color: 'red'}}>{modalHeader}</p>
                <p className='modal-text'>{modalBody}</p>
              </IonText>
              {modalHeader !== 'Error' && modalHeader !== 'ProfileFetch error' && <IonButton onClick={() => {setModalOpen(false)}}>Close</IonButton>}
            </div>
          </IonContent>
            </IonModal>*/}

          <IonAlert
            isOpen={modalOpen || failedApiCall === true}
            onDidDismiss={async () => {
              await Portals.publish({ topic: 'subscription', data: {type: 'dismiss', data: null } });
            }}
            cssClass='my-custom-class'
            mode='ios'
            header={'Error'}
            message={'Something went wrong. Please try again...'}
            buttons={['OK']}
          />

        <PortalsProvider initialContext={ context }>
          {authorized &&
            <IonReactRouter history={ allHistory }>
              <IonTabs>
                <IonRouterOutlet>

                  <Route exact path="/workouts_tab">
                    {/*}<WorkoutsTab />*/}
                  </Route>

                  <Route exact path="/analysis_tab">
                    {/*}<AnalysisTab />*/}
                  </Route>

                  <Route path="/classes">
                    { userData && <ClassesTab userData={userData} /> }
                  </Route>

                  <Route path="/ranking_tab">
                    {/*}<RankingTab />*/}
                  </Route>

                </IonRouterOutlet>
                <IonTabBar slot="bottom">

                  <IonTabButton tab="workouts_tab" href="/workouts_tab">
                    <IonIcon src='/assets/icon/workouts_tab.svg' size="large"/>
                    <IonLabel>Workouts</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="analysis_tab" href="/analysis_tab">
                    <IonIcon src='/assets/icon/analysis_tab.svg' size="large"/>
                    <IonLabel>Analysis</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="classes" href="/classes">
                    <IonIcon src='/assets/icon/classes_tab.svg' size="large"/>
                    <IonLabel>Classes</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="ranking_tab" href="/ranking_tab">
                    <IonIcon src='/assets/icon/ranking_tab.svg' size="large"/>
                    <IonLabel>Ranking</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>

              <Route exact path="/">
                <Redirect to={context.startingRoute ? context.startingRoute : "/flow_selection"} />
              </Route>

              <Route exact path="/class/:id">
                {userData &&
                  <ClassPage firstName={userData.name.split(' ')[0]} userPicture={ userData ? userData.image : '/profile_image.png' } client_id={userData ? userData.id : -1}/>
                }
              </Route>

              <Route exact path='/flow_selection'>
                {/*<FlowSelection default_location_id={userData.default_location_id}/>*/}
                {userData &&
                  <PersonalTrainingBooking client_id={userData ? userData.id : -1} default_location_id={userData.default_location_id}/>
                }
              </Route>

              <Route exact path='/personal_training_booking'>
                {userData &&
                  <PersonalTrainingBooking client_id={userData ? userData.id : -1} default_location_id={userData.default_location_id}/>
                }
              </Route>

              <Route exact path='/personal_training_booking_widget'>
                <PersonalTrainingBookingWidget default_location_id={userData.default_location_id}/>
              </Route>

              <Route exact path='/upcoming_training'>
                {userData &&
                  <UpcomingTraining client_id={userData ? userData.id : -1} />
                }
              </Route>

              <Route exact path="/my_bookings">
                {userData &&
                  <MyBookings userPicture={userData.image ? userData.image : 'assets/icon/profile_image.png' } client_id={userData ? userData.id : -1} />
                }
              </Route>

              <Route exact path="/booked_class/:id">
                {userData &&
                  <BookedClass firstName={userData.name.split(' ')[0]} userPicture={ userData ? userData.image : '/profile_image.png' } client_id={userData ? userData.id : -1}/>
                }
              </Route>

              <Route exact path="/trainers">
                {userData &&
                  <TrainersPage/>
                }
              </Route>

              <Route exact path="/trainer_profile">
                {userData &&
                  <TrainerProfile cover_photo={userData.cover_photo ? userData.cover_photo : '/assets/icon/club_image.jpg'} client_id={userData.id} />
                }
              </Route>

              <Route exact path="/trainer_services">
                {userData &&
                  <TrainerServiceList client_id={userData.id}/>
                }
              </Route>

              <Route exact path="/service_detail">
                  <ServiceDetail/>
              </Route>

              <Route exact path='/pt_timeslots'>
                {userData &&
                  <PtTimeslots client_id={userData.id}/>
                }
              </Route>

              <Route exact path='/pt_time_selector'>
                {userData && clubSettings &&
                  <PTTimeSelector client_id={userData.id} minutes_interval={clubSettings.booking_minutes_interval}/>
                }
              </Route>

              <Route exact path="/services">
                <ServiceList />
              </Route>

              <Route exact path="/find_a_class">
                {userData &&
                  <FindAClass userPicture={userData.image ? userData.image : 'assets/icon/profile_image.png' } client_id={userData ? userData.id : -1} />
                }
              </Route>

              <Route exact path='/pt_products_list'>
                {userData &&
                  <PTProductsList default_location_id={userData.default_location_id}/>
                }
              </Route>

              <Route exact path='/pt_product_detail'>
                {userData &&
                  <PTProductDetail client_id={userData.id}/>
                }
              </Route>

              <Route exact path="/filters">
                {userData &&
                  <FiltersPage default_location_id={userData.default_location_id}/>
                }
              </Route>

              <Route exact path="/profile_navigation">
                {userData &&
                  <ProfileNavigation firstName={userData.name.split(' ')[0]} lastName={userData.name.split(' ')[1]} userPicture={userData ? userData.image : '/profile_image.png' }/>
                }
              </Route>

              <Route exact path="/billing_details">
                {userData &&
                  (userData.credit_card && userData.credit_card.title) ? <BillingDetails fourDigits={userData.credit_card.title.substring(userData.credit_card.title.length - 4)}/> : <BillingDetails />
                }
              </Route>

              <Route exact path="/billing_address">
                {userData &&
                  <BillingAddress userData={userData} />
                }
              </Route>

              <Route exact path="/preferences">
                {userData &&
                  <Preferences location_id={userData.default_location_id} hashed_permissions={userData.hashed_permissions}/>
                }
              </Route>

              <Route exact path='/active_products'>
                <MyProducts/>
              </Route>

              <Route exact path='/past_purchases'>
                <PastPurchases />
              </Route>

              <Route exact path='/receipt'>
                <Receipt/>
              </Route>

              <Route exact path='/payment'>
              {userData &&
                (userData.credit_card && userData.credit_card.title) ? <Payment fourDigits={userData.credit_card.title.substring(userData.credit_card.title.length - 4)}/> : <Payment/>
              }
              </Route>

              <Route exact path='/stripe'>
              {userData &&
                (userData.credit_card && userData.credit_card.title) ? 
                  // <StripePage name={userData.name} fourDigits={userData.credit_card.title.substring(userData.credit_card.title.length - 4)}/>
                  // : <Payment/>
                <Elements stripe={stripePromise}>
                   <StripePage/>
                </Elements>
              : <Payment/>
              }
              </Route>

              <Route exact path='/stripe_capacitor'>
                <StripeCapasitor />
              </Route>

              <Route exact path='/stripe_3ds'>
                <Stripe3Ds />
              </Route>

              <Route exact path='/stripe_result'>
                <StripeResult />
              </Route>

              <Route exact path='/spreedly'>
                <Spreedly />
              </Route>

              {/*}<IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/tab1">
                    <Tab1 />
                  </Route>
                  <Route exact path="/tab2">
                    <Tab2 />
                  </Route>
                  <Route path="/tab3">
                    <Tab3 />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/tab1" />
                  </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="tab1" href="/tab1">
                    <IonIcon icon={triangle} />
                    <IonLabel>Tab 1</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab2" href="/tab2">
                    <IonIcon icon={ellipse} />
                    <IonLabel>Tab 2</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="tab3" href="/tab3">
                    <IonIcon icon={square} />
                    <IonLabel>Tab 3</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>*/}
            </IonReactRouter>
          }
        </PortalsProvider>
      </IonApp>
  );
};

export default App;
