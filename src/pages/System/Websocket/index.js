import React from 'react';
import { Card,Button,websocket } from 'antdlib';

const { connect, sendMessage, close} = websocket;

export default class Example extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ws: null,
      options : {
        url:`ws://localhost:8020/websocket/${localStorage.getItem('account')}`,
        reconnect:true,
        callback:(ws)=>{this.setState({ws})},
        timeout:250, // 连接超时
        showTime:5000 // 通知显示时长
      }
    };
  }

  componentDidMount() {
    this.setState({ws:connect(this.state.options)});
  }

  componentWillUnmount(){
    close(this.state.ws);
  }

  render() {
    const { ws} = this.state;
    return (
      <Card>
        <Button onClick={()=>sendMessage(ws,{title:'title',body:'body',from:'admin',to:'admin',tag:Math.random(100)})}>发送</Button>
        <Button onClick={()=>close(ws)}>关闭</Button>
      </Card>
    );
  }
}
