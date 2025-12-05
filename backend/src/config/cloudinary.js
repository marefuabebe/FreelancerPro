import { v2 as cloudinary } from "cloudinary";
import { config } from "./env.js";
import logger from "../utils/logger.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

/**
 * Upload file to Cloudinary
 *
 * @param {string} filePath - Path to the file
 * @param {string} folder - Folder name in Cloudinary
 * @param {object} options - Additional options
 * @returns {Promise<object>} Upload result
 */
export const uploadToCloudinary = async (
  filePath,
  folder = "freelancer-marketplace",
  options = {}
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",

      ...options,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw new Error("File upload failed");
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @param {string} resourceType - Resource type (image, video, raw)
 * @returns {Promise<object>} Deletion result
 */
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    logger.error(`Cloudinary deletion error: ${error.message}`);
    throw new Error("File deletion failed");
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file paths
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array>} Array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files,
  folder = "freelancer-marketplace"
) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, folder)
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error(`Multiple file upload error: ${error.message}`);
    throw new Error("Multiple file upload failed");
  }
};

/**
 * Generate optimized image URL
 * @param {string} publicId - Public ID of the image
 * @param {object} transformations - Transformation options
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: "auto",
    fetch_format: "auto",
    ...transformations,
  };

  return cloudinary.url(publicId, defaultTransformations);
};

export default cloudinary;
