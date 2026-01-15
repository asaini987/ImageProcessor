import { useState, useEffect } from "react";
import pythonCode from "../utils/grayscale_image.py?raw";

export default function ImageProcessor({ imageFile, pyodideInstance }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [grayscaledImageUrl, setGrayscaledImageUrl] = useState(null);

    useEffect(() => {
        setGrayscaledImageUrl((prevUrl) => {
            if (prevUrl) {
                URL.revokeObjectURL(prevUrl);
            }
            return null;
        });
    }, [imageFile]);

    useEffect(() => {
        return () => {
            if (grayscaledImageUrl) {
                URL.revokeObjectURL(grayscaledImageUrl);
            }
        };
    }, [grayscaledImageUrl]);

    const grayscaleImage = async () => {
        if (!imageFile || !pyodideInstance) {
            return;
        }

        setIsProcessing(true);

        try {
            const binaryImageData = await imageFile.arrayBuffer();
            const byteArray = new Uint8Array(binaryImageData);

            let byteString = "";
            for (let i = 0; i < byteArray.length; i++) {
                byteString += String.fromCharCode(byteArray[i]);
            }

            const base64String = btoa(byteString);

            pyodideInstance.globals.set("image_data", base64String);
            pyodideInstance.runPython(pythonCode);
            
            const b64GrayImg = pyodideInstance.globals.get("js")?.processed_data;
            
            if (!b64GrayImg) {
                throw new Error("Processed data is null or undefined");
            }

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

    return (
        <div>
            {imageFile && (
                <>
                    <button onClick={grayscaleImage} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Convert to Grayscale"}
                    </button>
                    {grayscaledImageUrl && (
                        <img src={grayscaledImageUrl} alt="Processed grayscale" />
                    )}
                </>
            )}
        </div>
    );
}
