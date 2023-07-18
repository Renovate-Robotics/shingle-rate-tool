"use client"

// React imports 
import React, { useState } from 'react';

// Redux imports
import store from '../store/store'
import { Provider } from 'react-redux'

// Custom component imports
import ImageAnnotation from '../components/ImageAnnotation';
import ImageMetadataTable from '../components/ImagesMetadata';
import ProjectParameters from '../components/ProjectParameters';
import ProductivityCharts from '../components/ProductivityCharts';

// Main component of application
export default function Main() {

  return (

    // Redux store provider
    <Provider store={store}>

    {/* Main grid */}
    <div className="ui grid">

      {/* Left column */}
      <div className="two wide column rightcol">

        <div className="ui segment">
          <a href="https://www.renovaterobotics.com/" target="_blank">
            <img src='logo.png' width="100%"/>

          </a>
          
        </div>

        <div className="ui segment">
          <ProjectParameters/>
        </div>

        {/* <div className="ui segment">
          <div className="ui message">
            <div className="header">
              Current Labor Hours Needed
            </div>
            <p>{laborHours.toFixed(1)}</p>
            <div className="header">
              Cost of Labor
            </div>
            <p>${(laborHours*projectData.roofer_wage).toFixed(2)}</p>
          </div>
        </div> */}
      </div>
      

      

      {/* Right column */}
      <div className="eight wide column">
        <div className="ui segment left">
          <ImageAnnotation/>
          <ImageMetadataTable/>
        </div>
      </div>

      {/* Middle column */}
      <div className="six wide column rightcol">
        <div className="ui segment">
          <ProductivityCharts/>
        </div>
      </div>

      </div>
    </Provider>
      

    
  )
}
