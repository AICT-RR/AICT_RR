import './App.css';
import { Route, Routes } from 'react-router-dom';
import SlideScreen from './pages/SlideScreen';
import Settings from './pages/Settings';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={ <SlideScreen /> } />
        <Route path="/settings" element={ <Settings /> } />
      </Routes>
    </div>
  );
}

export default App;
