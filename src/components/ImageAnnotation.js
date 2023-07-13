import { useDispatch } from 'react-redux';
import React, { useState, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { selectImages } from '../store/selectors';

import { addAnnotation, setAnnotationFinished, setCalculatedArea } from '../store/reducers/imagesSlice';

const ImageAnnotation = () => {

  const dispatch = useDispatch();

  const imageData = useSelector(selectImages);
  const selectedImageIndex = imageData.selectedImageIndex;

  const canvasRef = useRef(null);
  const closeDistance = 30;

  let annotations = selectedImageIndex === -1 ? [] : imageData.images[selectedImageIndex].annotations 
  let finishedFlag = selectedImageIndex === -1 ? false : imageData.images[selectedImageIndex].finishedFlag 

  const handleImageClick = (event) => {

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const annotation = { x, y };

    if (!finishedFlag) {

      // let imageDataCopy = [...imageData]

      if (annotations.length > 1) {
        const firstAnnotation = annotations[0];
        const distance = Math.hypot(
          annotation.x - firstAnnotation.x,
          annotation.y - firstAnnotation.y
        );
  
        if (distance > closeDistance) {

          dispatch(addAnnotation({annotation: annotation}))
          
          // imageDataCopy[selectedImageIndex].annotations = [...annotations, annotation];
          // setImageData(imageDataCopy)
        } else {

          // imageDataCopy[selectedImageIndex].annotations = [...annotations, firstAnnotation];
          dispatch(addAnnotation({annotation: firstAnnotation}))

          const area = calculateEnclosedArea(annotations);
          dispatch(setCalculatedArea({area_px: area}))
        }
      } else {
		dispatch(addAnnotation({annotation: annotation}))
      }
    }
  };

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'red';
    context.lineWidth = 1;

    if (annotations.length > 1) {
      context.beginPath();
      context.moveTo(annotations[0].x, annotations[0].y);

      const firstAnnotation = annotations[0];
      const lastAnnotation = annotations[annotations.length - 1];
      const distance = Math.hypot(
        lastAnnotation.x - firstAnnotation.x,
        lastAnnotation.y - firstAnnotation.y
      );

      annotations.forEach((annotation, index) => {
        const { x, y } = annotation;
        context.lineTo(x, y);
        context.stroke();
      });

      if (distance < closeDistance && annotations.length > 2) {
        context.lineTo(firstAnnotation.x, firstAnnotation.y);
        context.stroke();
        context.closePath();

		dispatch(setAnnotationFinished());
      }
    }

    annotations.forEach((annotation) => {
      const { x, y } = annotation;

      context.fillStyle = 'red';
      context.beginPath();
      context.arc(x, y, 2, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    });

    
  }, [annotations]);

  return (
    <div width="100%">
      <img
        src={selectedImageIndex === -1 ? "" : imageData.images[selectedImageIndex].file}
        alt="Image"
        style={{ width: '100%', height: 'auto' }}
        onClick={handleImageClick}
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
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

export default ImageAnnotation;
