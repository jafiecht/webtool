import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import CSVContent from './uploads/CSVContent.js';

const styles = theme => ({
  title: {
    marginTop: theme.spacing.unit*3,
  },
  paper: {
    margin: theme.spacing.unit*3,
  },
  button: {
    marginBottom: theme.spacing.unit*3
  },
  radio: {
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
  }
});


class Upload extends Component {
  render() {

    const{ classes } = this.props;

    var content;
    if (this.props.fileType==='csv') {
      content = <CSVContent/>;
    } else {
      content =
        <Grid item xs={12}>
          <List> 
            <ListItem button>
              <ListItemIcon>
                <CloudUploadIcon/>
              </ListItemIcon>
              <ListItemText
                primary="Upload .shp file"/>
              <ListItemSecondaryAction>
                <IconButton>
                  <DeleteIcon/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CloudUploadIcon/>
              </ListItemIcon>
              <ListItemText
                primary="Upload .shx file"/>
              <ListItemSecondaryAction>
                <IconButton>
                  <DeleteIcon/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CloudUploadIcon/>
              </ListItemIcon>
              <ListItemText
                primary="Upload .dbf file"/>
              <ListItemSecondaryAction>
                <IconButton>
                  <DeleteIcon/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CloudUploadIcon/>
              </ListItemIcon>
              <ListItemText
                primary="Upload .prj file"/>
              <ListItemSecondaryAction>
                <IconButton>
                  <DeleteIcon/>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Grid>
    }

    return (
      <Paper className={classes.paper}>
        <Grid container justify='center' alignItems='center'>
          <Grid item xs={12} justify='center' container>
            <Typography variant='title' className={classes.title}>
              Upload your soil data
            </Typography>
          </Grid>
          <Grid item xs={12} justify='center' container>
            <FormControl className={classes.radio}>
              <RadioGroup
                value={this.props.fileType}
                onChange={(event) => this.props.setFileType({type: event.target.value})}
                row>
                <FormControlLabel
                  value='csv'
                  label='Import as csv'
                  control={<Radio/>}/>
                <FormControlLabel
                  value='shp'
                  label='Import as shapefile'
                  control={<Radio/>}/>
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} justify='center' container>
            {content}
          </Grid>
          <Grid item xs={12} sm={6} justify='center' container>
            <Button 
              variant='contained' 
              className={classes.button}
              onClick={() => {this.props.changePage({page: 0})}}>
              Back to Welcome
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} justify='center' container>
            <Button 
              variant='contained' 
              className={classes.button}
              onClick={() => {this.props.assembleObservations()}}>
              Draw Field Boundary
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default connect(
  {
    fileType: state`fileType`,

    changePage: sequences`changePage`,
    setFileType: sequences`setFileType`,
    assembleObservations: sequences`assembleObservations`,
  },
  withStyles(styles, {withTheme: true})(Upload)
);
