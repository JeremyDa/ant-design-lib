

import { Button, Card, Modal, Popconfirm,SmartTable } from 'antdlib';
import { connect } from 'dva';
import React, { Fragment } from 'react';
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
  }

  handleSearch = (params={})=> {
    const {dispatch} = this.props;
    dispatch({
      type:'content/fetch',
      payload:{
        url:'role.selectByPrimaryKey',
        listKey:'role',
        ...params,
      }
    });
  }

  handleDelete = record => {
    const { dispatch } = this.props;

    if (!record) return;
    dispatch({
      type: 'content/fetch',
      payload: {
        url: `role/role.deleteByPrimaryKey`,
        ...record
      },
      callback: ()=>{
        this.handleSearch()
      }
    });
  };

  getColumns = () => {
    return [
      {title:'角色名称',dataIndex:'name'},
      {title:'说明',dataIndex:'desc'},
      {title:'操作',align:'center',dataIndex:'',
        render: (text, record,index) => (
          index > 0 && <Fragment>
            <a style={{marginRight:'8px'}} onClick={() => this.setState({visible:true,record})}>修改</a>
            <Popconfirm title="确认删除吗?" onConfirm={()=>this.handleDelete(record)}>
              <a style={{marginRight:'8px'}} href="">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },

    ]
  }

  render(){
    return (
      <Card>
        <Button type="primary"  style={{marginBottom:'8px'}}  onClick={()=>this.setState({visible:true,record:undefined})}>创建</Button>
        <SmartTable bordered
          loading={this.props.loading}
          data={this.props.content.role||{}}
          columns={this.getColumns()}
          handleChange={(params)=>this.handleSearch(params)}
        />
        <Modal
          title='编辑角色'
          visible={this.state.visible}
          onCancel={()=>this.setState({visible:false})}
          width='60%'
          footer={null}
          destroyOnClose={true}
          >
          <Create record={this.state.record} onSuccess={()=>{this.setState({visible:false});this.handleSearch();}} />
        </Modal>
      </Card>
    )
  }

}

