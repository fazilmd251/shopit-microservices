import axios from "axios";

const axiosInstanceForProducts = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI_PRODUCT,
    withCredentials: true
})

export default axiosInstanceForProducts
