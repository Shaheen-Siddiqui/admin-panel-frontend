import { toast } from "react-toastify";
import {
    CLOUDINARY_UPLOAD_PRESET,
    CLOUDINARY_URL,
  } from './uploadImageCloudinaty';
  

 const handleFileChange = async (event, setLoading, setFormData, formData) => {
  setLoading(true); // Set loading to true when starting upload

  const file = event.target.files[0];
  const cloudinaryFormData = new FormData();

  // Append the file and upload preset as before
  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  cloudinaryFormData.append("folder", "Abdullah-Store");

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: cloudinaryFormData,
    });

    if (response.ok) {
      const data = await response.json();
      setFormData({
        ...formData,
        imageUrl: data.url,
      });
    } else {
      toast.error("Image upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  } finally {
    setLoading(false); // Set loading to false when upload is complete
  }
};

export {handleFileChange}

