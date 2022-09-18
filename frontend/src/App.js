import './App.css';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Breadcrumb, Layout, Menu, Typography, Card, Button, Space, Progress, Table, Divider, Image } from 'antd';
import "antd/dist/antd.css";
import recordAudio from './recordAudio';
// import defaultGraph from './imgs/7510.wav.png';
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

const filler_words = ["um", "uh", "hmm", "mhm", "uh huh", "ahh", "like", "you know"]

const countFiller = (str) => {
  let count = 0;
  filler_words.forEach((word) => {
    if (str.includes(word))
      count += 1;
  })
  return count;
  ;
}

const calcAverage = (lst) => {
  let sums = [0, 0, 0];  // positive, neutral, negative
  let counts = [0, 0, 0]; 
  lst.forEach((entry) => {
    let index = 1;
    if(entry["sentiment"] == "POSITIVE")
      index = 0;
    else if(entry["sentiment"] == "NEGATIVE")
      index = 2;
    sums[index] = sums[index] + entry["confidence"];
    counts[index] = counts[index] + 1;
  })
  return [sums[0] / counts[0], sums[1] / counts[1], sums[2] / counts[2]];
}

const calcLoudPercent = (x) => {
  if (x == 100)
    return 0;
  if (20 <= x <= 22)
    return 50;
  else if (17 <= x <= 19)
    return 60;
  else if (14 <= x <= 16)
    return 80;
  else if (9 <= x <= 13)
    return 100;
  else if (6 <= x <= 8)
    return 80;
  else if (3 <= x <= 5)
    return 60;
  else if (0 <= x <= 2)
    return 50;
  else
    return 40;
}

function App() {
  const [loudness, setLoudness] = useState(-100);
  const [pronounce, setPronounce] = useState(0);
  const [posSentiment, setPosSentiment] = useState(0.0);
  const [negSentiment, setNegSentiment] = useState(0.0);
  const [neuSentiment, setNeuSentiment] = useState(0.0);
  const [text, setText] = useState("");
  const [balance, setBalance] = useState(0.0);
  const [speed, setSpeed] = useState(-1);
  const [pauses, setPauses] = useState(-1);
  const [syllables, setSyllables] = useState(-1);

  useEffect(() => {
    axios.get('/analyze', {
      params: {
        filename: "audio/7510.wav"
      }
    })
      .then((response) => {
        //console.log(response.data["metric_table"]["articulation_rate"]["0"]);
        setLoudness(response.data["loudness"]);
        let index = response.data["pronounce"].indexOf(":");
        setPronounce(response.data["pronounce"].substring(index + 1));
        setText(response.data["text"]);
        const sentiments = calcAverage(response.data["sentiment"]);
        setPosSentiment(sentiments[0]);
        setNeuSentiment(sentiments[1]);
        setNegSentiment(sentiments[2]);
        setBalance(parseFloat(response.data["metric_table"]["balance"]["0"]));
        setSpeed(parseInt(response.data["metric_table"]["articulation_rate"]["0"]));
        setPauses(parseInt(response.data["metric_table"]["number_of_pauses"]["0"]));
        setSyllables(parseInt(response.data["metric_table"]["number_ of_syllables"]["0"]));
      }).catch(error => {
        console.log(error);
      });
  }, [])

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const basicDashboard = (<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
    <Card title="Tell me about yourself."
      style={{ width: 900 }}
      actions={[
        <Button onClick={recordAudio}>Start here!</Button>,
        <Button onClick={handleClick}>Analyze!</Button>,
      ]}
    >
      <p>Are you ready to talk about yourself during a job interview? Interviewers will sometimes start an interview with an open-ended question like, "Tell me about yourself."

        This question is a way to break the ice and make you feel more comfortable during the interview process. However, some people might find this—and other interview questions about you—slightly stressful.

        If you’re someone who doesn’t like bragging about yourself, these kinds of questions can be difficult to answer. But they’re a good way for the hiring manager to get insight into your personality, so it pays to prepare to answer them. </p>
    </Card>

    <Card title="Results" style={{ width: 900 }}>
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

        <Title level={4}>You could work on...</Title>

        <Space direction="horizontal" size="large" style={{ display: 'flex' }} />
      </Space>
    </Card>
  </Space>);

  const resultsDashboard = (<>
    <Card title="Results"
      style={{ width: 900 }}
      actions={[
        <Button onClick={handleClick}>Go Back!</Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <Space direction="horizontal" size="large" style={{ display: 'flex' }}>
          <div style={{ width: 600 }}>
            Volume
            <Progress percent={calcLoudPercent(-1 * loudness)} />
            Filler Words
            <Progress percent={(countFiller(text) / (text.split(" ").length))*100} />
            Speech Balance
            <Progress percent={balance * 100} />
            Pronounciation
            <Progress percent={pronounce} />
            Content Positive Sentiment
            <Progress percent={posSentiment * 100} />
            Content Neutral Sentiment
            <Progress percent={neuSentiment * 100} />
            Content Negative Sentiment
            <Progress percent={negSentiment * 100} />
          </div>
        </Space>
        <Divider />
        <Space direction="horizontal" size="large" style={{ display: 'flex' }}>
          {/* <Image width={400} src={defaultGraph}/> */}
          <Progress type="dashboard" percent={75} width={200} />
          {(speed != -1 || pauses != -1 || syllables != -1) &&
            <Table dataSource={[
              {
                key: '1',
                metric: 'Syllables per second of speaking duration',
                value: speed,
              },
              {
                key: '2',
                metric: 'Number of pauses',
                value: pauses,
              },
              {
                key: '3',
                metric: 'Number of syllables',
                value: syllables,
              },
            ]} columns={columns} />
          }
        </Space>
      </Space>
    </Card>
  </>);

  return (<Layout>
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
            height: "100%"
          }}
        >
          {clicked ? resultsDashboard : basicDashboard}
        </Content>
      </Layout>
    </Content>
  </Layout>
  );
}

export default App;