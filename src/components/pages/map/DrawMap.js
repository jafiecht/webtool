import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import uuid from 'uuid';
//import Leaflet from 'leaflet';
import { Map, TileLayer, CircleMarker, Marker, Polyline, Polygon} from 'react-leaflet';

const styles = theme => ({
  map: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
    marginBottom: theme.spacing.unit*3,
    width: '100%',
  },
});


class DrawMap extends Component {

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    this.props.trackMap({
      lat: leafletMap.getCenter().lat,
      lon: leafletMap.getCenter().lng,
    });
    

    leafletMap.on('moveend', () =>{
      this.props.trackMap({
        lat: leafletMap.getCenter().lat,
        lon: leafletMap.getCenter().lng,
      });
     });
  }

  render() {
    const{ classes } = this.props;

    //Define our observation points
    var obsMarkers = []
    this.props.observations.forEach((value) => {
      obsMarkers.push(
        <CircleMarker
          key={uuid.v4()}
          center={[value[0], value[1]]}
          radius={3}
          opacity={1.0}
          color={"white"}
          weight={1}
          fillColor={'#0080ff'}
          fillOpacity={0.8}>
        </CircleMarker>
      );
    })       

    //Define our boundary points
    var boundaryMarkers = []
    Object.keys(this.props.vertices).forEach((objectKey) => {
      boundaryMarkers.push(
        <Marker
          key={objectKey}
          position={this.props.vertices[objectKey]}
          draggable={true}
          onDrag={(e) => this.props.resetVertex({id: objectKey, lat: e.target._latlng.lat, lon: e.target._latlng.lng})}>
        </Marker>
      );
    })       

    //Boundary line if only 2 markers
    var boundaryLine = []
    if (Object.keys(this.props.vertices).length === 2) {
      var endpoints = []; 
      Object.keys(this.props.vertices).forEach((objectKey) => {
        endpoints.push(this.props.vertices[objectKey]);
      });
      boundaryLine.push(
      <Polyline key={uuid.v4} positions={endpoints}/>
      );
    }

    //Boundary polygon if more than two markers
    var boundary = []
    if (Object.keys(this.props.vertices).length > 2) {
      var corners = []; 
      Object.keys(this.props.vertices).forEach((objectKey) => {
        corners.push(this.props.vertices[objectKey]);
      });
      boundary.push(
      <Polygon key={uuid.v4} positions={corners}/>
      );
    }

    return (
      <Map 
        className={classes.map}
        center={[this.props.observations[0][0], this.props.observations[0][1]]}
        zoom={14}
        dragging={true}
        ref={m => {this.leafletMap=m;}}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        />
        {obsMarkers}
        {boundaryMarkers}
        {boundaryLine}
        {boundary}
      </Map>
    );
  }
}

export default connect(
  {
    observations: state`map.observations`,
    vertices: state`map.vertices`,

    trackMap: sequences`trackMap`,
    resetVertex: sequences`resetVertex`,
  },
  withStyles(styles, {withTheme: true})(DrawMap)
);
