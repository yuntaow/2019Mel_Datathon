
import classes from './components/panel.module.css';
import SideLayout from "./components/Layout"
import "antd/dist/antd.css"
import * as React from 'react';
import Map from "./components/mapbox"
import Npvi from "./components/npvi"
import Yield from "./components/yield_chart"
import Clasi from "./components/classification"
import Timeline from "./components/timeline"
import { connect } from "react-redux";
import {message, Divider, Spin, Alert, Modal, Button, Input, Icon, Statistic, Row, Col,Card,Select } from "antd"
import BankPanel from "./components/panel"
import {  openModal, retrieveData} from "./redux/actions";

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
    this.state = { visible: false,
      loading: false, 
      chart: null,
      data:null};
  }


  updateCoor = (new_data) => {
    this.setState({
      data : new_data
    })
  }

  getMapCoors = (lon, lat) =>  {
    return [lon,lat]
  }

  showModal = () => {
    this.setState({ loading: false  });
    this.setState({
      visible: true,
    });
    console.log(this.state.data)
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
    this.props.openModal(false)
  };

  trigger = (coordinates) =>  {
    console.log(this.props.poly.flat())
    this.setState({ loading: true  });
    setTimeout( ()=>{
    axios.post('http://167.172.64.47:5000/yield_estimation', {
      "ratoonStartDate" : "2017-09-23",
      "harvestStartDate" : "2017-11-15",
      "latlonlist": this.props.poly.flat(),
    })
    .then((response)=> {
      console.log(response.data);
      this.setState({ loading: false, visible: false});
      if (response.data["errorCode"] == 1){
        console.log("Error in the backend")
        message.error('No sugarcane in selected area');
        this.props.openModal(false)
        this.setState({
          visible: false,
        });

      }
      else{
        this.props.retrieveData(response.data)
        this.props.openModal(false)

        this.setState({
          visible: false,
        });
        message.success('Success');
      }
    })
    .catch(error => {
      console.log(error);
    })
    },  1000)

  }
  render() {
    const { modal } = this.props
    if (modal && !this.state.visible) {
      this.showModal()
    }

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
                  {<Modal
                    title="Confirm"
                    visible={this.state.visible}
                    onOk={()=>this.trigger("dsaf")}
                    onCancel={this.hideModal}
                    okText="Confirm"
                    cancelText="Cancel"
                  >          
                  <Spin tip="Sending Coordinates" spinning={this.state.loading}>
                    <p>Do you want to generate statisitcs for the selected area? (this might take up to 30 seconds)</p>
                  </Spin>
                  </Modal> }         
                </div>
              </Col>
              <Col span={8}>
                <BankPanel data={this.state.data} trigger={this.showModal}/>
              </Col>
            </Row>
          <Divider />

          <Row gutter={32}>
            <Col span={12}>
            <h1 className={classes.panelTitle}>Historical Estimated Yield</h1>
            </Col>
            <Col span={12}>
            <h1 className={classes.panelTitle}>Extreme Weather Condition</h1>
            </Col>          
          </Row>

          <Row gutter={32}>
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
              <Row style={{marginLeft: "20px", flex:"row", width:"90%"}}>
                <Row gutter={8}>
                <Col span={12}>
                 <Statistic
                   title="Flood Effect"
                   value={0}
                   precision={2}
                   valueStyle={{ color: '#EE3936',fontWeight: "600"  }}
                   prefix={<Icon type="caret-up" />}
                   suffix="%"
                   style={{padding:"10px",backgroundColor:'rgba(0,0,0,0.05)'}}

                 />
                 </Col>
                   <Col span={12}>
                 <Statistic
                   title="Drought Effect"
                   value={0}
                   precision={2}
                   valueStyle={{ color: '#EE3936' ,fontWeight: "600" }}
                   prefix={<Icon type="caret-down" />}
                   suffix="%"
                   style={{padding:"10px", backgroundColor:'rgba(0,0,0,0.05)'}}
                 />
                 </Col>
                 </Row>
                 </Row>
              </Row>
            </Col>
          </Row>
          </Row>
          }
        </div>
      );
  }
}


const mapStateToProps = state => {
  console.log("modal",state.mapcor);
  return { modal: state.mapcor.modal, poly:state.mapcor.poly}
};

const Portal2 = connect(mapStateToProps,{openModal,retrieveData})(Portal)

export default () => <SideLayout content={<Portal2 />} />
