import { Badge, Button, Card, Col, Descriptions, Drawer, message, notification, Popconfirm, Row, } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import '../User/UserTable.scss';
import InputSearch from './InputSearch';
import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import * as XLSX from 'xlsx';
import UpdateUser from '../User/UpdateUser';
import TableAdmin from '../TableAdmin';
import { deleteBook, fetchBookList } from '../../../services/bookService';
import ViewDetailBook from './ViewDetailBook';
import CreateBook from './CreateBook';
import { formatDate } from '../../../helpers/formatDate';

interface DataType {
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

const AdminBook: React.FC = () => {
  const [userTableData, setUserTableData] = useState<User[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('sort=-updatedAt');

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetail, setUserDetail] = useState<User>({});
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [dataUpdate, setDataUpdate] = useState({});

  const showLoading = (id: string) => {
    setOpen(true);
    setLoading(true);

    const userDetailId = userTableData.findIndex((item) => item._id === id);
    setUserDetail(userTableData[userDetailId]);

    setLoading(false);
  };

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
      setUserTableData(res.data.result);
    }
    setTableLoading(false);
  };

  const handleDeleteBook = async (record) => {
    const { _id } = record;
    const res = await deleteBook(_id);
    if (res && res?.statusCode === 200) {
      message.success('Xóa sách thành công!');
      await fetchTableData();
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
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: '_id',
      render: (value, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => showLoading(value)}>
              {value}
            </Button>
          </>
        );
      },
    },
    {
      title: 'Tên sách',
      dataIndex: 'mainText',
      sorter: true,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      sorter: true,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      sorter: true,
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      sorter: true,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      sorter: true,
    },
    {
      title: 'Đã bán',
      dataIndex: 'sold',
      sorter: true,
    },
    {
      title: 'Ngày cập nhập',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (value) => {
        return <>{formatDate(value)}</>;
      },
    },
    {
      title: 'Action',
      render: (value, record, index) => {
        return (
          <>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ cursor: 'pointer', padding: '5px' }}>
                <Popconfirm
                  title="Delete book"
                  description="Are you sure to delete this book?"
                  okText="Confirm"
                  cancelText="Cancel"
                  onConfirm={() => handleDeleteBook(record)}
                  okType="danger"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <DeleteTwoTone twoToneColor="#ff4d4f" />
                </Popconfirm>
              </span>

              <span style={{ cursor: 'pointer', padding: '5px' }}>
                <EditTwoTone
                  twoToneColor="#f57800"
                  onClick={() => {
                    console.log(record);
                    setOpenUpdateModal(true);
                    setDataUpdate(record);
                  }}
                />
              </span>
            </div>
            <UpdateUser
              openUpdateModal={openUpdateModal}
              setOpenUpdateModal={setOpenUpdateModal}
              dataUpdate={dataUpdate}
              fetchTableData={fetchTableData}
            />
          </>
        );
      },
    },
  ];

  const handleFormFilter = (filterQuery: string) => {
    setFilter(filterQuery);
  };

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    if (pagination.current && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }

    if (sorter.field) {
      if (sorter.order === 'ascend') {
        setSort(`sort=${sorter.field}&`);
      } else if (sorter.order === 'descend') {
        setSort(`sort=-${sorter.field}&`);
      } else {
        setSort('sort=-updatedAt');
      }
    }
  };

  const hanleExport = () => {
    // Tạo object mới mà không có các trường thumbnail và slider
    const dataExport = userTableData.map(({ thumbnail, slider, ...rest }) => rest)
    const worksheet = XLSX.utils.json_to_sheet(dataExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, 'ExportBooks.xlsx');
  };

  const renderTableHeader = () => {
    return (
      <div className="user-table__header">
        <Row justify="space-between" align="middle">
          <Col>
            <span className="subtitle1">Table List Books</span>
          </Col>
          <Col>
            <div style={{ display: 'flex', gap: 15 }}>
              <Button icon={<ExportOutlined />} type="primary" onClick={hanleExport}>
                Export
              </Button>
              <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenCreateModal(true)}>
                Thêm mới
              </Button>
              <CreateBook
                openCreateModal={openCreateModal}
                setOpenCreateModal={setOpenCreateModal}
                fetchTableData={fetchTableData}
              />
              <Button
                type="text"
                onClick={() => {
                  setFilter('');
                  setSort('');
                }}
              >
                <ReloadOutlined />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <>
      <div className="manage-page-admin user-page-admin">
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div className="manage-page-admin__advanced-search">
              <InputSearch handleFilter={handleFormFilter} />
            </div>
          </Col>
          <Col span={24}>
            <TableAdmin
              renderTableHeader={renderTableHeader}
              columns={columns}
              tableData={userTableData}
              onChange={onChange}
              isLoading={tableLoading}
              current={current}
              pageSize={pageSize}
              total={total}
            />
          </Col>
        </Row>
      </div>

      <ViewDetailBook open={open} setOpen={setOpen} loading={loading} detailData={userDetail} />
    </>
  );
};

export default AdminBook;
