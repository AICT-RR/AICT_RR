import React from 'react';
import Slider from '../../components/Slider';
import images from '../../data/data.json';

import config from '../../config.json';

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
