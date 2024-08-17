import { Badge, Button, Card, Col, Descriptions, Drawer, message, notification, Popconfirm, Row, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { deleteUser, fetchUserList } from '../../../services/userServices';
import "./UserTable.scss"
import InputSearch from './InputSearch';
import { CloudDownloadOutlined, CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, ImportOutlined, PlusOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatDate } from '../../../helpers/formatDate';
import moment from 'moment';
import CreateUser from './CreateUser';
import ImportUserModal from './ImportUser';
import * as XLSX from 'xlsx';
import UpdateUser from './UpdateUser';

interface DataType {
  _id?: string,
  fullName?: string,
  email?: string,
  phone?: string,
  role?: string,
  avatar?: string,
  isActive?: boolean,
  createdAt?: string,
  updatedAt?: string,
  __v?: number,
  key?: string | number
}

interface User {
  _id?: string,
  fullName?: string,
  email?: string,
  phone?: string,
  role?: string,
  avatar?: string,
  isActive?: boolean,
  createdAt?: string,
  updatedAt?: string,
  __v?: number,
  key?: string | number
}

const UserTable: React.FC = () => {
  const [userTableData, setUserTableData] = useState<User[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetail, setUserDetail] = useState<User>({});

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [openImportModal, setOpenImportModal] = useState(false);

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
      query += filter
    }

    if (sort) {
      query += sort;
    }

    const res = await fetchUserList(query);
    if (res && res.data) {
      setTotal(res.data.meta.total);
      setUserTableData(res.data.result);

    }
    setTableLoading(false);
  }

  const handleDeleteUser = async (record) => {
    const { _id } = record;
    const res = await deleteUser(_id);
    if (res && res?.statusCode === 200) {
      message.success("Xóa tài khoản thành công!");
      await fetchTableData();
    }
    else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message ? res.message : 'An error occurred',
        placement: 'topRight',
        duration: 5,
        showProgress: true,
      })
    }

  }
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: '_id',
      render: (value, record, index) => {
        return <><Button type='link' onClick={() => showLoading(value)}>{value}</Button></>
      }
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'fullName',
      sorter: true,

    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: true,
    },
    {
      title: 'Ngày cập nhập',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (value) => {
        return <>{moment(value).format('DD/MM/YYYY HH:mm:ss')}</>
      }
    },
    {
      title: 'Action',
      render: (value, record, index) => {
        return <>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ cursor: 'pointer', padding: '5px' }}>
              <Popconfirm
                title="Delete user"
                description="Are you sure to delete this user?"
                okText="Xác nhận"
                cancelText="Hủy"
                onConfirm={() => handleDeleteUser(record)}
                okType='danger'
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </Popconfirm>
            </span>

            <span style={{ cursor: 'pointer', padding: '5px' }} >
              <EditTwoTone
                twoToneColor="#f57800"
                onClick={() => {
                  console.log(record);
                  setOpenUpdateModal(true);
                  setDataUpdate(record);
                }}
              />
            </span >
          </div>
          <UpdateUser openUpdateModal={openUpdateModal} setOpenUpdateModal={setOpenUpdateModal} dataUpdate={dataUpdate} fetchTableData={fetchTableData} />

        </>
      }
    }
  ];


  const handleFormFilter = (filterQuery: string) => {
    setFilter(filterQuery);
  }

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    if (pagination.current && pagination.current !== current) {
      setCurrent(pagination.current);
    }

    if (pagination.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }

    if (sorter.field) {
      if (sorter.order === 'ascend') {
        setSort(`sort=${sorter.field}&`)
      }
      else if (sorter.order === 'descend') {
        setSort(`sort=-${sorter.field}&`)
      }
      else {
        setSort("");
      }
    }
  };

  const hanleExportUser = () => {

    const worksheet = XLSX.utils.json_to_sheet(userTableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "ExportUsers.xlsx");

  }
  const renderTableHeader = () => {
    return (
      <div className='user-table__header'>
        <Row justify="space-between" align="middle">
          <Col> <span className='subtitle1'>Table List Users</span></Col>
          <Col>
            <div style={{ display: 'flex', gap: 15 }}>
              <Button
                icon={<ExportOutlined />}
                type="primary"
                onClick={hanleExportUser}
              >Export</Button>

              <Button
                icon={<CloudUploadOutlined />}
                type="primary"
                onClick={() => setOpenImportModal(true)}
              >Import</Button>
              <ImportUserModal openImportModal={openImportModal} setOpenImportModal={setOpenImportModal} fetchTableData={fetchTableData} />
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setOpenCreateModal(true)}
              >Thêm mới

              </Button>
              <CreateUser openCreateModal={openCreateModal} setOpenCreateModal={setOpenCreateModal} fetchTableData={fetchTableData} />
              <Button type='text' onClick={() => {
                setFilter("");
                setSort("");
              }}>
                <ReloadOutlined />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <>
      <div className='user-admin'>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div className='user-advanced-search'>
              <InputSearch handleFilter={handleFormFilter} />
            </div>
          </Col>
          <Col span={24}>
            <div className='user-table'>
              <Table
                title={renderTableHeader}
                columns={columns}
                dataSource={userTableData}
                onChange={onChange}
                loading={tableLoading}
                showSorterTooltip={{ target: 'full-header' }}
                rowKey="_id"
                pagination={{
                  showTotal: (total, range) => {
                    return <><p className='subtitle2'>{`${range[0]} - ${range[1]} trên ${total} hàng`}</p></>
                  },
                  current: current,
                  pageSize: pageSize,
                  total: total,
                  pageSizeOptions: [5, 10, 20, 50, 100],
                  showSizeChanger: true,
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className='user-description'>
        <Drawer
          closable
          destroyOnClose
          title={<p>Xem chi tiết người dùng</p>}
          placement="right"
          open={open}
          loading={loading}
          width="50vw"
          onClose={() => setOpen(false)}

        >
          <Descriptions title="Thông tin user" bordered column={2}>
            <Descriptions.Item label="Id">{userDetail._id}</Descriptions.Item>
            <Descriptions.Item label="Tên hiển thị">{userDetail.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{userDetail.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{userDetail.phone}</Descriptions.Item>
            <Descriptions.Item label="Role" span={2}>
              <Badge status="processing" text={userDetail.role} />
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {moment(userDetail.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {moment(userDetail.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </Drawer>
      </div>
    </>
  );
}

export default UserTable;
