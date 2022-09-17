import './App.css';
import React, { useState } from 'react';
import axios from "axios";

function App() {
  const [currentTime, setCurrentTime] = useState('');

  axios.get('/analyze', { 
    params: { 
      filename: "audio/7510.wav" 
    } 
  })
  .then((response) => {
    console.log(response.data[0]);
    setCurrentTime(response.data[0]);
  }).catch(error => {
    console.log(error);
  });

  return (
    <div className="App">
      <header className="App-header">

        ... no changes in this part ...

        <p>The current time is {currentTime}.</p>
      </header>
    </div>
  );
}

export default App;
