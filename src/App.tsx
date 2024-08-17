import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './routes'
import { useEffect } from 'react'
import { fetchAccount } from './services/userServices';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountAction } from './store/account/accountSlice';
import Loading from './components/Loading';

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);
  useEffect(() => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
      // || window.location.pathname === '/'
    ) return;

    const getAccount = async () => {
      const res = await fetchAccount();
      if (res && res.data) {
        dispatch(getAccountAction(res.data));
      }
    }
    getAccount();
  }, []);

  return (

    <>
      {
        isLoading === false
          || window.location.pathname === '/login'
          || window.location.pathname === '/register'
          || window.location.pathname === '/'
          || window.location.pathname.startsWith('/book')
          ?
          <RouterProvider router={router} />
          :
          <Loading />
      }

    </>
  )
}

export default App
