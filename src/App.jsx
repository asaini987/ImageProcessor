import { useState } from 'react';
import './App.css';
import ImageUpload from "./components/ImageUpload";
import ImageProcessor from "./components/ImageProcessor";
import { usePyodide } from "./usePyodide";

function App() {
  const { getPyodideInstance } = usePyodide();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = (file) => {
    if (!file) {
      setImage(null);
      setImageUrl(null);
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <div>
        <ImageUpload onImageUpload={handleImageUpload} />
        {imageUrl && (
          <div>
            <h3>Original Image</h3>
            <img src={imageUrl} alt="Uploaded" />
          </div>
        )}
        {image && (
          <ImageProcessor 
            imageFile={image} 
            getPyodide={getPyodideInstance}
          />
        )}
      </div>
    </>
  );
}

export default App;
