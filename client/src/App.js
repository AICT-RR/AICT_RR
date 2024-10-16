import './App.css';
import { Route, Routes } from 'react-router-dom';
import SlideScreen from './pages/slidePages/SlideScreen';
import Settings from './pages/settingPages/Settings';
import DisplaySetting from './pages/settingPages/DisplaySetting';
import SlideSetting from './pages/settingPages/SlideSetting';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<SlideScreen />} />
        <Route path='/settings' element={<Settings />}>
          <Route path='display' element={<DisplaySetting />} />
          <Route path='slide' element={<SlideSetting />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;