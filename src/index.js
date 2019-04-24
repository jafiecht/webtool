import React from 'react';
import ReactDOM from 'react-dom';
import App from 'cerebral';
import Devtools from 'cerebral/devtools';
import { Container } from '@cerebral/react';
import AppRoot from './components/AppRoot';
import root from './modules/root/';

const app = App(root, {
  devtools: Devtools({
    host: 'localhost:8585'
  })
});

ReactDOM.render(
  <Container app={app}>
    <AppRoot/>
  </Container>, 
  document.getElementById('root')
);

