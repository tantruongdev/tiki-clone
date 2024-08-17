import { AudioOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, MenuProps, message, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/userServices";
import { FaHome } from "react-icons/fa";
import { logoutAction } from "../../store/account/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import "./HeaderAdmin.scss"
import { MdLogout, MdOutlineAccountCircle } from "react-icons/md";
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


function HeaderAdmin(props) {
  const { user } = useSelector(state => state.account);
  const { collapsed, toggleCollapsed } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await logout();
    if (res && res.data) {
      dispatch(logoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  }
  const items: MenuProps['items'] = [
    {
      key: '0',
      label: (
        <Link to="/" rel="noopener noreferrer" className='link-to'>
          <FaHome /><span>Trang chủ</span>
        </Link>
      ),
    },
    {
      key: '1',
      label: (
        <Link to="/manage-account" rel="noopener noreferrer" className='link-to'>
          <MdOutlineAccountCircle /><span>Quản lý tài khoản</span>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link to="/" onClick={handleLogout} className='link-to'>
          <MdLogout /><span>Đăng xuất</span>
        </Link>
      ),
    },
  ];

  const urlAvatar = `${baseUrl}/images/avatar/${user.avatar}`;
  return <>
    <div className="header-admin">
      <div className="header-admin__collapsed-icon">
        <Button type="text" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <div className="header-admin__account">
        <div className="header__account">
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar size="large" src={urlAvatar}>

                </Avatar>
                {user.fullName}

                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </div >
  </>
}

export default HeaderAdmin;