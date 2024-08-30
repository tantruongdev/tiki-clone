import { useEffect, useState } from "react";
import { Modal, Button, Divider, Form, Input, message, notification, Row, Col, InputNumber, Select, Image } from 'antd';
import type { FormProps } from 'antd';
import { createAUser } from "../../../services/userServices";
import { useForm } from "antd/es/form/Form";
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Flex, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { createABook, fetchCategory, uploadBookImg } from "../../../services/bookService";
const baseImgBookUrl = `${import.meta.env.VITE_BACKEND_URL}/images/book/`;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

type FieldType = {
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  sold: number,
  quantity: number,
  category: string
};

interface uploadFile {
  name?: string,
  uid?: string
};

function CreateBook(props) {
  const { openCreateModal, setOpenCreateModal, fetchTableData } = props;
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [listCategory, setListCategory] = useState([])
  const [dataThumbnail, setDataThumbnail] = useState<uploadFile>({});
  const [dataSlider, setDataSlider] = useState<uploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    const fetchCategoryList = async () => {
      const res = await fetchCategory();
      if (res && res.data) {
        const d = res.data.map(item => {
          return { label: item, value: item }
        })
        setListCategory(d);
      }
    }
    fetchCategoryList();
  }, [])

  const handleChange: UploadProps['onChange'] = (info, type?: string) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        type ? setLoadingSlider(false) : setLoadingThumbnail(false);
        setImageUrl(url);
      });
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    setIsSubmitting(true);
    const sliderImg = dataSlider.map((item) => item.name);
    const createData = {
      ...values,
      thumbnail: dataThumbnail.name,
      slider: sliderImg
    }
    const res = await createABook(createData);
    if (res && res?.data?._id) {
      message.success("Thêm sách thành công!");
      await fetchTableData();
      setOpenCreateModal(false);
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
    setDataThumbnail({});
    setDataSlider([]);
    setIsSubmitting(false);

  };


  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await uploadBookImg(file);
    if (res && res.data) {
      setDataThumbnail({
        name: res.data.fileUploaded,
        uid: file.uid
      })
      onSuccess("ok");
    }
    else {
      onError('Đã có lỗi khi upload file!');
    }
    return;
  }

  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await uploadBookImg(file);
    if (res && res.data) {
      setDataSlider((prevData) => [...prevData,
      {
        name: res.data.fileUploaded,
        uid: file.uid
      }])
      onSuccess("ok");
    }
    else {
      onError('Đã có lỗi khi upload file!');
    }
  }

  const handleRemoveFile = (file, type) => {
    if (type === 'thumbnail') {
      setDataThumbnail({})
    }

    if (type === 'slider') {
      const newDataSlider = dataSlider.filter(item => item.uid !== file.uid);
      setDataSlider(newDataSlider);
    }
  }

  const handlePreview = async (file) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    });
  }

  return <>
    <Modal
      className="create-user-modal"
      title="Thêm mới người dùng"
      open={openCreateModal}
      onCancel={() => setOpenCreateModal(false)}
      okText="Thêm"
      cancelText="Hủy"
      onOk={() => { form.submit() }}
      destroyOnClose
      confirmLoading={isSubmitting}
      maskClosable={false}
      width={900}
    >
      <div className="create-user__form">
        <Form
          form={form}
          name="create-book-form"
          layout="vertical"
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          clearOnDestroy
        >
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Tên sách"
                name="mainText"
                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                wrapperCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
              >
                <InputNumber<number>
                  addonAfter="VND"
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
              >
                <Select
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="label"
                  options={listCategory}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber<number>
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Đã bán"
                name="sold"
                rules={[{ required: true, message: 'Vui lòng nhập số đã bán!' }]}
                initialValue={0}
              >
                <InputNumber<number>
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thumbnail"
                name="thumbnail"
                rules={[{ required: true, message: 'Vui lòng upload thumbnail!' }]}
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onRemove={(file) => handleRemoveFile(file, 'thumbnail')}
                  onPreview={handlePreview}
                >
                  <div>
                    {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Slider"
                name="slider"
                rules={[{ required: true, message: 'Vui lòng upload slider image!' }]}
              >
                <Upload
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, 'slider')}
                  onRemove={(file) => handleRemoveFile(file, 'slider')}
                  onPreview={handlePreview}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>

              </Form.Item>

            </Col>
          </Row>
        </Form>
      </div>
    </Modal>

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
}

export default CreateBook;