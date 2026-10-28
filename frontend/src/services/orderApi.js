import api from "./api";

// Create new order
export const createOrder = async (
  deliveryData,
  token
) => {
  const response = await api.post(
    "/orders",
    deliveryData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get logged-in customer's orders
export const getMyOrders = async (token) => {
  const response = await api.get(
    "/orders",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Get one customer order
export const getMyOrderById = async (
  orderId,
  token
) => {
  const response = await api.get(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};