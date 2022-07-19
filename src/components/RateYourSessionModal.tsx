import React from 'react';
import { IonButton, IonContent, IonFooter, IonIcon, IonModal, IonText, IonTextarea } from '@ionic/react';
import Rating from 'react-rating';

import '../styles/modal.css';
import '../styles/index.css';
import '../styles/text.css';

type Props = {
  isOpen: boolean;
  setOnClose: (value: boolean) => void;
}

const RateYourSessionModal: React.FC<Props> = ({ isOpen, setOnClose }) => (
  <IonModal
    className='modal-rounded'
    isOpen={isOpen}
    breakpoints={[0.75, 1]}
    initialBreakpoint={0.75}
    swipeToClose={true}
    onDidDismiss={() => setOnClose(false)}
  >
    <IonContent>
      <div className='modal-body'>
        <IonText>
          <p className='modal-header'>Review your recent session</p>
          <p className='modal-text'>Zumba with Anna Kerry on 3 November</p>
        </IonText>
        <IonText className='modal-section-header'>How was Zumba?</IonText>
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '8px'}}>
          <Rating emptySymbol={<IonIcon src="/assets/icon/grey-star.png" className="star-icon" />}
                  placeholderSymbol={<IonIcon src="/assets/icon/orange-star.png" className="star-icon" />}
                  fullSymbol={<IonIcon src="/assets/icon/orange-star.png" className="star-icon" />}
          />
        </div>
        <IonText className='modal-section-header' style={{paddingTop: '30px'}}>How was Anna?</IonText>
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '8px'}}>
          <Rating emptySymbol={<IonIcon src="/assets/icon/grey-star.png" className="star-icon" />}
                  placeholderSymbol={<IonIcon src="/assets/icon/orange-star.png" className="star-icon" />}
                  fullSymbol={<IonIcon src="/assets/icon/orange-star.png" className="star-icon" />}
          />
        </div>
        <IonTextarea placeholder='Let us know what you thought....' className='modal-textarea' />
        <IonFooter style={{position: 'relative', bottom: '-100px'}}>
          <IonButton className='color-button'>Leave Feedback</IonButton>
          <IonButton className='white-button' onClick={() => setOnClose(false)}>No thanks</IonButton>
        </IonFooter>
      </div>
    </IonContent>
  </IonModal>
);

export default RateYourSessionModal;
