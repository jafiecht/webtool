import React, { Component } from 'react';
import { sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DrawMap from './map/DrawMap.js';

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit*3,
  },
  title: {
    marginTop: theme.spacing.unit*3,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
  },
  text: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
  },
  button: {
    marginBottom: theme.spacing.unit*3
  },
  mapGridItem: {
    width: '100%'
  },
  mapContainer: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '65vh',
  },
});


class Draw extends Component {


  render() {
    const{ classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <Grid container direction='column' justify='center' alignItems='center'>
          <Grid item xs={12}>
            <Typography variant='title' className={classes.title}>
              Draw your field boundary
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.text}>
              Add and drag points to create your field boundary.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify='center' alignItems='center'>
              <Button
                onClick= {() => this.props.newVertex()}>
                Add a vertex
              </Button>
              <Button
                onClick={() => this.props.removeVertex()}>
                Remove last vertex
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.mapGridItem}>
            <div className={classes.mapContainer}>
              <DrawMap/>
            </div>
          </Grid>
          <Grid item xs={12}container justify='center' alignItems='center'>
            <Grid item xs={12} sm={6} justify='center' container>
              <Button 
                variant='contained' 
                className={classes.button}
                onClick={() => this.props.changePage({page: 1})}>
                Back to Upload
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} justify='center' container>
              <Button 
                variant='contained' 
                className={classes.button}
                onClick={() => this.props.validateBoundary()}>
                Interpolate
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default connect(
  {
    //currentPage: state`currentPage`,
    //mapCenter: state`map.mapCenter`,

    validateBoundary: sequences`validateBoundary`,
    newVertex: sequences`newVertex`,
    changePage: sequences`changePage`,
    removeVertex: sequences`removeVertex`,
  },
  withStyles(styles, {withTheme: true})(Draw)
);
