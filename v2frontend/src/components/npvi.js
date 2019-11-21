import React, { PureComponent } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { connect } from "react-redux";

{/* <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
<Bar dataKey="pv" barSize={20} fill="#413ea0" /> */}
class npvi extends PureComponent {
  static jsfiddleUrl = '//jsfiddle.net/alidingling/9wnuL90w/';

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <ComposedChart
            width={200}
            height={400}
            data={this.props.data}
            margin={{
              top: 20, right: 0, bottom: 20, left: -10,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <YAxis />
            <XAxis dataKey="date" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ndvi" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
  


const mapStateToProps = state => {
  console.log("location",state.retrieveData);

  const a1 = state.retrieveData.mean_ndvi_list
  const a2 = state.retrieveData.date_list
  const result = a1.map((item,index) => {return [item,a2[index]]})
  return {data:result.map(x => {return({ndvi:x[0],date:x[1]})}) };
};

export default connect(mapStateToProps)(npvi);
