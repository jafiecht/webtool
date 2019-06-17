import { sequence, state } from 'cerebral';
import {featureCollection, point, polygon} from '@turf/helpers';
import * as turf from '@turf/turf';
import ls from 'local-storage';
import axios from 'axios';
var shapefile = require('shapefile');

var serverUrl = 'http://localhost:5000/'

////////////////////////////////////////////////////////////////////////
//Change the page. Will likely need a rework
export const changePage = sequence("changePage", [
  ({store, props}) => {
    store.set(state`currentPage`, props.page)
    ls(`currentPage`, props.page)
  },
]); 

////////////////////////////////////////////////////////////////////////
//Remove existing soil data
export const deleteSoilData = sequence("deleteSoilData", [
  ({store}) => {
    store.set(state`csvData`, {});
    ls(`csvData`, {});
    store.set(state`shpData`, {});
    ls(`shpData`, {});
    store.set(state`map`, {
      mapCenter: [],
      vertices: {},
      observations: [],
    });
    ls(`map`, {
      mapCenter: [],
      vertices: {},
      observations: [],
    });
    store.set(state`geojson`, {
      points: {},
      boundary: {},
    });
    ls(`geojson`, {
      points: {},
      boundary: {},
    });
  },
]);

////////////////////////////////////////////////////////////////////////
//Change the type of import file and remove existing data
export const setFileType = sequence("setFileType", [
  ({store, props}) => {
    store.set(state`fileType`, props.type)
    ls(`fileType`, props.type)
  },
  deleteSoilData,
]); 

////////////////////////////////////////////////////////////////////////
//Read in and validate a csv
export const loadCSV = sequence("loadCSV", [
  ({store, get, props}) => {
    var reader = new FileReader();
    reader.onload = function(e) {
      var text = reader.result;
      var array = text.split(/\n/);
      var rows = [];
      for (var i = 0; i < (array.length - 1); i++) {
        rows.push(array[i].split(','));
      }
 
      //Validate the shape of the input
      var err = null;
      var length = rows[0].length;
      rows.forEach((row) => {
        if (row.length !== length) {
          err = 'CSV has invalid shape. Review file and try again.';
        }
      });
      if (err) {
        store.set(state`error`, err);
      } else {
        if (rows.length < 11) {
          err = `${rows.length - 1} is not enough points for interpolation. At least ten observations are required.`;
        } 
        if (err) {
          store.set(state`error`, err);
        } else {
          store.set(state`csvData`, {
            data: rows,
            header: true,
            latIndex: 'Select Field',
            lonIndex: 'Select Field',
            interestIndex: 'Select Field',
          });
          ls(`csvData`, get(state`csvData`));
        };
      }
    }
    reader.readAsText(props.file[0]);
  },
]);


////////////////////////////////////////////////////////////////////////
//Validate the csv lat field chosen by user
export const toggleHeader = sequence("toggleHeader", [
  ({store, get}) => {
    store.toggle(state`csvData.header`);
    store.set(state`csvData.latIndex`, 'Select Field');
    store.set(state`csvData.lonIndex`, 'Select Field');
    store.set(state`csvData.interestIndex`, 'Select Field');
    ls(`csvData`, get(state`csvData`));
  },
]);
 
////////////////////////////////////////////////////////////////////////
//Validate the csv lat field chosen by user
export const setLat = sequence("setLat", [
  ({store, get, props}) => {
    var data = get(state`csvData.data`);
    if (get(state`csvData.header`)) {
      data = data.slice(1);
    }
    var err = null;
    data.forEach((row) => {
      if (row[props.index] > 90 || row[props.index] < -90 || isNaN(row[props.index])) {
        err = 'Field selected has invalid values for WGS84 latitude. Review field and try again.';
      }
    });
    if (err) {
      store.set(state`error`, err);
    } else {
      store.set(state`csvData.latIndex`, props.index);
      ls(`csvData`, get(state`csvData`));
    }
  },
]); 

