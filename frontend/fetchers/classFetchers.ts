import axios from "axios";

export const dataFetcher = async (url: string) => {
  const {data} = await axios.get(url);
  return data;
}