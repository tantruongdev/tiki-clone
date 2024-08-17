import { useDispatch, useSelector } from "react-redux";
import AdminPage from "../../pages/admin";
import Error403 from "../../pages/error/Error403";
import { Navigate } from "react-router-dom";
import { fetchAccount } from "../../services/userServices";
import { getAccountAction } from "../../store/account/accountSlice";
import { useEffect } from "react";

const RoleBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const userRole = useSelector(state => state.account.user.role);

  if (isAdminRoute && userRole === 'ADMIN') {
    return <>
      {props.children}
    </>
  }
  else {
    return <>{<Error403 />}</>
  }
}
function ProtectedRoute(props) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.account.isAuthenticated);


  return <>
    {isAuthenticated === true ?
      <RoleBaseRoute>
        {props.children}
      </RoleBaseRoute>
      :
      <Navigate to="/login" />
    }
  </>
}

export default ProtectedRoute;