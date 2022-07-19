import { IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';

import { UserData } from '../../utils/data';

import BookingsHomepage from './BookingsHomepage';
import BookingListPage from './BookingListPage';

type Props = {
  userData: UserData;
}

const ClassesTab: React.FC<Props> = ({ userData }) => {
  return (
    <IonRouterOutlet>
      <Route exact path="/classes/booking_homepage">
        {userData &&
          <BookingsHomepage firstName={userData.name.split(' ')[0]} userPicture={userData.image ? userData.image : 'assets/icon/profile_image.png' } client_id={userData ? userData.id : -1} cover_photo={userData.cover_photo ? userData.cover_photo : ''}/>
        }
      </Route>
      {<Route exact path="/classes/booking_list">
        {userData &&
          <BookingListPage userPicture={userData.image ? userData.image : 'assets/icon/profile_image.png' } client_id={userData ? userData.id : -1} />
        }
      </Route>}
      <Route exact path="/classes">
        <Redirect to="/classes/booking_homepage" />
      </Route>
    </IonRouterOutlet>
  );
};

export default ClassesTab;
