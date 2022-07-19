import { IonButton, IonCol, IonIcon, IonGrid, IonRow, IonText, IonToolbar } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import '../styles/index.css';
import '../styles/text.css';

type Props = {
  title: string;
  onClick?: () => void;
  secondButtonType?: string;
  secondButton?: string;
  onClickSecond?: () => void;
}

const BasicHeader: React.FC<Props> = ({ title, onClick, secondButtonType, secondButton, onClickSecond }) => {

  const history = useHistory();

  const onClickAction = async () => {
    if(onClick) {
      await onClick();
    }
    history.goBack();
  }

  return (
      <IonToolbar mode='md' className='toolbar'>
        <IonGrid>
          <IonRow>
            <IonCol size="2" className='centered-container' style={{paddingBottom: '0px', paddingTop: '10px'}}>
              <IonButton className="small-grey-icon-button" onClick={onClickAction}><IonIcon icon={chevronBackOutline} className="toolbar-icon"></IonIcon></IonButton>
            </IonCol>
            <IonCol size="8" className='centered-container' style={{paddingBottom: '0px', paddingTop: '10px'}}>
              <IonText className='EGymText-16px-032' style={{fontStyle: 'medium'}}>{title}</IonText>
            </IonCol>
            <IonCol size="2" className='centered-container' style={{paddingBottom: '0px', paddingTop: '10px'}}>
              {(secondButton && onClickSecond) ? (secondButtonType === 'text' ?
                <IonButton fill='clear' className='EGymText-16px-01 text-button' onClick={onClickSecond}>{secondButton}</IonButton>
                  :
                <IonButton color="light" className={`small-grey-icon-button ${secondButton === '/assets/icon/notification.svg' ? 'toolbar-circle-button' : ''}`} onClick={onClickSecond}>
                  {secondButtonType === 'src' ? <IonIcon src={secondButton} size={`${secondButton === '/assets/icon/tick.svg' ? 'small': 'large'}`} className="toolbar-icon"></IonIcon> : <IonIcon icon={secondButton} className="toolbar-icon"></IonIcon>}
                </IonButton>)
                :
                null
              }
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonToolbar>
  );
};

export default BasicHeader;
