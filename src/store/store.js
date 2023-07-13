import { configureStore } from '@reduxjs/toolkit'
import projectParametersReducer from './reducers/projectParametersSlice';
import imageDataReducer from './reducers/imagesSlice';

// Creating the Redux store
export default configureStore({
    reducer: {
        projectParameters: projectParametersReducer,
        imageData: imageDataReducer
    }
});