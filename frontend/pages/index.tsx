import Header from "../components/header.js"
import "antd/dist/antd.css"
import * as React from 'react';


class Portal extends React.Component {
  render() {
    return <h1>Hello</h1>;
  }
}



export default () => (
  <Header content={<Portal />} />
)
