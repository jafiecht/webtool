import * as sequences from './sequences';
//import {pageAhead} from './sequences';

export default {
  state:{
    currentPage: 1,
    fileType: 'csv',
    csvData: null,
    shpData: null,
    sampleLocations: null,
    error: null,
    map: {
      mapCenter: [],
      vertices: {},
      centroid:[],
    },
    pointsGeojson: null,
  },
  sequences,
};
