import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

// Define a type for the slice state
interface AccountState {
  isAuthenticated?: boolean;
  isLoading?: boolean;
  user?: {
    email?: string,
    phone?: string,
    fullName?: string,
    role?: string
    avatar?: string,
    id?: string,
  };
}

// Define the initial state using that type
const initialState: AccountState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: ""
  }
}

export const accountSlice = createSlice({
  name: 'account',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    logoutAction: (state) => {
      localStorage.removeItem('access_token');
     state.isAuthenticated = false;
      state.isLoading = true;
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
      };
    },
    getAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user;
    }
  },
})

export const { loginAction,logoutAction,getAccountAction } = accountSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default accountSlice.reducer 