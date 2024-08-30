import { Link, Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import { useSelector } from 'react-redux';
import HeaderAdmin from '../HeaderAdmin';
import { Button, Menu, MenuProps } from 'antd';
import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import './LayoutAdmin.scss';
import { FaUsers } from 'react-icons/fa';
import { ImBooks } from 'react-icons/im';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { AiFillDashboard } from 'react-icons/ai';
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '1',
    label: (
      <Link to="" className="link-to">

        <span>Dashboard</span>
      </Link>
    ),
    icon: <AiFillDashboard />
  },
  {
    key: '2',
    label: (
      <Link to="user" className="link-to">

        <span>Manage Users</span>
      </Link>
    ),
    icon: <FaUsers />
  },
  {
    key: '3',
    label: (
      <Link to="book" className="link-to">

        <span>Manage Books</span>
      </Link>
    ),
    icon: <ImBooks />
  },
  {
    key: '4',
    label: (
      <Link to="order" className="link-to">

        <span>Manage Orders</span>
      </Link>
    ),
    icon: <BsFillCartCheckFill />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      { key: '7', label: 'Option 7' },
      { key: '8', label: 'Option 8' },
    ],
  },
];

function LayoutAdmin() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const userRole = useSelector((state) => state.account.user.role);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      <div className="layout-admin">
        {isAdminRoute && userRole === 'ADMIN' && (
          <div className="layout-admin__left">
            <div className={collapsed ? 'side-bar collapsed' : 'side-bar'}>
              <div className="side-bar__title text-center">{collapsed ? <h5>Admin</h5> : <h5>Admin Page</h5>}</div>
              <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                items={items}
              />
              <div className="side-bar__collapsed-icon">
                <span onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                  {collapsed ? <MdOutlineKeyboardArrowRight /> : <MdOutlineKeyboardArrowLeft />}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="layout-admin__right">
          {isAdminRoute && userRole === 'ADMIN' && (
            <HeaderAdmin collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
          )}

          <div className="main-content">
            <Outlet />
          </div>

          {isAdminRoute && userRole === 'ADMIN' && <Footer />}
        </div>
      </div>
    </>
  );
}

export default LayoutAdmin;
