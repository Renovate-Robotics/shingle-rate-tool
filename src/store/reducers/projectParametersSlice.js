// Importing createSlice function from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit'

// Defining the initial state of the project parameters
const initialState = {
    roof_area: {value: 6374, display_name: "Roof Area (ft^2)"}, 
    shingle_size: {value: 3.6, display_name: "Shingle Size (ft^2)"},
    roofer_wage: {value: 20, display_name: "Roofer Wage ($/hr)"}, 
    labor_reduction: {value: 50, display_name: "Labor Reduction w/ Rufus (%)"}, 
    rufus_lease_cost: {value: 1000, display_name: "Rufus Lease Cost ($/project)"},
    manual_shingle_rate: {value: 1, display_name: "Manual Shingle Rate (shingles/minute)"}, 
    rufus_shingle_rate: {value: 2, display_name: "Rufus Shingle Rate (shingles/minute)"}
}

// Creating a slice of the Redux store for project parameters
export const projectParametersSlice = createSlice({

    name: 'projectParameters', // Name of the slice
    initialState: initialState, // Initial state of the slice
    
    reducers: {
        // Reducer function to update a project parameter
        updateProjectParameter: (state, action) => { 
            state[action.payload.param_name].value = action.payload.value
        }
    }
});

// Exporting the updateProjectParameter reducer function
export const { updateProjectParameter } = projectParametersSlice.actions;

// Exporting the projectParametersSlice reducer function
export default projectParametersSlice.reducer;