import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Settings.css';

export default function DisplaySetting() {
  const [count, setCount] = useState(null); // 초기값을 null로 설정
  const [selectedEffect, setSelectedEffect] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/config.json');
        setCount(response.data.delaySec);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  const Increase = useCallback(() => {
    if (count !== null) {
      const newCount = count + 1;
      setCount(newCount);
      saveDelaySec(newCount);
    }
  }, [count]);

  const Decrease = useCallback(() => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      saveDelaySec(newCount);
    }
  }, [count]);

  const Reset = useCallback(() => {
    const defaultDelay = 15;
    setCount(defaultDelay);
    saveDelaySec(defaultDelay);
  }, []);

  const handleEffectClick = useCallback((effect) => {
    setSelectedEffect(effect);
  }, []);

  const saveDelaySec = async (newDelaySec) => {
    try {
      await axios.post('http://localhost:5000/api/saveCount', { count: newDelaySec });
    } catch (error) {
      console.error('Error updating delaySec:', error);
    }
  };

  if (count === null) {
    return <div>Loading...</div>; // count가 null일 때 로딩 표시
  }

  return (
    <div>
      <h1>DisplaySetting</h1>
      <div role='group'>
        <EffectButton effect="Fade" selectedEffect={selectedEffect} handleEffectClick={handleEffectClick} />
        <EffectButton effect="Slide" selectedEffect={selectedEffect} handleEffectClick={handleEffectClick} />
        <EffectButton effect="CoverFlow" selectedEffect={selectedEffect} handleEffectClick={handleEffectClick} />
        <EffectButton effect="cube" selectedEffect={selectedEffect} handleEffectClick={handleEffectClick} />
      </div>
      <h2>{count}초</h2> {/* count가 정상적으로 표시됩니다 */}
      <button className='outline' onClick={Increase}>+</button>
      <button className='outline' onClick={Decrease}>-</button>
      <button className='outline' onClick={Reset}>15</button>
    </div>
  );
}

const EffectButton = React.memo(({ effect, selectedEffect, handleEffectClick }) => {
  return (
    <button
      className={selectedEffect === effect ? 'selected' : 'unselected'}
      onClick={() => handleEffectClick(effect)}
    >
      {effect}
    </button>
  );
});
