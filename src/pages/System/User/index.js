

import { Avatar, Button, Card, Modal, Popconfirm, SmartTable,ajax } from 'antdlib';
import { connect } from 'dva';
import React, { Fragment } from 'react';
import defaultAvatar from '../../../../public/user.png';
import Create from './create';

@connect(({ content, loading }) => ({
  content,
  loading: loading.models.content,
}))
export default class Example extends React.PureComponent {

  state={
    visible:false,
  }

  componentDidMount(){
    this.handleSearch();
    this.searchRole();
  }

  handleSearch = (params={})=> {
    ajax({
        url:'user.selectByPrimaryKey',
        listKey:'user',
        showAll:true,
        roleid: 3,
        ...params
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });

  }

  searchRole = ()=> {
    ajax({
        url: `kv/role.selectByPrimaryKey`,
        key: 'id',       // key名称 
        value: 'name',   // value名称
        retKey: 'roleKV', // 表名称
    });
  }

  handleDelete = record => {

    if (!record) return;
    ajax({
        url: `user.deleteByPrimaryKey`,
        ...record
      },
      ()=>{
        this.handleSearch()
    });
  };

  getColumns = () => {
    const { roleKV } = this.props.content;
    return [
      {title:'登录名',dataIndex:'account'},
      {title:'名称',dataIndex:'name'},
      {title:'头像',align:'center',dataIndex:'avatar',render:(val,record)=><Avatar src={val||defaultAvatar} />},
      {title:'角色',dataIndex:'roleid',render: (val,record) => val && roleKV && roleKV.kv[val]},
      {title:'联系方式',dataIndex:'phone'},
      {title:'操作',align:'center',dataIndex:'',
        render: (text, record, index) => (
          <Fragment>
            <a style={{marginRight:'8px'}} onClick={() => this.setState({visible:true,record})}>修改</a>
            <Popconfirm title="确认删除吗?" onConfirm={()=>this.handleDelete(record)}>
              {index > 0 && <a style={{marginRight:'8px'}} href="">删除</a>}
            </Popconfirm>
          </Fragment>
        ),
      },

    ]
  }

  render(){
    return (
      <Card>
        <Button type="primary" style={{marginBottom:'8px'}} onClick={()=>this.setState({visible:true,record:undefined})}>创建</Button>
        <SmartTable
          bordered
          loading={this.props.loading}
          data={this.props.content.user||{}}
          columns={this.getColumns()}
          handleChange={(params)=>this.handleSearch(params)}
        />
        <Modal
          title='编辑用户'
          visible={this.state.visible}
          onCancel={()=>this.setState({visible:false})}
          width='40%'
          footer={null}
          destroyOnClose
        >
          <Create record={this.state.record} onSuccess={()=>{this.setState({visible:false});this.handleSearch();}} />
        </Modal>
      </Card>
    )
  }

}

