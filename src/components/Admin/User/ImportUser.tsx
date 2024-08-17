import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Modal, Button, notification } from 'antd';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import * as XLSX from 'xlsx';
import { bulkCreateUser } from '../../../services/userServices';
import templateImportFile from "./template-import.xlsx?url";
const { Dragger } = Upload;

interface DataType {
  key: string;
  fullName: string;
  email: number;
  phone: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Tên hiển thị',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    key: 'phone',
  },
];

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 1000);
};

const ImportUserModal: React.FC = (props) => {
  const { openImportModal, setOpenImportModal, fetchTableData } = props;
  const [dataExcel, setDataExcel] = useState([]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    // customRequest: dummyRequest({ file, onSuccess }),
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        if (info.file.size / 1024 > 5000) {
          message.error('File is too big!');
          return;
        }
      }

      if (status === 'done') {
        // reset DataExcel
        setDataExcel([]);
        if (info.fileList && info.fileList.length > 0) {

          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = new Uint8Array(reader.result);
            const wb = XLSX.read(bstr, { type: 'array' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const dataJson = XLSX.utils.sheet_to_json(ws, { header: ['fullName', 'email', 'phone'], range: 1 });
            /* Update state */

            if (dataJson && dataJson.length > 0) {
              setDataExcel(dataJson);
            }
          };
          message.success(`${info.file.name} file uploaded successfully.`);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleOk = async () => {

    const data = dataExcel.map((item: any) => {
      return {
        ...item,
        password: '123456'
      }
    })

    const res = await bulkCreateUser(data);

    if (res && res.data) {
      notification.success({
        message: "Import user thành công",
        description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
        placement: 'topRight',
        duration: 5,
        showProgress: true,
      })
      setDataExcel([]);
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
    setOpenImportModal(false);
  };
  return (
    <>
      <Modal
        className="import-user-modal"
        title={
          <>
            <h4 className="text-center">Import Users</h4>
          </>
        }
        open={openImportModal}
        onOk={handleOk}
        onCancel={() => {
          setOpenImportModal(false);
          setDataExcel([]);
        }}
        maskClosable={false}
        destroyOnClose
        okButtonProps={{
          disabled: dataExcel.length < 1
        }}
      >
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single upload. Only accept .csv .xls .xlsx
            </p>
            <p className="ant-upload-hint"><a onClick={(e) => e.stopPropagation()} href={templateImportFile} download>Download a Template</a></p>
          </Dragger>

          <Table
            columns={columns}
            dataSource={dataExcel}
            rowKey="email"
            title={() => {
              return (
                <>
                  <p className="subtitle1">Danh sách người dùng</p>
                </>
              );
            }}
          />
        </Space>
      </Modal>
    </>
  );
};

export default ImportUserModal;
