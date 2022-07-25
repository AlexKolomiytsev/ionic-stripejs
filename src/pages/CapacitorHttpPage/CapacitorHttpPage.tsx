import {FC, useCallback, useState} from 'react';
import {Http, HttpResponse} from "@capacitor-community/http";
import {IonButton, IonContent, IonInput, IonPage, IonText} from '@ionic/react';

const CapacitorHttpPage: FC = () => {
  const [name, setName] = useState();
  const [age, setAge] = useState();

  const request = useCallback(async () => {
    if (!name) return;

    const options = {
      url: 'https://api.agify.io',
      params: {name}
    };

    const response: HttpResponse = await Http.get(options);

    setAge(response.data.age)
  }, [name])

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
      </IonContent>
    </IonPage>
  );
};

export default CapacitorHttpPage;