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

  const handleReset = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImage(null);
    setImageUrl(null);
  };

  return (
    <>
      <div>
        <h1 className="app-title">Image Processor</h1>
        {!image && <ImageUpload onImageUpload={handleImageUpload} />}
        {image && (
          <ImageProcessor 
            imageFile={image}
            imageUrl={imageUrl}
            getPyodideInstance={getPyodideInstance}
            onReset={handleReset}
          />
        )}
      </div>
    </>
  );
}

export default App;