////////////////////////////////////////////////////////////////////////
//Validate the csv lon field chosen by user
export const setLon = sequence("setLon", [
  ({store, get, props}) => {
    var data = get(state`csvData.data`);
    if (get(state`csvData.header`)) {
      data = data.slice(1);
    }
    var err = null;
    data.forEach((row) => {
      if (row[props.index] > 180 || row[props.index] < -180 || isNaN(row[props.index])) {
        err = 'Field selected has invalid values for WGS84 longitude. Review field and try again.';
      }
    });
    if (err) {
      store.set(state`error`, err);
    } else {
      store.set(state`csvData.lonIndex`, props.index)
      ls(`csvData`, get(state`csvData`));
    }
  },
]); 

////////////////////////////////////////////////////////////////////////
//Validate the field to interpolate chosen by user
export const setInterest = sequence("setInterest", [
  ({store, get, props}) => {
    var data = get(state`csvData.data`);
    if (get(state`csvData.header`)) {
      data = data.slice(1);
    }
    var err = null;
    data.forEach((row) => {
      if (isNaN(row[props.index])) {
        err = 'Field selected for interpolation is not a number. Review field and try again.';
      }
    });
    if (err) {
      store.set(state`error`, err);
    } else {
      store.set(state`csvData.interestIndex`, props.index)
      ls(`csvData`, get(state`csvData`));
    }
  },
]); 


////////////////////////////////////////////////////////////////////////
//Validate the field to interpolate chosen by user for the shapefile
export const setProperty = sequence("setProperty", [
  ({store, get, props}) => {
    var shpGeojson  = get(state`shpData.geojson`);
    
    var err = null;
    shpGeojson.features.forEach((feature) => {
      if (isNaN(feature.properties[props.property])) {
        err = 'Field selected for interpolation is not a number. Review field and try again.';
      }
    });
    if (err) {
      store.set(state`error`, err);
    } else {
      store.set(state`shpData.propertyLabel`, props.property)
      ls(`shpData`, get(state`shpData`));
    }
  },
]); 


////////////////////////////////////////////////////////////////////////
//Read in a shapefile
export const loadShp = sequence("loadShp", [
  ({store, props, get}) => {
    var reader = new FileReader();
    reader.onload = function(e) {
      var text = reader.result;
      store.set(state`shpData.rawShp`, [text]);
      ls(`shpData`, get(state`shpData`));
    }
    reader.readAsArrayBuffer(props.file[0]);
  },
]);

////////////////////////////////////////////////////////////////////////
//Delete shapefile
export const deleteShp = sequence("deleteShp", [
  ({store, get}) => {
    store.set(state`shpData`, {});
    ls(`shpData`, get(state`shpData`));
  }
]);


