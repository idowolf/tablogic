import React, { Component } from 'react';
import { Carousel, Form, FormGroup, FormControl, ControlLabel, ToggleButton,ToggleButtonGroup, Row, Grid, Col } from 'react-bootstrap';
import {ScatterChart, Scatter, ComposedChart, Line, Area, Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, PolarGrid,PolarAngleAxis,PolarRadiusAxis,RadarChart,Radar} from 'recharts';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import 'react-times/css/material/default.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import PresenceChart from './PresenceChart';
import MockSoundLevelChart from './MockSoundLevelChart';
import CurrentTemp from './CurrentTemp';
import UserInputChart from './UserInputChart'

let axios = require('axios');

const rooms = [{label: "Aquarium", value: "Aquarium"},{label: "Library", value: "Library"}];
const devices = [{label: "Device 1", value: 1},{label: "Device 2", value: 2},{label: "Device 4", value: 4}];
const sensors = [{label: "Sound Level", value: "mic"},
{label: "Presence", value: "prox"},
{label: "Temperature", value: "temp"},
{label: "Humidity", value: "hum"},
{label: "User Input", value: "slider"}];

const dominantSpeakerData = [
{deviceId: '1', avgMicValue: 40},
{deviceId: '2', avgMicValue: 45},
{deviceId: '3', avgMicValue: 60},
{deviceId: '4', avgMicValue: 35},
{deviceId: '5', avgMicValue: 55}]

class DataChart extends Component {
  constructor(){
    super();
    this.state = {
    selectedRoom: "Aquarium",
    selectedDevice: 1,
    leftAxis:"mic",
    rightAxis:"prox",
    selectedDate: moment(),
    chartData: [],
    startTime: moment("00:00","hh:mm"),
    endTime: moment("23:59","hh:mm"),
    speakerData: this.getRandomSpeakerData()
  };
  }

  componentDidMount () {
    setInterval(this.updateChartData,3500);
  }

  getRandomSpeakerData = () => {
    const numOfDevices = Math.random()*4+3;
    let data = [];
    for(let i=1;i<numOfDevices;i++){
        data.push({deviceId: i, avgMicValue: Math.random()*40+20});
    }
    return data;
}

  changeRoom = (e) => {
    this.setState({selectedRoom: e.target.value, speakerData: this.getRandomSpeakerData()}, this.updateChartData)};

  changeDevice = (e) => {
    this.setState({selectedDevice: e.target.value}, this.updateChartData)};

  changeRightAxis = (e) => {
      this.setState({rightAxis: e.target.value})};

  changeLeftAxis = (e) => {
     this.setState({leftAxis: e.target.value});};

  changeDate = (date) => {
    this.setState({selectedDate: date, speakerData: this.getRandomSpeakerData() }, this.updateChartData);
  }

  changeStartTime = (time) => {
    this.setState({startTime: time});
  }

  changeEndTime = (time) => {
    this.setState({endTime: time});
  }

  updateChartData = () => {
    const {selectedDevice, selectedRoom, selectedDate} = this.state;
    const url = `https://SERVERADDRESS/getDevice?deviceId=${selectedDevice}&tableId=1&roomId=1&date=${selectedDate.format('DD-MM-YYYY')}`;
    axios.get(url).then((res) =>{
      this.setState({chartData : res.data});
    });
  }

  filterData = () => {
    const {chartData, startTime, endTime } = this.state;
    // filter by time
    let data = chartData.filter((entry) => {
      let time = entry.timestamp.split('-')[3];
      return moment(time,"hh:mm:ss").isAfter(startTime)
         && moment(time,"hh:mm:ss").isBefore(endTime);
    })
    data = data.map((entry) => {
      let newEntry = Object.assign({}, entry);
      newEntry.timestamp = newEntry.timestamp.split('-')[3];
      return newEntry;
    })
    return data;
  }

  scatterData = () => {
    const {chartData} = this.state;
    let hourArray = [];
    let entriesArray = []
    for(let i=0;i<24;i++){
      hourArray.push(0);
      entriesArray.push(0);
    }
    for(let entry in chartData) {
      let newEntry = Object.assign({}, chartData[entry]);
      let time = newEntry.timestamp.split('-')[3];
      const hour = moment(time,"hh:mm:ss").hour();
      hourArray[hour] += newEntry.prox;
      entriesArray[hour]++;
    }
    const data= hourArray.map((entry, index) => {
      let value =  entry/entriesArray[index];
      return {hour: index, value, index: 1}
    });
    return data;
  }
    
