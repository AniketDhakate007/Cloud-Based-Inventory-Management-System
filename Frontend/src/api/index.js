import axios from "axios";

const API_BASE_URL = "https://zx991pwv31.execute-api.eu-north-1.amazonaws.com/dev"; // replace with your API endpoint

export const getStockByShopId = async (shopId) => {
  const res = await axios.get(`${API_BASE_URL}/stocks/${shopId}`);
  return res.data;
};
