//import { Slider } from './effect_component/auto.jsx';
import { Slider } from './effect_component/fade.jsx';
import slides from './mock.json';
import './App.css';

function App() {
  return (
    <Slider slides={slides}/>
  );
}

export default App;
