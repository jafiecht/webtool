import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import L from 'leaflet';
import { withLeaflet, MapControl, MapLayer } from 'react-leaflet';

class TiffOverlay extends MapLayer {
  //constructor(props, context) {
    //super(props);
    //props.leaflet.map.addEventListener("mousemove", ev => {
      //this.panelDiv.innerHTML = `<h2><span>Lat: ${ev.latlng.lat.toFixed(
        //4
      //)}</span>&nbsp;<span>Lng: ${ev.latlng.lng.toFixed(4)}</span></h2>`;
      //console.log(this.panelDiv.innerHTML);
    //});
  //}

  createLeafletElement(opts) {
   // const MapInfo = leaflet.Control.extend({
      //onAdd: map => {
        //this.panelDiv = leaflet.DomUtil.create("div", "info");
        //return this.panelDiv;
      //}
    //});
    //return new MapInfo({ position: "bottomleft" });
    const TiffOverlay = leaflet.leafletGeotiff
    return TiffOverlay({
      url: 'http://localhost:5000/temp.tif'
    })
    
  }

}

export default withLeaflet(TiffOverlay);

//var layer = L.leafletGeotiff(url, options).addTo(map);



