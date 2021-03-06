import { connect } from 'dva';
import React, { Component } from 'react';
import { messageCountdown,ModifyPassword,ajax  } from 'antdlib';
import md5 from 'md5';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class SecurityView extends Component {

  handleSubmit = (values) => {
    
    const { currentUser } = this.props;
    ajax({
        url: 'login.user.modifyPassword',
        ...values,
        id:currentUser.id,
        oldpassword: md5(values.oldpassword),
        password:  md5(values.password),
      },
      ()=>{
        messageCountdown({duration:3,interval:1,data:`密码修改成功,将在count后重新登录`,callback:this.logout});
    });
  }

  logout = ()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'login/logout',
    });
  }

  render() {
    
    return (
      <div style={{paddingTop:'12px'}}>
        <ModifyPassword submit={this.handleSubmit} />
      </div>
    );
  }
}

export default SecurityView;
