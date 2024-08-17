import { useState } from "react";
import { Modal, Button, Divider, Form, Input, message, notification } from 'antd';
import type { FormProps } from 'antd';
import { createAUser } from "../../../services/userServices";
import { useForm } from "antd/es/form/Form";


type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

function CreateUser(props) {
  const { openCreateModal, setOpenCreateModal, fetchTableData } = props;
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<FieldType>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setIsSubmitting(true);
    const res = await createAUser(values);
    if (res?.data?._id) {
      message.success("Đăng kí tài khoản thành công!");
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
    setIsSubmitting(false);

  };

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
    >
      <div className="create-user__form">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          clearOnDestroy
        >
          <Form.Item<FieldType>
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email address' },
              // eslint-disable-next-line no-useless-escape
              { pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Please enter a valid email address' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password autoComplete='on' />
          </Form.Item>

          <Form.Item<FieldType>
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  </>
}

export default CreateUser;