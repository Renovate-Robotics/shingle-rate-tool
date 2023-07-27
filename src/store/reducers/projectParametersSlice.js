// Importing createSlice function from Redux Toolkit
import { createSlice } from '@reduxjs/toolkit'

// Defining the initial state of the project parameters
const initialState = {
    project_name: {value: "Project Name", display_name: "Project Name", type: "text"},
    roof_area: {value: 6374, display_name: "Roof Area (ft^2)", type: "number"}, 
    exposed_shingle_area: {value: 1.58, display_name: "Exposed Area of Shingle (ft^2)", type: "number"},
    roofer_wage: {value: 20, display_name: "Roofer Wage ($/hr)", type: "number"}, 
    labor_reduction: {value: 50, display_name: "Labor Reduction w/ Rufus (%)", type: "number"}, 
    rufus_lease_cost: {value: 1000, display_name: "Rufus Lease Cost ($/project)", type: "number"},
    manual_shingle_rate: {value: 1, display_name: "Manual Shingle Rate (shingles/minute)", type: "number"}, 
    rufus_shingle_rate: {value: 2, display_name: "Rufus Shingle Rate (shingles/minute)", type: "number"}
}

// Creating a slice of the Redux store for project parameters
export const projectParametersSlice = createSlice({

    name: 'projectParameters', // Name of the slice
    initialState: initialState, // Initial state of the slice
    
    reducers: {
        // Reducer function to update a project parameter
        updateProjectParameter: (state, action) => { 
            state[action.payload.param_name].value = action.payload.value
        },

        // Reducer function to change entire state
        setNewProjectParametersState: (state, action) => {
            
            // Looping through each key in the payload and update the state
            for (const key of Object.keys(action.payload)) {
                state[key] = action.payload[key]
            }
        }
    }
});

// Exporting the updateProjectParameter reducer function
export const { updateProjectParameter, setNewProjectParametersState } = projectParametersSlice.actions;

// Exporting the projectParametersSlice reducer function
export default projectParametersSlice.reducer;