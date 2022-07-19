import React, { useEffect } from 'react';
import { IonInput, IonLabel, IonText } from '@ionic/react';
import { useState } from 'react';
import InputMask from 'react-input-mask';

type Props = {
  fourDigits?: string;
  onClick?:(value: any) => void;
  cardNumber?: string;
  setCardNumber?: (value: string) => void;
  expMonth?: number;
  setExpMonth?: (value: number) => void;
  expYear?: number;
  setExpYear?: (value: number) => void;
  cvc?: string;
  setCvc?: (value: string) => void;
}

const CreditCard: React.FC<Props> = ({ fourDigits, onClick, cardNumber, setCardNumber, expMonth, setExpMonth, expYear, setExpYear, cvc, setCvc }) => {

  const [placeholder, setPlaceholder] = useState(true);

  useEffect(() => {
    console.log(fourDigits);
  }, [])

  return(
    <div className='credit-card' onClick={onClick}>
      <div style={{padding: '15px', paddingRight: '50px'}}>
        <IonLabel className='EGymText-12x-0'>Card Number</IonLabel>
        {fourDigits ?
              (placeholder ?
                <div className='card-field' onClick={() => {
                  setPlaceholder(false);
                  // document.getElementById("card-number")!.focus();
                }}>
                    <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot'></div>
                    <div className='black-separator-dot'></div>
                    <IonText style={{marginLeft: '8px'}}>{fourDigits}</IonText>
                </div> :
                <InputMask mask="9999 9999 9999 9999" className='card-field' value={cardNumber} onChange={(e) => {
                  if(setCardNumber) {setCardNumber(e.target.value.replace(/[_ ]/g, ''));}
                  console.log(e.target.value.replace(/[_ ]/g, ''));
                }} autoFocus />) :
                <InputMask mask="9999 9999 9999 9999" className='card-field' value={cardNumber} onChange={(e) => {
                  if(setCardNumber) {setCardNumber(e.target.value.replace(/[_ ]/g, ''));}
                  console.log(e.target.value.replace(/[_ ]/g, ''));
                }} autoFocus />}
      </div>
      <div style={{padding: '15px', paddingRight: '50px', paddingTop: '30px'}}>
        <div className='two-side-container'>
          <div style={{width: '50%'}}>
            <IonLabel className='EGymText-12x-0'>Valid Thru</IonLabel>
              {fourDigits ?
                (placeholder ?
                  <div className='two-side-container'>
                    <div className='card-field' style={{marginRight: '10px'}}>
                      <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                      <div className='black-separator-dot'></div>
                    </div>
                    <div className='card-field'>
                      <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                      <div className='black-separator-dot'></div>
                    </div>
                  </div> :
                  <div className='two-side-container'>
                    <IonInput className='card-field' style={{marginRight: '10px'}} value={expMonth} onIonChange={(e) => {
                      if(e.detail.value) {
                        if(setExpMonth) {setExpMonth(parseInt(e.detail.value));}
                        console.log(e.detail.value);
                      }
                    }} type="tel" inputmode="numeric" maxlength={2} autocomplete="cc-exp-month">
                    </IonInput>
                    <IonInput className='card-field' value={expYear} onIonChange={(e) => {
                      if(e.detail.value) {
                        if(setExpYear) {setExpYear(parseInt(e.detail.value));}
                        console.log(e.detail.value);
                      }
                    }} type="tel" inputmode="numeric" maxlength={2} autocomplete="cc-exp-year">
                    </IonInput>
                  </div>) :
                <div className='two-side-container'>
                  <IonInput className='card-field' style={{marginRight: '10px'}} value={expMonth} onIonChange={(e) => {
                      if(e.detail.value) {
                        if(setExpMonth) {setExpMonth(parseInt(e.detail.value));}
                        console.log(e.detail.value);
                      }
                    }} type="tel" inputmode="numeric" maxlength={2} autocomplete="cc-exp-month">
                    </IonInput>
                    <IonInput className='card-field' value={expYear} onIonChange={(e) => {
                      if(e.detail.value) {
                        if(setExpYear) {setExpYear(parseInt(e.detail.value));}
                        console.log(e.detail.value);
                      }
                    }} type="tel" inputmode="numeric" maxlength={2} autocomplete="cc-exp-year">
                    </IonInput>
                </div>}
            </div>
          <div style={{width: '20%'}}>
            <IonLabel className='EGymText-12x-0'>CVV</IonLabel>
            {fourDigits ?
              (placeholder ?
                <div className='card-field'>
                  <div className='black-separator-dot' style={{marginLeft: '8px'}}></div>
                  <div className='black-separator-dot'></div>
                  <div className='black-separator-dot'></div>
                </div> :
                <IonInput className='card-field' value={cvc} onIonChange={(e) => {
                  if(e.detail.value) {
                    if(setCvc) {setCvc(e.detail.value);}
                    console.log(e.detail.value);
                  }
                }} type="tel" inputmode="numeric" maxlength={3} autocomplete="cc-csc"></IonInput>) :
              <IonInput className='card-field' value={cvc} onIonChange={(e) => {
                if(e.detail.value) {
                  if(setCvc) {setCvc(e.detail.value);}
                  console.log(e.detail.value);
                }
              }} type="tel" inputmode="numeric" maxlength={3} autocomplete="cc-csc"></IonInput>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCard;
