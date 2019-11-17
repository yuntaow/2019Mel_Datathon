
import SideLayout from "./components/Layout"
import "antd/dist/antd.css"
import * as React from 'react';
import Map from "./components/mapbox"
import Npvi from "./components/npvi"
import Yield from "./components/yield_chart"
import Clasi from "./components/classification"
import Timeline from "./components/timeline"

import {Divider, Spin, Alert, Modal, Button, Input, Icon, Statistic, Row, Col,Card,Select } from "antd"
import BankPanel from "./components/panel"
const axios = require('axios');


const data = [
  { genre: 'Sports', sold: 275, income: 2300 },
  { genre: 'Strategy', sold: 115, income: 667 },
  { genre: 'Action', sold: 120, income: 982 },
  { genre: 'Shooter', sold: 350, income: 5271 },
  { genre: 'Other', sold: 150, income: 3710 }
];

const cols = {
  sold: { alias: '销售量' },
  genre: { alias: '游戏种类' }
};

class Portal extends React.Component {

  constructor(props) {
    super(props);
  }
  state = { visible: false,
     loading: false, 
     chart: null,
     data:null};

  updateCoor = (new_data) => {
    this.setState({
      data : new_data
    })
  }

  getMapCoors = (lon, lat) =>  {
    return [lon,lat]
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
    console.log(this.state.data)
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });

  };

  trigger = (coordinates) =>  {
    this.setState({ loading: true });
    setTimeout( ()=>{
    axios.post('http://127.0.0.1:5000/', {
      coordinates:  this.state.data,
    })
    .then((response)=> {
      console.log(response.data);
      this.setState({ loading: false, visible: false});

    })
    .catch(error => {
      console.log(error);
    })
    },  1000)

  }
  render() {
      return (
        <div>
        <link href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.css' rel='stylesheet' />
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css" type="text/css"/>
          {process.browser &&
          <Row>
            <Row type="flex" align="top" gutter={16}>
              <Col span={16} >
                <div style={{backgroundColor: "grey", height:"60vh"}}>
                    <Map updateCoor={this.updateCoor} getMapCoors={this.getMapCoors}/>
                  <Modal
                    title="Confirm"
                    visible={this.state.visible}
                    onOk={()=>this.trigger("dsaf")}
                    onCancel={this.hideModal}
                    okText="Confirm"
                    cancelText="Cancel"
                  >          
                  <Spin tip="Sending Coordinates" spinning={this.state.loading}>
                    <p>Calculate</p>
                  </Spin>
                  </Modal>          
                </div>
              </Col>
              <Col span={8}>
                <BankPanel data={this.state.data} trigger={this.showModal}/>
              </Col>
            </Row>
          <Divider />

          <Row gutter={32}>
            <Col span={12}>
            <h1 style={{backgroundColor:"rgba(0,0,0,0.05)"}}>Historical Estimated Yield</h1>
            </Col>
            <Col span={12}>
            <h1 style={{backgroundColor:"rgba(0,0,0,0.05)"}}>Extreme Weather Condition</h1>
            </Col>          
          </Row>

          <Row>
            <Col span={4} >
              <Npvi />
            </Col>
            <Col span={4}>
              <Yield/> 
            </Col>
            <Col span={4}>
              <Clasi/> 
            </Col>
            <Col span={12}>
              <Row>
              <Timeline/> 
              </Row>
              <Row>
              <Card style={{marginLeft: "20px", flex:"row", width:"90%"}}>
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
                 </Card>
              </Row>
            </Col>
          </Row>
          </Row>
          }
        </div>
      );
  }
}


export default () => (
  <SideLayout content={<Portal />} />
)
