import "antd/dist/antd.css"
import * as React from 'react';
import { PureComponent } from 'react';
import {List, Typography, Table, Divider, Tag, Button, Input, Icon, Statistic, Row, Col,Card,Select } from "antd"
// import { ScatterChart, Scatter,AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { connect } from "react-redux";

const data = [
  'Australia',
  'Korea',
  'Indonesia',
  'Malaysia',
  'Thailand',
];

class BankPanel extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)
}
  render() {
    return (
      <Col>
                <Row>
                  
                <h1 style={{backgroundColor:"rgba(0,0,0,0.05)"}}>Location</h1>
                <p>{this.props.lon==0? "None": this.props.lon+","+this.props.lat}</p>
                <h1 style={{backgroundColor:"rgba(0,0,0,0.05)"}}>Current Sugar Price</h1>
                <List
                  bordered
                  dataSource={data}
                  renderItem={item => (
                    <List.Item>
                      <Typography.Text><Icon type="reddit" /></Typography.Text>  {item}
                      <span style={{float:"right"}}>
                        $10</span>
                    </List.Item>
                  )}
                />
                <h1 style={{backgroundColor:"rgba(0,0,0,0.05)", marginTop:"10px"}}>Prediction</h1>
                <div style={{marginTop: "20px", marginLeft: "20px", flex:"row", width:"90%"}}>
                <Row gutter={8}>

                <Col span={12}>

                 <Statistic
                   title="Production"
                   value={11.28}
                   precision={2}
                   valueStyle={{ color: '#3f8600' }}
                   prefix={<Icon type="arrow-up" />}
                   suffix="%"
                 />
                 </Col>
                   <Col span={12}>
                 <Statistic
                   title="Land Utilisation"
                   value={9.3}
                   precision={2}
                   valueStyle={{ color: '#cf1322' }}
                   prefix={<Icon type="arrow-down" />}
                   suffix="%"
                 />
                 </Col>
                 </Row>
                 </div>
                 <div style={{marginTop: "20px", marginLeft: "20px", flex:"row", width:"90%"}}>
                <Row gutter={8}>
                <Col span={12}>
                 <Statistic
                   title="Production"
                   value={11.28}
                   precision={2}
                   valueStyle={{ color: '#3f8600' }}
                   prefix={<Icon type="arrow-up" />}
                   suffix="%"
                 />
                 </Col>
                   <Col span={12}>
                 <Statistic
                   title="Land Utilisation"
                   value={9.3}
                   precision={2}
                   valueStyle={{ color: '#cf1322' }}
                   prefix={<Icon type="arrow-down" />}
                   suffix="%"
                 />
                 </Col>
                 </Row>
                 </div>


                </Row>
      </Col>
    );
  }
}


const mapStateToProps = state => {
  console.log(state.mapcor)
  return {lat:state.mapcor.lat, lon:state.mapcor.lon}

};


export default connect(mapStateToProps)(BankPanel);