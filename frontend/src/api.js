import axios from "axios";

const instance = axios.create({
  baseURL: "https://terry489490-scorecard.up.railway.app/",
});

export default instance;
