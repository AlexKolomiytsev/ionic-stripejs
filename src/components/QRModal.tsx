import React, { useState } from 'react';
import { IonButton, IonContent, IonModal, IonSlide, IonSlides, IonText } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';

import BasicFooter from './BasicFooter';

import '../styles/modal.css';
import '../styles/index.css';

type Props = {
  isOpen: boolean;
  setOnClose: (value: boolean) => void;
}

const QRs = [{name: 'Clair Kruger', src: '/QR.png'}, {name: 'Clair Kruger', src: '/QR.png'}]

const QRModal: React.FC<Props> = ({ isOpen, setOnClose }) => (
  <IonModal
    className='modal-rounded'
    isOpen={isOpen}
    breakpoints={[0.75, 1]}
    initialBreakpoint={0.75}
  >
    <IonContent>
      <div className='modal-body'>
        <IonText>
          <p className='modal-header'>Club Access</p>
          <p className='modal-text' style={{paddingTop: '15px'}}>Align your QR code with the door reader to request entry. Swipe left or right to change users.</p>
        </IonText>
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
        >
          <SwiperSlide>
            <div >
              <img src="/QR.png" />
              <h2>Welcome</h2>
              <p>
                The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a
                demonstration of proper code use.
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <img src="/QR.png" />
            <h2>What is Ionic?</h2>
            <p>
              <b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps
              with web technologies like HTML, CSS, and JavaScript.
            </p>
          </SwiperSlide>
        </Swiper>
        <BasicFooter text='Finish' onClick={() => {setOnClose(false);}} />
      </div>
    </IonContent>
  </IonModal>
);

export default QRModal;
