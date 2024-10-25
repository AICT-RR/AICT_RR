import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from '../../components/Slider';
import axios from 'axios';
import './SlideScreen.css';

export default function SlideScreen() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('http://localhost:5000/getImage', {
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
    return <div>Loading...</div>;
  }

  const { slideMode, delaySec } = config;

  return (
    <div className="toolbar-container">
      <div className="hover-toolbar">
        <Link to="/settings"> {/* Logo is now clickable to navigate home */}
          <img src="/image/1.png" alt="Logo" className="toolbar-logo" />
        </Link>
      </div>
      <Slider className="slide" slides={slides} mode={slideMode} delay={delaySec} />
    </div>
  );
}
