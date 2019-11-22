
import classNamees from './components/panel.module.css';
import SideLayout from "./components/Layout"
import "antd/dist/antd.css"
import * as React from 'react';
import "./team.css"
import { Skeleton, Switch, Card, Icon, Avatar } from 'antd';
import logo from './assets/team.PNG';

const axios = require('axios');
const { Meta } = Card;


class Portal extends React.Component {
    state = {
        loading: false,
      };

      onChange = checked => {
        this.setState({ loading: !checked });
      };

      render() {
        const { loading } = this.state;

        return (
          <div>
          <div style={{display:"flex", flexWrap:'wrap'}}>
            <Card
              style={{ margin:"10px",width: 500, marginTop: 16 }}
              actions={[
                <Icon type="linkedin" key="setting" onClick={()=>{window.open("https://www.linkedin.com/in/victoria-zhang/")}} />,
              ]}
            >
                <Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title="Victoria"
                  description="I am a business/market analyst."
                />
            </Card>
            <Card
              style={{ margin:"10px",width: 500, marginTop: 16 }}
              actions={[
                <Icon type="linkedin" key="setting" onClick={()=>{window.open("https://www.linkedin.com/in/cedric-le-mercier/")}} />,
              ]}
            >
                <Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title="Cedric"
                  description="i am a designer."
                />
            </Card>
            <Card
              style={{ margin:"10px",width: 500, marginTop: 16 }}
              actions={[
                <Icon type="linkedin" key="setting" onClick={()=>{window.open("")}} />,
              ]}
            >
                <Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title= "Alan"
                  description="I am a data engineer."
                />
            </Card>
            <Card
              style={{ margin:"10px",width: 500, marginTop: 16 }}
              actions={[
                <Icon type="linkedin" key="setting" onClick={()=>{window.open("")}} />,
              ]}
            >
                <Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title="Steven"
                  description="I am a geo/satellite expert."
                />
            </Card>
            <Card
              style={{ margin:"10px",width: 500, marginTop: 16 }}
              actions={[
                <Icon type="linkedin" key="setting" onClick={()=>{window.open("https://www.linkedin.com/in/timothy-wang-yt/")}} />,
              ]}
            >
                <Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title="Timothy"
                  description="I am a software engineer."
                />
            </Card>
          </div>
          <div style={{marginRight:"auto",marginLeft:"auto",display:"block",width:"40%"}}><img src={logo} style={{height:"300px",margin:"16px"}}/></div>

          </div>

        );
      }
}




export default () => <SideLayout content={<Portal />} />
