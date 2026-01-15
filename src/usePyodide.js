import { useState, useEffect, useRef } from "react";
import { loadPyodide } from "pyodide";

export function usePyodide() {
    const [pyodideInstance, setPyodideInstance] = useState(null);
    const pyodidePromiseRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            try {
                const pyodide = await loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.1/full/"
                });

                await pyodide.loadPackage("pillow");
                setPyodideInstance(pyodide);
                return pyodide;
            } catch (error) {
                console.error("Pyodide initialization error:", error);
                throw error;
            }
        };

        pyodidePromiseRef.current = init();
    }, []);

    const getPyodideInstance = async () => {
        if (pyodideInstance) {
            return pyodideInstance;
        }

        return await pyodidePromiseRef.current;
    };

    return { pyodideInstance, getPyodideInstance };
}
