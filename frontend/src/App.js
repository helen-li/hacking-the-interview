import './App.css';
import React, { useState } from 'react';
import axios from "axios";

const filler_words = ["um", "uh", "hmm", "mhm", "uh huh", "ahh", "like", "you know"]

const countFiller = (str) => {
  let count = 0;
  filler_words.forEach((word) => {
    if(str.includes(word))
      count += 1;
  })
  return count;
;}

function App() {
  const [currentText, setCurrentText] = useState('');
  // const [pronounciationScore, setPronounciationScore] = useState("0");
  // const [loudness, setLoudness] = useState("0");
  // const [imagePath, setImagePath] = useState('imgs/white_square.png');
  // const [totalAnalysis, setTotalAnalysis] = useState({
  //   articulationRate: "", 
  //   balance: "",
  //   numberOfPauses: "",
  //   rateOfSpeech: "",
  //   speakingDuration: "", 
  // });

  axios.get('/analyze', { 
    params: { 
      filename: "audio/7510.wav" 
    } 
  })
  .then((response) => {
    setCurrentText(response.data[0]);
  }).catch(error => {
    console.log(error);
  });

  // axios.get('/voice', { 
  //   params: { 
  //     filename: "7510" 
  //   } 
  // })
  // .then((response) => {
  //   let index = response.data[0].indexOf(":");
  //   setPronounciationScore(response.data[0].substring(index+1));
  // }).catch(error => {
  //   console.log(error);
  // });

  // axios.get('/loudness', { 
  //   params: { 
  //     filename: "audio/7510.wav" 
  //   } 
  // })
  // .then((response) => {
  //   setLoudness(response.data[0])
  // }).catch(error => {
  //   console.log(error);
  // });

  // axios.get('/amplitude_graph', { 
  //   params: { 
  //     filename: "audio/7510.wav" 
  //   } 
  // })
  // .then(() => {
  //   setImagePath('imgs/7510.wav.png');
  //   console.log("Success image creation!")
  // }).catch(error => {
  //   console.log(error);
  // });

  return (
    <div className="App">
      <header className="App-header">
        <p>The detected text from speech = {currentText}.</p>
        <p>The number of filler words used = {countFiller(currentText)}.</p>
        {/* <p>Pronounciation Score = {pronounciationScore}.</p> */}
        {/* <p>Perceived Loudness Score = {loudness}.</p> */}
      </header>
      {/* <img src={imagePath} alt={''}/> */}
    </div>
  );
}

export default App;
