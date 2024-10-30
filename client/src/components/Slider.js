import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import './Slider.css';
import { ReactComponent as NoFileIcon } from '../icons/fluent--document-split-hint-off-20-regular.svg';
import { Link } from 'react-router-dom';

export const Slider = ({ slides = [] }) => {
  const [delay, setDelay] = useState(null); // 초기값을 null로 설정하여 로딩 상태 구분

  useEffect(() => {
    fetch('/config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('config.json을 찾을 수 없습니다');
        }
        return response.json();
      })
      .then((data) => {
        if (data.delaySec) {
          setDelay(data.delaySec * 1000); // 초를 밀리초로 변환
        } else {
          setDelay(5000); // config.json에 delaySec이 없을 경우 기본값 설정
        }
      })
      .catch((error) => {
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
        <div className='no-slide'>
          <NoFileIcon className='no-file-icon' />
          <h3 className='no-slide-title'>슬라이드가 비어있어요</h3>
          <div className='no-slide-desc'>
            <Link className='no-slide-link' to='./settings'>
              설정
            </Link>
            <p>페이지에서 이미지를 추가해 보세요</p>
          </div>
        </div>
      )}
    </Swiper>
  );
};

export default Slider;
