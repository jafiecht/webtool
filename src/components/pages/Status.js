import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
    marginTop: theme.spacing.unit*3,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
  },
  button: {
    marginBottom: theme.spacing.unit*3
  },
  input: {
    marginBottom: theme.spacing.unit*3,
  },
});


class Status extends Component {

  handleChange = event => {
    this.props.updateInputID({id: event.target.value});
  };

  render() {
 
    const{ classes } = this.props;
 
    var idField;
    if(this.props.id) {
      idField = (
        <div>
          <Grid item>
            <Typography variant='body2' align='center'>
              Unique Request id:
            </Typography>
          </Grid>
          <Grid item>
            <Typography align='center' className={classes.idField}>
              {this.props.id}
            </Typography>
          </Grid>
        </div>
     );
    } 

    var text;
    if (this.props.status === 'not found') {
      text = (
        <Grid item justify='center' container>
          <Typography className={classes.text} color='secondary' align='center'>
            Your request id was not found. Your id may incorrectly entered.
          </Typography>
        </Grid>
      );
    } else if (this.props.status === 'removed') {
      text = (
        <Grid item justify='center' container>
          <Typography className={classes.text} color='secondary' align='center'>
            Your request has been pruned from the server. Request results only persist for two days, after which they are purged.
          </Typography>
        </Grid>
      );
    } else if (this.props.status === 'in progress') {
      text = (
        <Grid item justify='center' container>
          <Typography className={classes.text} color='primary' align='center'>
            Your request is still being processed. Please allow up to two hours for your request to be completed. After completion, your results will persist on the server for two days, after which they will be removed.
          </Typography>
        </Grid>
      );
    } else if (this.props.status === 'complete') {
      text = (
        <Grid item justify='center' container>
          <Typography className={classes.text} color='primary' align='center'>
            Your request is complete. Continue on to view and download your results.
          </Typography>
        </Grid>
      );
    } else if (this.props.status === 'server error') {
      text = (
        <Grid item justify='center' container>
          <Typography className={classes.text} color='secondary' align='center'>
            There was a server error while processing your request. Results are unavailable.
          </Typography>
        </Grid>
      );
    } else {
      text = (
        <Grid item justify='center' container>
          <Typography className={classes.text} align='center'>
              Your request may take some time; please allow up to two hours for your request to be completed. You can check the status of your request at any time by entering the unique request id below.
          </Typography>
        </Grid>
      );
    }

    var statusButton;
    if (this.props.status === 'complete') {
      statusButton = (
        <Grid item xs={12} sm={6} justify='center' container>
          <Button 
            variant='contained' 
            className={classes.button}
            onClick={() => this.props.viewData()}>
            View Results
          </Button>
        </Grid>
      );
    } else {
      statusButton = (
        <Grid item xs={12} sm={6} justify='center' container>
          <Button 
            variant='contained' 
            className={classes.button}
            onClick={() => this.props.checkStatus()}>
            Check Request Status
          </Button>
        </Grid>
      );
    }

    var field;
    if (this.props.status === 'complete') {
      field = (
        <Grid item justify='center' container>
          <TextField
            disabled
            className={classes.input}
            label="Request ID"
            id='id'
            onChange={this.handleChange}/>
        </Grid>
      );    
    } else {
      field = (
        <Grid item justify='center' container>
          <TextField
            className={classes.input}
            label="Enter Request ID"
            id='id'
            onChange={this.handleChange}/>
        </Grid>
      );
    }


    return (
      <Paper className={classes.paper}>
        <Grid container justify='center'>
          <Grid item justify='center' container>
            <Typography variant='title' className={classes.title}>
              Check Request Status
            </Typography>
          </Grid>
          {text}
          {idField}
          {field}
          <Grid item xs={12} sm={6} justify='center' container>
            <Button 
              variant='contained' 
              className={classes.button}
              onClick={() => this.props.newRequest()}>
              Submit another request
            </Button>
          </Grid>
          {statusButton}
        </Grid>
      </Paper>
    );
  }
}

export default connect(
  {
    id: state`request.id`,
    status: state`request.status`,

    newRequest: sequences`newRequest`,
    updateInputID: sequences`updateInputID`,
    checkStatus: sequences`checkStatus`,
    changePage: sequences`changePage`,
    viewData: sequences`viewData`,
  },
  withStyles(styles, {withTheme: true})(Status)
);
