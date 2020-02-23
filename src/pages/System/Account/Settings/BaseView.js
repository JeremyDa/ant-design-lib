import { Button, Col, message, Row, SmartForm } from 'antdlib';
import { connect } from 'dva';
import React, { Component } from 'react';
import { domain } from '@/domain';
import defaultAvatar from '../../../../../public/user.png';
import styles from './BaseView.less';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class BaseView extends Component {
  
  getFields = () => {
    const { currentUser:{name,phone,avatar} } = this.props; 
    return [
      {type: 'input',placeholder: '请输入',field: 'name',initialValue:name,  label:'名称',},
      {type: 'input',placeholder: '请输入',field: 'phone',initialValue:phone,  label:'联系方式',},
      {type: 'avatar',placeholder: '请输入',field: 'avatar',label:'头像', defaultAvatar,
      domain,
      buttonText:'选择图片' ,
      uploadParam:{account:localStorage.getItem('account')},
      uploadUrl:'api/uploadFile' ,
      avatar,
      onSuccess:(file)=>this.uploadSuccess(file),
      headers:{token:localStorage.getItem('token')}
      },
    ]
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {currentUser} = this.props;
    this.formComp.getForm().validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          dispatch,
        } = this.props;
        dispatch({
          type: 'content/fetch',
          payload: {
            url:'user.updateByPrimaryKeySelective',
            ...values,
            id: currentUser.id,
            avatar:this.state && this.state.avatar,
          },
          callback: () => {
            message.success('修改成功');
            this.currentUser();
          },
        });
      }
    });
    
  };

  currentUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  };

  refForm = ref => {
    this.formComp = ref;
  }

  uploadSuccess = ( fileObj ) => {
    this.setState({
      avatar:fileObj.url
    });
  }

  render() {

    return (
      <div className={styles.baseView}>
        <div className={styles.left} style={{paddingLeft:'120px'}}>

          <SmartForm 
            onRef={this.refForm}
            onSubmit={this.handleSubmit}
            formLayout='horizontal'
            fields={this.getFields()}
          >
            <Row span={24} gutter={16}>
              <Col span={2} offset={5}>
                <Button type="primary" htmlType="submit">修改</Button>
              </Col>
            </Row>
          </SmartForm>
        </div>
      </div>
    );
  }
}

export default BaseView;
