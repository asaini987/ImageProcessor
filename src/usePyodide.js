import { useState, useEffect } from "react";
import { loadPyodide } from "pyodide";

export function usePyodide() {
    const [pyodideInstance, setPyodideInstance] = useState(null);
    const [isPyodideReady, setIsPyodideReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const pyodideInit = async () => {
            try {
                const pyodideInstance = await loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.1/full/"
                });
                
                await pyodideInstance.loadPackage("pillow");
                
                setPyodideInstance(pyodideInstance);
                setIsPyodideReady(true);
            } catch (error) {
                console.error("Pyodide initialization error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        pyodideInit();
    }, []);

    return { pyodideInstance, isPyodideReady, isLoading };
}
