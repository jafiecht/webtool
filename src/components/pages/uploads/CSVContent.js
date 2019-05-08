import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import ReactFileReader from 'react-file-reader';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import uuid from 'uuid';
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
  root: {
    flexGrow: 1,
  },
});


class CSVContent extends Component {
  render() {

    const{ classes } = this.props;

    var content;
    if (this.props.csvData) {
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
              Select .csv Latitude and Longtitude fields. Coordinates assumed to be WGS84.
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.select}>
            <FormControl fullWidth>   
              <InputLabel shrink>Latitude</InputLabel> 
              <Select
                value={this.props.csvData.latLabel}
                onChange={(event) => this.props.setLat({lat: event.target.value})}>    
                {this.props.csvData.data[0].map(value => (
                  <MenuItem value={value} key={uuid.v4()}>{value}</MenuItem>
                ))}    
              </Select>     
            </FormControl>          
          </Grid>
          <Grid item xs={12} className={classes.select}>
            <FormControl fullWidth>   
              <InputLabel shrink>Longitude</InputLabel> 
              <Select
                value={this.props.csvData.lonLabel}
                onChange={(event) => this.props.setLon({lon: event.target.value})}>    
                {this.props.csvData.data[0].map(value => (
                  <MenuItem value={value} key={uuid.v4()}>{value}</MenuItem>
                ))}    
              </Select>     
            </FormControl>          
          </Grid>
          <Grid item xs={12} className={classes.lastSelect}>
            <FormControl fullWidth>   
              <InputLabel shrink>Field to Interpolate</InputLabel> 
              <Select
                value={this.props.csvData.interestLabel}
                onChange={(event) => this.props.setInterest({interest: event.target.value})}>    
                {this.props.csvData.data[0].map(value => (
                  <MenuItem value={value} key={uuid.v4()}>{value}</MenuItem>
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
    csvData: state`csvData`,
    //csvInfo: state`csvInfo`,

    setLat: sequences`setLat`,
    setLon: sequences`setLon`,
    setInterest: sequences`setInterest`,
    loadCSV: sequences`loadCSV`,
    deleteSoilData: sequences`deleteSoilData`
  },
  withStyles(styles, {withTheme: true})(CSVContent)
);
