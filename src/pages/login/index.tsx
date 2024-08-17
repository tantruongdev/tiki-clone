import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, message, notification } from 'antd';

import "./login.scss"
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../../services/userServices';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/account/accountSlice';

type FieldType = {
  username: string;
  password: string;
};

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true);
    const res = await login(values);
    setLoading(false);
    if (res?.data?.user) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(loginAction(res.data.user));
      message.success("Đăng nhập tài khoản thành công!");
      navigate("/");
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

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log(errorInfo);
  };


  return <>
    <div className="" >
      <main className=' login-page main'>
        <div className='login-page__wrapper'>
          <div className="login-page__title">
            <h2 className='text-center'>Login</h2>
          </div>
          <Divider />
          <div className="login-page__form">
            <Form
              name="basic"
              layout="vertical"
              wrapperCol={{ span: 24 }}
              // initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}

            >

              <Form.Item<FieldType>
                label="Email"
                name="username"
                rules={[
                  { required: true, message: 'Please enter your email address' },
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

              <Form.Item >
                <Button block type="primary" htmlType="submit"  >
                  Login
                </Button>
              </Form.Item>


            </Form>
            <Divider >Or</Divider>
            <p className='login-page__sign-up'>
              Don&apos;t have an account?
              <button onClick={() => navigate("/register")}>Sign up</button>
            </p>
          </div>

        </div>
      </main>

    </div >
  </>
}

export default Login;