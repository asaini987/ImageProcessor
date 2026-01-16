import { useState, useEffect, useRef } from "react";
import { loadPyodide } from "pyodide";
import pythonCode from "../utils/grayscale_image.py?raw";
import "../App.css";

export default function ImageProcessor({ imageFile, imageUrl, onReset }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [grayscaledImageUrl, setGrayscaledImageUrl] = useState(null);

    const pyodideInstanceRef = useRef(null);
    const pyodidePromiseRef = useRef(null);

    // change image file URL
    useEffect(() => {
        setGrayscaledImageUrl((prevUrl) => {
            if (prevUrl) {
                URL.revokeObjectURL(prevUrl);
            }

            return null;
        });
    }, [imageFile]);

    // cleanup
    useEffect(() => {
        return () => {
            if (grayscaledImageUrl) {
                URL.revokeObjectURL(grayscaledImageUrl);
            }
        };
    }, [grayscaledImageUrl]);

    const getPyodideInstance = async () => {
        // already loaded pyodide
        if (pyodideInstanceRef.current) {
            return pyodideInstanceRef.current;
        }

        // pyodide loading in progress
        if (pyodidePromiseRef.current) {
            return await pyodidePromiseRef.current;
        }

        // load pyodide
        pyodidePromiseRef.current = (async () => {
            const pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.1/full/"
            });

            await pyodide.loadPackage("pillow");
            
            pyodideInstanceRef.current = pyodide;
            return pyodide;
        })();

        return await pyodidePromiseRef.current;
    };

    const grayscaleImage = async () => {
        if (!imageFile) {
            return;
        }

        setIsProcessing(true);

        try {
            // load pyodide and convert image to base64 string
            const pyodideInstance = await getPyodideInstance();

            const binaryImageData = await imageFile.arrayBuffer();
            const byteArray = new Uint8Array(binaryImageData);

            let byteString = "";
            for (let i = 0; i < byteArray.length; i++) {
                byteString += String.fromCharCode(byteArray[i]);
            }

            const base64String = btoa(byteString);
            
            // convert image to grayscale
            pyodideInstance.globals.set("image_data", base64String);
            pyodideInstance.runPython(pythonCode);
            
            const b64GrayImg = pyodideInstance.globals.get("js")?.processed_data;
            
            if (!b64GrayImg) {
                throw new Error("Processed data is null or undefined");
            }

            // convert base64 string to BLOB then set grayscale image URL
            const grayImgByteString = atob(b64GrayImg);
            const grayImgBytes = new Uint8Array(grayImgByteString.length);
            
            for (let i = 0; i < grayImgBytes.length; i++) {
                grayImgBytes[i] = grayImgByteString.charCodeAt(i);
            }

            const blobType = imageFile.type ? imageFile.type : "image/png";
            const imgBlob = new Blob([grayImgBytes], { type: blobType });
            const grayscaledImageUrl = URL.createObjectURL(imgBlob);

            setGrayscaledImageUrl(grayscaledImageUrl);
        } catch (error) {
            console.error("Error converting image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = () => {
        if (!grayscaledImageUrl) {
            return;
        }

        const link = document.createElement("a");
        link.href = grayscaledImageUrl;
        link.download = "grayscale-image.png";
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {imageFile && (
                <>
                    {!grayscaledImageUrl && imageUrl && (
                        <>
                            <div className="image-container">
                                <img src={imageUrl} alt="Original" />
                            </div>
                            <div className="action-buttons-container">
                                <button onClick={onReset}>
                                    Choose Another Image
                                </button>
                                <button onClick={grayscaleImage} disabled={isProcessing}>
                                    {isProcessing ? "Processing..." : "Convert to Grayscale"}
                                </button>
                            </div>
                        </>
                    )}
                    {grayscaledImageUrl && imageUrl && (
                        <>
                            <div className="comparison-container">
                                <div className="comparison-item">
                                    <h3>Original</h3>
                                    <img src={imageUrl} alt="Original" />
                                </div>
                                <div className="comparison-item">
                                    <h3>Grayscale</h3>
                                    <img src={grayscaledImageUrl} alt="Processed grayscale" />
                                </div>
                            </div>
                            <div className="action-buttons-container">
                                <div className="action-button-item">
                                    <button onClick={onReset}>
                                        Choose Another Image
                                    </button>
                                </div>
                                <div className="action-button-item">
                                    <button onClick={downloadImage}>
                                        Download
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
