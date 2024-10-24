import React, { useState, useEffect } from 'react';
import Slider from '../../components/Slider';
import axios from 'axios'; // axios를 추가합니다

import './SlideScreen.css';

export default function SlideScreen() {
  const [config, setConfig] = useState({}); // config의 초기값을 빈 객체로 설정
  const [loading, setLoading] = useState(true); // 로딩 상태를 관리
  const [slides, setSlides] = useState([]); // slides 상태 추가

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('http://localhost:5000/getImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // 필요한 경우 본문 추가
        });
        const data = await response.json();
        setSlides(data); // 불러온 데이터를 slides 상태에 설정
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchSlides(); 
  }, []); 

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/config.json'); // public 폴더에서 config.json을 가져옴
        setConfig(response.data); // 가져온 데이터를 설정
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setLoading(false); // 로딩이 끝났음을 설정
      }
    };

    fetchConfig();
  }, []); // 빈 배열로 인해 처음 렌더링할 때만 실행

  // 로딩 중일 때의 처리
  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
  }

  const { slideMode, delaySec } = config; // config에서 slideMode와 delaySec 추출

  return (
    <>
      <Slider slides={slides} mode={slideMode} delay={delaySec} /> {/* slides를 Slider에 전달 */}
    </>
  );
}
