import api from "./api";

export const getAllOrders = async (token) => {
  const response = await api.get(
    "/orders/admin/all",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAdminOrderById = async (
  orderId,
  token
) => {
  const response = await api.get(
    `/orders/admin/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateOrderStatus = async (
  orderId,
  status,
  token
) => {
  const response = await api.put(
    `/orders/admin/${orderId}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};