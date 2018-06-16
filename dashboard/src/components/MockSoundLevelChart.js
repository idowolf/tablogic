
import React, { Component } from 'react';
import {RadarChart, PolarAngleAxis, PolarGrid, Radar, PolarRadiusAxis  } from 'recharts';
import {ControlLabel} from 'react-bootstrap'


const dominantSpeakerData = [
    {deviceId: '1', avgMicValue: 40},
    {deviceId: '2', avgMicValue: 45},
    {deviceId: '3', avgMicValue: 60},
    {deviceId: '4', avgMicValue: 35},
    {deviceId: '5', avgMicValue: 55}];

class MockSoundLevelChart extends Component {

  render() {
        return (
        <div><center>
        {/* <ControlLabel> Dominant Speaker by Average db level</ControlLabel> */}
        <RadarChart cx={150} cy={150} outerRadius={120} width={300} height={300} data={this.props.data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="deviceId" />
            <PolarRadiusAxis />
        <Radar name="Mike" dataKey="avgMicValue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
        </RadarChart>
        </center>
        </div>)
  }
}

export default MockSoundLevelChart;
