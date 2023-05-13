/*
    Program: main.js
    Programmer: Olivia Escobar
    Date: March 25 2023
    Purpose: create map with options of different geojson layers, basemaps,
            and show coodinate values
*/

import './style.css';
import { Map, View } from './ol';
import TileLayer from './ol/layer/Tile';
import Stamen from './ol/source/Stamen';
import { fromLonLat } from './ol/proj';

//add mouse control modules
import MousePosition from './ol/control/MousePosition.js';
import { createStringXY } from './ol/coordinate.js';

//add modules for geoJSON files
import VectorLayer from './ol/layer/Vector';
import GeoJSON from './ol/format/GeoJSON';
import { Vector as vectorSource } from './ol/source';

// add modules for styling points, lines, and polygons
import { Style, Icon, Stroke, Fill } from './ol/style';

// global scope variables
var mainMap;
var restaurantsLyr;
var parksLyr;
var streetsLyr;
var terrain;
var toner;

//after the document/HTML window loads, execute the init function
document.addEventListener("DOMContentLoaded", init);

// function to switch between basemap based on which radio button is checked
function changebase() {
  let terrainCheck = document.getElementById('terrainbutton');
  let tonerCheck = document.getElementById('tonerbutton');

  if (terrainCheck.checked) {
    terrain.setVisible(true);
    toner.setVisible(false);
  } else if (tonerCheck.checked) {
    terrain.setVisible(false);
    toner.setVisible(true);
  };
};


// function that creates map with two different basemaps, creates mouse object 
// to show lat/long,calls to add geojson layers to map, and creates event listeners
// for each layer option
function init() {
  mainMap = new Map({
    target: 'mapDiv',
    layers: [
      terrain = new TileLayer({
        source: new Stamen({
          layer: 'terrain'
        })
      }),
      toner = new TileLayer({
        source: new Stamen({
          layer: 'toner'
        })
      })
    ],
    view: new View({
      center: fromLonLat([-78.942207, 43.879841]),
      zoom: 14
    })
  });

  // create mouse object to show long/lat based on mouse position
  var myMouse = new MousePosition({
    coordinateFormat: createStringXY(3),
    projection: 'EPSG:4326',
    target: document.getElementById("myMousePosition"),
    undefinedHTML: '&nbsp;'
  });

  //add myMouse object to the map 
  mainMap.addControl(myMouse);

  //call whitbyLayers() function to add layers to map
  whitbylayers();

  // create an event listener for the checkbox to turn restaurant layer on/off
  document.getElementById("restaurantVis").addEventListener("click", restaurantLyrVis);

  // create an event listener for the checkbox to turn street layer on/off
  document.getElementById("streetVis").addEventListener("click", streetLyrVis);

  // create an event listener for the checkbox to turn park layer on/off
  document.getElementById("parkVis").addEventListener("click", parkLyrVis);

  // create an event listener for the radiobutton to turn terrain basemap on/off
  document.getElementById("terrainbutton").addEventListener("click", changebase);

  // create an event listener for the radiobutton to turn toner basemap on/off
  document.getElementById("tonerbutton").addEventListener("click", changebase);
};


// function to make park layer visibility
function parkLyrVis() {
  let restCheck = document.getElementById('parkVis');

  if (restCheck.checked) {
    parksLyr.setVisible(true);
  } else {
    parksLyr.setVisible(false);
  }
};


// function to make restaurant layer visibility
function restaurantLyrVis() {
  let restCheck = document.getElementById('restaurantVis');

  if (restCheck.checked) {
    restaurantsLyr.setVisible(true);
  } else {
    restaurantsLyr.setVisible(false);
  }
};


// function to make street layer visibility
function streetLyrVis() {
  let restCheck = document.getElementById('streetVis');

  if (restCheck.checked) {
    streetsLyr.setVisible(true);
  } else {
    streetsLyr.setVisible(false);
  }
};


// function to add geojson layers
function whitbylayers() {

  // create icon for points in restaurants layer 
  var restaurantIcon = new Style({
    image: new Icon({
      src: './icons/restaurants.png',
      scale: 0.65
    })

  });

  // define and add restaurant (point) geoJSON  file
  var restaurantsFile = 'geojson/points.geojson';

  restaurantsLyr = new VectorLayer({
    source: new vectorSource({
      url: restaurantsFile,
      format: new GeoJSON()
    }),
    style: restaurantIcon
  });

  // define the style for the streets
  var streetsStyle = new Style({
    stroke: new Stroke({
      color: 'black',
      width: 4,
      lineDash: [70, 45, 30, 45]
    })
  });

  // define and add streets (line) geoJSON  file
  var streetsFile = 'geojson/streets.geojson';

  streetsLyr = new VectorLayer({
    source: new vectorSource({
      url: streetsFile,
      format: new GeoJSON()
    }),
    style: streetsStyle
  });

  // define style for the geoJSON parks (polygon) layer
  var parksStyle = new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: 'green'
    })
  });

  // define and add parks (polygon)) geoJSON  file
  var parksFile = 'geojson/parks.geojson';

  parksLyr = new VectorLayer({
    source: new vectorSource({
      url: parksFile,
      format: new GeoJSON()
    }),
    style: parksStyle
  });

  // add layers to map
  mainMap.getLayers().extend([parksLyr, streetsLyr, restaurantsLyr])
};

