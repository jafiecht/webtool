import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import ReactFileReader from 'react-file-reader';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit*3,
  },
  text: {
    padding: theme.spacing.unit*3,
  },
  title: {
    marginTop: theme.spacing.unit*3,
  },
  button: {
    margin: theme.spacing.unit*3
  },
  uploadButton: {
    margin: theme.spacing.unit*3,
  },
  buttonIcon: {
    marginLeft: theme.spacing.unit,
  },
  gridItem: {
    alignItems: 'center',
  }
});


class CSVContent extends Component {
  render() {

    const{ classes } = this.props;

    var content;
    if (this.props.rawCSV) {
      content =
      <div>
        <Grid item xs={12}>
          <List> 
            <ListItem 
              button
              onClick={() => this.props.deleteCSV()}>
              <ListItemIcon>
                <DeleteIcon/>
              </ListItemIcon>
              <ListItemText
                primary="Delete .csv file"/>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Select .csv Latitude and Longtitude fields. Coordinates assumed to be WGS84.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl>   
            <InputLabel>Latitude</InputLabel> 
            <Select>    
              <MenuItem>1</MenuItem>
              <MenuItem>2</MenuItem>
            </Select>     
          </FormControl>          
        </Grid>
        <Grid item xs={6}>
          <FormControl>   
            <InputLabel>Longtitue</InputLabel> 
            <Select>    
              <MenuItem>1</MenuItem>
              <MenuItem>2</MenuItem>
            </Select>     
          </FormControl>          
        </Grid>
      </div>
    } else {
      content =
      <Grid item xs={12}>
        <List> 
          <ReactFileReader 
            fileTypes={".csv"} 
            handleFiles={(files) => this.props.loadCSV({file: files})}>
            <ListItem 
              button>
              <ListItemIcon>
                <CloudUploadIcon/>
              </ListItemIcon>
              <ListItemText
                primary="Upload .csv file"/>
            </ListItem>
          </ReactFileReader>
        </List>
      </Grid>
    }

    const csv = <Typography>CSV File</Typography>
      

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default connect(
  {
    rawCSV: state`rawCSV`,
    //fileType: state`fileType`,

    //changePage: sequences`changePage`,
    //setFileType: sequences`setFileType`,
    loadCSV: sequences`loadCSV`,
    deleteCSV: sequences`deleteCSV`
  },
  withStyles(styles, {withTheme: true})(CSVContent)
);
