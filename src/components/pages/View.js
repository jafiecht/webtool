import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ResultsMap from './map/ResultsMap.js';

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
              Interpolation Results
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.text}>
              All results are in WGS84
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.mapGridItem}>
            <div className={classes.mapContainer}>
              <ResultsMap/>
            </div>
          </Grid>
          <Grid item xs={12}container justify='center' alignItems='center'>
            <Grid item xs={12} sm={6} justify='center' container>
              <Button 
                variant='contained' 
                className={classes.button}
                onClick={() => this.props.backToWelcome()}>
                Back to Home Page
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} justify='center' container>
              <Button 
                variant='contained' 
                href={this.props.tifPath}
                className={classes.button}>
                Download Interpolation
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
    tifPath: state`request.tifPath`,

    validateBoundary: sequences`validateBoundary`,
    newVertex: sequences`newVertex`,
    backToWelcome: sequences`backToWelcome`,
    removeVertex: sequences`removeVertex`,
  },
  withStyles(styles, {withTheme: true})(Draw)
);
