import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import EmailIcon from '@material-ui/icons/Email';

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit*3,
  },
  text: {
    padding: theme.spacing.unit*3,
  },
  title: {
    marginTop: theme.spacing.unit*3,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3
  },
  button: {
    marginBottom: theme.spacing.unit*3
  },
  input: {
    marginBottom: theme.spacing.unit*3,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
  },
});


class Submit extends Component {

  handleChange = event => {
    this.props.updateEmail({email: event.target.value});
  };

  render() {
    const{ classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container justify='center'>
          <Grid item xs={12} justify='center' container>
            <Typography variant='title' align='center' className={classes.title}>
              Submit for Interpolation
            </Typography>
          </Grid>
          <Grid item xs={12} justify='center' container>
            <Typography className={classes.text} align='center'>
              Your request may take some time, depending on the size of your selected area and how many other users are also submitting requests currently. You will recieve two emails: one as soon as the request is submitted, and one as soon as the request is completed. Please allow up to two hours for your request to be completed.
            </Typography>
          </Grid>
          <Grid item xs={12} justify='center' container>
            <TextField
              className={classes.input}
              label="Enter Email"
              id='email'
              onChange={this.handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <EmailIcon/>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} justify='center' container>
            <Button 
              variant='contained' 
              className={classes.button}
              onClick={() => this.props.changePage({page: 2})}>
              Modify Boundary
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} justify='center' container>
            <Button 
              variant='contained' 
              className={classes.button}
              onClick={() => this.props.submitRequest()}>
              Submit
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
    email: state`request.email`,

    changePage: sequences`changePage`,
    submitRequest: sequences`submitRequest`,
    updateEmail: sequences`updateEmail`,
  },
  withStyles(styles, {withTheme: true})(Submit)
);