////////////////////////////////////////////////////////////////////////
//Read in a .dbf file, read the shapefile and validate
export const loadDbf = sequence("loadDbf", [
  ({store, props, get}) => {
    var reader = new FileReader();
    reader.onload = async function(e) {
      var array = reader.result;
      store.set(state`shpData.rawDbf`, [array]);
      ls(`shpData`, get(state`shpData`));
   
      shapefile.read(get(state`shpData.rawShp`)[0], get(state`shpData.rawDbf`)[0])
        .then((result) => {
          
          //Are there enough points?
          if (result.features.length > 9) {

            //Are there properties?
            var properties = Object.keys(result.features[0].properties);
            if (properties.length > 0) {
              
              //Do all the points have the same properties?
              var propertyErr;
              result.features.forEach(feature=> {
                properties.forEach(property => {
                  if (!(property in feature.properties)) {
                    propertyErr = 'Works!';
                  }
                })
              })
 
              if (!propertyErr) {
 
                //Are the points spread out over too large an area?
                var bbox = turf.bboxPolygon(result.bbox);
                if (turf.area(bbox) < 2580000 && turf.length(bbox) < 6) {

                  //Is the area of interest large enough?
                  if (turf.area(bbox) > 4050) {
                    store.set(state`shpData.geojson`, result);
                    store.set(state`shpData.propertyLabel`, 'Select Field');
                    ls(`shpData`, get(state`shpData`));

                  } else {
                    store.set(state`error`, 'Points are are in to small an area for interpolation.')
                    store.set(state`shpData`, {});
                    ls(`shpData`, get(state`shpData`));
                  }
       
                } else {
                  store.set(state`error`, 'Points are spread out over too large an area.')
                  store.set(state`shpData`, {});
                  ls(`shpData`, get(state`shpData`));
                }

              } else {
                store.set(state`error`, propertyErr);
                store.set(state`shpData`, {});
                ls(`shpData`, get(state`shpData`));
              }              

            } else {
              var err = 'There are no property values. Check .dbf file.'
              store.set(state`error`, err);
              store.set(state`shpData`, {});
              ls(`shpData`, get(state`shpData`));
            }

          } else {
            store.set(
               state`error`,
              `${result.features.length} is not enough points for interpolation. At least ten observations are required.`
            );
            store.set(state`shpData`, {});
            ls(`shpData`, get(state`shpData`));
          }
 
        })
        .catch(() => {
          var err = 'Unable to read files provided. Validate file content and format.'
          store.set(state`error`, err);
          store.set(state`shpData`, {});
          ls(`shpData`, get(state`shpData`));
        });
    }
    reader.readAsArrayBuffer(props.file[0])
  }
]);


////////////////////////////////////////////////////////////////////////
//Assemble the observations into a lat/lon set for the map.
export const assembleObservations = sequence("assembleObservations", [
  ({store, get, props}) => {
    if (get(state`fileType`) === 'csv') {
      var csvData = get(state`csvData`);
  
      //Has a file been uploaded?
  		if(Object.keys(csvData).length > 0) {
        //Have lat, lon, and interest been chosen?
        if(csvData.latIndex === 'Select Field' || csvData.lonIndex === 'Select Field' || csvData.interestIndex === 'Select Field') {
          store.set(state`error`, 'Latitude, Longitude, and Field to Interpolate are required fields. Select before continuing.');
        } else {
          var observations = [];
          csvData.data.forEach((values) => {
            var observation = [
              values[csvData.latIndex], 
              values[csvData.lonIndex], 
              values[csvData.interestIndex]
            ];
            observations.push(observation); 
          });
          //Remove head if need be.
          if (csvData.header) { observations.shift() }
          var features = [];
          observations.forEach((obs) => {
            features.push(point([obs[1], obs[0]], {value: obs[2]}));
          });
          var pointsGeojson = featureCollection(features);
          var bbox = turf.bboxPolygon(turf.bbox(pointsGeojson));
          if (turf.area(bbox) > 2580000 || turf.length(bbox) > 6) {
            store.set(state`error`, 'Points are spread out over too large an area.')
          } else {
            if (turf.area(bbox) < 4050) {
              store.set(state`error`, 'Point area is too small for interpolation.')
            } else {
              store.set(state`geojson.points`, pointsGeojson);       
              ls(`geojson`, get(state`geojson`));       
              store.set(state`map.observations`, observations);
              ls(`map`, get(state`map`));
              store.set(state`currentPage`, 2);
              ls(`currentPage`, 2);
            }
          }
        }
      } else {
        store.set(state`error`, 'Select file before continuing.');
      }
 
    //The file is a shapefile
    } else {
     
      var shpData = get(state`shpData`);

      //Are all the files loaded and validated?
      if (shpData.rawShp && shpData.rawDbf && shpData.geojson) {
       
        //Has a property been selected?
        if (shpData.propertyLabel !== 'Select Field') {
          var geojson = {
            features: [],
            type: shpData.geojson.type
          };       

          var obs = [];

          shpData.geojson.features.forEach(feature => {
            var paredFeature = {};
            paredFeature.geometry = feature.geometry;
            paredFeature.type = feature.type;
            paredFeature.properties = {};
            paredFeature.properties.value = feature.properties[shpData.propertyLabel];
            geojson.features.push(paredFeature);
            obs.push([
              feature.geometry.coordinates[1], 
              feature.geometry.coordinates[0], 
              feature.properties[shpData.propertyLabel]
            ])
          })
          store.set(state`geojson.points`, geojson);       
          ls(`geojson`, get(state`geojson`));       
          store.set(state`map.observations`, obs);
          ls(`map`, get(state`map`));
          store.set(state`currentPage`, 2);
          ls(`currentPage`, 2);
  
        } else {
          store.set(state`error`, 'Select property to interpolate before continuing.');
        }

      } else {
        store.set(state`error`, 'Select file before continuing.');
      }
    }
  },
]); 


