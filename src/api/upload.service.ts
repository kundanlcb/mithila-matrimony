import { apiClient } from './apiClient';
import type { PresignedUrlResponse } from '../types/api.types';

export const UploadService = {
  /**
   * Fetch a presigned URL from the backend
   */
  getPresignedUrl: async (fileName: string, contentType: string): Promise<PresignedUrlResponse> => {
    return apiClient.get<PresignedUrlResponse>(
      `/api/v1/upload/presigned-url?fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`
    );
  },

  /**
   * Upload a raw file to the backend via a presigned URL.
   * Returns the public fileUrl.
   */
  uploadFile: async (file: File): Promise<string> => {
    // 1. Get presigned URL
    const presignedData = await UploadService.getPresignedUrl(file.name, file.type);
    
    // 2. Upload file directly to S3/Blob Storage using PUT
    const response = await fetch(presignedData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file. Status: ${response.status}`);
    }

    // 3. Return the public URL for saving in the database
    return presignedData.fileUrl;
  }
};
