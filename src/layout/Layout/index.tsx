import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import "./Layout.scss";
function Layout() {
  return <>
    <div className="layout-app">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>



  </>
}

export default Layout;