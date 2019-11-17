import Header from "../components/header.js"
import "antd/dist/antd.css"
import * as React from 'react';
import Map from "../components/mapbox"
import dynamic from 'next/dynamic';
import {Row, Col,Card } from "antd"
let bizcharts;
if (process.browser) {
  bizcharts = require('bizcharts');
}

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
            <Row type="flex" align="top" gutter={32}>
              <Col span={18} >
                <div style={{s backgroundColor: "grey"}}>
                  <Map />
                </div>
              </Col>
              <Col span={6}>
              <Card>
                  <bizcharts.Chart data={data} scale={cols} forceFit>
                  <bizcharts.Axis name="genre" />
                  <bizcharts.Axis name="sold" />
                  <bizcharts.Legend position="top" dy={-20} />
                  <bizcharts.Tooltip />
                  <bizcharts.Geom type="interval" position="genre*sold" color="genre" />
                  </bizcharts.Chart>
              </Card>
              </Col>
              </Row>
          }
        </div>
      );
  }
}


export default () => (
  <Header content={<Portal />} />
)
