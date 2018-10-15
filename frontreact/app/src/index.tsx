import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './style/index.css';

// const name = 'Gurimarukin';
// const element = <h1>Hello, {name}</h1>;

// ReactDOM.render(
//   element,
//   document.getElementById('root') as HTMLElement
// );


// function tick() {
//   const element = (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {new Date().toLocaleTimeString()}.</h2>
//     </div>
//   );
//   ReactDOM.render(element, document.getElementById('root'));
// }

// setInterval(tick, 1000);

const element = <App name="Gurimarukin" />;

ReactDOM.render(element, document.getElementById('root'));

registerServiceWorker();
