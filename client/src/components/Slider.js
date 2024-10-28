import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

export const Slider = ({ slides = [] }) => {
  const [delay, setDelay] = useState(null); // 초기값을 null로 설정하여 로딩 상태 구분

  useEffect(() => {
    fetch('/config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('config.json을 찾을 수 없습니다');
        }
        return response.json();
      })
      .then(data => {
        if (data.delaySec) {
          setDelay(data.delaySec * 1000); // 초를 밀리초로 변환
        } else {
          setDelay(5000); // config.json에 delaySec이 없을 경우 기본값 설정
        }
      })
      .catch(error => {
        console.error('config.json 불러오기 오류:', error);
        setDelay(5000); // 오류 발생 시 기본값 설정
      });
  }, []);

  if (delay === null) {
    return <div>로딩 중...</div>; // 딜레이 값이 설정되기 전 로딩 화면 표시
  }

  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      effect={'fade'}
      autoplay={{
        delay,
        disableOnInteraction: false,
      }}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {slides.length > 0 ? (
        slides.map((slide) => (
          <SwiperSlide key={slide.id} className='slide'>
            <img src={slide.url} alt={slide.title} />
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <div>슬라이드가 없습니다.</div>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default Slider;
