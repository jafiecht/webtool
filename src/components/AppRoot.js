import React, { Component } from 'react';
import { state, sequences } from 'cerebral';
import { connect } from '@cerebral/react';
import { withStyles } from '@material-ui/core/styles';
import Welcome from './pages/Welcome.js';
import Upload from './pages/Upload.js';
import Draw from './pages/Draw.js';
import View from './pages/View.js';
import Status from './pages/Status.js';
import Submit from './pages/Submit.js';
import Error from './Error.js';

const styles = theme => ({
});


class AppRoot extends Component {

  componentWillMount() {
    this.props.loadState();
  }

  render() {
    return (
      <div>
        {(()=>{
          switch(this.props.currentPage) {
            case 0:
              return <Welcome/>
            case 1:
              return <Upload/>
            case 2: 
              return <Draw/>
            case 3: 
              return <Submit/>
            case 4: 
              return <Status/>
            case 5: 
              return <View/>
            default:
              return <Welcome/> 
          }
        })()}
        <Error/>
      </div>
    );
  }
}

export default connect(
  {
    currentPage: state`currentPage`,
    
    loadState: sequences`loadState`,
  },
  withStyles(styles, {withTheme: true})(AppRoot)
);
