
import React, { Component } from 'react';
import {AreaChart, CartesianGrid,XAxis,YAxis,Tooltip,linearGradient, defs, stop, Area  } from 'recharts';
import {ControlLabel} from 'react-bootstrap'


const mockUserInput = [
    {timestamp: '08:00', slider: 20},
    {timestamp: '09:00', slider: 30},
    {timestamp: '10:00', slider: 32},
    {timestamp: '11:00', slider: 50},
    {timestamp: '12:00', slider: 56},
    {timestamp: '13:00', slider: 42},
    {timestamp: '14:00', slider: 30},
    {timestamp: '15:00', slider: 50},
    {timestamp: '16:00', slider: 60},
    {timestamp: '17:00', slider: 32},
    {timestamp: '18:00', slider: 20},
    {timestamp: '19:00', slider: 14},
    {timestamp: '20:00', slider: 42},
    {timestamp: '21:00', slider: 36},
    {timestamp: '22:00', slider: 36},
];



class UserInputChart extends Component {
  render() {
    const {data} = this.props;    
        return (
            <div>
              <br/>
                <ControlLabel>Satisfaction By Hour</ControlLabel>
                <br/><br/>
            <AreaChart
        width={400}
        height={250}
        data={mockUserInput}
        margin={{top: 10, right: 30, left: 0, bottom: 0}}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="timestamp"/>
        <YAxis/>
        <Tooltip/>
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={0.3} stopColor="green" stopOpacity={1}/>
            <stop offset={0.5} stopColor="orange" stopOpacity={1}/>
            <stop offset={0.8} stopColor="red" stopOpacity={1}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="slider" stroke="#000" fill="url(#splitColor)" />
      </AreaChart>
      </div>
      )
  }
}

export default UserInputChart;


