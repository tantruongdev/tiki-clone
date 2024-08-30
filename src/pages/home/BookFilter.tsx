import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Divider, InputNumber, notification, Row, Form, Rate, Flex } from 'antd';
import { Checkbox } from 'antd';
import type { GetProp } from 'antd';
import { useEffect, useState } from 'react';
import { fetchCategory } from '../../services/bookService';

function BookFilter(props) {
  const { filter, setFilter } = props;
  const [cateFilter, setCateFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const onChange: InputNumberProps['onChange'] = (value) => {
    console.log('changed', value);
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetchCategory();
      if (res && res.data) {
        setCategories(res.data);
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message ? res.message : 'An error occurred',
          placement: 'topRight',
          duration: 5,
          showProgress: true,
        });
      }
    };
    fetchCategories();
  }, []);

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);

    if (values.range.from && values.range.to) {
      let queryFilter = `price>=${values.range.from}&price<=${values.range.to}&`;
      if (values.category && values.category.length > 0) {
        const filter = values.category.join(',');
        queryFilter += `category=${filter}&`;
      }
      setFilter(queryFilter);
    }

    // if (values.categpry && values.category.length > 0) {
    //   setFilter((prev) => {
    //     return prev + cateFilter;
    //   });
    // }
  };

  const handleValuesChange = (changedValues, values) => {
    console.log(changedValues, values);
    if (changedValues.category && changedValues.category.length > 0) {
      const filter = changedValues.category.join(',');
      setFilter(`category=${filter}&`);
    } else {
      setFilter('');
    }
  };

  return (
    <>
      <div className="home-page__filter">
        <div className="home-page__filter-header">
          <Row align="middle" justify="space-between">
            <div className="filter-title" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <FilterOutlined style={{ color: 'var(--text-color)', fontSize: '16px' }} />
              <span className="subtitle1">Bộ lọc tìm kiếm</span>
            </div>
            <div className="filter-reset">
              <Button style={{ padding: '5px', cursor: 'pointer' }} type="text" onClick={() => {}}>
                <ReloadOutlined />
              </Button>
            </div>
          </Row>
        </div>
        <Divider />

        <div className="filter-body">
          <Form onFinish={onFinish} onValuesChange={handleValuesChange}>
            <div className="home-page__filter-category">
              {/* <div className="subtitle1">Danh mục sản phẩm</div> */}
              <div className="checkbox-group">
                <Form.Item
                  label={<span className="subtitle2">Danh mục sản phẩm</span>}
                  labelCol={{ span: 24 }}
                  name="category"
                >
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    //  onChange={onChangeCheckbox}
                  >
                    <Row gutter={[10, 10]}>
                      {categories.map((item, index) => (
                        <Col span={24} key={index}>
                          <Checkbox value={item}>{item}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
            <Divider />
            <div className="range-price">
              <Form.Item label={<span className="subtitle2">Khoảng giá</span>} labelCol={{ span: 24 }}>
                <Row gutter={[10, 10]} style={{ width: '100%' }}>
                  <Col xl={11} md={24}>
                    <Form.Item name={['range', 'from']}>
                      <InputNumber
                        name="from"
                        min={0}
                        placeholder="đ TỪ"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={2} md={0}>
                    <div> - </div>
                  </Col>
                  <Col xl={11} md={24}>
                    <Form.Item name={['range', 'to']}>
                      <InputNumber
                        name="to"
                        min={0}
                        placeholder="đ ĐẾN"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </div>
            <Button block type="primary" htmlType="submit">
              Áp dụng
            </Button>
            <Divider />
            <Form.Item label={<span className="subtitle2">Đánh giá</span>} labelCol={{ span: 24 }}>
              <Flex gap="middle" vertical>
                <Flex gap="middle">
                  <Rate defaultValue={5} />
                  <span>trở lên</span>
                </Flex>
                <Flex gap="middle">
                  <Rate allowHalf defaultValue={4.5} allowClear={false} />
                  <span>trở lên</span>
                </Flex>
                <Flex gap="middle">
                  <Rate defaultValue={4} />
                  <span>trở lên</span>
                </Flex>
                <Flex gap="middle">
                  <Rate allowHalf defaultValue={3.5} allowClear={false} />
                  <span>trở lên</span>
                </Flex>
                <Flex gap="middle">
                  <Rate defaultValue={3} />
                  <span>trở lên</span>
                </Flex>
              </Flex>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
export default BookFilter;
