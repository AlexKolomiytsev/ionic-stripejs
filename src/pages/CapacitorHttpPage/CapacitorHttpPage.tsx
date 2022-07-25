import {FC, useCallback, useState} from 'react';
import {Http, HttpResponse} from "@capacitor-community/http";
import {IonButton, IonContent, IonInput, IonPage, IonText} from '@ionic/react';

const CapacitorHttpPage: FC = () => {
  const [name, setName] = useState();
  const [age, setAge] = useState();

  const request = useCallback(async () => {
    if (!name) return;

    const response: HttpResponse = await Http.get({
      url: 'https://api.agify.io',
      params: {name},
    });

    setAge(response.data.age);
  }, [name])

  const request2 = useCallback(async () => {
    try {
      const response: HttpResponse = await Http.get({
        // url: 'http://localhost:3030/set-cookie',
        url: 'https://floating-bayou-00569.herokuapp.com/set-cookie',
        webFetchExtra: {
          credentials: 'include'
        }
      });

      console.log('response 2', response);
      console.log('response 2', response.headers);
    } catch (e) {
      console.log(e);
      // @ts-ignore
      // alert(JSON.stringify(e.message, null, 2))
    }

  }, [])

  const request3 = useCallback(async () => {
    try {
      const response: HttpResponse = await Http.get({
        // url: 'http://localhost:3030/read-cookie',
        url: 'https://floating-bayou-00569.herokuapp.com/read-cookie',
        webFetchExtra: {
          credentials: 'include'
        }
      });

      console.log('response 3', response);

      alert(`response.data.message -- ${response.data.rememberme || 'NO COOKIE'}`);
    } catch (e) {
      console.log(e);
      // @ts-ignore
      alert(JSON.stringify(e.message, null, 2))
    }

  }, [])

  return (
    <IonPage>
      <IonContent fullscreen style={{ height: '100vh', width: '100vw' }}>
        <IonText>Predict age based on a name:</IonText>

        <IonInput
          value={name}
          placeholder="Enter your name"
          onIonChange={(e: any) => setName(e.detail.value!)}
        ></IonInput>

        <IonButton color="primary" onClick={request}>
          Do request
        </IonButton>

        <div>
          <IonText>Your age: {age || '?'}</IonText>
        </div>

        <IonButton color="primary" onClick={request2}>
          Set cookie
        </IonButton>

        <IonButton color="primary" onClick={request3}>
          Read cookie
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CapacitorHttpPage;