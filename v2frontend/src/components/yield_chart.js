import React, { PureComponent } from 'react';
import {
  LineChart, ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { connect } from "react-redux";


class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';

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
            <Area type="monotone" dataKey="yield" fill="#8884d8" stroke="#8884d8" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const a1 = state.retrieveData.predicted_yield_list
  const a2 = state.retrieveData.date_list
  const result = a1.map((item,index) => {return [item,a2[index]]})
  return {data:result.map(x => {return({yield:x[0],date:x[1]})}) };

};

export default connect(mapStateToProps)(Example);