import * as sequences from './sequences';
//import {pageAhead} from './sequences';

export default {
  state:{
    currentPage: 0,
    fileType: 'csv',
    rawCSV: null,
    csvInfo: {lat: null, lon: null, interest: null},
  },
  sequences,
};
