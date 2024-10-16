import React from 'react';
import Slider from '../components/Slider';
import images from '../images.json';

import config from '../config.json';

import './SlideScreen.css';

export default function SlideScreen() {
  const { slideMode } = config;
  const { delaySec } = config;
  return (
    <>
      <Slider slides={images} mode={slideMode} delay={delaySec} />
    </>
  );
}
