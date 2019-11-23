import "antd/dist/antd.css"
import * as React from 'react';
import { PureComponent } from 'react';
import {Button, Input, Icon, Statistic, Row, Col,Card,Select } from "antd"
// import { ScatterChart, Scatter,AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import classes from "./Intro.module.css";
import Logo from "./assets/logo-white.png";
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
    const backToDashboard = <Button className={classes.back}><Link to="/dashboard"><Icon type="caret-left" />Back</Link></Button>;
    const enter = <Button className={classes.Enter}><Link to="/dashboard">Enter</Link></Button>
    
    return (
        <div className={classes.intro}>
          
            <Carousel style={{height:"97vh"}} effect="fade">
            
                <div className={classes.pptHolder}>
                  <img className={classes.ppt} src={require("./11.png")} alt="Italian Trulli"/>
                </div>
                <div className={classes.pptHolder}>
                <img className={classes.ppt} src={require("./22.png")} alt="Italian Trulli"/>
                </div>
                <div className={classes.pptHolder}>
                <img className={classes.ppt} src={require("./33.png")} alt="Italian Trulli"/>
                </div>
                <div className={classes.splash} >
                <div className={classes.Logo__box}>
                  <img src={Logo} className={classes.Logo} />
                  <h1>Sugero</h1>
                  {enter}
                  </div>
                </div>
              </Carousel>

              {backToDashboard}
        </div>
    );
  }
}
