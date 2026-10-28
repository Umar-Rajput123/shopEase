import axios from "axios";

export const uploadProductImage = async (imageFile, token) => {
  if (!imageFile) {
    throw new Error("Please select an image");
  }

  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/upload/product-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};