// Importing necessary modules
import { useDispatch } from 'react-redux';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectImages } from '../store/selectors';
import { calculateEnclosedArea } from '../utils/utils';
import { addAnnotation, setAnnotationFinished, setCalculatedArea } from '../store/reducers/imagesSlice';

// Defining the maximum distance from the first click to close the polygon
// (Measured in fraction of image width)
const MAX_DISTANCE_TO_CLOSE = 0.05;

// Defining the ImageAnnotation component
const ImageAnnotation = () => {

  // Set windowSize as a state so that a resize event triggers redraw to occur properly
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Initializing the useDispatch and useSelector hooks
  const dispatch = useDispatch();
  const imageData = useSelector(selectImages);
  const selectedImageIndex = imageData.selectedImageIndex;

  // Initializing the canvasRef and closeDistance variables
  const canvasRef = useRef(null);

  // Initializing the annotations and finishedFlag variables
  let annotations = selectedImageIndex === -1 ? [] : imageData.images[selectedImageIndex].annotations 
  let finishedFlag = selectedImageIndex === -1 ? false : imageData.images[selectedImageIndex].finishedFlag 

  // Do the following when user clicks on the image
  const handleImageClick = (event) => {

    // Getting the coordinates of the click event
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Creating an annotation object with the coordinates
    const annotation = { x, y };

    // Get the canvas's parent div in order to use image size as the canvas size
    const imageDiv = document.getElementById('imageDiv');

    // Scale the click from pixel space to image ratio space
    const scaledAnnotation = {x: (x/imageDiv.width), y: (y/imageDiv.height)}

    // Checking if the annotation is finished
    // (If it's finished don't bother doing anything)
    if (!finishedFlag) {

      // If there are less than 2 annotations, don't bother checking for polygon closure
      if (annotations.length <=2) {

        // Just add the scaled annotation to the annotation list and move on
        dispatch(addAnnotation({annotation: scaledAnnotation}))
        return;
      }

      // If there *are* more than 2 annotations, check for polygon closure

      // Calculating the distance between the new annotation and the first annotation
      const firstAnnotation = annotations[0];
      const distance = Math.hypot(scaledAnnotation.x - firstAnnotation.x, scaledAnnotation.y - firstAnnotation.y) ;

      // If the distance exceeds the maximum distance to close, don't close the polygon
      // Just add the annotation and move on
      if (distance > MAX_DISTANCE_TO_CLOSE) {
        dispatch(addAnnotation({annotation: scaledAnnotation}))
        return;
      } 

      // However if the distance is *less* than the maximum distance to close, close the polygon,
      // calculate and set the area, and set the finishedFlag to true
      else {

        // Add the first annotation to the annotations array
        dispatch(addAnnotation({annotation: firstAnnotation}))

        // Calculating the enclosed area of the annotations
        const area = calculateEnclosedArea(annotations);

        // Set the calculated area in the store
        dispatch(setCalculatedArea({area_px: area}))
        
        // Set the finishedFlag to true
        dispatch(setAnnotationFinished())
      }
    }
  };

  // Defining the useEffect hook to update canvas when annotations change or window resizes
  useEffect(() => {

    // Get the canvas
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Get the canvas's parent div in order to use image size as the canvas size
    const imageDiv = document.getElementById('imageDiv');

    // Set the canvas size to the image size (in case of resize)
    canvas.width = imageDiv.width;
    canvas.height= imageDiv.height;
    canvas.style.top = imageDiv.offsetTop+'px';
    canvas.style.left = imageDiv.offsetLeft+'px';

    // Clearing the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Setting the stroke style and line width
    context.strokeStyle = 'red';
    context.lineWidth = 1;

    // Drawing the annotation points
    annotations.forEach((annotation) => {
      const { x, y } = annotation;

      const scaledX = x * imageDiv.width;
      const scaledY = y * imageDiv.height;

      context.fillStyle = 'red';
      context.beginPath();
      context.arc(scaledX, scaledY, 2, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    });

    // Drawing the lines between the annotations
    for (let i = 1; i < annotations.length; i++) {

      // Draw line between (i)th and (i-1)th annotations
      context.beginPath();
      context.moveTo(annotations[i].x * imageDiv.width, annotations[i].y * imageDiv.height);
      context.lineTo(annotations[i-1].x * imageDiv.width, annotations[i-1].y * imageDiv.height);
      context.stroke();
      context.closePath();
    }

    // Set up resize event handler to update windowSize and thus redraw canvas on window resize 
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [selectedImageIndex, annotations, windowSize]);


  // Returning the component
  return (
    <div id="imageContainer" width="100%">
      <img id="imageDiv"
        src={selectedImageIndex === -1 ? "" : imageData.images[selectedImageIndex].file}
        alt="Image"
        style={{ width: '100%', height: 'auto' }}
        onMouseDown={() => {
          if (annotations.length === 0) {
            canvasRef.current.width = imageDiv.width;
            canvasRef.current.height= imageDiv.height;
            canvas.style.top = imageDiv.offsetTop+'px';
            canvas.style.left = imageDiv.offsetLeft+'px';
          }
        }}
        onClick={handleImageClick}
      >

      </img>

      <canvas
        id="canvas"
        ref={canvasRef}
        style={{
          
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// Exporting the ImageAnnotation component
export default ImageAnnotation;