////////////////////////////////////////////////////////////////////////
//Clear errors
export const clearError = sequence("clearError", [
  ({store}) => {store.set(state`error`, null)},
]);


////////////////////////////////////////////////////////////////////////
//Track the map center
export const trackMap = sequence("trackMap", [
  ({store, get, props}) => {
    store.set(state`map.mapCenter`, [props.lat, props.lon]);
    ls(`map`, get(state`map`));
  },
]);

////////////////////////////////////////////////////////////////////////
//Create new boundary vertex
export const newVertex = sequence("newVertex", [
  ({store, get}) => {
    var mapCenter = get(state`map.mapCenter`);
    var keys = Object.keys(get(state`map.vertices`));
    var key = keys.length;
    store.set(state`map.vertices.${key}`, mapCenter);
    ls(`map`, get(state`map`));
  },
]);

////////////////////////////////////////////////////////////////////////
//Reset a boudary vertex location
export const resetVertex = sequence("resetVertex", [
  ({store, get, props}) => {
    store.set(state`map.vertices.${props.id}`, [props.lat, props.lon]);
    ls(`map`, get(state`map`));
  },
]);

////////////////////////////////////////////////////////////////////////
//Remove the last boundary vertex added
export const removeVertex = sequence("removeVertex", [
  ({store, get}) => {
    var keys = Object.keys(get(state`map.vertices`));
    if (keys.length > 0) {
      store.unset(state`map.vertices.${Math.max(...keys)}`);
      ls(`map`, get(state`map`));
    }
  },
]);

////////////////////////////////////////////////////////////////////////
//Make the boundary into a geojson and validate input.
export const validateBoundary = sequence("validateBoundary", [
  ({store, get, props}) => {
    var vertices = get(state`map.vertices`);

    //Has a file been uploaded?
		if(Object.keys(vertices).length === 0) {
      store.set(state`error`, 'No boundary drawn');
    } else {
      //Have lat, lon, and interest been chosen?
		  if(Object.keys(vertices).length < 3) {
        store.set(state`error`, 'Boundary must consist of at least 3 vertices');
      } else {
        var vertexList = [];
        Object.keys(vertices).forEach((vertex) => {
          vertexList.push([vertices[vertex][1], vertices[vertex][0]]);
        });
        vertexList.push([vertices[0][1], vertices[0][0]]);
        var feature = polygon([vertexList]);
        if (turf.area(feature) > 2580000 || turf.length(feature) > 6) {
          store.set(state`error`, 'Area selected is too large.')
        } else {
          if (turf.area(feature) < 4050) {
            store.set(state`error`,'Area selected is too small.')
          } else {
            var points = get(state`geojson.points.features`);
            var inside = true;
            points.forEach((observation) => {
              if (!turf.booleanPointInPolygon(observation, feature)) {
                inside = false;
              } 
            });
            if (!inside) {
              store.set(state`error`,'All points must be inside boundary.')
            } else {
              var crosses = turf.kinks(feature);
              if (crosses.features.length !== 0) {
                store.set(state`error`,'Boundary cannot cross itself.')
              } else {
               var boundary = featureCollection(feature);
               store.set(state`geojson.boundary`, boundary);       
               ls(`geojson`, get(state`geojson`));       
               store.set(state`currentPage`, 3);
               ls('currentPage', 3);
              }
            }
          }
        }
      }
    }
  },
]); 


