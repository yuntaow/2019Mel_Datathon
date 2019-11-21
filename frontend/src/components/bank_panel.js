import "antd/dist/antd.css"
import * as React from 'react';
import { PureComponent } from 'react';
import {Button, Input, Icon, Statistic, Row, Col,Card,Select } from "antd"
// import { ScatterChart, Scatter,AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { connect } from "react-redux";

const { Option, OptGroup } = Select;


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
                <Select defaultValue="Loan" style={{ width: "100%", marginBottom: "10px"}}>
                <OptGroup label="Banking">
                  <Option value="Loan">Loan Tool</Option>
                  <Option value="Investment">Investment Tool</Option>
                </OptGroup>
                <OptGroup label="Land">
                  <Option value="Fertiliser">Fertiliser</Option>
                </OptGroup>
                </Select>
                </Row>
                <Row>
                <Card style={{marginBottom: "10px", flex:"row"}}>
                <Row gutter={16}>
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
                 <Card>
                  <div style={{ marginBottom: 16 }}>
                      <Input addonBefore="Land Size" addonAfter="m*m" defaultValue="110" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Input addonBefore="Soil quality" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Input addonBefore="Corps" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Input addonBefore="Quarter" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Input addonBefore="*" />
                    </div>
                    <Button type="dashed" icon="retweet" style={{marginRight: "10px"}}>
                      Reset
                    </Button>
                    <Button type="primary" icon="bulb" onClick={()=>this.props.trigger("what ever")}>
                      Calculate
                    </Button>
                  </Card>
           </Col>
    );
  }
}


const mapStateToProps = state => {
  console.log(state.mapcor)
  return {lat:state.mapcor.lat, lon:state.mapcor.lon}

};


export default connect(mapStateToProps)(BankPanel);