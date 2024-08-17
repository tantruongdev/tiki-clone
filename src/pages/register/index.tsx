import { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, message, notification } from 'antd';
import "./register.scss"
import { useNavigate } from 'react-router-dom';

import { register } from '../../services/userServices';

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};


function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

    setLoading(true);
    const res = await register(values);
    setLoading(false);
    console.log(res);
    if (res?.data?._id) {
      message.success("Đăng kí tài khoản thành công!");
      navigate("/login");
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
  };

  return <>

    <div className="register-page" style={{}}>
      <div className='register-page__wrapper'>
        <div className="register-page__title">
          <h2 className='text-center' >Register</h2>
        </div>
        <Divider />
        <div className="register-page__form">
          <Form
            name="basic"
            layout="vertical"
            wrapperCol={{ span: 24 }}

            initialValues={{ remember: true }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
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

            <Form.Item >
              <Button block type="primary" htmlType="submit" loading={loading} >
                Register
              </Button>
            </Form.Item>


          </Form>
          <Divider >Or</Divider>
          <p className='register-page__sign-in' >Already have an account? <button onClick={() => navigate("/login")}>Sign in</button></p>
        </div>

      </div>
    </div >
  </>
}

export default Register;