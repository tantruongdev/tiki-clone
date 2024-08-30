import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import './Layout.scss';
import { Content } from 'antd/es/layout/layout';
function Layout() {
  return (
    <>
      <div className="layout-app">
        <Header />
        <div className="main-content">
          <Content style={{ padding: '20px 48px 0' }}>
            <Outlet />
          </Content>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
