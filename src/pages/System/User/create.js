import { Button, Col, message, Row, SmartForm, ajax } from 'antdlib';
import { connect } from 'dva';
import md5 from 'md5';
import React from 'react';

@connect(({ content, loading }) => ({
  content,
  loading: loading.models.content,
}))
export default class Example extends React.PureComponent {

  constructor(props){
    super(props);
    const { record } = props;
    this.state = {
      confirmDirty: false,
      formLayout: 'horizontal', // horizontal, inline,vertical
      cols: 1,
      record
    }
  }

  componentDidMount(){
    this.searchRole();

    this.formComp.setFieldsValue({...this.props.record});
  }

  searchRole = ()=> {
    ajax({
        url: `kv/role.selectByPrimaryKey`,
        key: 'id',       // key名称 
        value: 'name',   // value名称
        retKey: 'roleKV', // 表名称
    });
  }

  getFields = ()=>{
    const {record} = this.props;
    const { menuData,roleKV } = this.props.content;
    return [
      {type:'input',disabled:record && true,placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:30,message:'最多30个字符'}],field:'account',label:'登录名'},
      {type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:30,message:'最多30个字符'}],field:'name',label:'名称'},
      {type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:11,message:'最多11个字符'}],field:'phone',label:'联系方式'},
      {type:'select',placeholder:'请选择',rules:[{required:true,message:'请选择',}],field:'roleid',label:'角色',options:roleKV && roleKV.tv||[]},
      (!record || record.account !== 'admin') && {
        type: 'password',
        label: '密码',
        field: 'password',
        placeholder:'请输入',
        rules:[{max:100,message:'最多100个字符'}],
        validator: this.validateToNextPassword,
      } ,
      (!record || record.account !== 'admin') &&  {
        type: 'confirmpassword',
        label: '确认密码',
        field: 'confirmpassword',
        placeholder:'请输入',
        rules:[ {max:100,message:'最多100个字符'}],
        validator: this.compareToFirstPassword,
        onBlur: this.handleConfirmBlur, // 加上该参数，第一次输入密码onBlur时，不会校验confirmpassword,
      } ,
    ]
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {

    if(!value && this.formComp.getFieldValue('password')){
      callback('请输入');
    }

    if (value && value !== this.formComp.getFieldValue('password')) {
      callback('密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {

    if(!value){
      this.formComp.validateFields(['confirmpassword'], { force: false }); 
    }

    if (value && (this.state.confirmDirty || this.formComp.getFieldValue('confirmpassword'))) {
      this.formComp.validateFields(['confirmpassword'], { force: true }); 
    }
    callback();
  };

  refForm = ref => {
    this.formComp = ref.getForm();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.formComp.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      this.handleInsert(fieldsValue);
      
    });
  }

  handleInsert = (fields) => {
    const { record } = this.props;

    ajax({
        ...fields,
        password: fields.password && md5(fields.password) || null,
        id: record && record.id,
        acountRef: fields.account,
        url: record && `user.updateByPrimaryKeySelective`|| `user.insertSelective`, // 通用写法
      },
      ()=>{
        
        message.success(record && '修改成功'||'创建成功');
        this.formComp.resetFields();

        const { onSuccess } = this.props;
        onSuccess && onSuccess();
    });
  }

  render(){
    const {formLayout,cols} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      }
    }

    return (
      <div>
        <SmartForm 
          formItemLayout={formItemLayout}
          onRef={this.refForm}
          onSubmit={this.handleSubmit}
          cols={cols}
          formLayout={formLayout}
          fields={this.getFields()}
        >
          <Row span={24} gutter={16}>
            <Col span={2} offset={5}>
              <Button type="primary" htmlType="submit">提交</Button>
            </Col>
          </Row>
        </SmartForm>
      </div>
    )
  }
}