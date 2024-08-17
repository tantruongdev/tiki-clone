import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../../components/Admin/User/UserTable';



const AdminPage: React.FC = () => {
  return (
    <>

      <Link to="/">Home</Link>
      <UserTable />
    </>
  );
};



export default AdminPage;