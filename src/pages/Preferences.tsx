import { IonAlert, IonContent, IonChip, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonLoading, IonPage, IonSelect, IonSelectOption, IonText, IonToggle } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Portals from '@ionic/portals';
import { useTranslation } from 'react-i18next';

import { Notification, NotificationSettingsSet, LinkedClient, Location } from '../utils/data';
import { fetchNotifications, fetchLinked, fetchLocations, fetchRegions, compareObjects } from '../utils/utils';
import { apiPut } from '../utils/requests';

import BasicHeader from '../components/BasicHeader';
import ButtonsFooter from '../components/ButtonsFooter';

// import './Preferences.css';
import '../styles/index.css';
import '../styles/text.css'

type Props = {
  location_id: number;
  hashed_permissions: {book_for: Array<number>, email_redirection_for: Array<number>};
}

const ProfilePreferences: React.FC<Props> = ({ location_id, hashed_permissions }) => {

  let history = useHistory();
  const { t } = useTranslation();

  const [location, setLocation] = useState<number>();
  const [locations, setLocations] = useState<Location[]>();
  const [notificationsSet, setNotificationsSet] = useState<NotificationSettingsSet>();
  const [pushEnabled, setPushEnabled] = useState<boolean>();
  const [emailEnabled, setEmailEnabled] = useState<boolean>();
  const [linkedClients, setLinkedClients] = useState<LinkedClient[]>();
  const [linkedEmails, setLinkedEmails] = useState<boolean[]>();
  const [linkedBookFor, setLinkedBookFor] = useState<boolean[]>();
  // const [linkedForLinkedBook, setLinkedForLinkedBook] = useState<Array<boolean[]>>();
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const getLocations = async () => {
      let regions = await fetchRegions("?unified_filters[disabled]=false");
      let data = await fetchLocations("?unified_filters[hidden]=false");
      if (regions && data){
        // let region_ids = regions.map((item) => { return item.id; });
        // let filtered_data: Location[] = [];
        // await data.forEach((item: any) => {
        //   if (region_ids.includes(item.region_id)) {
        //     filtered_data.push(item);
        //   }
        // });
        setLocations(await data.sort((item1: Location, item2: Location) => {return compareObjects(item1, item2, 'name');}));
        let default_loc = await data.find((item: Location) => { return item.id === location_id; });
        console.log(default_loc);
        if(default_loc) {
          setLocation(default_loc.id);
          console.log(default_loc.id);
        }
      }
    }

    const getPreferences = async () => {
      await getLocations();
      let notifications = await fetchNotifications();
      setNotificationsSet(notifications);
      console.log(notifications);
      let note = await notifications.notification_settings.find((item: Notification) => { return item.key === "global_notifications_by_pushes_enabled"; });
      setPushEnabled(note.to_client);
      note = await notifications.notification_settings.find((item: Notification) => { return item.key === "global_notifications_enabled"; })
      setEmailEnabled(note.to_client);
      let linked = await fetchLinked();
      console.log(linked);
      setLinkedClients(linked);
      let linked_notes: boolean[] = [];
      let linked_book: boolean[] = [];
      // let linked_book_for: Array<boolean[]> = [];
      await linked.forEach((item: LinkedClient, index: number) => {
        if(hashed_permissions.email_redirection_for.includes(item.id)) {
          linked_notes.push(true);
        }
        else {
          linked_notes.push(false);
        }
        if(hashed_permissions.book_for.includes(item.id)) {
          linked_book.push(true);
        }
        else {
          linked_book.push(false);
        }
      });
      setLinkedEmails(linked_notes);
      setLinkedBookFor(linked_book);
      console.log(hashed_permissions);
      setShowLoading(false);
    };

    getPreferences();
  }, [location_id, hashed_permissions]);

  const changePermissions = async () => {
    if(notificationsSet) {
      let book: number[] = [];
      await linkedBookFor!.forEach((item: boolean, index: number) => { linkedClients && book && item && book.push(linkedClients[index].id); });
      let notes: number[] = [];
      await linkedEmails!.forEach((item: boolean, index: number) => { linkedClients && notes && item && notes.push(linkedClients[index].id); });
      let body = {
        user: {
          id: notificationsSet && notificationsSet.user_id,
          hashed_permissions: {
            client: {
              book_for: book,
              email_redirection_for: notes
            }
          }
        }
      }
      let push = await notificationsSet.notification_settings.find((item: Notification) => { return item.key === "global_notifications_by_pushes_enabled"; });
      let email = await notificationsSet.notification_settings.find((item: Notification) => { return item.key === "global_notifications_enabled"; });
      let date = new Date();
      let notification_settings_set = {
        notification_settings_set: {
          id: notificationsSet.id,
          club_id: notificationsSet.club_id,
          user_id: notificationsSet.user_id,
          notification_settings_attributes: [
            push && {
              created_at: push.created_at,
              id: push.id,
              key: push.key,
              notification_settings_set_id: push.notification_settings_set_id,
              to_accountant: push.to_accountant,
              to_administrator: push.to_administrator,
              to_client: pushEnabled,
              to_content_provider: push.to_content_provider,
              to_content_user: push.to_content_user,
              to_front_house_manager: push.to_front_house_manager,
              to_independent_trainer: push.to_independent_trainer,
              to_manager: push.to_manager,
              to_pt_manager: push.to_pt_manager,
              to_self_employed: push.to_self_employed,
              to_sjd_accountant: push.to_sjd_accountant,
              to_system: push.to_system,
              to_trainer: push.to_trainer,
              updated_at: date.toISOString()
            },
            email && {
              created_at: email.created_at,
              id: email.id,
              key: email.key,
              notification_settings_set_id: email.notification_settings_set_id,
              to_accountant: email.to_accountant,
              to_administrator: email.to_administrator,
              to_client: emailEnabled,
              to_content_provider: email.to_content_provider,
              to_content_user: email.to_content_user,
              to_front_house_manager: email.to_front_house_manager,
              to_independent_trainer: email.to_independent_trainer,
              to_manager: email.to_manager,
              to_pt_manager: email.to_pt_manager,
              to_self_employed: email.to_self_employed,
              to_sjd_accountant: email.to_sjd_accountant,
              to_system: email.to_system,
              to_trainer: email.to_trainer,
              updated_at: date.toISOString()
            }
          ]
        }
      }
      try{
        let permissionsResult = await apiPut('/api/unified/users/profile/permissions', body, true);
        console.log(permissionsResult);
        let notificationsResult = await apiPut('/api/unified/settings/notification_settings_sets/' + notificationsSet!.id, notification_settings_set, true);
        console.log(notificationsResult);
        await setAlertHeader(t('alert.success'));
        await setAlertMessage(t('alert.preferences_successfully_changed'));
        setShowAlert(true);
      }
      catch(e) {
        console.log(e);
        await setAlertHeader(t('alert.error'));
        await setAlertMessage(t('alert.something_went_wrong'));
        setShowAlert(true);
      }
    }
  }

  return (
    <IonPage>
      <IonHeader translucent style={{position: 'relative', top: '0px'}}>
        <BasicHeader title={t('headers.preferences')} onClick={ async () => {await Portals.publish({ topic: 'subscription', data: {type: 'dismiss', data: null } });}} />
      </IonHeader>
    <IonLoading
     cssClass='loading'
     isOpen={showLoading}
     onDidDismiss={() => setShowLoading(false)}
    />
    <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => {
          setShowAlert(false);
          if(alertHeader === t('alert.success')) {
            history.goBack();
          }
        }}
        cssClass='my-custom-class'
        mode='ios'
        header={alertHeader}
        message={alertMessage}
        buttons={['OK']}
      />
      <IonContent>
        <div style={{display: 'flex', overflowY: 'scroll', flexDirection: 'column', position: 'relative', paddingBottom: '100px', backgroundColor: '#F4F4F4', minHeight: '100vh'}}>
          <IonList style={{background: '#F4F4F4'}}>
            <IonItemGroup>
              <IonItem className='input-item'>
                 <IonLabel className='input-label'>{t('default') + ' ' + t('filter.location').charAt(0).toUpperCase() + t('filter.location').slice(1)}</IonLabel>
                  {location && <IonSelect value={location} onIonChange={ async (e) => {
                      setLocation(e.detail.value);
                      console.log(e.detail.value);
                      
                      }}>
                      {locations && locations.map((item) => (
                        <IonSelectOption value={item.id}>{item.name}</IonSelectOption>
                      ))}
                    </IonSelect>}
              </IonItem>
            </IonItemGroup>
          </IonList>
          <div style={{background: '#F4F4F4', paddingTop: '20px', paddingBottom: '10px'}} >
            <IonText className='date'>{t('notifications')}</IonText>
          </div>
          <IonList>
            <IonItemGroup>
              <IonItem className='input-item'>
                <div className='two-side-container' style={{alignItems: 'center'}}>
                 <IonLabel className='input-label' >{t('my_push') + ' ' + t('notifications')}</IonLabel>
                 {/*<IonChip className={`chip ${(pushEnabled) ? "color-chip" : "white-chip"}`} style={{width: '80px'}} onClick={() => {setPushEnabled(!pushEnabled);}}>
                   <IonLabel style={{margin: 'auto'}}>{(pushEnabled) ? t('enabled') : t('disabled')}</IonLabel>
        </IonChip>*/}
                 <IonToggle checked={pushEnabled} onIonChange={() => {setPushEnabled(!pushEnabled);}} />
               </div>
              </IonItem>

              <IonItem className='input-item'>
                <div className='two-side-container'  style={{alignItems: 'center'}}>
                 <IonLabel className='input-label' >{t('my_email') + ' ' + t('notifications')}</IonLabel>
                 {/*<IonChip className={`chip ${(emailEnabled) ? "color-chip" : "white-chip"}`} style={{width: '80px'}} onClick={() => {setEmailEnabled(!emailEnabled);}}>
                   <IonLabel style={{margin: 'auto'}}>{(emailEnabled) ? t('enabled') : t('disabled')}</IonLabel>
      </IonChip>*/}
                   <IonToggle checked={emailEnabled} onIonChange={() => {setEmailEnabled(!emailEnabled);}} />
                </div>
              </IonItem>

              {linkedEmails && linkedClients && linkedClients.map((item, index) => (
                <IonItem mode="ios" className='input-item'>
                  <div className='two-side-container'  style={{alignItems: 'center'}}>
                   <IonLabel className='input-label' >{item.name + ' ' + t('emails')}</IonLabel>
                   {/*<IonChip className={`chip ${(linkedEmails[index]) ? "color-chip" : "white-chip"}`} style={{width: '80px'}} onClick={ async () => {
                     let change = linkedEmails;
                     await setLinkedEmails([false]);
                     change[index] = !linkedEmails[index];
                     console.log(change);
                     await setLinkedEmails(change);
                   }}>
                     <IonLabel style={{margin: 'auto'}}>{(linkedEmails[index]) ? t('enabled') : t('disabled')}</IonLabel>
                  </IonChip>*/}
                   <IonToggle checked={linkedEmails[index]} onIonChange={async () => {
                     let change = linkedEmails;
                    //  await setLinkedEmails([false]);
                     change[index] = !linkedEmails[index];
                     console.log(change);
                     setLinkedEmails(change);}} />
                  </div>
                </IonItem>
              ))}
            </IonItemGroup>
          </IonList>
          {linkedBookFor && linkedClients && linkedClients.length && <IonList>
            <div style={{background: '#F4F4F4', paddingTop: '20px', paddingBottom: '10px'}} >
              <IonText className='date'>{t('who_can_i_book_for')}</IonText>
            </div>
            <IonItemGroup>
            {linkedClients.map((item, index) => (
              <IonItem className='input-item'>
                <div className='two-side-container'  style={{alignItems: 'center'}}>
                 <IonLabel className='input-label' >{item.name}</IonLabel>
                 {/*<IonChip className={`chip ${(linkedBookFor[index]) ? "color-chip" : "white-chip"}`} style={{width: '80px'}} onClick={ async () => {
                   let change = linkedBookFor;
                   await setLinkedBookFor([false]);
                   change[index] = !change[index];
                   await setLinkedBookFor(change);
                 }}>
                   <IonLabel style={{margin: 'auto'}}>{(linkedBookFor[index]) ? t('enabled') : t('disabled')}</IonLabel>
                </IonChip>*/}
                <IonToggle checked={linkedBookFor[index]} onIonChange={async () => {
                  let change = linkedBookFor;
                  // await setLinkedBookFor([false]);
                  change[index] = !change[index];
                  setLinkedBookFor(change);
                }} />

                </div>
              </IonItem>
            ))}
            </IonItemGroup>
          </IonList>}
          {/*}<div style={{background: '#F4F4F4', paddingTop: '20px', paddingBottom: '10px'}} >
            <IonText className='date'>Who can Bing book for?</IonText>
          </div>
          <IonList>
            <IonItemGroup>
              <IonItem className='input-item'>
                <div className='two-side-container' style={{alignItems: 'center'}}>
                 <IonLabel className='input-label' >Me</IonLabel>
                 <IonChip className={`chip ${(bingBookMe) ? "color-chip" : "white-chip"}`} style={{width: '80px'}} onClick={() => {setBingBookMe(!bingBookMe);}}>
                   <IonLabel style={{margin: 'auto'}}>{(bingBookMe) ? 'Enabled' : 'Disabled'}</IonLabel>
                 </IonChip>
               </div>
              </IonItem>

              <IonItem className='input-item'>
                <div className='two-side-container'  style={{alignItems: 'center'}}>
                 <IonLabel className='input-label' >Audrey Hepburn</IonLabel>
                 <IonChip className={`chip ${(bingBookAudrey) ? "color-chip" : "white-chip"}`} style={{width: '80px'}} onClick={() => {setBingBookAudrey(!bingBookAudrey);}}>
                   <IonLabel style={{margin: 'auto'}}>{(bingBookAudrey) ? 'Enabled' : 'Disabled'}</IonLabel>
                 </IonChip>
                </div>
              </IonItem>
            </IonItemGroup>
          </IonList>*/}
        </div>
        {/*<div className='footer-div-one-button' >
          <ButtonsFooter text={t('footer.subscribe_to_calendar')} onClick={changePermissions}/>
        </div>*/}
      </IonContent>
      <ButtonsFooter text={t('footer.subscribe_to_calendar')} onClick={changePermissions}/>
    </IonPage>
  );
};

export default ProfilePreferences;
