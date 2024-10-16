import './App.css';
import { Route, Routes } from 'react-router-dom';
import SlideScreen from './pages/SlideScreen';
import Settings from './pages/Settings';
import DisplaySetting from './pages/DisplaySetting';
import SlideSetting from './pages/SlideSetting';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={ <SlideScreen /> } />
        <Route path="/settings" element={ <Settings /> }>
          <Route path="display" element={ <DisplaySetting /> } />
          <Route path="slide" element={ <SlideSetting /> } />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
