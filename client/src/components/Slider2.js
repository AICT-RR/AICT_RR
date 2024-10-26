import React from 'react';
import { Autoplay, EffectCoverflow, EffectFade, EffectCube } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export default function Slider2(props) {
  function getModules() {
    switch (props.mode) {
      case 0: // Fade
        return { modules: [Autoplay, EffectFade], effect: 'fade' };
      case 1: // Slide
        return { modules: [Autoplay], effect: null };
      case 2: // CoverFlow
        return { modules: [Autoplay, EffectCoverflow], effect: 'coverflow' };
      case 3: // cube
        return { modules: [Autoplay, EffectCube], effect: 'cube' };
      default: // Fade
        return { modules: [Autoplay, EffectFade], effect: 'fade' };
    }
  }

  const { modules, effect } = getModules();

  console.log('mode:', props.mode);
  console.log('props.delay:', props.delay);
  console.log('modeules:', modules);
  console.log('effect:', effect);

  return (
    <Swiper
      key={`${props.mode}-${props.delay}`} // mode와 delay 값에 따라 key 변경
      modules={modules} // moduels: Autoplay, EffectFade, EffectCoverflow,
      spaceBetween={0}
      slidesPerView={1}
      effect={effect} // effect: fade, coverflow
      loop={true} // infinite loop
      autoplay={{
        // delay: 1000, // 슬라이드 전환 대기 시간 (ms)
        delay: (props.delay) * 1000,
        disableOnInteraction: false,
      }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {props.slides.map(function (slide) {
        return (
          <SwiperSlide key={slide.image} className='slide'>
            <img src={slide.image} alt={slide.slide} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
