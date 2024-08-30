import { useState } from "react";
import { Modal, Button, Divider, Form, Input, message, notification } from 'antd';
import type { FormProps } from 'antd';
import { createAUser, updateUser } from "../../../services/userServices";


type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

function UpdateUser(props) {
  const { openUpdateModal, setOpenUpdateModal, dataUpdate, fetchTableData } = props;
  const [updateForm] = Form.useForm();
  const [formValues, setFormValues] = useState<FieldType>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setIsSubmitting(true);
    const data = {
      _id: dataUpdate._id,
      fullName: values.fullName,
      phone: values.phone,
    }
    const res = await updateUser(data);

    if (res && res?.statusCode === 200 && res?.data?.acknowledged === true) {
      message.success("Cập nhập tài khoản thành công!");
      await fetchTableData();
      setOpenUpdateModal(false);
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
      title="Cập nhập thông tin người dùng"
      open={openUpdateModal}
      onCancel={() => setOpenUpdateModal(false)}
      okText="Cập nhập"
      cancelText="Hủy"
      onOk={() => { updateForm.submit() }}
      destroyOnClose
      confirmLoading={isSubmitting}
      maskClosable={false}
    >
      <div className="create-user__form">
        <Form
          form={updateForm}
          name="updateForm"
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
            initialValue={dataUpdate.fullName}
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
            initialValue={dataUpdate.email}
          >
            <Input disabled />
          </Form.Item>


          <Form.Item<FieldType>
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
            initialValue={dataUpdate.phone}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  </>
}

export default UpdateUser;