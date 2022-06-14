import axios from "axios";

const instance = axios.create({
  baseURL: "https://programowanie-w-internecie.herokuapp.com",
});

export default instance;
