import { useState, useRef } from "react";
import "./ImageUpload.css";

export default function ImageUpload({ onImageUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];

        if (file && file.type.startsWith("image/")) {
            onImageUpload(file);
        } else {
            alert("Please upload an image file");
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <div 
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave} 
        onDrop={handleDrop} 
        onClick={handleClick}
        className={`upload-box ${isDragging ? "dragging" : ""}`}
        >
            <input 
                ref={inputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
            />
            <p>Drag and drop an image here or click to upload</p>
            <p>Max size: 10MB</p>
        </div>
    );
}
