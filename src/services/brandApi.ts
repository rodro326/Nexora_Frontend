
import api from "./api";

export const getBrands = async () => {
  const response = await api.get("/brands");
  return response.data;
};
