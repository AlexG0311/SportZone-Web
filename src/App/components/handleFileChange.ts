 import { useHandleAddImage } from "../hooks/useHandleAddImage";
 
 const {addImage} = useHandleAddImage();
 
 export const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
     addImage(file);
    }
  };