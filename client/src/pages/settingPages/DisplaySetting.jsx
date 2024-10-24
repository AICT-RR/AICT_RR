import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

export default function DisplaySetting() {
  const [count, setCount] = useState(0); // 초기값을 null로 설정
  const [selectedEffect, setSelectedEffect] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('./config.json'); // config.json의 경로
        setCount(response.data.delaySec); // config에서 delaySec 값으로 초기화
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, []); // 빈 배열로 인해 처음 렌더링할 때만 실행

  const Increase = () => {
    if (count !== null) {
      const newCount = count + 1;
      console.log('New count (Increase):', newCount); // 확인용 로그
      setCount(newCount);
      saveDelaySec(newCount); // delaySec을 저장
    }
  };

  const Decrease = () => {
    if (count > 1) {
      const newCount = count - 1;
      console.log('New count (Decrease):', newCount); // 확인용 로그
      setCount(newCount);
      saveDelaySec(newCount); // delaySec을 저장
    }
  };

  const Reset = () => {
    const defaultDelay = 15;
    console.log('Default delay (Reset):', defaultDelay); // 확인용 로그
    setCount(defaultDelay);
    saveDelaySec(defaultDelay); // delaySec을 15로 리셋
  };

  const handleEffectClick = (effect) => {
    setSelectedEffect(effect);
  };

  // 서버에 delaySec 값을 저장하는 함수
  const saveDelaySec = async (newDelaySec) => {
    try {
      console.log('Saving delaySec:', newDelaySec); // 확인용 로그
      await axios.post('http://localhost:5000/api/saveCount', { count: newDelaySec });
      console.log('DelaySec updated successfully!');
    } catch (error) {
      console.error('Error updating delaySec:', error);
    }
  };

  if (count === null) {
    return <div>Loading...</div>; // count 값이 null일 때 로딩 표시
  }

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
      <button className='outline' onClick={Reset}>15</button>
    </div>
  );
}
