import axios from "axios";
import { useState } from "react";

interface RequestProps {
  url: string;
  method: "get" | "post" | "put" | "delete";
  body?: any;
  onSuccess?: (data: any) => void;
}

export const useRequest = ({ url, method, body, onSuccess }: RequestProps) => {
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const doRequest = async (props = {}) => {
    try {
      setIsLoading(true);
      setErrors(null);

      const response = await axios[method](
        url,
        // For GET requests, we don't want to send a body
        method === "get" ? undefined : { ...body, ...props }
      );

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.errors?.[0]?.message || "Something went wrong";

      setErrors(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Return simple error message instead of a React component
  // This gives more flexibility to the component using the hook
  return { doRequest, errors, isLoading };
};