  renderOptions(options) {
    return options.map((option, index) => {
      return <option key={index} value={option.value}>{option.label}</option>
    });
  }

  render() {
    const {selectedDevice, selectedRoom, leftAxis, rightAxis, selectedDate, chartData} = this.state;
    return [
        <Row>
          <Col md={3}>
        <Form horizontal>
          <FormGroup controlId="room">
          Room:
            <FormControl componentClass="select" placeholder="room" onChange={this.changeRoom} defaultValue={selectedRoom}>
              {this.renderOptions(rooms)}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="device">
          Device:
            <FormControl componentClass="select" placeholder="devices" onChange={this.changeDevice} defaultValue={selectedDevice}>
              {this.renderOptions(devices)}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="leftAxis">
          Left Axis:
            <FormControl componentClass="select" placeholder="mic" onChange={this.changeLeftAxis} defaultValue={leftAxis}>
              {this.renderOptions(sensors)}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="rightAxis">
          Right Axis:
            <FormControl componentClass="select" placeholder="prox" onChange={this.changeRightAxis} defaultValue={rightAxis}>
              {this.renderOptions(sensors)}
            </FormControl>
          </FormGroup>
          
          <FormGroup controlId="date">
          Date:
          <DatePicker selected={selectedDate} onChange={this.changeDate} />
          </FormGroup>
          Start Time:
          <TimePicker defaultValue={moment("00:00","hh:mm")} showSecond={false} onChange={this.changeStartTime}/>
          <br/>
          End Time:
          <TimePicker defaultValue={moment("23:59","hh:mm")} showSecond={false} onChange={this.changeEndTime}/>
        </Form>
        </Col>
        <Col md={7}>
            <Carousel wrap={false} interval={null}>
              <Carousel.Item>
              <img width={900} height={500} />
              <MockSoundLevelChart data={this.state.speakerData}/>
                <Carousel.Caption>
                  <h3>Sound Level Map</h3>
                  <p>Allows you to detect dominant speakers using several Tablogic devices</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
              <CurrentTemp data={this.filterData()} deviceId={selectedDevice} room={selectedRoom} />
                <Carousel.Caption>
                  <h3>Live Feed</h3>
                  <p>Get live readings from any online device</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
              <PresenceChart data={this.scatterData()} deviceId={selectedDevice} room={selectedRoom} date={selectedDate}/>
                <Carousel.Caption>
                  <h3>Presence Chart</h3>
                  <p>Spot the active hours and days</p>
                </Carousel.Caption>
              </Carousel.Item>
    </Carousel>
        {/* <Row>
          <Col md={4}>
          <MockSoundLevelChart data={this.state.speakerData}/>
          </Col>
          <Col md={4}>
          <CurrentTemp data={this.filterData()} />
          </Col>
          <Col md={4}>
          <UserInputChart data={this.filterData()} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
          <PresenceChart data={this.scatterData()} />
          </Col>
        </Row> */}
        </Col>
        </Row>,
        <Row>
          <i><h3>Data Chart</h3></i>
        <ComposedChart width={1550} height={400} data={this.filterData()}
            margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                   <CartesianGrid strokeDasharray="3 3"/>
                 <XAxis dataKey="timestamp"/>
                 <YAxis yAxisId="left" />
                 <YAxis yAxisId="right" orientation="right" />
                 <Tooltip/>
                 <Legend />
                 <Area yAxisId="left" type="monotone" dataKey={leftAxis} stroke="#8884d8" activeDot={{r: 8}}/>
                 <Line yAxisId="right" type="monotone" dataKey={rightAxis} stroke="#82ca9d" />
       </ComposedChart>
       </Row>]
       
{/* 
       <div>
       <label> Presence by Hour</label>
       
        </div>

       <h1>Examples:</h1>
       <div>
       <label> Dominant Speaker by Average db level</label>
       <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={dominantSpeakerData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="deviceId" />
           <PolarRadiusAxis />
          <Radar name="Mike" dataKey="avgMicValue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
        </RadarChart>
        </div> */}
  }
}

export default DataChart;
