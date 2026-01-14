import { useState } from 'react';
import './App.css';
import ImageUpload from './components/ImageUpload';

function App() {
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
        {imageUrl && <img src={imageUrl} alt="Uploaded" />}
      </div>
    </>
  );
}

export default App;
