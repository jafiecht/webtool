import React, { Component } from 'react';
import { state } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import MenuBar from './MenuBar.js';
import Welcome from './pages/Welcome.js';
import Upload from './pages/Upload.js';
import Draw from './pages/Draw.js';
import View from './pages/View.js';
import Status from './pages/Status.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
  },
  toolbar: theme.mixins.toolbar,
  content: {
  },
  paper: {
    margin: theme.spacing.unit*3,
  }
});


class AppRoot extends Component {
  render() {
    const{ classes } = this.props;
    return (
      <div className={classes.root}>
        {/*<MenuBar/>*/}
        <Grid className={classes.content}>
          {/*<div className={classes.toolbar}/>*/}
          <Paper className={classes.paper}>
            {(()=>{
              switch(this.props.currentPage) {
                case 0:
                  return <Welcome/>
                case 1:
                  return <Upload/>
                case 2: 
                  return <Draw/>
                case 3: 
                  return <Status/>
                case 4: 
                  return <View/>
                default:
                  return <Welcome/> 
              }
            })()}
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default connect(
  {
    currentPage: state`currentPage`
  },
  withStyles(styles, {withTheme: true})(AppRoot)
);