////////////////////////////////////////////////////////////////////////
//Submit the interpolation request
export const submitRequest = sequence("submitRequest", [
  ({store, get, props}) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get(state`request.email`))) {

      axios({
        method: 'post',
        url: serverUrl + 'submit',
        data: {
          email: get(state`request.email`),
          points: get(state`geojson.points`),
          boundary: get(state`geojson.boundary`),
        },
      }).then((response) => {
          store.set(state`currentPage`, 4);
          store.set(state`request.id`, response.data.id);
          store.unset(state`request.email`);
          ls('currentPage', 4);
        } 
      ).catch((err) => {
          store.set(state`error`,'A server error has occured. Please re-submit your request at another time.');
        }
      );
    } else {
      store.set(state`error`,'Please enter a valid email address.')
    };
  },
]);


////////////////////////////////////////////////////////////////////////
//Update user email as user inputs email
export const updateEmail = sequence("updateEmail", [
  ({store, props}) => {
    store.set(state`request.email`, props.email);
  },
]);


////////////////////////////////////////////////////////////////////////
//Update request ID as user inputs id
export const updateInputID = sequence("updateInputID", [
  ({store, props}) => {
    store.set(state`request.inputID`, props.id);
  },
]);

////////////////////////////////////////////////////////////////////////
//Clear last request id and reset page
export const newRequest = sequence("newRequest", [
  ({store, props}) => {
    store.unset(state`request.inputID`);
    store.unset(state`request.id`);
    store.unset(state`request.status`);
    store.set(state`currentPage`, 1);
    ls('currentPage', 1)
  },
]);


////////////////////////////////////////////////////////////////////////
//Check the status of a request
export const checkStatus = sequence("checkStatus", [
  ({store, get}) => {
    if (get(state`request.inputID`)) {

      axios.get(serverUrl + 'status', {
        params: {
          id: get(state`request.inputID`),
        },
      }).then((response) => {
          console.log(response.data.status);
          store.set(state`request.status`, response.data.status);
          if (response.data.status === 'complete') {
           
            console.log(response.data);
            if (response.data.tifPath  && response.data.jpgPath && response.data.bounds) {
              store.set(state`request.tifPath`, serverUrl + response.data.tifPath);
              store.set(state`request.jpgPath`, serverUrl + response.data.jpgPath);
              store.set(state`request.bounds`, response.data.bounds);
            } else {
              store.unset(state`request.status`);
              store.set(state`error`,'A server error has occured. Please check status at another time.');
            }
          }
          
        } 
      ).catch((err) => {
          store.set(state`error`,'A server error has occured. Please check status at another time.');
        }
      );
    } else {
      store.set(state`error`,'Please enter a request id.')
    };
  },
]);

////////////////////////////////////////////////////////////////////////
//Change the page to view data without saving locally
export const viewData = sequence("viewData", [
  ({store, props}) => {
    store.set(state`currentPage`, 5)
  },
]); 


////////////////////////////////////////////////////////////////////////
//Change the page to view data without saving locally
export const backToWelcome = sequence("backToWelcome", [
  ({store, props}) => {
    store.set(state`currentPage`, 0)
    ls('currentPage', 0)
    store.set(state`request`, {})
  },
]); 


////////////////////////////////////////////////////////////////////////
//Load data from local storage
export const loadState = sequence("LoadState", [
  ({store}) => {

    if(ls('currentPage') !== null) {
      store.set(state`currentPage`, ls('currentPage'));
    }

    if(ls('fileType') !== null) {
      store.set(state`fileType`, ls('fileType'));
    }

    if(ls('csvData') !== null) {
      store.set(state`csvData`, ls('csvData'));
    }

    if(ls('shpData') !== null) {
      store.set(state`shpData`, ls('shpData'));
    }

    if(ls('map') !== null) {
      store.set(state`map`, ls('map'));
    }

    if(ls('geojson') !== null) {
      store.set(state`geojson`, ls('geojson'));
    }
  },
]);
