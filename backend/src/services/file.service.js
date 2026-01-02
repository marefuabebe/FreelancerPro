import fs from 'fs/promises';
import path from 'path';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import logger from '../utils/logger.js';

/**
 * File Service
 */
class FileService {
  /**
   * Upload file to cloud
   */
  async uploadFile(filePath, folder = 'general', options = {}) {
    try {
      const result = await uploadToCloudinary(filePath, folder, options);

      // Delete local file after upload
      await this.deleteLocalFile(filePath);

      return result;
    } catch (error) {
      logger.error(`File upload failed: ${error.message}`);
      // Clean up local file on error
      await this.deleteLocalFile(filePath);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files, folder = 'general') {
    try {
      const uploadPromises = files.map((file) => this.uploadFile(file.path, folder));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      logger.error(`Multiple file upload failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete file from cloud
   */
  async deleteFile(publicId, resourceType = 'image') {
    try {
      const result = await deleteFromCloudinary(publicId, resourceType);
      return result;
    } catch (error) {
      logger.error(`File deletion failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete multiple files from cloud
   */
  async deleteMultipleFiles(publicIds, resourceType = 'image') {
    try {
      const deletePromises = publicIds.map((publicId) =>
        this.deleteFile(publicId, resourceType)
      );
      const results = await Promise.all(deletePromises);
      return results;
    } catch (error) {
      logger.error(`Multiple file deletion failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete local file
   */
  async deleteLocalFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.error(`Local file deletion failed: ${error.message}`);
    }
  }

  /**
   * Get file extension
   */
  getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  /**
   * Validate file type
   */
  validateFileType(filename, allowedTypes) {
    const ext = this.getFileExtension(filename);
    return allowedTypes.includes(ext);
  }

  /**
   * Get file size
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      logger.error(`Get file size failed: ${error.message}`);
      return 0;
    }
  }
}

export default new FileService();

