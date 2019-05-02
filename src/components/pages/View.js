import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit*3,
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


class Upload extends Component {
  render() {
    const{ classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container justify='center'>
          <Typography variant='title' className={classes.title}>
            View your prediction
          </Typography>
          <Typography className={classes.text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
          </Typography>
          <Button 
            variant='contained' 
            className={classes.button}
            onClick={() => this.props.changePage({page: 0})}>
            Submit another request
          </Button>
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
  withStyles(styles, {withTheme: true})(Upload)
);
