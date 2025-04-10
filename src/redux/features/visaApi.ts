import baseApi from "../api/baseApi";

const visaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createVisa: builder.mutation({
            query: (data) => ({
                url: "/visaBooking/v2/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["visa"],
        }),

        getVisa: builder.query({
            query: () => ({
                url: "/visa",
                method: "GET",
            }),
            providesTags: ["visa"],
        }),


        getVisaById: builder.query({
            query: (id) => ({
                url: `/visa/${id}`,
                method: "GET",
            }),
            providesTags: ["visa"],
        }),

        updateVisa: builder.mutation({
            query: ({ id, data }) => ({

                url: `/visa/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["visa"],
        }),


        deleteVisa: builder.mutation({
            query: (id) => ({
                url: `/visa/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["visa"],
        }),

        deleteSubTraveler: builder.mutation({
            query: ({ id, subTravelerId }) => ({

                url: `/visa/${id}/sub-traveler/${subTravelerId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["visa"],
        }),

        updateSubTraveler: builder.mutation({
            query: ({ id, subTravelerId, data }) => ({
                url: `/visa/${id}/sub-traveler/${subTravelerId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["visa"],
        }),

        getSubTravelerById: builder.query({
            query: ({ id, subTravelerId }) => ({
                url: `/visa/${id}/sub-traveler/${subTravelerId}`,
                method: "GET",
            }),
            providesTags: ["visa"],
        }),

        updatePrimaryTraveler: builder.mutation({
            query: ({ id, data }) => ({
                url: `/visa/${id}/primary-traveler`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["visa"],
        }),
    }),
})


export const { useCreateVisaMutation, useGetVisaQuery, useGetVisaByIdQuery, useUpdateVisaMutation, useDeleteVisaMutation, useDeleteSubTravelerMutation, useUpdateSubTravelerMutation, useGetSubTravelerByIdQuery, useUpdatePrimaryTravelerMutation } = visaApi;
// export const { useCreateVisaMutation, useGetVisaQuery, useGetVisaByIdQuery, useUpdateVisaMutation, useDeleteVisaMutation, useDeleteSubTravelerMutation, useUpdateSubTravelerMutation, useGetSubTravelerByIdQuery } = visaApi;
// export const { useCreateVisaMutation, useGetVisaQuery, useGetVisaByIdQuery, useUpdateVisaMutation, useDeleteVisaMutation, useDeleteSubTravelerMutation } = visaApi;