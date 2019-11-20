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
                <span style={{ float: "right" }}>$10</span>
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
                  title="Production"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#6CD56D", fontWeight: "600" }}
                  prefix={<Icon type="caret-up" />}
                  suffix="%"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Land Utilisation"
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#EE3936", fontWeight: "600" }}
                  prefix={<Icon type="caret-down" />}
                  suffix="%"
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
                  title="Production"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#6CD56D", fontWeight: "600" }}
                  prefix={<Icon type="caret-up" />}
                  suffix="%"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Land Utilisation"
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#EE3936", fontWeight: "600" }}
                  prefix={<Icon type="caret-down" />}
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
  console.log(state.mapcor);
  return { lat: state.mapcor.lat, lon: state.mapcor.lon };
};

export default connect(mapStateToProps)(BankPanel);
