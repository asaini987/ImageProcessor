import { useState, useRef } from "react";
import "./ImageUpload.css";

export default function ImageUpload({ onImageUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

    const isFileValid = (file) => {
        if (!file) {
            return false;
        }

        setError(null); // clear previous error

        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError(`File size exceeds the maximum limit of 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
            return false;
        }

        return true;
    };

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

        if (isFileValid(file)) {
            onImageUpload(file);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (isFileValid(file)) {
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
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
}
