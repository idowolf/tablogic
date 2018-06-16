import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import './App.css'
import DataChart from './components/DataChart.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
          <img src='./logo.PNG' height='100px' align='top'/></h1>
        </header>
        <Grid>
            <DataChart />
        </Grid>  
      </div>
    );
  }
}

export default App;
