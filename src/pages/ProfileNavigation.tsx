import { IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonModal, IonPage, IonText } from '@ionic/react';
import { pencil } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Portals from '@ionic/portals'; //, { PortalSubscription }

import { auth } from '../utils/const';
import { apiPostFetch } from '../utils/requests';

import BasicHeader from '../components/BasicHeader';

// import './ProfileNavigation.css';
import '../styles/index.css';
import '../styles/text.css'

type Props = {
  firstName: string;
  lastName: string;
  userPicture: string;
}

const ProfileNavigation: React.FC<Props> = ({ firstName, lastName, userPicture }) => {

  let history = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('Unable to find user');
  const [authData, setAuthData] = useState('');

  const refreshToken = async () => {
      await Portals.publish({ topic: 'subscription', data: {type: 'authToken', data: null } });
      Portals.subscribe<string>({ topic: 'authToken' }, async (response) => {
        try {
          let auth = await apiPostFetch('/api/unified/sessions/auth', {"egym": {"token": response.data} }, false);
          if(auth === false) {
            await setModalMessage('User with specified token not authorized');
            await setAuthData('PortalsData: ' + response + '; Token: ' + response.data);
            setShowModal(true);
          }
          else {
            console.log(auth);
            await setModalMessage('Success');
            await setAuthData('PortalsData: ' + response + '; Token: ' + response.data);
            setShowModal(true);
          }
        }
        catch (e: any) {
          await setModalMessage(e);
          await setAuthData('PortalsData: ' + response);
          setShowModal(true);
        }
      });
    }

  return (
    <IonPage>
      <IonModal
       isOpen={showModal}
       onDidDismiss={() => setShowModal(false)}
       backdrop-dismiss
     >
       <IonContent>
         <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
           <IonText className='modal-header'>{modalMessage}</IonText>
           <IonText className='modal-text' style={{paddingTop: '10px'}}>{authData}</IonText>
           <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
         </div>
       </IonContent>
     </IonModal>
      <IonContent force-overscroll scroll-events>
        <IonHeader style={{position: 'fixed', top: '0px'}}>
          <BasicHeader title={'My Profile'} secondButtonType='src' secondButton='/assets/icon/notification.svg' onClickSecond={refreshToken} />
        </IonHeader>
        {/*}<IonHeader style={{position: 'sticky', top: '0px', zIndex: 20}}>
          <IonToolbar mode='md'>
            <div className="two-side-container toolbar-profile-container">
              <IonButton color="light" className="small-grey-icon-button" onClick={() => {history.goBack();}}><IonIcon icon={chevronBackOutline} className="toolbar-icon"></IonIcon></IonButton>
              <IonText className='my-profile'>My Profile</IonText>
              <IonButton color="light" className="small-grey-icon-button toolbar-circle-button" onClick={refreshToken}><IonIcon src='/assets/icon/notification.svg' className="toolbar-icon"></IonIcon></IonButton>
            </div>
          </IonToolbar>
        </IonHeader>*/}
        <div className='body' style={{backgroundColor: '#F9F9F9', paddingTop: '25px'}}>
          <div className="profile-container">
            <IonAvatar className='profile-avatar'>{/*onClick=*/}
              <img src={userPicture ? userPicture : '/assets/icon/profile_image.png'} alt='User' />
            </IonAvatar>
            <div className='circle profile-circle'><IonIcon icon={pencil} style={{padding: '4px', paddingTop: '3px'}}></IonIcon></div>
          </div>
          <div className="profile-container">
            <IonText className='EGymText-20px-048'>{firstName + ' ' + lastName}</IonText>
          </div>
          <div className="profile-container">
            <IonText className='EGymText-16px-032'>{auth.club.name !== '' ? auth.club.name : 'Great Endurance Gym'}</IonText>
          </div>
          <IonList style={{backgroundColor: '#F9F9F9'}}>
            <IonItemGroup>
              <IonItem lines="none" className="profile-action">
                <IonIcon size='large' src='/assets/icon/edit_profile.svg' style={{padding: '15px 0px'}}/>
                <IonLabel style={{marginLeft: '10px'}}>Edit Profile</IonLabel>
              </IonItem>

              <IonItemDivider style={{backgroundColor: '#F9F9F9', border: '0px'}}>
                <IonLabel>Manage account information</IonLabel>
              </IonItemDivider>

              <IonItem lines="none" className="profile-action">
                <IonIcon size='large' src='/assets/icon/my_membership.svg' style={{padding: '15px 0px'}}/>
                <IonLabel style={{marginLeft: '10px'}}>My Membership</IonLabel>
              </IonItem>

              <IonItem lines="none" className="profile-action" onClick={() => {history.push("/billing_details");}}>
                <IonIcon size='large' src='/assets/icon/billing_details.svg' style={{padding: '15px 0px'}}/>
                <IonLabel style={{marginLeft: '10px'}}>Billing Details</IonLabel>
              </IonItem>

              <IonItem lines="none" className="profile-action" onClick={() => {history.push("/preferences");}}>
                <IonIcon size='large' src='/assets/icon/billing_details.svg' style={{padding: '15px 0px'}}/>
                <IonLabel style={{marginLeft: '10px'}}>Preferences</IonLabel>
              </IonItem>

              <IonItem lines="none" className="profile-action" onClick={() => {history.push("/active_products");}}>
                <IonIcon size='large' src='/assets/icon/billing_details.svg' style={{padding: '15px 0px'}}/>
                <IonLabel style={{marginLeft: '10px'}}>My Products</IonLabel>
              </IonItem>

              <IonItemDivider style={{backgroundColor: '#F9F9F9', border: '0px'}}>
                <IonLabel>Details of your membership</IonLabel>
              </IonItemDivider>

              <IonItem lines="none" className="profile-action">
                <IonIcon size='large' src='/assets/icon/share_feedback.svg' style={{padding: '15px 0px'}}/>
                <IonLabel style={{marginLeft: '10px'}}>Share Feedback</IonLabel>
              </IonItem>

              <IonItem lines="none" className="profile-action">
                <IonIcon size='large' src='/assets/icon/privacy.svg' style={{padding: '15px 0px'}}/>
                <IonLabel style={{marginLeft: '10px'}}>Privacy</IonLabel>
              </IonItem>
            </IonItemGroup>

            <IonText>{authData}</IonText>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileNavigation;
