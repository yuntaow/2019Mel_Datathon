import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {Card, Steps, Popover } from 'antd';

const { Step } = Steps;

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

  render() {
    return (
    <div style={{height:"150px",marginLeft:"20px",marginTop:10,marginBottom:20, overflowX: "auto", width:"90%"}}>
    <Steps current={1} progressDot={customDot} style={{ marginTop:30}}>
      <Step title="No Drought" description="Nov" />
      <Step title="No Drought" description="Dec" />
      <Step title="No Drought" description="Jan" />
      <Step title="No Drought" description="Feb" />
    </Steps>
    </div>
    );
  }
}
