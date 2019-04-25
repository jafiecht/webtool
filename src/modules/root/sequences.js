import { sequence, state } from 'cerebral';
//import { state, props } from 'cerebral/tags';

export const changePage = sequence("changePage", [
  ({store, props}) => {store.set(state`currentPage`, props.page)},
]); 

 export const setFileType = sequence("setFileType", [
  ({store, props}) => {store.set(state`fileType`, props.type)},
]);    
