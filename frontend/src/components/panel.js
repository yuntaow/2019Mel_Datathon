import "antd/dist/antd.css";
import * as React from "react";
import { PureComponent } from "react";
import {
  List,
  Typography,
  Table,
  Divider,
  Tag,
  Button,
  Input,
  Icon,
  Statistic,
  Row,
  Col,
  Card,
  Select
} from "antd";
// import { ScatterChart, Scatter,AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { connect } from "react-redux";

// Import CSS from CSS module
import classes from "./panel.module.css";
import australia from "../assets/australia.png";
import korea from "../assets/korea.png";
import indonesia from "../assets/indonesia.png";
import malaysia from "../assets/malaysia.png";
import thai from "../assets/thailand.png";
import { bearingToAngle } from "@turf/helpers";

const data = ["Australia", "Korea", "Indonesia", "Malaysia", "Thailand"];

class BankPanel extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  getCountry = country => {
    switch (country) {
      case "Australia":
        return australia;
      case "Korea":
        return korea;
      case "Indonesia":
        return indonesia;
      case "Malaysia":
        return malaysia;
      case "Thailand":
        return thai;
      default:
        return null;
    }
  };

  getPrice = country => {
    switch (country) {
      case "Australia":
        return 0.82;
      case "Korea":
        return 0.83;
      case "Indonesia":
        return 0.84;
      case "Malaysia":
        return 0.6;
      case "Thailand":
        return 0.5;
      default:
        return 0.82;
    }
  };

  render() {
    return (
      <Col>
        <Row>
          <h1 className={classes.panelTitle}>Location</h1>
          <p className={classes.location}>
            {this.props.lon == 0
              ? "None"
              : this.props.lon + "," + this.props.lat}
          </p>
          <h1 className={classes.panelTitle}>Current Sugar Price</h1>
          <List
            className={classes.list}
            bordered
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Typography.Text>
                  {/* <Icon type="reddit" /> */}
                  <img className={classes.countryFlag} src={this.getCountry( item )} />
                </Typography.Text>
                {item}
            <span style={{ float: "right" }}>${this.getPrice(item)}</span>
              </List.Item>
            )}
          />
          <h1 className={classes.panelTitle}>Prediction</h1>
          <div
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              flex: "row",
              width: "90%"
            }}
          >
            <Row gutter={8}>
              <Col span={12}>
                <Statistic
                  title="Estimated Sugar Volume "
                  value={this.props.tons}
                  precision={2}
                  valueStyle={{ color: "#6CD56D", fontWeight: "600" }}
                  prefix={<Icon type="caret-up" />}
                  suffix="t"
                  style={{padding:"10px",backgroundColor:'rgba(0,0,0,0.05)'}}

                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Estimated Sugar Content "
                  value={this.props.content}
                  precision={2}
                  valueStyle={{ color: "#6CD56D", fontWeight: "600" }}
                  prefix={<Icon type="caret-down" />}
                  suffix="t"
                  style={{padding:"10px",backgroundColor:'rgba(0,0,0,0.05)'}}

                />
              </Col>
            </Row>
          </div>
          <div
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              flex: "row",
              width: "90%"
            }}
          >
            <Row gutter={8}>
              <Col span={12}>
                <Statistic
                  title="Estimated Yield"
                  value={this.props.ey}
                  precision={2}
                  valueStyle={{ color: "#6CD56D", fontWeight: "600" }}
                  prefix={<Icon type="caret-up" />}
                  suffix="t/ha"
                  style={{padding:"10px",backgroundColor:'rgba(0,0,0,0.05)'}}

                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Estimated Revenue"
                  value={this.props.rev/100}
                  precision={2}
                  valueStyle={{ color: "#6CD56D", fontWeight: "600" }}
                  prefix={<Icon type="caret-down" />}
                  suffix="$AUD"
                  style={{padding:"10px",backgroundColor:'rgba(0,0,0,0.05)'}}

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
  console.log("location",state.retrieve);

  const ey = state.retrieveData.estimated_yield
  const rev = state.retrieveData.revenue
  const tons = state.retrieveData.estimated_tons
  const content = state.retrieveData.sugar_content
  return { lon:state.mapcor.lon, lat:state.mapcor.lat, ey:ey, rev:rev, tons:tons, content:content};
};

export default connect(mapStateToProps)(BankPanel);
