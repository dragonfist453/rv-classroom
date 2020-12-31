import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import axios from 'axios';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { hostname } from "../links";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default class EventsCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
      proportions: {
        width: props.width,
        height: props.height
      },
      toolbar: props.toolbar,
      defaultView: props.defaultView,
      events: [],
    };
  }

  componentDidMount() {
    this.getEvents();
    window.onresize = this.setDims;
  }

  getEvents = () => {
      // Code that gets events from backend
      axios.get(this.props.eventsurl)
        .then(res => {
          let events = [];
          res.data.events.forEach(({description: title, fromtime, totime, ondate, eventid: eid, link}) => {
            const date = new Date(ondate)
            date.setDate(date.getDate() + 1)
            const start = new Date(date.toISOString().split('T')[0] + 'T' + fromtime)
            start.setMinutes(start.getMinutes() - start.getTimezoneOffset())
            const end = new Date(date.toISOString().split('T')[0] + 'T' + totime)
            end.setMinutes(end.getMinutes() - end.getTimezoneOffset())
            events.push({title, start, end, allDay: false, resource: false, eid, link})
          })
          this.setState({events: events})
        })
        .catch(err => {
          console.error(`Error when getting calendar events: ${err}`)
        })
  }

  setDims = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
  };

  static defaultProps = {
    defaultView: 'week',
    toolbar: true,
    maxHeight: "100%",
  }

  handleSelect = ({ start, end }) => {
    const description = window.prompt('New event name')
    const count = window.prompt('How many times should the event repeat weekly/daily')
    const classid = window.prompt('Enter subject code of class')
    if (description && count && classid) {
      const body = {
        sectionid: this.props.sectionid,
        classid: classid,
        summary: description,
        start: start.toISOString(),
        end: end.toISOString(),
        freq: this.state.defaultView==='week'?'WEEKLY':'DAILY',
        count: count
      }
      console.log(body)
      axios.post(hostname + '/auth/admin/event/', body, {
        headers: {
          'x-auth-token': localStorage.getItem('admintoken')
        }
      })
      .then(res => {
        console.log(res.data)
        window.location.reload()
      })
      .catch(err => {
        console.error(err)
      })
    }
  }

  render() {
    return (
      <div style={{padding: this.props.padding}}>
        <div
          style={this.props.defaultView !== "agenda"?{
            height: this.state.height * (this.state.proportions.height / 100),
            width: this.state.width * (this.state.proportions.width / 100),
            margin: "auto",
            maxWidth: this.props.maxHeight,
            padding: 30,
            borderRadius: 5,
            boxShadow: "0px 0px 5px 3px #999",
            backgroundColor: '#fff',
            color: '#000'
          }:
          {
            height: this.state.height * (this.state.proportions.height / 100),
            width: this.state.width * (this.state.proportions.width / 100),
            margin: "auto",
            maxWidth: this.props.maxHeight,
          }
          }>
            <Calendar
              popup
              selectable={this.props.selectable}
              views={this.state.defaultView === 'agenda'?['agenda']:['week','day']}
              localizer={localizer}
              events={this.state.events}
              defaultView={this.state.defaultView}
              onView={(view) => this.setState({...this.state, defaultView: view})}
              startAccessor="start"
              endAccessor="end"
              onDoubleClickEvent={(event) => {
                window.open(event.link, '_blank');
              }}
              // onSelectEvent={(event) => {
              //   if(localStorage.getItem('usertype')==='student')
              //     this.props.feedbackForm(event.eventid)
              //   else
              //     this.props.feedbackOutput(event.eventid)
              // }}
              toolbar={this.props.toolbar}
              onSelectSlot={this.handleSelect}
            />
          </div>
      </div>
    );
  }
}
