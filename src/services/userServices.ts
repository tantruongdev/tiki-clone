import instance from "../utils/axios-customize"
interface IRegister {
  fullName: string,
  email: string,
  password: string,
  phone: string,
}

interface IUpdate {
  _id: string,
  fullName: string,
  phone: string,
}
interface ILogin {
  username: string,
  password: string,
}

interface AxiosResponseData<T = any> {
  data: T;
  message?: string;
}

export const register = async (payload: IRegister): Promise<AxiosResponseData<any>> => {
    const response = await instance.post(
       '/user/register',
     payload
    );
    return response;
}

export const login = async (payload: ILogin): Promise<AxiosResponseData<any>> => {
  const response = await instance.post(
     '/auth/login',
   payload
  );
  return response;
}
export const logout = async (): Promise<AxiosResponseData<any>> => {
  const response = await instance.post(
     '/auth/logout',
  );
  return response;
}
export const fetchAccount = async (): Promise<AxiosResponseData<any>> => {
  const response = await instance.get(
     '/auth/account',
  );
  return response;
}

export const fetchUserList = async (query: string): Promise<AxiosResponseData<any>> => {
  const response = await instance.get(
     `/user?${query}`,
  );
  return response;
}

export const createAUser = async (payload: IRegister): Promise<AxiosResponseData<any>> => {
  const response = await instance.post(
     '/user',
   payload
  );
  return response;
}

export const bulkCreateUser = async (payload: IRegister[]): Promise<AxiosResponseData<any>> => {
  const response = await instance.post(
     '/user/bulk-create',
   payload
  );
  return response;
}

export const updateUser = async (payload: IUpdate): Promise<AxiosResponseData<any>> => {
  const response = await instance.put(
     '/user',
   payload
  );
  return response;
}


export const deleteUser = async (id: string): Promise<AxiosResponseData<any>> => {
  const response = await instance.delete(
     '/user/' + id,
  );
  return response;
}
