import React, { useState, useEffect } from 'react';
import Slider from '../../components/Slider';
import axios from 'axios';
import './SlideScreen.css';

export default function SlideScreen() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);

  // 현재 접속 중인 호스트 주소를 사용하여 API URL 구성
  const apiUrl = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // const response = await fetch('http://localhost:5000/getImage', {
        const response = await fetch(apiUrl + '/getImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/config.json');
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return <div>잠시만 기다려주세요</div>;
  }

  const { slideMode, delaySec } = config;

  return (
    <div className="toolbar-container">
      <Slider className="slide" slides={slides} mode={slideMode} delay={delaySec} />
    </div>
  );
}
