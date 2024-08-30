import { Button, Col, Pagination, Rate, Result, Row, Space, Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { fetchBookList } from '../../services/bookService';
import { SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const baseImgBookUrl = `${import.meta.env.VITE_BACKEND_URL}/images/book/`;

interface User {
  _id?: string;
  mainText?: string;
  category?: string;
  author?: string;
  price?: number;
  quantity?: number;
  sold?: number;
  thumbnail?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  slider?: string[];
}

const items: TabsProps['items'] = [
  {
    key: '-sold',
    label: 'Phổ biến',
  },
  {
    key: '-updatedAt',
    label: 'Hàng mới',
  },
  {
    key: 'price',
    label: 'Giá thấp đến cao',
  },
  {
    key: '-price',
    label: 'Giá cao đến thấp',
  },
];

function BookList(props) {
  const { filter, setFilter } = props;
  const [bookData, setBookData] = useState([]);
  const [userTableData, setUserTableData] = useState<User[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [sort, setSort] = useState('sort=-sold');

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTableData();
  }, [current, pageSize, filter, sort]);

  const fetchTableData = async () => {
    setTableLoading(true);
    let query = `current=${current}&pageSize=${pageSize}&`;

    if (filter) {
      query += filter;
    }

    if (sort) {
      query += sort;
    }

    const res = await fetchBookList(query);

    if (res && res.data) {
      setTotal(res.data.meta.total);
      setBookData(res.data.result);
    }
    setTableLoading(false);
  };

  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
  };

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to =
      'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  };

  const handleRedirectBook = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };

  return (
    <>
      <div className="home-page__book">
        <Space direction="vertical" size="large">
          <div className="home-page__book-tabs">
            <Tabs
              defaultActiveKey="1"
              items={items}
              onChange={(key) => {
                console.log(key);
                setSort(`sort=${key}`);
              }}
            />
          </div>
          <div className="home-page__book-list">
            <Spin tip="Loading..." spinning={tableLoading}>
              {total ? (
                <Row gutter={[10, 10]}>
                  {bookData.map((item, index) => (
                    <Col
                      key={`book-${index}`}
                      flex="1 1 20%"
                      style={{ maxWidth: '20%' }} // Ensures columns don't exceed 20% widths
                    >
                      <div
                        className="search-item-result__item"
                        onClick={() => {
                          handleRedirectBook(item);
                        }}
                      >
                        <div className="image">
                          <img src={baseImgBookUrl + item.thumbnail}></img>
                        </div>
                        <div className="content">
                          <div className="title">{item.mainText}</div>
                          <div className="highlight"></div>
                          <div className="price">
                            <div className="new-price">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                item?.price * 0.6 ?? 0,
                              )}
                            </div>
                            <div className="old-price">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                item?.price ?? 0,
                              )}
                            </div>
                            <div className="price-discount">40%</div>
                          </div>
                          <div className="testimonial">
                            <div className="rating">
                              <Rate defaultValue={5} style={{ fontSize: 'inherit' }} />
                            </div>
                            <div className="sold">Đã bán {item.sold}</div>
                          </div>
                          <div className="place">
                            <div className="place-text">Ha Noi</div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                // <div className="no-data" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                //   <Result
                //     icon={<SmileOutlined />}
                //     title="No data!"
                //     extra={
                //       <Button
                //         type="primary"
                //         onClick={() => {
                //           setFilter('');
                //         }}
                //       >
                //         Reset
                //       </Button>
                //     }
                //   />
                // </div>
                <></>
              )}
            </Spin>
          </div>
          <div className="home-page__book-pagination">
            {total > 0 && (
              <Pagination
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                current={current}
                pageSize={pageSize}
                total={total}
                onChange={(current, pageSize) => {
                  setCurrent(current);
                  setPageSize(pageSize);
                }}
                showSizeChanger={true}
                responsive
              />
            )}
          </div>
        </Space>
      </div>
    </>
  );
}

export default BookList;
