import { sequence, state } from 'cerebral';
import {featureCollection, point, polygon} from '@turf/helpers';
import * as turf from '@turf/turf';
import ls from 'local-storage';
import axios from 'axios';
import FileDownload from 'js-file-download';

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
  ({store, props}) => {
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
            latLabel: 'Select Field',
            lonLabel: 'Select Field',
            interestLabel: 'Select Field',
          });
          ls(`csvData`, {
            data: rows,
            latLabel: 'Select Field',
            lonLabel: 'Select Field',
            interestLabel: 'Select Field',
          });
        };
      }
    }
    reader.readAsText(props.file[0]);
  },
]);

////////////////////////////////////////////////////////////////////////
//Validate the csv lat field chosen by user
export const setLat = sequence("setLat", [
  ({store, get, props}) => {
    var csvData = get(state`csvData.data`);
    var latIndex = csvData[0].indexOf(props.lat);
    var data = csvData.slice(1);
    var err = null;
    data.forEach((row) => {
      if (row[latIndex] > 90 || row[latIndex] < -90 || isNaN(row[latIndex])) {
        err = 'Field selected has invalid values for WGS84 latitude. Review field and try again.';
      }
    });
    if (err) {
      store.set(state`error`, err);
    } else {
      store.set(state`csvData.latLabel`, props.lat);
      ls(`csvData`, get(state`csvData`));
    }
  },
]); 

////////////////////////////////////////////////////////////////////////
//Validate the csv lon field chosen by user
export const setLon = sequence("setLon", [
  ({store, get, props}) => {
    var csvData = get(state`csvData.data`);
    var lonIndex = csvData[0].indexOf(props.lon);
    var data = csvData.slice(1);
    var err = null;
    data.forEach((row) => {
      if (row[lonIndex] > 90 || row[lonIndex] < -90 || isNaN(row[lonIndex])) {
        err = 'Field selected has invalid values for WGS84 longitude. Review field and try again.';
      }
    });
    if (err) {
      store.set(state`error`, err);
    } else {
      store.set(state`csvData.lonLabel`, props.lon)
      ls(`csvData`, get(state`csvData`));
    }
  },
]); 

////////////////////////////////////////////////////////////////////////
//Validate the field to interpolate chosen by user
export const setInterest = sequence("setInterest", [
  ({store, get, props}) => {
    var csvData = get(state`csvData.data`);
    var interestIndex = csvData[0].indexOf(props.interest);
    var data = csvData.slice(1);
    var err = null;
    data.forEach((row) => {
      if (isNaN(row[interestIndex])) {
        err = 'Field selected for interpolation is not a number. Review field and try again.';
      }
    });
    if (err) {
      store.set(state`error`, err);
    } else {
      store.set(state`csvData.interestLabel`, props.interest)
      ls(`csvData`, get(state`csvData`));
    }
  },
]); 


////////////////////////////////////////////////////////////////////////
//Assemble the observations into a lat/lon set for the map.
export const assembleObservations = sequence("assembleObservations", [
  ({store, get, props}) => {
    var csvData = get(state`csvData`);

    //Has a file been uploaded?
		if(Object.keys(csvData).length > 0) {
      //Have lat, lon, and interest been chosen?
      if(csvData.latLabel === 'Select Field' || csvData.lonLabel === 'Select Field' || csvData.interestLabel === 'Select Field') {
        store.set(state`error`, 'Latitude, Longitude, and Field to Interpolate are required fields. Select before continuing.');
      } else {
        var latIndex = csvData.data[0].indexOf(csvData.latLabel);
        var lonIndex = csvData.data[0].indexOf(csvData.lonLabel);
        var interestIndex = csvData.data[0].indexOf(csvData.interestLabel);
        var observations = [];
        csvData.data.forEach((values) => {
          var observation = [values[latIndex], values[lonIndex], values[interestIndex]];
          observations.push(observation); 
        });
        //Remove head
        observations.shift();
        var features = [];
        observations.forEach((obs) => {
          features.push(point([obs[0], obs[1]], {value: obs[2]}));
        });
        var pointsGeojson = featureCollection(features);
        var bbox = turf.bboxPolygon(turf.bbox(pointsGeojson));
        if (turf.area(bbox) > 258000 || turf.length(bbox) > 6) {
          store.set(state`error`, 'Points are spread out over too large an area.')
        } else {
          if (turf.area(bbox) < 405) {
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
          vertexList.push(vertices[vertex]);
        });
        vertexList.push(vertices[0]); 
        var feature = polygon([vertexList]);
        if (turf.area(feature) > 258000 || turf.length(feature) > 6) {
          store.set(state`error`, 'Area selected is too large.')
        } else {
          if (turf.area(feature) < 405) {
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
          userEmail: get(state`request.email`),
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
          store.set(state`request.status`, response.data.status);
          if (response.data.status === 'complete') {
            if (response.data.tiffp  && response.data.jpgfp && response.data.bounds) {
              store.set(state`request.tifPath`, serverUrl + response.data.tiffp);
              store.set(state`request.jpgPath`, serverUrl + response.data.jpgfp);
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
//Let the user download the .tif file from the server.
export const download = sequence("download", [
  ({store, get}) => {
    if (get(state`request.tifPath`)) {
      downloads.download(get(state`request.tifPath`));
      axios.get(get(state`request.tifPath`))
       .then((response) => {
          //FileDownload(response.data, 'interpolation.tif');
          console.log(response);
          //store.set(state`request.status`, response.data.status);
        } 
      ).catch((err) => {
          store.set(state`error`,'A server error has occured. Please attempt to download data at another time.');
        }
      );
    } else {
      store.set(state`error`,'An error occured before the data could be retrieved.')
    };
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
