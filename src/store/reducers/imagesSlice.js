// Importing createSlice function from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit'

// Constants
const DEFAULT_TIMESTEP = 10;
const DEFAULT_NUM_ROOFERS = 10; 

// Defining the initial state of the project parameters
const initialState = {selectedImageIndex: -1, referenceImageIndex: -1, images: []}

// Creating a slice of the Redux store for project parameters
export const imagesSlice = createSlice({

    name: 'imageData', // Name of the slice
    initialState: initialState, // Initial state of the slice
    
    reducers: {
        
        // Reducer function to add an image to the state
        addImage: (state, action) => {

            // Get the filenames and files from the action payload
            const filenames = action.payload.names;
            const files = action.payload.urls;

            // Calculate appropriate default timestamps for each image
            const timestamps = [...files].map((x, i) => (state.images.length==0) ? 
                                                        (i == 0 ? 0 : (i-1)*DEFAULT_TIMESTEP) : 
                                                        (state.images[state.images.length-1].timestamp + ((i+1)*DEFAULT_TIMESTEP)))

            // Add each image to the state
            for (let i = 0; i < files.length; i++) {
                state.images.push({file: files[i], 
                                   name: filenames[i],
                                   area_px: 0,
                                   timestamp: timestamps[i],
                                   num_roofers: DEFAULT_NUM_ROOFERS,
                                   annotations: [],
                                   finishedFlag: false
                })
            }

            // Set the selected image index and reference image index to the first image if needed 
            if (state.selectedImageIndex === -1) {
                state.selectedImageIndex = 0;
                state.referenceImageIndex = 0;
            }
        },

        // Reducer function to remove an image from the state
        removeImage: (state, action) => {
            const idx = action.payload.idx;
            state.images.splice(idx, 1)
        },

        // Reducer function to move an image up in the state
        moveImageUp: (state, action) => {
            // Get the index of the image to move
            const idx = action.payload.idx;
            // Swap the image with the one above it
            if (idx > 0) {
                const temp = state.images[idx-1];
                state.images[idx-1] = state.images[idx]
                state.images[idx] = temp;
            }
        },

        // Reducer function to move an image down in the state
        moveImageDown: (state, action) => {
            // Get the index of the image to move
            const idx = action.payload.idx;
            // Swap the image with the one below it
            if (idx < (state.images.length-1)) {
                const temp = state.images[idx + 1];
                state.images[idx+1] = state.images[idx]
                state.images[idx] = temp;
            }
        },

        // Reducer function to change the timestamp of an image
        changeTimestamp: (state, action) => {
            // Get the index of the image to change
            const idx = action.payload.idx;
            // Change the timestamp of the image
            state.images[idx].timestamp = parseInt(action.payload.timestamp);
        },

        // Reducer function to change the number of roofers for an image
        changeRooferCount: (state, action) => {
            // Get the index of the image to change
            const idx = action.payload.idx;
            // Change the number of roofers for the image
            state.images[idx].num_roofers = parseInt(action.payload.num_roofers);
        },

        // Reducer function to change the selected image index
        changeSelected: (state, action) => {
            // Get the index of the image to select
            const idx = action.payload.idx;
            // Change the selected image index
            state.selectedImageIndex = idx;
        },

        // Reducer function to change the reference image index
        changeReference: (state, action) => {
            // Get the index of the image to select
            const idx = action.payload.idx;
            // Change the selected image index
            state.referenceImageIndex = idx;
        },

        // Reducer function to add an annotation to an image
        addAnnotation: (state, action) => {
            // Get the annotation to add
            const annotation = action.payload.annotation;
            // Add the annotation to the image
            state.images[state.selectedImageIndex].annotations.push(annotation);
        },

        // Reducer function to set an image's finished flag to true
        setAnnotationFinished: (state, action) => {
            state.images[state.selectedImageIndex].finishedFlag = true;
        },

        // Reducer function to clear an image's annotations
        clearAnnotation: (state, action) => {
            state.images[action.payload.idx].annotations = [];
            state.images[action.payload.idx].finishedFlag = false;
            state.images[action.payload.idx].area_px = 0;
        },

        // Reducer function to set an image's calculated area
        setCalculatedArea: (state, action) => {
            state.images[state.selectedImageIndex].area_px = action.payload.area_px;
        },

        // Reducer function to change entire state
        setNewImagesState: (state, action) => {
            
            // Looping through each key in the payload and update the state
            for (const key of Object.keys(action.payload)) {
                state[key] = action.payload[key]
            }
        }
    }
});

// Exporting the reducer functions
export const { addImage, removeImage, moveImageUp, moveImageDown, 
               changeTimestamp, changeRooferCount, changeSelected, changeReference,
               addAnnotation, setAnnotationFinished, clearAnnotation, setCalculatedArea, setNewImagesState } = imagesSlice.actions;

// Exporting the imagesSlice reducer function
export default imagesSlice.reducer;
