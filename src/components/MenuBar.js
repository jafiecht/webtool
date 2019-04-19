import React, { Component } from 'react';
import { state } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});


class MenuBar extends Component {
  render() {
    const{ classes } = this.props;
    return (
      <AppBar>
        <Toolbar>
          <Typography variant='title'>
            Soil Mapper
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connect(
  {
    currentPage: state`currentPage`
  },
  withStyles(styles, {withTheme: true})(MenuBar)
);
