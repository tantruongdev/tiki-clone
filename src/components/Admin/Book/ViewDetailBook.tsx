import { Badge, Descriptions, Divider, Drawer } from "antd";
import { formatDate } from "../../../helpers/formatDate";
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const baseImgBookUrl = `${import.meta.env.VITE_BACKEND_URL}/images/book/`;


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


function ViewDetailBook(props) {
  const { open, setOpen, loading, detailData } = props;
  const BookImages: React.FC = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    let [fileList, setFileList] = useState<UploadFile[]>([]);


    useEffect(() => {
      let listImg = [];
      if (detailData) {
        if (detailData.thumbnail) {
          listImg.push(
            {
              uid: uuidv4(),
              name: detailData.thumbnail,
              status: 'done',
              url: `${baseImgBookUrl}${detailData.thumbnail}`,
            },
          )
        }
        if (detailData.slider && detailData.slider.length > 0) {
          detailData.slider.map((item) => {
            listImg.push(
              {
                uid: uuidv4(),
                name: item,
                status: 'done',
                url: `${baseImgBookUrl}${item}`,
              },
            )
          })
        }
      }
      setFileList(listImg);
    }, []);

    const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
      }

      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
    };

    // const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    //   setFileList(newFileList);

    return (
      <>
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          // onChange={handleChange}
          showUploadList={
            {
              showRemoveIcon: false
            }
          }
        >
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: 'none' }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />

        )}
      </>
    );
  };

  return <>
    <div className="user-description">
      <Drawer
        closable
        destroyOnClose
        title={<p>Xem chi tiết sách</p>}
        placement="right"
        open={open}
        loading={loading}
        width="50vw"
        onClose={() => setOpen(false)}
      >
        <Descriptions title="Thông tin sách" bordered column={2}>
          <Descriptions.Item label="Id">{detailData._id}</Descriptions.Item>
          <Descriptions.Item label="Tên sách">{detailData.mainText}</Descriptions.Item>
          <Descriptions.Item label="Tác giả">{detailData.author}</Descriptions.Item>
          <Descriptions.Item label="Giá tiền">{detailData.price}</Descriptions.Item>
          <Descriptions.Item label="Thể loại" span={2}>
            <Badge status="processing" text={detailData.category} />
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng">{detailData.quantity}</Descriptions.Item>
          <Descriptions.Item label="Đã bán">{detailData.sold}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDate(detailData.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhập">
            {formatDate(detailData.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left" plain style={{ borderColor: '#7cb305' }}>
          <span className="subtitle1">Hình ảnh</span>
        </Divider>
        <BookImages />
      </Drawer>
    </div></>
}

export default ViewDetailBook;