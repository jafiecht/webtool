import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
//import MenuIcon from '@material-ui/icons/Menu';
//import Menu from '@material-ui/core/Menu';
//import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit*3,
    flexGrow: 1,
  },
  text: {
    padding: theme.spacing.unit*3,
  },
  title: {
    marginTop: theme.spacing.unit*3
  },
  button: {
    marginBottom: theme.spacing.unit*3
  },
});


class Welcome extends Component {
  render() {
    const{ classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container justify='center' alignItems='center'>
          <Grid item xs={12} justify='center' alignContent='center' container>
            <Typography variant='title'  className={classes.title}>
              Welcome!
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.text} align='center'>
              {"High quality soil maps are the lifeblood of Precision Agriculture. You've taken great pains to ensure your soil samples are accurate, so why settle for any less in interpolation? This webtool uses state-of-the-art Machine Learning and high quality elevation data to make the most accurate interpolation possible."}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} justify='center' container>
            <Button 
              variant='contained' 
              className={classes.button}
              onClick={() => this.props.changePage({page: 4})}>
              Check Order Status
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} justify='center' container>
            <Button 
              variant='contained' 
              className={classes.button}
              onClick={() => this.props.changePage({page: 1})}>
              Upload Soil Data
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default connect(
  {
    currentPage: state`currentPage`,

    changePage: sequences`changePage`
  },
  withStyles(styles, {withTheme: true})(Welcome)
);
