import axios from "axios";
import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../utilities/utils";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Link,
  Navigate
} from "react-router-dom";

const BASE_URL = process.env.REACT_APP_FinXCoreUrl;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Initialize loading state
let setLoading;

export function initializeLoadingSetter(setter) {
  setLoading = setter;
}


function LoginRedirect() {

  const navigate = useNavigate();
  navigate("/Login");
  return null;
}




api.interceptors.response.use(
  (response) => {

    return response;
  },

  (error) => {
    if (error.response.status === 401) {
      debugger;
      return error.response;
    }
    return Promise.reject(error);
  }
);

export function PostCallHeader(url, data, header) {
  const respdata = axios.post(url, data, header);
  return respdata;
}

export default api;