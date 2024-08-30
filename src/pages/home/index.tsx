import { Col, Row } from 'antd';
import './Home.scss';
import BookFilter from './BookFilter';
import BookList from './BookList';
import { useState } from 'react';

function Home() {
  const [filter, setFilter] = useState('');
  // console.log(filter);
  return (
    <>
      <div className="home-page">
        <Row gutter={20}>
          <Col lg={5} sm={0} xs={0}>
            <BookFilter filter={filter} setFilter={setFilter} />
          </Col>
          <Col lg={19} sm={24} xs={24}>
            <BookList filter={filter} setFilter={setFilter} />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
