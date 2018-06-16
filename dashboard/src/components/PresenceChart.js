
import React, { Component } from 'react';
import {ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
import {ControlLabel} from 'react-bootstrap'
import moment from 'moment';

let axios =require('axios');

class PresenceChart extends Component {
  constructor(){
    super();
    this.state = {data: {}};
  }

  scatterData = () => {
    const {deviceId, room, date} = this.props;
    const url = `SERVERADDRESS/getDevice?deviceId=${deviceId}&tableId=1&roomId=1&date=${date.format('DD-MM-YYYY')}`;
    axios.get(url).then((res) =>{
        let chartData = res.data;
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
        this.setState({today: data})
    });
    const yesterdayDate = date.clone().subtract(1,'days');
    const urlYesterday = `SERVERADDRESS/getDevice?deviceId=${deviceId}&tableId=1&roomId=1&date=${yesterdayDate.format('DD-MM-YYYY')}`;
    axios.get(urlYesterday).then((res) =>{
        let chartData = res.data;
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
        this.setState({yesterday: data})
    });

    const yesterday2Date = date.clone().subtract(2,'days');
    const url2Days = `SERVERADDRESS/getDevice?deviceId=${deviceId}&tableId=1&roomId=1&date=${yesterday2Date.format('DD-MM-YYYY')}`;
    axios.get(url2Days).then((res) =>{
        let chartData = res.data;
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
        this.setState({doubleyesterday: data})
    });
  }

  componentWillReceiveProps() {
    this.scatterData();
  }

  render() {
      const {today, yesterday, doubleyesterday} = this.state;
return (
<div>
  <br/>
{this.props.date.clone().subtract(2,'days').format('LL')}<ScatterChart width={800} height={60} margin={{top: 10, right: 0, bottom: 0, left: 0}}>
<XAxis type="category" dataKey="hour" interval={0} tick={{ fontSize: 12 }} tickLine={{ transform: 'translate(0, -6)' }} />
<YAxis type="number" dataKey="index" name="Presence" height={10} width={80} tick={false} tickLine={false} axisLine={false}/>
<ZAxis type="number" dataKey="value" domain={[100,0]} range={[16, 225]} />
<Tooltip cursor={{strokeDasharray: '3 3'}} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
<Scatter data={doubleyesterday} fill='#8884d8'/>
</ScatterChart>

{this.props.date.clone().subtract(1,'days').format('LL')}<ScatterChart width={800} height={60} margin={{top: 10, right: 0, bottom: 0, left: 0}}>
       <XAxis type="category" dataKey="hour" interval={0} tick={{ fontSize: 12 }} tickLine={{ transform: 'translate(0, -6)' }} />
       <YAxis type="number" dataKey="index" name="Presence" height={10} width={80} tick={false} tickLine={false} axisLine={false}/>
       <ZAxis type="number" dataKey="value" domain={[100,0]} range={[16, 225]} />
       <Tooltip cursor={{strokeDasharray: '3 3'}} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
       <Scatter data={yesterday} fill='#8884d8'/>
     </ScatterChart>

    {this.props.date.format('LL')}<ScatterChart width={800} height={60} margin={{top: 10, right: 0, bottom: 0, left: 0}}>
       <XAxis type="category" dataKey="hour" interval={0} tick={{ fontSize: 12 }} tickLine={{ transform: 'translate(0, -6)' }} />
       <YAxis type="number" dataKey="index" name="Presence" height={10} width={80} tick={false} tickLine={false} axisLine={false}/>
       <ZAxis type="number" dataKey="value" domain={[100,0]} range={[16, 225]} />
       <Tooltip cursor={{strokeDasharray: '3 3'}} wrapperStyle={{ zIndex: 100 }} content={this.renderTooltip} />
       <Scatter data={today} fill='#8884d8'/>
     </ScatterChart>
</div>)
  }
}

export default PresenceChart;
