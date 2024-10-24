import React, { useState } from 'react';
import './Settings.css';


export default function DisplaySetting() {
  const [count, setCount] = useState(3);
  const [selectedEffect, setSelectedEffect] = useState('');

  const Increase = () => {
    setCount(count + 1);
  };

  const Decrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const Reset = () => {
    setCount(3);
  };

  const handleEffectClick = (effect) => {
    setSelectedEffect(effect);
  };

  return (
    <div>
      <h1>DisplaySetting</h1>
      <div role='group'>
        <button className={selectedEffect === 'Fade' ? 'selected' : 'unselected'} onClick={() => handleEffectClick('Fade')}>
          Fade
        </button>
        <button className={selectedEffect === 'Slide' ? 'selected' : 'unselected'} onClick={() => handleEffectClick('Slide')}>
          Slide
        </button>
        <button className={selectedEffect === 'CoverFlow' ? 'selected' : 'unselected'} onClick={() => handleEffectClick('CoverFlow')}>
          CoverFlow
        </button>
        <button className={selectedEffect === 'cube' ? 'selected' : 'unselected'} onClick={() => handleEffectClick('cube')}>
          cube
        </button>
      </div>
      <h2>{count}초</h2>
      <button className='outline' onClick={Increase}>+</button>
      <button className='outline' onClick={Decrease}>-</button>
      <button className='outline' onClick={Reset}>Reset</button>
    </div>
  );
}
