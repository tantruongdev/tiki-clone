import instance from "../utils/axios-customize"
interface IBook {
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  sold: number,
  quantity: number,
  category: string
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

export const fetchBookList = async (query: string): Promise<AxiosResponseData<any>> => {
  const response = await instance.get(
     `/book?${query}`,
  );
  return response;
}

export const fetchABookData = async (id: string): Promise<AxiosResponseData<any>> => {
  const response = await instance.get(
     `/book/${id}`,
  );
  return response;
}

export const fetchCategory = async (): Promise<AxiosResponseData<any>> => {
  const response = await instance.get(
     `/database/category`,
  );
  return response;
}

export const createABook = async (payload: IBook): Promise<AxiosResponseData<any>> => {
  const response = await instance.post(
     '/book',
   payload
  );
  return response;
}

export const updateBook = async (payload: IUpdate): Promise<AxiosResponseData<any>> => {
  const response = await instance.put(
     '/user',
   payload
  );
  return response;
}


export const deleteBook = async (id: string): Promise<AxiosResponseData<any>> => {
  const response = await instance.delete(
     '/book/' + id,
  );
  return response;
}

export const uploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append('fileImg', fileImg);
  return instance({
  method: 'post',
  url: '/file/upload',
  data: bodyFormData,
  headers: {
  "Content-Type": "multipart/form-data",
  "upload-type": "book"
  },
  });
 }
 