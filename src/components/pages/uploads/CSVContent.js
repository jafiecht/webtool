import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import ReactFileReader from 'react-file-reader';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import uuid from 'uuid';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  list: {
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
  },
  select: {
    paddingLeft: theme.spacing.unit*3,
    paddingRight: theme.spacing.unit*3,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  lastSelect: {
    paddingLeft: theme.spacing.unit*3,
    paddingRight: theme.spacing.unit*3,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit*3,
  },
  text: {
    marginRight: theme.spacing.unit*3,
    marginLeft: theme.spacing.unit*3,
  },
  headerToggle: {
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
  },
  root: {
    flexGrow: 1,
  },
});


class CSVContent extends Component {
  render() {

    const{ classes } = this.props;

    var content;
    if (Object.keys(this.props.csvData).length > 0) {
      content =
      <div>
        <Grid item xs={12} className={classes.root}>
          <Grid container justify='center'>
            <List className={classes.list}> 
              <ListItem 
                button
                onClick={() => this.props.deleteSoilData()}>
                <ListItemIcon>
                  <DeleteIcon/>
                </ListItemIcon>
                <ListItemText
                  primary="Delete .csv file"/>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.text}>
              Select .csv Latitude, Longtitude and Property fields.
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.headerToggle} container justify='center'>
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.csvData.header}
                  onChange={() => this.props.toggleHeader()}
                  value="header switch"
                  color='primary'
                  />
              }
              label="First Row is Header"
            />
          </Grid>
          <Grid item xs={12} className={classes.select}>
            <FormControl fullWidth>   
              <InputLabel shrink>Latitude</InputLabel> 
              <Select
                value={this.props.csvData.latIndex}
                onChange={(event) => this.props.setLat({index: event.target.value})}>    
                {this.props.csvData.data[0].map((value, index) => (
                  <MenuItem value={index} key={uuid.v4()}>
                    {this.props.csvData.header ? value : (index+1)}
                  </MenuItem>
                ))}    
              </Select>     
            </FormControl>          
          </Grid>
          <Grid item xs={12} className={classes.select}>
            <FormControl fullWidth>   
              <InputLabel shrink>Longitude</InputLabel> 
              <Select
                value={this.props.csvData.lonIndex}
                onChange={(event) => this.props.setLon({index: event.target.value})}>    
                {this.props.csvData.data[0].map((value, index) => (
                  <MenuItem value={index} key={uuid.v4()}>
                    {this.props.csvData.header ? value :  (index+1)}
                  </MenuItem>
                ))}    
              </Select>     
            </FormControl>          
          </Grid>
          <Grid item xs={12} className={classes.lastSelect}>
            <FormControl fullWidth>   
              <InputLabel shrink>Field to Interpolate</InputLabel> 
              <Select
                value={this.props.csvData.interestIndex}
                onChange={(event) => this.props.setInterest({index: event.target.value})}>    
                {this.props.csvData.data[0].map((value, index) => (
                  <MenuItem value={index} key={uuid.v4()}>
                    {this.props.csvData.header ? value :  (index+1)}
                  </MenuItem>
                ))}    
              </Select>     
            </FormControl>          
          </Grid> 
        </Grid>
      </div>
    } else {
      content =
      <Grid item xs={12} justify='center' container>
        <List className={classes.list}> 
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


    return (
      <div>
        {content}
      </div>
    );
  }
}

export default connect(
  {
    csvData: state`csvData`,
    //csvInfo: state`csvInfo`,

    setLat: sequences`setLat`,
    setLon: sequences`setLon`,
    setInterest: sequences`setInterest`,
    loadCSV: sequences`loadCSV`,
    toggleHeader: sequences`toggleHeader`,
    deleteSoilData: sequences`deleteSoilData`
  },
  withStyles(styles, {withTheme: true})(CSVContent)
);
