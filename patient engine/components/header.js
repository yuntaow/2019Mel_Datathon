import { Layout, Menu, Icon } from 'antd';

const { Header, Sider, Content } = Layout;
import Link from 'next/link';


class Side extends React.Component {
  state = {
    collapsed: false,
    sele: null
  };

  changeSelection = (key)=> {
    this.setState({
      sele: key,
    });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      current
    });
  };


  render() {
    return (
      <Layout>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css" rel="stylesheet" />
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline"
          style={{height:"100vh"}}
          selectedKeys={[""]}>
            <Menu.Item key="/">
              <Link href="/">
              <div>
              <Icon type="dashboard" />
              <span> My Dashboard </span>
              </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="query">
              <Link href="/query">
              <div>
              <Icon type="bar-chart" />
              <span> Query </span>
              </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link href="/query">
              <div>
              <Icon type="eye" />
              <span> Search </span>
              </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link href="/reports">
              <div>
              <Icon type="file-pdf" />
              <span> Reports </span>
              </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link href="/support">
              <div>
              <Icon type="team" />
              <span> Support </span>
              </div>
              </Link>
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
            <span style={{fontSize: "20px", marginLeft: "1%"}}> Patitent Insight Engine </span>

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

export default Side
