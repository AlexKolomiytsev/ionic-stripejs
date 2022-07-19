import { isPlatform } from '@ionic/core';
import { IonButton, IonFooter } from '@ionic/react';

import '../styles/index.css';

type Props = {
  text: string;
  onClick?: (value: any) => void;
  disabled?: boolean;
  secondButtonText?: string;
  onClickSecond?: (value: any) => void;
}

const ButtonsFooter: React.FC<Props> = ({ text, onClick, disabled=false, secondButtonText, onClickSecond }) => {

  return (
    <IonFooter className={`${secondButtonText ? 'footer-div-one-button' : 'buttons-footer'}`} style={{paddingBottom: `${isPlatform("ios") ? '30px' : '0px'}`}}>
      {onClick ? <IonButton id="confirm-button" className='color-button EGymText-16px-032' onClick={onClick} disabled={disabled}>{text}</IonButton> : <IonButton className='color-button EGymText-16px-032'>{text}</IonButton>}
      {secondButtonText && onClickSecond && <IonButton className='white-button EGymText-16px-032' onClick={onClickSecond}>{secondButtonText}</IonButton>}
    </IonFooter>
  );
};

export default ButtonsFooter;
