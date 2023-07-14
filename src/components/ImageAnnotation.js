// Importing necessary modules
import { useDispatch } from 'react-redux';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectImages } from '../store/selectors';
import { addAnnotation, setAnnotationFinished, setCalculatedArea } from '../store/reducers/imagesSlice';

// Defining the ImageAnnotation component
const ImageAnnotation = () => {

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const videoFrame = document.getElementById('videoFrame');

  // Initializing the useDispatch and useSelector hooks
  const dispatch = useDispatch();
  const imageData = useSelector(selectImages);
  const selectedImageIndex = imageData.selectedImageIndex;

  // Initializing the canvasRef and closeDistance variables
  const canvasRef = useRef(null);
  const closeDistance = 0.05;

  // Initializing the annotations and finishedFlag variables
  let annotations = selectedImageIndex === -1 ? [] : imageData.images[selectedImageIndex].annotations 
  let finishedFlag = selectedImageIndex === -1 ? false : imageData.images[selectedImageIndex].finishedFlag 

  // Defining the handleImageClick function
  const handleImageClick = (event) => {

    // Getting the coordinates of the click event
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Creating an annotation object with the coordinates
    const annotation = { x, y };
    const scaledAnnotation = {x: (x/videoFrame.width), y: (y/videoFrame.height)}

    // Checking if the annotation is finished
    if (!finishedFlag) {

      // Checking if there are already annotations
      if (annotations.length > 1) {
        const firstAnnotation = annotations[0];

        // Calculating the distance between the new annotation and the first annotation
        const distance = Math.hypot(
          annotation.x - firstAnnotation.x,
          annotation.y - firstAnnotation.y
        ) * videoFrame.height;
  
        // Checking if the distance is less than the closeDistance variable
        if (distance > closeDistance) {

          // Adding the new annotation to the annotations array
          dispatch(addAnnotation({annotation: scaledAnnotation}))
          
        } else {

          // Adding the first annotation to the annotations array
          dispatch(addAnnotation({annotation: firstAnnotation}))

          // Calculating the enclosed area of the annotations
          const area = calculateEnclosedArea(annotations);
          dispatch(setCalculatedArea({area_px: area}))
        }
      } 
      else {
		    dispatch(addAnnotation({annotation: scaledAnnotation}))
      }
    }
  };

  // Defining the calculateEnclosedArea function
  // Shoelace formula: https://en.wikipedia.org/wiki/Shoelace_formula
  const calculateEnclosedArea = (points) => {
    const n = points.length;
    let area = 0;

    for (let i = 0; i < n; i++) {
      const current = points[i];
      const next = points[(i + 1) % n];
      area += current.x * next.y - current.y * next.x;
    }

    area = Math.abs(area) / 2;
    return area;
  };

  // Defining the useEffect hook
  useEffect(() => {

    console.log(annotations)

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // const parentRect = canvasRef.current.getBoundingClientRect();

    const videoFrame = document.getElementById('videoFrame');

    canvas.width = videoFrame.width;
    canvas.height= videoFrame.height;

    canvas.style.top = videoFrame.offsetTop+'px';
    canvas.style.left = videoFrame.offsetLeft+'px';

    // Clearing the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Setting the stroke style and line width
    context.strokeStyle = 'red';
    context.lineWidth = 1;

    // Checking if there are annotations
    if (annotations.length > 1) {

      // Starting the path
      context.beginPath();
      context.moveTo(annotations[0].x * videoFrame.width, annotations[0].y * videoFrame.height);

      // Getting the first and last annotations
      const firstAnnotation = annotations[0];
      const lastAnnotation = annotations[annotations.length - 1];

      // Calculating the distance between the first and last annotations
      const distance = Math.hypot(
        lastAnnotation.x - firstAnnotation.x,
        lastAnnotation.y - firstAnnotation.y
      );

      // Drawing the annotations
      annotations.forEach((annotation, index) => {
        const { x, y } = annotation;

        const scaledX = x * videoFrame.width;
        const scaledY = y * videoFrame.height;
        
        context.lineTo(scaledX, scaledY);
        context.stroke();
      });

      // Checking if the distance is less than the closeDistance variable and there are more than 2 annotations
      if (distance < closeDistance && annotations.length > 2) {
        context.lineTo(firstAnnotation.x * videoFrame.width, firstAnnotation.y * videoFrame.height);
        context.stroke();
        context.closePath();

		    // Setting the finishedFlag to true
		    dispatch(setAnnotationFinished());
      }
    }

    // Drawing the annotation points
    annotations.forEach((annotation) => {
      const { x, y } = annotation;

      const scaledX = x * videoFrame.width;
      const scaledY = y * videoFrame.height;

      context.fillStyle = 'red';
      context.beginPath();
      context.arc(scaledX, scaledY, 2, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    });

    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

    
  }, [annotations, windowSize]);

  

  // Returning the component
  return (
    <div id="imageContainer" width="100%">
      <img id="videoFrame"
        src={selectedImageIndex === -1 ? "" : imageData.images[selectedImageIndex].file}
        alt="Image"
        style={{ width: '100%', height: 'auto' }}
        onMouseDown={() => {
          if (annotations.length === 0) {
            canvasRef.current.width = videoFrame.width;
            canvasRef.current.height= videoFrame.height;
            canvas.style.top = videoFrame.offsetTop+'px';
            canvas.style.left = videoFrame.offsetLeft+'px';
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
