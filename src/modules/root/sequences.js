import { sequence, state } from 'cerebral';

////////////////////////////////////////////////////////////////////////
//Change the page. Will likely need a rework
export const changePage = sequence("changePage", [
  ({store, props}) => {store.set(state`currentPage`, props.page)},
]); 

////////////////////////////////////////////////////////////////////////
//Remove existing soil data
export const deleteSoilData = sequence("deleteSoilData", [
  ({store}) => {store.set(state`csvData`, null)},
  ({store}) => {store.set(state`shpData`, null)},
  ({store}) => {store.set(state`observations`, null)},
]);

////////////////////////////////////////////////////////////////////////
//Change the type of import file and remove existing data
export const setFileType = sequence("setFileType", [
  ({store, props}) => {store.set(state`fileType`, props.type)},
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
        if (row.length != length) {
          err = 'CSV has invalid shape. Review file and try again.';
        }
      });
      if (err) {
        store.set(state`error`, err);
      } else {
        store.set(state`csvData`, {
          data: rows,
          latLabel: null,
          lonLabel: null,
          interestLabel: null,
        });
      };
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
      store.set(state`csvData.latLabel`, props.lat)
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
    }
  },
]); 


////////////////////////////////////////////////////////////////////////
//Assemble the observations into a lat/lon set for the map.
export const assembleObservations = sequence("assembleObservations", [
  ({store, get, props}) => {
    var csvData = get(state`csvData`);

    //Has a file been uploaded?
		if(csvData) {
      //Have lat, lon, and interest been chosen?
      if(csvData.latLabel == null || csvData.lonLabel == null || csvData.interestLabel == null) {
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
        store.set(state`observations`, observations);
        store.set(state`currentPage`, 2);
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
  ({store, props}) => {
    store.set(state`map.mapCenter`, [props.lat, props.lon]);
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
  },
]);

////////////////////////////////////////////////////////////////////////
//Reset a boudary vertex location
export const resetVertex = sequence("resetVertex", [
  ({store, props}) => {
    store.set(state`map.vertices.${props.id}`, [props.lat, props.lon]);
  },
]);

////////////////////////////////////////////////////////////////////////
//Remove the last boundary vertex added
export const removeVertex = sequence("removeVertex", [
  ({store, get}) => {
    var keys = Object.keys(get(state`map.vertices`));
    if (keys.length > 0) {
      store.unset(state`map.vertices.${Math.max(...keys)}`);
    }
  },
]);


