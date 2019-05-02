import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import uuid from 'uuid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Map, TileLayer, CircleMarker} from 'react-leaflet';

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit*3,
  },
  title: {
    marginTop: theme.spacing.unit*3
  },
  button: {
    marginBottom: theme.spacing.unit*3
  },
  mapContainer: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '70vh',
  },
  map: {
    margin: theme.spacing.unit*3,
    width: '100%',
  },
});


class Draw extends Component {
  render() {
    const{ classes } = this.props;

    //Define our observation points
    var sampleMarkers = [];
    this.props.observations.forEach((value) => {
      sampleMarkers.push(
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

    return (
      <Paper className={classes.paper}>
        <Grid container justify='center'>
          <Typography variant='title' className={classes.title}>
            Draw your field boundary
          </Typography>
          <Grid item xs={12}>
            <div className={classes.mapContainer}>
              <Map 
                className={classes.map}
                center={[this.props.observations[0][0], this.props.observations[0][1]]}
                zoom={14}>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                />
                {sampleMarkers}
              </Map>
            </div>
          </Grid>
          <Button 
            variant='contained' 
            className={classes.button}
            onClick={() => this.props.changePage({page: 3})}>
            Submit for Interpolation!
          </Button>
        </Grid>
      </Paper>
    );
  }
}

export default connect(
  {
    //currentPage: state`currentPage`,
    observations: state`observations`,

    changePage: sequences`changePage`
  },
  withStyles(styles, {withTheme: true})(Draw)
);
