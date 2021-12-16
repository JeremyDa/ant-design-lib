

import { Button, Card, Modal, Popconfirm,SmartTable,ajax } from 'antdlib';
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
    ajax({
      url:'role.selectByPrimaryKey',
      listKey:'role',
      ...params,
    });
  }

  handleDelete = record => {

    if (!record) return;
    ajax({
        url: `role/role.deleteByPrimaryKey`,
        ...record
      },
      ()=>{
        this.handleSearch()
    });
  };

  getColumns = () => {
    return [
      {title:'角色名称',dataIndex:'name'},
      {title:'说明',dataIndex:'desc'},
      {title:'操作',align:'center',dataIndex:'',
        render: (text, record,index) => (
          <Fragment>
            <a style={{marginRight:'8px'}} onClick={() => {this.setState({visible:true,record});console.log('record:',record)}}>修改</a>
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
      <Card bordered={false}>
        <div style={{display:'flex',justifyContent:'center'}}>
          <div style={{width:'50%'}}>
            <Button icon='plus' style={{marginBottom:'8px'}} onClick={()=>this.setState({visible:true,record:undefined})}>新建</Button>
            <SmartTable
              bordered
              loading={this.props.loading}
              data={this.props.content.role||{}}
              columns={this.getColumns()}
              handleChange={(params)=>this.handleSearch(params)}
            />
          </div>
        </div>
        <Modal
          title='编辑角色'
          visible={this.state.visible}
          onCancel={()=>this.setState({visible:false})}
          width='60%'
          footer={null}
          destroyOnClose
        >
          <Create record={this.state.record} onSuccess={()=>{this.setState({visible:false});this.handleSearch();}} />
        </Modal>
      </Card>
    )
  }

}

