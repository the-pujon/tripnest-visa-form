/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    BaseQueryApi,
    BaseQueryFn,
    createApi,
    DefinitionType,
    FetchArgs,
    fetchBaseQuery,
  } from "@reduxjs/toolkit/query/react";
//   import { toast } from "sonner";
import toast from "react-hot-toast";
  

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
  });
  
  const baseQueryWithErrorHandling: BaseQueryFn<
    FetchArgs,
    BaseQueryApi,
    DefinitionType
  > = async (args, api, extraOptions): Promise<any> => {
    try {
      const result = await baseQuery(args, api, extraOptions);
  
      if (result.error) {
        if (result.error.status === 401) {
          toast.error((result.error.data as { message: string }).message);
          console.error("Unauthorized access. Please check your credentials.");
        } else if (result.error.status === 403) {
          console.error(
            "Forbidden. You do not have permission to access this resource."
          );
        } else if (result.error.status === 404) {
          console.error("Resource not found.");
        } else if (result.error.status === 500) {
          console.error("Server error:", result.error);
          toast.error(
            "An unexpected server error occurred. Please try again later."
          );
        } else {
          console.error("An unexpected error occurred:", result.error);
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
  
      return result;
    } catch (error) {
      console.error("An error occurred during the request:", error);
      toast.error("An error occurred. Please try again later.");
      throw error;
    }
  };
  
  export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: [
      "visa",
    ],
    endpoints: () => ({}),
  });
  
  export default baseApi;
  