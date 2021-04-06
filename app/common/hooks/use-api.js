import { useState, useEffect } from "react";
import Axios from "axios";
import APIService from "../api-service";

export const useAPI = (method, ...params) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = Axios.CancelToken.source();

  const fetchData = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const response = await APIService[method]([...params, request]);
      setData(response.data);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      request.cancel();
    };
  }, params);

  return { data, isLoading, error, fetchData };
};
