import Header from "../components/header.js"
// import Pie from "../components/piechart.js"
import "antd/dist/antd.less"
import * as React from 'react';
import "./index.css"
// import Map from "../components/mapbox"
import dynamic from 'next/dynamic';
import {Row, Col,Card } from "antd"
let bizcharts;
if (process.browser) {
  bizcharts = require('bizcharts');
}
const {Meta} = Card
const data = [
  { genre: 'Drug1', sold: 275, income: 2300 },
  { genre: 'Drug2', sold: 115, income: 667 },
  { genre: 'Drug3', sold: 120, income: 982 },
  { genre: 'Drug4', sold: 350, income: 5271 },
  { genre: 'Drug5', sold: 150, income: 3710 }
];

const cols = {
  sold: { alias: 'sales' },
  genre: { alias: 'drugs' }
};

const DynamicComponentWithNoSSR = dynamic(() => import("../components/mapbox"), {
    ssr: false
});


class Portal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {chart: null};
  }
  componentDidMount(){
  }
                  // <DynamicComponentWithNoSSR/>
  render() {
      return (
        <div>
          {process.browser &&
            <Row gutter={24} style={{height: "200px"}}>
            <Row type="flex" align="top" gutter={16}>
            <Col span={12} style={{ marginBottom: 24 }}>
                <Card>
                <Meta
                     className="CardType"
                    />
                    <bizcharts.Chart height={300} data={data} scale={cols} forceFit>
                    <bizcharts.Axis name="genre" />
                    <bizcharts.Axis name="sold" />
                    <bizcharts.Legend position="top"/>
                    <bizcharts.Tooltip />
                    <bizcharts.Geom type="interval" position="genre*sold" color="genre" />
                    </bizcharts.Chart>
                </Card>
              </Col>
              <Col span={12}>
              </Col>
              </Row>
            </Row>
          }
        </div>
      );
  }
}


export default () => (
  <Header content={<Portal />} />
)
