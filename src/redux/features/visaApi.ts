import baseApi from "../api/baseApi";

const visaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createVisa: builder.mutation({
            query: (data) => ({
                url: "/visa/create",
                method: "POST",
                body: data,
            }),
        }),
    }),
})

export const { useCreateVisaMutation } = visaApi;