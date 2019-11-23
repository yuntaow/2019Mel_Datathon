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
}
  render() {
    return (
        <div style={{height:"100vh",backgroundColor:"black"}}>
            <Carousel style={{height:"90vh"}} effect="fade">
                <div className="ppt-holder">
                  <img className="ppt" src={require("./11.png")} alt="Italian Trulli"/>
                  <Button type="primary" style={{margin:"auto",display:"block",marginTop:"2%"}}><Link to="/dashboard">Back to dashboard</Link></Button>
                </div>
                <div className="ppt-holder">
                <img className="ppt" src={require("./22.png")} alt="Italian Trulli"/>
                <Button type="primary" style={{margin:"auto",display:"block",marginTop:"2%"}}><Link to="/dashboard">Back to dashboard</Link></Button>
                </div>
                <div className="ppt-holder">
                <img className="ppt" src={require("./33.png")} alt="Italian Trulli"/>
                <Button type="primary" style={{margin:"auto",display:"block",marginTop:"2%"}}><Link to="/dashboard">Back to dashboard</Link></Button>

                </div>
              </Carousel>
        </div>
    );
  }
}
