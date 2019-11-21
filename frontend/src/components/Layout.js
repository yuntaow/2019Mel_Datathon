import logo from '../assets/logo-default.png';
import classes from './Layout.module.css';
import { Layout, Menu, Icon, Button} from 'antd';
import React from "react"
import "antd/dist/antd.css"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const { Header, Sider, Content } = Layout;


class SideLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css" rel="stylesheet" />
        <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{height:"100vh", backgroundColor: '#fff', borderRight: '2px solid #EAE9EE'}}>
          <div style={{marginRight:"auto",marginLeft:"auto",display:"block",width:"50%"}}><img src={logo} style={{maxHeight:"50px", margin:"16px"}}/></div>
          <Menu theme="light" mode="inline" defaultSelectedKeys={['0']} style={{backgroundColor: '#fff', fontWeight: '600', color: '#9A99B0', borderRight: '0'}}>
          
          <Menu.Item key="2">
             <Link to="/dashboard">
              <Icon type="dashboard" />
              <span> Dashboard </span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
            <Link to="/team">
              <Icon type="team" />
              <span> Team </span>
            </Link>
            </Menu.Item>

            <div style={{marginTop:"70vh", marginLeft:"30px", position:"absolute",  padding:"15px", borderStyle:"dotted"}}>
            <Link to="/intro">

            <Icon type="read" />
            <span style={{paddingLeft:"10px"}}>Read Story</span>
            </Link>
            </div>


          </Menu>
        </Sider>
        <Layout>
          <div style={{height:"100vh", padding:"10px"}}>
          <Content
            style={{
              padding: 24,
              background: '#fff',
              Height: "100vh",
            }}
          >
            {this.props.content}
          </Content>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default SideLayout
