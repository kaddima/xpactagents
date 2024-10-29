import React,{useMemo} from 'react'
import moment from 'moment'
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar'
//import { events } from '../data/data'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const mLocalizer = momentLocalizer(moment)


const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
  style: {
    backgroundColor: 'lightblue',
  },
  })

const CalenderEvent = ({eventLists}) => {

  let events = useMemo(()=>{

    let arr = []

    eventLists.map((value,i)=>{

      let obj =  {
      id: i+1,
      title: 'Property Tour',
      start: new Date(value.date),
      end: new Date(value.date),
      }

      arr.push(obj)
    })

    return arr
  },[eventLists])

  const { components, defaultDate, views } = useMemo(
    () => ({
      components: {
      timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: Date.now(),
      //max: dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours'),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
    )

  return (
     <Calendar
      components={components}
      //defaultDate={defaultDate}
      events={events}
      localizer={mLocalizer}
      // max={30}
      showMultiDayTimes
      // step={60}
      views={views}
      className=''
    />
  )
}

export default CalenderEvent