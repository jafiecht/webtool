import { sequence, state } from 'cerebral';
//import { state, props } from 'cerebral/tags';

export const pageAhead = sequence("pageAhead", [
  ({store}) => {store.increment(state`currentPage`, 1)},
]);    
