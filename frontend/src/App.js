import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Typography, Card, Button, Space, Progress } from 'antd';
import React from 'react';
import "antd/dist/antd.css";
import recordAudio from './recordAudio';
const { Header, Content, Footer, Sider } = Layout;

const { Title } = Typography;

const questions = ["Tell me about yourself.",
  "Why do you want to work at this company?",
  , "Why do you want this job?"
  , "Why should we hire you?"
  , "What can you bring to the company?"
  , "What are your greatest strengths?"
  , "What do you consider to be your weaknesses?"
  , "What is your greatest professional achievement?"
  , "Tell me about a challenge or conflict you’ve faced at work, and how you dealt with it."
  , "Tell me about a time you demonstrated leadership skills."
  , "What’s a time you disagreed with a decision that was made at work?"];

const items2 = questions.map((question, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    label: `${key}. ` + question,
  };
});

const items1 = ['Home', 'Dashboard', 'Logout'].map((key) => ({
  key,
  label: `${key}`,
}));

const App = () => (
  <Layout>
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
    </Header>
    <Content
      style={{
        padding: '0 50px',
      }}
    >
      <Breadcrumb
        style={{
          margin: '16px 0',
        }}
      >
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <Layout
        className="site-layout-background"
        style={{
          padding: '24px 0',
        }}
      >

        <Sider width={400}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              width: 400,
            }}
            items={items2}
          />
        </Sider>
        <Content
          style={{
            padding: '0 24px',
            marginBottom: '24px',
            minHeight: 280,
          }}
        >
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Card title="Tell me about yourself."
              style={{ width: 900 }}
              actions={[
                <Button onClick={recordAudio}>Start here!</Button>,
              ]}
            >
              <p>Are you ready to talk about yourself during a job interview? Interviewers will sometimes start an interview with an open-ended question like, "Tell me about yourself."

                This question is a way to break the ice and make you feel more comfortable during the interview process. However, some people might find this—and other interview questions about you—slightly stressful.

                If you’re someone who doesn’t like bragging about yourself, these kinds of questions can be difficult to answer. But they’re a good way for the hiring manager to get insight into your personality, so it pays to prepare to answer them. </p>
            </Card>

            <Card title="Results"
              style={{ width: 900 }}
              actions={[
                <Button>Start here!</Button>,
              ]}
            >
              <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                <Space direction="horizontal" size="large" style={{ display: 'flex' }}>
                  <Progress type="dashboard" percent={75} />
                  <div style={{ width: 600 }}>
                    Volume
                    <Progress percent={30} />
                    Stutter
                    <Progress percent={50} />
                    Repetitiveness
                    <Progress percent={70} />
                    Enthusiasm
                    <Progress percent={80} />
                  </div>
                </Space>

                <Title level={4}>You could work on</Title>

                <Space direction="horizontal" size="large" style={{ display: 'flex' }}>

                </Space>
              </Space>
            </Card>
          </Space>

        </Content>
      </Layout>
    </Content>
  </Layout>
);

export default App;

// import './App.css';
// import React, { useState } from 'react';
// import axios from "axios";

// const filler_words = ["um", "uh", "hmm", "mhm", "uh huh", "ahh", "like", "you know"]

// const countFiller = (str) => {
//   let count = 0;
//   filler_words.forEach((word) => {
//     if(str.includes(word))
//       count += 1;
//   })
//   return count;
// ;}

// function App() {
//   const [currentText, setCurrentText] = useState('');
//   // const [pronounciationScore, setPronounciationScore] = useState("0");
//   // const [loudness, setLoudness] = useState("0");
//   // const [imagePath, setImagePath] = useState('imgs/white_square.png');
//   // const [totalAnalysis, setTotalAnalysis] = useState({
//   //   articulationRate: "", 
//   //   balance: "",
//   //   numberOfPauses: "",
//   //   rateOfSpeech: "",
//   //   speakingDuration: "", 
//   // });

//   axios.get('/analyze', { 
//     params: { 
//       filename: "audio/7510.wav" 
//     } 
//   })
//   .then((response) => {
//     setCurrentText(response.data[0]);
//   }).catch(error => {
//     console.log(error);
//   });

//   // axios.get('/voice', { 
//   //   params: { 
//   //     filename: "7510" 
//   //   } 
//   // })
//   // .then((response) => {
//   //   let index = response.data[0].indexOf(":");
//   //   setPronounciationScore(response.data[0].substring(index+1));
//   // }).catch(error => {
//   //   console.log(error);
//   // });

//   // axios.get('/loudness', { 
//   //   params: { 
//   //     filename: "audio/7510.wav" 
//   //   } 
//   // })
//   // .then((response) => {
//   //   setLoudness(response.data[0])
//   // }).catch(error => {
//   //   console.log(error);
//   // });

//   // axios.get('/amplitude_graph', { 
//   //   params: { 
//   //     filename: "audio/7510.wav" 
//   //   } 
//   // })
//   // .then(() => {
//   //   setImagePath('imgs/7510.wav.png');
//   //   console.log("Success image creation!")
//   // }).catch(error => {
//   //   console.log(error);
//   // });

//   return (
//     <div className="App">
//       <header className="App-header">
//         <p>The detected text from speech = {currentText}.</p>
//         <p>The number of filler words used = {countFiller(currentText)}.</p>
//         {/* <p>Pronounciation Score = {pronounciationScore}.</p> */}
//         {/* <p>Perceived Loudness Score = {loudness}.</p> */}
//       </header>
//       {/* <img src={imagePath} alt={''}/> */}
//     </div>
//   );
// }

// export default App;