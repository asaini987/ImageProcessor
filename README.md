# Browser-Side Image Processor

This is a Browser-Side Image Processor that converts image files to
grayscale directly in the browser without any need for a backend server
connection, allowing for reduced latency.

## Design & Technical Decisions

### Overview
This website was built with React.js for the UI and the image processing was handled by the Python library Pillow, which was executed using Pyodide, a Python runtime for the browser.

This app allows for images to be uploaded through a file picker or be drag and dropped into the upload box. It also allows for a side-by-side comparison of the processed grayscale image and the ability to download that processed image as well.

I chose React.js for the frontend because of its component-based architecture, which allows for a clear separation of concerns between image uploads, image processing, and display. Its reactive state system via useState and useRef enables us to efficiently manage UI state and updates.

I chose Pillow for the image processing because it is a lightweight Python library that allows for a simple 1 line conversion to grayscale, `Image.convert("L")`. This library is widely used and well-tested which makes it trustworthy, and it comes directly built into the Pyodide runtime, which makes it extremely convenient and easy to use for browser-side image processing.

**JS-Python Bridge**

Image data is transferred between JavaScript and Python using base64 encoding.
1. JavaScript reads the uploaded image file as an ArrayBuffer
2. The ArrayBuffer is converted to a Uint8Array, and then to a base64 string.
3. The base64 string is passed to python via `pyodideInstance.globals.set()` into a global variable called image_data.
4. Pillow converts the image to grayscale and passes the base64-encoded bytes back to JavaScript, via `js.processed_data`.
5. JavaScript decodes these bytes and creates a Blob URL to display the processed image in the browser.

I chose Base64 encoding because it allows us to pass these image bytes seamlessly through the JS-Python bridge without having to worry about type conversion.

### Architecture & Code Organization

**Component Structure**

The application has two main components:
1. `ImageUpload`: This component handles uploading an image via drag and drop or the file picker, as well as file validation.
2. `ImageProcessor`: This component handles the Pyodide runtime, image processing logic, and handling the UI flow for displaying the original image, providing a convert to grayscale button, and displaying the original and processed image side by side.

This application distinctly separates upload logic from image processing logic to maintain a clean, maintainable codebase.

CSS styles are organized into global styles within `index.css`, app layout styles in `App.css`, and each component has its own CSS file specifically for its styles, (`ImageUpload.css`, `ImageProcessor.css`).

**State Management**

I used React hooks to manage UI state.
- `useState` is used for state that changes the UI (processing state, images, errors) to trigger re-renders.
- `useRef` is used for caching the Pyodide instance because it persists across image uploads and UI renders.

The Pyodide instance is loaded once and then cached to avoid re-loading the runtime every conversion, which significantly reduces latency by 3-5 seconds for later operations.

I did not think it was necessary to use a state management library such as Redux or Zustand in this project because I felt React's built-in state management features (`useState`, `useRef`, and props) better fit the scope of this project. Since there are only 2 main components in the app and there is not much shared state, a state management library like Redux would add unnecessary complexity.
  
### UX Choices
Errors are displayed on the webpage as a message to provide a better user experience.
1. **File validation errors**: The image upload component shows an error message when files exceed the size limit (10MB). File types are restricted to just image types.
2. **Processing errors**: These errors are shown below the original image and action buttons when the image processing fails.
   
All errors use a shared `.error-message` CSS class for consistent styling.

These errors stay on the page until the user tries the operation again, which gives them as much time as they need to read and understand the message.

### Optimizations
Blob URLs are created for displaying the images in the browser and are cleaned up using `URL.revokeObjectURL()` to prevent memory leaks.

The Pyodide runtime instance is cached using `useRef`, preventing unnecessary re-initializations. Pyodide is first initialized when the user clicks "Convert to Grayscale" for the first time, which loads the Python runtime and caches it, which ensures that later image conversions in the session happen much quicker as Pyodide is already loaded.

Initially, Pyodide was loaded on startup, which caused UI lag (file dialogs took 3-4 seconds to appear). To improve responsiveness, Pyodide initialization was refactored to only trigger when the user clicks "Convert to Grayscale," which allows for better user experience.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies:
   npm install
3. Run the development server:
   npm run dev
   