import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';
import './DisplaySetting.css';

export default function DisplaySetting() {
  const [count, setCount] = useState(null); // 초기값을 null로 설정

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/config.json'); // config.json의 경로
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
      setCount(newCount);
      console.log('New count (Increase):', newCount); // 확인용 로그
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

  const Reset = (defaultDelay) => {
    console.log('Default delay (Reset):', defaultDelay); // 확인용 로그
    setCount(defaultDelay);
    saveDelaySec(defaultDelay); // delaySec을 defaultDelay로 리셋
  };

  // 서버에 delaySec 값을 저장하는 함수
  const saveDelaySec = async (newDelaySec) => {
    try {
      console.log('Saving delaySec:', newDelaySec); // 확인용 로그
      await axios.post('http://localhost:5000/api/saveCount', {
        count: newDelaySec,
      });
      console.log('DelaySec updated successfully!');
    } catch (error) {
      console.error('Error updating delaySec:', error);
    }
  };

  if (count === null) {
    return <div>Loading...</div>; // count 값이 null일 때 로딩 표시
  }

  return (
    <div className='second'>
      <h1>초 설정</h1>
      <div className='cho'>
      
        <div className='first-row'>
          <button className='btn' onClick={() => Decrease()} type='button'>-</button>
          <div className='box'><h2>{count}초</h2></div>
          <button className='btn' onClick={() => Increase()} type='button'>+</button>
        </div>

        <div className='second-row'>
          <button className='secbtn' onClick={() => Reset(15)} type='button'><img src='/image/clock.png' alt='clock' width='20px'/>15</button>
          <button className='secbtn' onClick={() => Reset(30)} type='button'><img src='/image/clock.png' alt='clock' width='20px' />30</button>
          <button className='secbtn' onClick={() => Reset(60)} type='button'><img src='/image/clock.png' alt='clock' width='20px' />60</button>
        </div>
      
      </div>
    </div>
  );
}
