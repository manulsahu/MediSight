
import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance with correct credentials
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dmnvxybj3'
  },
  url: {
    secure: true
  }
});

// Function to build a correct download URL for files
export const getFileUrl = (publicId: string): string => {
  // If the URL already contains the full URL, return it as is
  if (publicId.startsWith('http')) {
    // For PDFs, always use raw/upload to ensure proper download/viewing
    if (publicId.includes('.pdf') || publicId.includes('/pdf/')) {
      return publicId.replace(/image\/upload|auto\/upload/, 'raw/upload');
    }
    return publicId;
  }
  
  // For PDFs, use raw/upload to ensure proper download/viewing
  if (publicId.endsWith('.pdf') || publicId.includes('/pdf/')) {
    return `https://res.cloudinary.com/dmnvxybj3/raw/upload/${publicId}`;
  }
  
  // For images and other files
  return `https://res.cloudinary.com/dmnvxybj3/image/upload/${publicId}`;
};

// Get a public sharing URL that can be copied to clipboard
export const getPublicSharingUrl = (fileUrl: string): string => {
  // If it's already a full URL, make sure it's using the proper format for sharing
  if (fileUrl.startsWith('http')) {
    // For PDFs
    if (fileUrl.includes('.pdf') || fileUrl.includes('/pdf/')) {
      return fileUrl.replace(/image\/upload|auto\/upload/, 'raw/upload');
    }
    return fileUrl;
  }

  // Generate appropriate URL based on file type
  if (fileUrl.endsWith('.pdf') || fileUrl.includes('/pdf/')) {
    return `https://res.cloudinary.com/dmnvxybj3/raw/upload/${fileUrl}`;
  }
  
  return `https://res.cloudinary.com/dmnvxybj3/image/upload/${fileUrl}`;
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // Create a FormData instance
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'healthcare_uploads'); // Using unsigned upload preset
  
  try {
    console.log(`Uploading file to Cloudinary: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    
    // Determine the correct resource_type based on file type
    const resourceType = file.type.includes('pdf') ? 'raw' : 'auto';
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dmnvxybj3/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error details:', errorData);
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Upload successful, response data:', data);
    
    // Store the public_id for better download control
    if (data.public_id) {
      return data.public_id;
    } else if (data.secure_url) {
      return data.secure_url;
    } else if (data.url) {
      return data.url;
    } else {
      throw new Error('Upload failed - No URL or public_id returned in response');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
