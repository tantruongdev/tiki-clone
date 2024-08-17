import { FaReact } from 'react-icons/fa';
import './Header.scss';
import { AudioOutlined, DownOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Badge, Drawer, Dropdown, Input, message, Skeleton, Space } from 'antd';
import type { GetProps, MenuProps } from 'antd';
import { FaBars } from 'react-icons/fa6';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdOutlineAccountCircle, MdLogout, MdAdminPanelSettings } from 'react-icons/md';
import { logout } from '../../services/userServices';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../store/account/accountSlice';

const baseUrl = import.meta.env.VITE_BACKEND_URL

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1677ff',
    }}
  />
);
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

function Header() {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.account);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res && res.data) {
      dispatch(logoutAction());
      message.success('Đăng xuất thành công');
      // navigate('/');
    }
  };

  let loginItems: MenuProps['items'] = [
    {
      key: '1',
      label: (

        <Link to="/manage-account" rel="noopener noreferrer" className='link-to'>
          <MdOutlineAccountCircle /> <span>Quản lý tài khoản</span>
        </Link>

      ),
    },
    {
      key: '2',
      label: (
        <Link to="/" onClick={handleLogout} className='link-to'>
          <MdLogout /> <span>Đăng xuất</span>
        </Link>
      ),
    },
  ];

  if (isAuthenticated && user.role === 'ADMIN') {
    loginItems.unshift({
      key: '0',
      label: (

        <Link to="/admin" rel="noopener noreferrer" className='link-to'>
          <MdAdminPanelSettings /> <span>Trang quản trị</span>
        </Link>

      ),

    },)
  }
  const unLoginItems: MenuProps['items'] = [
    {
      key: '3',
      label: (
        <Link to="/login" className='link-to' > <MdOutlineAccountCircle /><span>Đăng nhập</span></Link>
      ),

    },
    {
      key: '4',
      label: (
        <Link to={'/register'} className='link-to'> <MdLogout /> <span>Đăng kí</span></Link>
      ),
    },
  ];

  const urlAvatar = `${baseUrl}/images/avatar/${user.avatar}`;

  const items = isAuthenticated === true ? loginItems : unLoginItems;
  return (
    <>
      <header className="header">
        <div className="container-fluid">
          <div className="header__wrapper">
            <div className="header__logo">
              <FaReact size={50} color="#1677ff" className="spinner" /> <span>TIKI</span>
            </div>

            <div className="header__search-bar">
              <Search
                placeholder="Bạn tìm gì hôm nay"
                allowClear
                prefix={<SearchOutlined style={{ color: 'rgb(128, 128, 137)', fontSize: '22px', margin: '0 5px' }} />}
                enterButton={
                  <>
                    <span className="search-text">Search</span>
                    <SearchOutlined style={{ color: 'rgb(128, 128, 137)' }} className="mobile-search" />
                  </>
                }
                size="large"
                onSearch={onSearch}
                classNames={{ prefix: 'd-none' }}
              />
            </div>
            <div className="header__user">
              <div className="header__account">
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>

                      <>
                        {isAuthenticated ? <>
                          <Avatar size="large" src={urlAvatar}>
                          </Avatar>
                          {user.fullName}</> :
                          // isLoading ?
                          //   <>
                          //     < Skeleton.Input active={true} block={true} />
                          //   </>
                          //   :
                          <>Tài khoản</>}
                        <DownOutlined />


                      </>
                    </Space>
                  </a>
                </Dropdown>
              </div>
              <div className="header__cart">
                <Badge count={5} overflowCount={10}>
                  <AiOutlineShoppingCart size={35} color="#1677ff" />
                </Badge>
              </div>
            </div>
            <div className="header__mobile-bar" onClick={showDrawer}>
              <FaBars size={25} />
            </div>
            <Drawer title={<span>Menu chức năng</span>} onClose={onClose} open={open}>
              <ul className="header__mobile-bar-actions">
                {isAuthenticated ? (
                  <>
                    <li>
                      <span className="icon">
                        <MdOutlineAccountCircle />
                      </span>
                      <span className="text">Quản lí tài khoản</span>
                    </li>
                    <li onClick={handleLogout}>
                      <span className="icon">
                        <MdLogout />
                      </span>
                      <span className="text">Đăng xuất</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li onClick={() => navigate('/login')}>
                      <span className="icon">
                        <MdOutlineAccountCircle />
                      </span>
                      <span className="text">Đăng nhập</span>
                    </li>
                    <li onClick={() => navigate('/register')}>
                      <span className="icon">
                        <MdLogout />
                      </span>
                      <span className="text">Đăng kí</span>
                    </li>
                  </>
                )}
              </ul>
            </Drawer>
          </div>
        </div>
      </header >
    </>
  );
}

export default Header;
