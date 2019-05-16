import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import { Map, TileLayer, ImageOverlay } from 'react-leaflet';

const styles = theme => ({
  map: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
    marginBottom: theme.spacing.unit*3,
    width: '100%',
  },
});


class ResultsMap extends Component {

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
        <ImageOverlay
          url={this.props.jpgPath}
          bounds={this.props.bounds}
        />
      </Map>
    );
  }
}

export default connect(
  {
    observations: state`map.observations`,
    jpgPath: state`request.jpgPath`,
    bounds: state`request.bounds`,

    trackMap: sequences`trackMap`,
  },
  withStyles(styles, {withTheme: true})(ResultsMap)
);
