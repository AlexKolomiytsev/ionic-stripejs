import React from "react";
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonPage, IonRouterLink,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

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
import StripePage from './pages/StripePage';
import CapacitorHttpPage from './pages/CapacitorHttpPage';

// const stripePromise = loadStripe('pk_test_MaMhlqv0uPa8mFSOKTJGYO8U');
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
// const stripePromise = loadStripe('pk_live_51LMwD2JmyNf7GGPubBTis0cxOjbVzTa7pAuAvQXXHzVA1p1S3laYdn7KdbCBLKQdlw80j6yBqJA3LhnL3lh96YLn00E5eUMpgY');

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/capacitorhttp">
          <CapacitorHttpPage />
        </Route>

        <Route exact path="/stripe">
          <Elements stripe={stripePromise}>
            <StripePage />
          </Elements>
        </Route>
        <Route exact path="/home">
          <IonPage>
            <IonContent fullscreen>
              <IonCard>

                <IonCardHeader>
                  <IonCardTitle>Navigation</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <div>
                    <IonRouterLink routerLink={`/capacitorhttp`}>"/capacitorhttp"</IonRouterLink>
                  </div>
                  <div>
                    <IonRouterLink routerLink={`/stripe`}>"/stripe"</IonRouterLink>
                  </div>
                </IonCardContent>

              </IonCard>
            </IonContent>
          </IonPage>
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;

