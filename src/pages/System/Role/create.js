import { Button, Col, message, Row, SmartForm } from 'antdlib';
import { connect } from 'dva';

@connect(({ content, loading }) => ({
  content,
  loading: loading.models.content,
}))
export default class Example extends React.PureComponent {

  constructor(props){
    super(props);
    const { record } = props;
    this.state = {
      menuidList: record && record.menuidList.split(',')||[],
      formLayout: 'horizontal', // horizontal, inline
      cols: 1,
    }
  }

  componentDidMount(){
    this.searchMenu();

    console.log('record:',this.props.record);
    this.formComp.setFieldsValue({...this.props.record});
  }

  searchMenu = ()=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'content/fetch',
      payload: {
        url: `menu/role.selectByPrimaryKey`,
        childName: 'children',
        listKey: 'menuData',
      }
    });
  }

  getFields = ()=>{
    const { menuData } = this.props.content;
    return [
      {type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:15,message:'最多15个字符'}],field:'name',label:'角色名称'},
      {type:'input',placeholder:'请输入',rules:[{required:true,message:'请输入',},{max:30,message:'最多30个字符'}],field:'desc',label:'说明'},
      {
        type:'tree',
        field:'menuidList',
        label:'菜单',
        checkedKeys:this.state.menuidList||[],
        onCheck:(checkedKeys, info)=>this.onCheck(checkedKeys, info),
        data:menuData
      },
    ]
  }

  onCheck = (checkedKeys, info) => {
    this.setState({
      menuidList: checkedKeys,
    });
  }

  refForm = ref => {
    this.formComp = ref.getForm();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.formComp.validateFields((err, fieldsValue) => {
      if (err) return;

      this.handleInsert(fieldsValue);
      
    });
  }

  handleInsert = (fields) => {
    const { dispatch,record } = this.props;
    const { menuidList } = this.state;
    if(!menuidList || menuidList.length == 0){
      message.warning('请选择菜单');
      return;
    }

    dispatch({
      type: 'content/fetch',
      payload: {
        ...fields,
        id: record && record.id,
        url: record && `role/role.updateByPrimaryKeySelective`|| `role/role.insertSelective`, // 特殊写法，一次请求是一个事务，根据后台url配置
        menuidList,
      },
      callback: ()=>{
        
        message.success(record && '修改成功'||'创建成功');
        this.formComp.resetFields();
        this.setState({
          menuidList: undefined,
        });

        const { onSuccess } = this.props;
        onSuccess && onSuccess();
      }
    });
  }

  render(){

    const {formLayout,cols} = this.state;

    return (
      <div>
        <SmartForm 
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