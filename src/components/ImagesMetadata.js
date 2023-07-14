// Import necessary dependencies
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { selectImages, selectProjectParameters } from '../store/selectors';
import { saveObjectAsFile } from '../utils/utils';

import { setNewProjectParametersState } from '../store/reducers/projectParametersSlice';
import { addImage, removeImage, moveImageUp, moveImageDown, clearAnnotation, 
	     changeTimestamp, changeRooferCount, changeSelected, changeReference, setNewImagesState} from '../store/reducers/imagesSlice';

// Define the ImagesMetadata component
const ImagesMetadata = () => {

	// Get the project parameters and image data from the Redux store
	const projectParameters = useSelector(selectProjectParameters);
	const imageData = useSelector(selectImages);

	// Get the dispatch function from the Redux store
	const dispatch = useDispatch();

	// Function to check if an array is sorted
	const isSorted = (arr) => arr.reduce((acc, curr, i) => acc && (i === 0 || curr >= arr[i - 1]), true);

	// Check if the imageData.images array is sorted by timestamp
	let timestampSortedFlag = isSorted(imageData.images.map(x=>x.timestamp))

	// Set the class for the timestamp input based on whether the array is sorted or not
	let timestampClass = timestampSortedFlag ? "ui fluid input" : "ui fluid input error"

	// Add an event listener for keydown events and remove it when the component unmounts
	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress);
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [imageData]);

	// Function to handle keypress events	
	function handleKeyPress(event) {
		if (event.key === "w" || event.key === "s") {
		  if (event.key === "w" && imageData.selectedImageIndex > 0) {
			dispatch(changeSelected({idx: imageData.selectedImageIndex-1}))
		  }
		  else if (event.key === "s" && imageData.selectedImageIndex < (imageData.images.length-1)) {
			dispatch(changeSelected({idx: imageData.selectedImageIndex+1}))
		  }
		}
	}

	// Download the entire store to local storage
	function saveStore() {
		
		// Construct new save object with project parameters and image data
		const saveData = {
			projectParameters: projectParameters,
			imageData: imageData
		}

		// Save the project parameters and image data to local storage
		saveObjectAsFile(saveData, (projectParameters.project_name.value + '.json'))
	};

	// Load the entire store from local JSON file
	function loadStore(file) {
		
		// Create reader
		const reader = new FileReader();
		reader.onload = (e) => {

			// Parse the JSON file
			const text = e.target.result;
			const obj = JSON.parse(text);

			const newProjectParameters = obj.projectParameters;
			const newImageData = obj.imageData;

			// Set the project parameters and image data in the Redux
			// store to the parsed JSON file
			dispatch(setNewProjectParametersState(newProjectParameters))
			dispatch(setNewImagesState(newImageData))
		}

		// Read the file as text
		reader.readAsText(file);

	}

	// This function takes an array of files and reads them as data URLs using the FileReader API.
	// The resulting data URLs are added to an array and then dispatched to the Redux store as new images.
	function addImages(files) {

		// Initialize an empty array to store the data URLs
		const images = []

		// Loop over each file in the array
		for (let i = 0, len = files.length; i < len; i++) {
			var file = files[i];

			// Create a new FileReader object
			var reader = new FileReader();

			// Add an onload event listener to the reader
			reader.onload = (function(f) {
				return function(e) {
					// Push the resulting data URL to the images array
					images.push({index: i, name: f.name, value: this.result})

					// If all files have been read, dispatch the new image to the Redux store
					if (images.length === files.length) {

						images.sort((a,b) => a.index - b.index).map(x=>x.index);
						dispatch(addImage({names: images.map(x=>x.name), urls: images.map(x=>x.value)}));
					}
				};
			})(file);

			// Read the file as a data URL (base 64 image)
			reader.readAsDataURL(file);
		}
	}

	// Render the component
	return (

		<div className="filetablecontainer">
			<table class="ui celled table">

				{/* Render the table header */}
				<thead><tr>
						<th>Selected</th>
						<th>Reference</th>
						<th>Filename</th>
						<th>Time (min)</th>
						<th># Roofers</th>
						<th>Area (sqft)</th>
						<th>Controls</th>
				
				</tr></thead>

				{/* Render the table body */}
			  	<tbody>

					{/* Map over the images in the imageData array and render a row for each image */}
					{imageData.images.map((x, i)=>
					
					<tr>
						{/* Button to select/unselect an image */}
						<td data-label="Selected">
							{
							<button class="ui icon button" onClick={(e) => dispatch(changeSelected({idx: i}))}>
							{i === imageData.selectedImageIndex ? 
								<i class="green large check circle icon" /> : 
								<i class="large circle outline icon" />}
							</button>}
						</td>

						{/* Button to set/unset the reference image */}
						<td data-label="Reference">
							{
							<button class="ui icon button" onClick={(e) => dispatch(changeReference({idx: i}))}>
							{i === imageData.referenceImageIndex ? 
								<i class="orange large check circle icon" /> : 
								<i class="large circle outline icon" />}
							</button>
							}
						</td>

						{/* File name from import */}
						<td data-label="Filename">{x.name}</td>

						{/* Render the timestamp input if the current image is not the reference image */}
						<td data-label="Time (min)">
							{i === imageData.referenceImageIndex ? <></> : 
								(<div class = {timestampClass}>
									<input type="number" value={x.timestamp} onChange={(e) => dispatch(changeTimestamp({idx: i, timestamp: e.target.value}))}/>
								</div>)}
						</td>

						{/* Render the number of roofers input if the current image is not the reference image */}
						<td data-label="# Roofers">
							{i === imageData.referenceImageIndex ? <></> : (
								<div class = "ui fluid input">
									<input type="number" value={x.num_roofers} onChange={(e) => dispatch(changeRooferCount({idx: i, num_roofers: e.target.value}))} />
								</div>)}
						</td>

						{/* Render the area label of the image */}
						<td data-label="Area">
							{(imageData.referenceImageIndex !== -1) ? (x.area_px / imageData.images[imageData.referenceImageIndex].area_px * projectParameters.roof_area.value).toFixed(2) : 0}
						</td>

						{/* Render the controls for the image */}
						<td data-label="Controls">
						{<div>
							<button class="ui icon button" onClick={(e) => dispatch(clearAnnotation({}))}>
								<i class="arrow undo icon"></i>
							</button>
							{(i === imageData.referenceImageIndex) ? <></> : (
							<button class="ui icon button" onClick={(e) => dispatch(moveImageUp({idx: i}))}>
								<i class="arrow up icon"></i>
							</button>
							)}
							{(i === imageData.referenceImageIndex) ? <></> : (
							<button class="ui icon button" onClick={(e) => dispatch(moveImageDown({idx: i}))}>
								<i class="arrow down icon"></i>
							</button>
							)}
							<button class="ui icon button" onClick={(e) => dispatch(removeImage({idx: i}))}>
								<i class="trash icon"></i>
							</button>
							</div>}
							
						</td>
					</tr>)
					}
			  	</tbody>

			  {/* Render the "Add Image(s)" button */}
			  <tfoot class="full-width">
				<tr><th colSpan="7">

					<button className="ui left floated small labeled icon button"
							onClick={() => saveStore()}>
						<i className="save icon"></i> Save Project
					</button>

					<label htmlFor="load-store" className="ui left floated small labeled icon button">
						<i className="upload icon"></i> Load Project
					</label>

					<label htmlFor="file-input" className="ui right floated small primary labeled icon button">
						<i className="image icon"></i> Add Image(s)
					</label>

					<input
						id       = "load-store" type="file"
						accept   = "application/JSON" 
						style    = {{ display: 'none' }}
						onClick  = {(e) => e.target.value = null}
						onChange = {(e) => loadStore(e.target.files[0])}
					/>

					<input
						id       = "file-input" type="file"
						accept   = "image/*" multiple
						style    = {{ display: 'none' }}
						onClick  = {(e) => e.target.value = null}
						onChange = {(e) => addImages(e.target.files)}
					/>
				</th></tr>
			</tfoot>

			</table>
		  </div>
	)
}

// Export the ImagesMetadata component as the default export
export default ImagesMetadata;
