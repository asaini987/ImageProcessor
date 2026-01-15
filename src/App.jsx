import { useState } from 'react';
import './App.css';
import ImageUpload from "./components/ImageUpload";
import ImageProcessor from "./components/ImageProcessor";
import { usePyodide } from "./usePyodide";

function App() {
  const { pyodideInstance, isPyodideReady, isLoading } = usePyodide();
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
        {isLoading && <div>Loading Python runtime...</div>}
        <ImageUpload onImageUpload={handleImageUpload} />
        {imageUrl && (
          <div>
            <h3>Original Image</h3>
            <img src={imageUrl} alt="Uploaded" />
          </div>
        )}
        {image && isPyodideReady && (
          <ImageProcessor imageFile={image} pyodideInstance={pyodideInstance} />
        )}
      </div>
    </>
  );
}

export default App;
