import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItemDivider, IonRippleEffect, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';

import '../styles/index.css';
import '../styles/text.css';

type Props = {
    image: string;
    text: string;
    onClick: () => void;
};

const BasicImageCard: React.FC<Props> = ({ image, text, onClick }) => {

  let history = useHistory();

 return (
    <IonCard key={text} className='trainer-card' onClick={onClick}>
        <IonCardContent className='trainer-card-content'>
        <img src={image ? image : '/assets/icon/profile_image.png'} className='trainer-img' alt={text}/>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <IonCardTitle className='EGymText-16px-032'>{text}</IonCardTitle>
        </div>
        </IonCardContent>
    </IonCard>
 );
};

export default BasicImageCard;
