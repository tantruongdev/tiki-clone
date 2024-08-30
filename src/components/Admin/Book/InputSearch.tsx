import { Button, Col, Form, Input, Row, Space } from 'antd';


interface InputSearchProps {
  handleFilter: (filterQuery: string) => void;
}

interface InputSearchForm {
  mainText?: string,
  author?: string,
  category?: string
}
const InputSearch: React.FC<InputSearchProps> = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values: InputSearchForm) => {
    let query = "";
    if (values.mainText) {
      query += `mainText=/${values.mainText}/i&`
    }

    if (values.author) {
      query += `author=/${values.author}/i&`;
    }

    if (values.category) {
      query += `category=/${values.category}/i&`;
    }

    if (query) {
      props.handleFilter(query);
    }
  };

  const onReset = () => {
    form.resetFields();
  };


  return (
    <Form
      layout='vertical'
      form={form}
      name="control-hooks"
      onFinish={onFinish}
    >
      <Row gutter={[20, 20]}>
        <Col span={8}>
          <Form.Item name="mainText" label="Tên sách" >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="author" label="Tên tác giả" >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="category" label="Thể loại" >
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