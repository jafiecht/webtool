import { sequence, state } from 'cerebral';
//import { state, props } from 'cerebral/tags';

export const changePage = sequence("changePage", [
  ({store, props}) => {store.set(state`currentPage`, props.page)},
]); 

export const setFileType = sequence("setFileType", [
  ({store, props}) => {store.set(state`fileType`, props.type)},
]); 

export const loadCSV = sequence("loadCSV", [
  ({store, props}) => {
    var reader = new FileReader();
    reader.onload = function(e) {
      var text = reader.result;
      console.log(reader);
      var array = text.split(/\n/);
      for (var i = 0; i < array.length; i++) {
        array[i] = array[i].split(',');
      }
      store.set(state`rawCSV`, array);
    }
    reader.readAsText(props.file[0]);
  },
]);

export const deleteCSV = sequence("deleteCSV", [
  ({store}) => {store.set(state`rawCSV`, null)},
  ({store}) => {store.set(state`csvInfo.lat`, null)},
  ({store}) => {store.set(state`csvInfo.lon`, null)},
  ({store}) => {store.set(state`csvInfo.interest`, null)},
]);

export const setLat = sequence("setLat", [
  ({store, props}) => {store.set(state`csvInfo.lat`, props.lat)},
]); 

export const setLon = sequence("setLon", [
  ({store, props}) => {store.set(state`csvInfo.lon`, props.lon)},
]); 


