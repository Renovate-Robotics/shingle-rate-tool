// Importing necessary modules
import { useSelector, useDispatch } from 'react-redux'
import { updateProjectParameter } from '../store/reducers/projectParametersSlice'
import { selectProjectParameters } from '../store/selectors'

// Defining a functional component named ProjectParameters
const ProjectParameters = () => {

    // Accessing the project parameters from the redux store
    const projectParameters = useSelector(selectProjectParameters)

    // Creating a dispatch function to update the project parameters
    const dispatch = useDispatch()

    // Rendering the form with input fields for each project parameter
    return (
        <div className="ui form">
            {
                // Mapping through each project parameter and rendering an input field for it
                Object.entries(projectParameters).map(([param_name, param]) => (
                    <div className={param.value ? "field" : "error field"} key={param_name}>
                        <label>{param.display_name}</label>
                        <input value={param.value} 
                               type= {param.type}
                               placeholder={param.display_name} 
                               onChange=
                               {(e) => dispatch(updateProjectParameter({param_name: param_name, value: param.type === "number" ? parseFloat(e.target.value) : e.target.value}))}
                        />
                    </div>
                ))
            }
        </div>
    )
}

// Exporting the ProjectParameters component
export default ProjectParameters;