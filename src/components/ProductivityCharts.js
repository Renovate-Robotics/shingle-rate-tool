// Importing necessary modules
import React, { useState, useEffect } from 'react';
import regression from 'regression';
import { useSelector } from 'react-redux';
import { selectImages, selectProjectParameters } from '../store/selectors';
import Chart from 'chart.js/auto';
import { Scatter } from 'react-chartjs-2';

// Defining the ProductivityCharts component
const ProductivityCharts = () => {
    
    // Getting the necessary data from the Redux store
    const imageData = useSelector(selectImages);
    const projectData = useSelector(selectProjectParameters);

    // Setting the initial polynomial order to 1
    const [polynomailOrder, setPolynomailOrder] = useState(1); 
    
    // If there is image data available
    if (imageData.images && imageData.images.length > 0) {

        // Filtering out the reference image
        const notReferenceData = imageData.images.filter((x,i)=>(i !== imageData.referenceImageIndex)) 

        // Formatting the data for the chart
        const formattedTimes = notReferenceData.map(x=>x.timestamp)
        const formattedAreas = notReferenceData.map(x=>x.area_px/imageData.images[imageData.referenceImageIndex].area_px * projectData.roof_area.value)
        const formattedData = formattedTimes.map((val,i)=>({x: val, y: formattedAreas[i]}))
        const regressionData = formattedTimes.map((val,i)=>([val, formattedAreas[i]]))

        // Performing polynomial regression on the data
        const result = regression.polynomial(regressionData, { order: polynomailOrder });

        // Formatting the regression data for the chart
        const useful_points = result.points.map(([x, y]) => {return {x, y}})

        // Creating the data object for the first chart
        const data = {
            labels: ['Data Points'],
            datasets: [
            {
                label: 'Coverage',
                data: formattedData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Best Fit',
                data: useful_points,
                borderColor: 'rgba(162, 162, 162, 1)',
                fill: false,
                borderWidth: 1,
                showLine: true,
                pointRadius: 0
            }
            ],
        };
        
        // Creating the options object for the first chart
        const options = {
            scales: {
            x: {title: {display: true, text: "Time (min)"}},
            y: {title: {display: true, text: "Area (sqft)"}},
            },
            plugins: {
            title: {
                display: true,
                text: 'Area Covered by Crew',
            },
            },
        };

        // Handling changes to the polynomial order input
        const handlePolynomialOrderChange = (event) => {
            setPolynomailOrder(Number(event.target.value));
        };

        // Calculating the productivities for each time interval
        let productivities = []
        for (let i = 1; i < useful_points.length; i++) {
            let {x, y} =  useful_points[i]
            let productivity = ((useful_points[i].y - useful_points[i-1].y)/(useful_points[i].x - useful_points[i-1].x))/((notReferenceData[i].num_roofers + notReferenceData[i-1].num_roofers)/2)
            productivities.push({x: x, y: productivity})
        }

        // Creating the data object for the second chart
        const data2 = {
            labels: ['Data Points'],
            datasets: [
            {
                label: 'sqft/min/roofer',
                data: productivities,
                backgroundColor: 'rgba(255,105,97, 0.2)',
                borderColor: 'rgba(255,105,97, 1)',
                borderWidth: 1,
            },
            ],
        };

        // Creating the options object for the second chart
        const options2 = {
            scales: {
                x: {title: {display: true, text: "Time (min)"}},
                y: {title: {display: true, text: "Area Rate per Roofer (sqft)"}},
            },
            plugins: {
            title: {
                display: true,
                text: 'Roofer Productivity',
            },
            },
        };

        const average_productivity = productivities.reduce((a, b) => a + b.y, 0)/productivities.length

        // Rendering the charts and input field
        return (
            <div>
                <Scatter data={data} options={options} />

                &nbsp;

                <div className="ui form">
                    <div className="fields">
                        <div className="field">
                            <label>Regression Order</label>
                            <input
                                type="number"
                                value={polynomailOrder}
                                onChange={handlePolynomialOrderChange}
                            />
                        </div>
                    </div>
                </div>

                &nbsp;

                Fit: {result.string}

                &nbsp;

                <Scatter data={data2} options={options2} />


                <b>Average: </b>

                <br />
                <br />
                
                {average_productivity.toFixed(2)} sqft/min/roofer

                <br />

                {(average_productivity/projectData.exposed_shingle_area.value).toFixed(2)} shingles/min/roofer

            </div>
        );

    } else {
        // If there is no image data available, return an empty div
        return <div/>
    }

}

// Exporting the ProductivityCharts component
export default ProductivityCharts