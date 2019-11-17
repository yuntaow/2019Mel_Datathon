import "antd/dist/antd.css"
import * as React from 'react';
import { PureComponent } from 'react';
import {Button, Input, Icon, Statistic, Row, Col,Card,Select } from "antd"
// import { ScatterChart, Scatter,AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import "./Intro.css"
import { Carousel } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Option, OptGroup } = Select;


export default class Intro extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)
}
  render() {
    return (
        <div className="bg">
            <Carousel style={{height:"100vh"}}>
                <div className="ppt-holder">
                  <img className="ppt" src={require("./1.jpeg")} alt="Italian Trulli"/>
                </div>
                <div className="ppt-holder">
                <img className="ppt" src={require("./2.jpeg")} alt="Italian Trulli"/>
                </div>
                <div className="ppt-holder">
                <img className="ppt" src={require("./3.jpeg")} alt="Italian Trulli"/>
                </div>
                <div className="ppt-holder">
                <Button type="primary" shape="circle"><Link to="/dashboard">Go</Link></Button>
                </div>

              </Carousel>
        </div>
    );
  }
}
