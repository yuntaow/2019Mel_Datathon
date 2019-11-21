import React, { PureComponent } from 'react';
import { Treemap,PieChart,Pie } from 'recharts';
import {
  LineChart, ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { connect } from "react-redux";


class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/u702a3Lx/';

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
            <XAxis dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" barSize={20} fill="#413ea0" />
            </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const a1 = state.retrieveData.type_clustering
  var arr = [];
  for (var key in a1) {
      if (a1.hasOwnProperty(key)) {
          arr.push( [ key, a1[key] ] );
      }
  }
  
  return {data:arr.map(x => {return({name:x[0],amount:x[1]})})};

};

export default connect(mapStateToProps)(Example);
