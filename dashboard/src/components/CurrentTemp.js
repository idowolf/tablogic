
import React, { Component } from 'react';

class CurrentTemp extends Component {

    getLastEntry = () => {
        if(this.props.data === []){
            return {};
        }
        return this.props.data.slice(-1)[0] || {};
    }

    getAvg = () => {
        const {data}  =this.props;
        let avgTemp = 0, avgHumidity = 0;
        for(let entry in data){
            avgTemp+= data[entry].temp;
            avgHumidity+= data[entry].hum;
        }
        avgTemp = avgTemp / (Object.keys(data).length);
        avgHumidity = avgHumidity / (Object.keys(data).length);
        return {temp: avgTemp.toFixed(2), hum: avgHumidity.toFixed(2)};
    }

  render() {
    const lastEntry = this.getLastEntry();
    const avg = this.getAvg();
    let mood = "smile";
    if(mood < 40){
        mood = "meh";
        if(mood <20){
            mood = "sad";
        }
    }
    if(Object.keys(lastEntry).length === 0) {
     return (
        <div style={{'font-size': '1.5em'}} align="center" verticalAlign="middle">
            <h3><i>Device {this.props.deviceId} in Room {this.props.room}</i></h3>
            <br/><br/>
            No available reads from today
    </div>
     )   
    } else {
    return (
    <div style={{'font-size': '1.5em'}} align="center" verticalAlign="middle">
        <br/>
        <h3><i>Device {this.props.deviceId} in Room {this.props.room}</i></h3>
        <h4>Last Read: {lastEntry.timestamp}</h4>
        <br/>
        <i class="fas fa-thermometer-empty"></i>&nbsp; {lastEntry.temp + " °C"}, {lastEntry.hum + '%'}
        <br/>
        <i class="fas fa-volume-up"></i>&nbsp; {lastEntry.mic + " dB"}
        <br/>
        <i class="fas fa-street-view"></i>&nbsp; {lastEntry.prox < 17 ? "Occupied" : "Free"}
        <br/>
        <i class={`fas fa-${mood}`}></i>&nbsp; User Input
    </div>)
    }
  }
}

export default CurrentTemp;
