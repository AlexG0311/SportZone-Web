const CLOUDINARY_CLOUD_NAME = "dyxwkzchf"; 
const CLOUDINARY_UPLOAD_PRESET = "mediaescenarios";

export const subirImagenACloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error subiendo imagen a Cloudinary');
    }

    const result = await response.json();
    return result.secure_url; // URL segura de la imagen en Cloudinary
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};