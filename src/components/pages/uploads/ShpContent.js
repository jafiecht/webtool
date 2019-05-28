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
    marginRight: theme.spacing.unit*3
  },
  select: {
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


class ShpContent extends Component {

  render() {
    const {classes} = this.props;

    var shpButton;
    if (this.props.shpData.rawShp){
      shpButton =
        <ListItem
          button
          onClick={() => this.props.deleteShp()}>
          <ListItemIcon>
            <DeleteIcon/>
          </ListItemIcon>
          <ListItemText
            primary="Delete .shp file"/>
        </ListItem>
    } else {  
      shpButton =
        <ReactFileReader
          fileTypes={".shp"}
          handleFiles={(files) => this.props.loadShp({file: files})}>
          <ListItem
            button>
            <ListItemIcon>
              <CloudUploadIcon/>
            </ListItemIcon>
            <ListItemText
              primary="Upload .shp file"/>
          </ListItem>
        </ReactFileReader>
    }      

    var dbfButton;
    if (this.props.shpData.rawShp && !this.props.shpData.rawDbf){
      dbfButton =
        <ReactFileReader
          fileTypes={".dbf"}
          handleFiles={(files) => this.props.loadDbf({file: files})}>
          <ListItem
            button>
            <ListItemIcon>
              <CloudUploadIcon/>
            </ListItemIcon>
            <ListItemText
              primary="Upload .dbf file"/>
          </ListItem>
        </ReactFileReader>
    }      

    var propertySelect;
    if(this.props.shpData.geojson) {
      propertySelect =
      <div>
        <Grid item xs={12} className={classes.root}>
          <Grid item xs={12}>
            <Typography className={classes.text}>
              Select the property of interest from the list below.
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.select}>
            <FormControl fullWidth>
              <InputLabel shrink>Property</InputLabel>
              <Select
                value={this.props.shpData.propertyLabel}
                onChange={(event) => this.props.setProperty({property: event.target.value})}>
                {Object.keys(this.props.shpData.geojson.features[0].properties).map(value => (
                  <MenuItem value={value} key={uuid.v4()}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
    }

    return (
      <Grid item xs={12} justify='center' container>
        <List className={classes.list}>
           {shpButton}
           {dbfButton}
           {propertySelect}
        </List>
      </Grid>
    );
  }
}

export default connect(
  {
    shpData: state`shpData`,

    setProperty: sequences`setProperty`,
    loadShp: sequences`loadShp`,
    deleteShp: sequences`deleteShp`,
    loadDbf: sequences`loadDbf`,
  },
  withStyles(styles, {withTheme: true})(ShpContent)
);
