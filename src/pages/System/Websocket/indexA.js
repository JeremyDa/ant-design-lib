import React from 'react';
import { Card } from 'antdlib';
import { Button } from 'antd';

export default class Example extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ws: null,
    };
  }

  // single websocket instance for the own application and constantly trying to reconnect.
  componentDidMount() {
    this.connect();
  }

  componentWillUnmount(){
    this.close();
  }

  timeout = 250; // Initial timeout duration as a class variable

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = () => {
    const ws = new WebSocket(`ws://localhost:8020/websocket/${localStorage.getItem('account')}`);
    const that = this; // cache the this
    let connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log('connected websocket main component');

      this.setState({ ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = e => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout += that.timeout; // increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); // call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = err => {
      console.error('Socket encountered error: ', err.message, 'Closing socket');

      ws.close();
    };

    ws.onmessage = (e) => {
      console.log(e.data);

      // {"messageType":1,"from":"account2","to":"all"}
      // messageType: 1-上线，2-下线，3-在线名单，4-消息
      // from: 发送方
      // to: 接收方，all-广播消息

      this.setState({
        message: [...(this.state.message||[]),JSON.parse(e.data)]
      });
    }
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); // check if websocket instance is closed, if so call `connect` function.
  };

  sendMessage=(data)=>{
    const {ws} = this.state // websocket instance passed as props to the child component.

    try {
        ws.send(data) // send data to the server
    } catch (error) {
        console.log(error) // catch error
    }
  }

  close = () => {
    const { ws } = this.state;
    try {
      ws.close();
    } catch (error) {
      console.log(error);
    }
  }

  render() {

    const { message} = this.state;
    return (
      <Card>
        <Button onClick={()=>this.sendMessage(JSON.stringify({message:'111',from:localStorage.getItem('account'),to:'admin'}))}>发送</Button>
        <Button onClick={()=>this.close()}>关闭</Button>
        {message && message.map(item=><div>{`${item.from }向${ item.to }${'发送了'}${item.message||''},${item.messageType}`}</div>)}
      </Card>
    );
  }
}
