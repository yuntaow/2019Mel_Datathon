
import classNamees from './components/panel.module.css';
import SideLayout from "./components/Layout"
import "antd/dist/antd.css"
import * as React from 'react';
import "./team.css"
import { Skeleton, Switch, Card, Icon, Avatar } from 'antd';

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
          <div style={{display:"flex", flexWrap:'wrap'}}>
              

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
                  title="Victoria"
                  description=""
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
                  title="Cedric"
                  description=""
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
                  title= "Alan"
                  description=""
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
                  title="Steven"
                  description=""
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
                  description="I am a software engineer;"
                />
            </Card>  
          </div>
        );
      }
}




export default () => <SideLayout content={<Portal />} />
