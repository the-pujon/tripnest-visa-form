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

        getVisa: builder.query({
            query: () => ({
                url: "/visa",
                method: "GET",
            }),
        }),

        getVisaById: builder.query({
            query: (id) => ({
                url: `/visa/${id}`,
                method: "GET",
            }),
        }),

        updateVisa: builder.mutation({
            query: ({ id, data }) => ({
                url: `/visa/${id}`,
                method: "PUT",
                body: data,
            }),
        }),

        deleteVisa: builder.mutation({
            query: (id) => ({
                url: `/visa/${id}`,
                method: "DELETE",
            }),
        }),

        deleteSubTraveler: builder.mutation({
            query: ({ id, subTravelerId }) => ({
                url: `/visa/${id}/sub-traveler/${subTravelerId}`,
                method: "DELETE",
            }),
        }),
    }),
})


export const { useCreateVisaMutation, useGetVisaQuery, useGetVisaByIdQuery } = visaApi;