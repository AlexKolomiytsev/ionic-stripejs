import { IonSegment, IonSegmentButton, IonText } from '@ionic/react';

import '../styles/Segment.css';

// import './Segment.css';

interface ContainerProps {
  values: Array<string>;
  names: Array<string>;
  tab: string;
  setTab: (value: any) => void;
}

const Segment: React.FC<ContainerProps> = ({ values, names, tab, setTab }) => {

  return (
    <div className='segment-div'>{/* className='segment'*/}
      <IonSegment mode="ios"  onIonChange={e => setTab(e.detail.value)} value={tab} >
        {values.map((value, index) => (
          <IonSegmentButton key={value} value={value} className='segment-button EGymText-12x-0072 segment-text' >
            {names[index]}
          </IonSegmentButton>
        ))}
      </IonSegment>
    </div>
  );
};

export default Segment;
