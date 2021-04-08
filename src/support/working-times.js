import { shifts } from './shifts'

class WorkingTimes {
  constructor() {
    this.startDate = null
    this.shifts = []
    this.events = []
  }

  setStartDate(date) {
    this.startDate = date
  }

  getStartDate() {
    return this.startDate
  }

  addShift(type) {
    // // breaks = { start, duration }
    this.shifts.push(type)
    // this.shifts.push({
    //   day,
    //   start,
    //   duration,
    //   breaks
    // })
  }

  addEvent(duration) {
    const currentDate = new Date(`${this.startDate} ${shifts[this.shifts[0]].startTime}`)
    return currentDate
  }

  getEvents() {
    return this.events
  }

  print() {
    console.log('shifts', this.shifts)
    console.log('startDate', this.startDate)
    console.log('events', this.events)
  }
}


export default WorkingTimes
