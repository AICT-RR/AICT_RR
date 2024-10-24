import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/swiper-bundle.css";

export const Slider = ({ slides = [] }) => { // slides의 기본값을 빈 배열로 설정
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      effect={"fade"}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {slides.length > 0 ? ( // 슬라이드가 있을 때만 렌더링
        slides.map((slide) => (
          <SwiperSlide key={slide.id} className='slide'> {/* 고유한 key 값 사용 */}
            <img src={slide.url} alt={slide.title} />
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          {/* 슬라이드가 없을 때 메시지 표시 */}
          <div>슬라이드가 없습니다.</div>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default Slider;
