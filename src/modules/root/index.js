import * as sequences from './sequences';
//import {pageAhead} from './sequences';

export default {
  state:{
    currentPage: 0,
    fileType: 'csv',
    csvData: {},
    shpData: {},
    error: null,
    map: {
      mapCenter: [],
      vertices: {},
      observations:[],
    },
    geojson: {
      points: {},
      boundary: {},
    },
    request: {},
  },
  sequences,
};
