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
        <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{height:"115vh"}}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="2">
              <Icon type="dashboard" />
              <span> Banking/Investor </span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="team" />
              <span> About team </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', paddingLeft: "20px" }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <span style={{fontSize: "20px", marginLeft: "1%"}}> Satellite Intelligence</span>
            <span style={{fontSize: "15px", float: "right"}}> 
            Read Story 
            <Link to="/intro">
            <Button style={{marginLeft:"5px"}} shape="circle">
            <Icon type="read" />
            </Button>
            </Link>
            </span>

          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            {this.props.content}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default SideLayout
