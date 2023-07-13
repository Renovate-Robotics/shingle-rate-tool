"use client"

// React imports 
import React, { useState } from 'react';

import store from '../store/store'
import { Provider } from 'react-redux'

import { useSelector } from 'react-redux';
import { selectProjectParameters, selectImages } from '../store/selectors';

// Custom component imports
import ImageAnnotation from '../components/ImageAnnotation';
import ImageMetadataTable from '../components/ImagesMetadata';
import ProjectParameters from '../components/ProjectParameters';
import ProductivityCharts from '../components/ProductivityCharts';

// Main component of application
export default function Main() {

  return (
    <Provider store={store}>
    <div class="ui grid">
      <div class="eight wide column">
        <div class="ui segment left">

          <ImageAnnotation/>
          <ImageMetadataTable/>

        </div>
      </div>

      <div class="two wide column rightcol">
        <div class="ui segment">
          <ProjectParameters/>
        </div>

        {/* <div class="ui segment">
          <div class="ui message">
            <div class="header">
              Current Labor Hours Needed
            </div>
            <p>{laborHours.toFixed(1)}</p>
            <div class="header">
              Cost of Labor
            </div>
            <p>${(laborHours*projectData.roofer_wage).toFixed(2)}</p>
          </div>
        </div> */}
      </div>

      <div class="six wide column rightcol">
        
        <div class="ui segment">
          <ProductivityCharts/>
        </div>
        
      </div>

      </div>
    </Provider>
      

    
  )
}
