import React, { Component } from 'react';
import { state } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import MenuBar from './MenuBar.js';
import Welcome from './Welcome.js';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    backgroundImage: 'url(https://images.pexels.com/photos/1000057/pexels-photo-1000057.jpeg?cs=srgb&dl=cropland-farm-farmland-1000057.jpg&fm=jpg)'
  }
});


class AppRoot extends Component {
  render() {
    const{ classes } = this.props;
    return (
      <div>
        <MenuBar/>
        <Grid className={classes.content}>
          <div className={classes.toolbar}/>
          <Welcome/>
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
