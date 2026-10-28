import cloudinary from "../config/cloudinary.js";

export const uploadProductImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const base64Image =
      `data:${req.file.mimetype};base64,` +
      req.file.buffer.toString("base64");

    const result = await cloudinary.uploader.upload(
      base64Image,
      {
        folder: "shopease/products",
        resource_type: "image",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
};