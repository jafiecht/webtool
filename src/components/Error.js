import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
});


class Error extends Component {
  render() {
  
    var newError = false;
    if (this.props.error != null) {
      newError = true;
    }
   
    return (
      <Dialog
        open={newError}
        onClose={() => {this.props.clearError()}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Error:"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.props.error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {this.props.clearError()}} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(
  {
    error: state`error`,

    clearError: sequences`clearError`
  },
  withStyles(styles, {withTheme: true})(Error)
);
