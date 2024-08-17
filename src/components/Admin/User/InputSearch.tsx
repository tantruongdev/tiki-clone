import { Button, Col, Form, Input, Row, Select, Space } from 'antd';


interface InputSearchProps {
  handleFilter: (filterQuery: string) => void;
}

interface InputSearchForm {
  fullName?: string,
  email?: string,
  phone?: string
}
const InputSearch: React.FC<InputSearchProps> = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values: InputSearchForm) => {
    let query = "";
    if (values.fullName) {
      query += `fullName=/${values.fullName}/i&`
    }

    if (values.email) {
      query += `email=/${values.email}/i&`;
    }

    if (values.phone) {
      query += `phone=/${values.phone}/i&`;
    }
    // props.handleFilter(query);
    if (query) {
      props.handleFilter(query);
    }



  };

  const onReset = () => {
    form.resetFields();
  };


  return (
    <Form
      // {...layout}
      layout='vertical'
      form={form}
      name="control-hooks"
      onFinish={onFinish}

    >
      <Row gutter={[20, 20]}>
        <Col span={8}>
          <Form.Item name="fullName" label="Tên hiển thị" >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="email" label="Email" >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="phone" label="Số điện thoại" >
            <Input />
          </Form.Item>
        </Col>

      </Row>
      <Row justify='end'>
        <Col  >
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Clear
              </Button>
            </Space>
          </Form.Item></Col>
      </Row>

    </Form >
  );
};

export default InputSearch;