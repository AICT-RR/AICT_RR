
import React, { useEffect, useState } from 'react';
// import { Slider } from './effect_component/fade.jsx';
import './main.css';
function Main() {
  
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/getImage', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({}) // 필요한 경우 본문 추가
      });
        const data = await response.json();
        setSlides(data);
        console(data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchSlides(); 
  }, []); 

  const imageUrl = "http://localhost:5000/uploads/45a218ab7d823e9c.png";

  return (
    <div>
      <img src ={imageUrl}/>
        {slides.map(img => (
            <div key={img.id}> {/* 각 img에 대해 고유한 key를 추가 */}
                <h2>{img.id}</h2>
                <p>{img.filename}</p>
                <img src={img.url} alt={`Slide ${img.id}`} /> {/* alt 속성 추가 */}
            </div>
        ))}
    </div>
);
}
export default Main;

