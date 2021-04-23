import { shifts } from './shifts'

class WorkingTimes {
  constructor() {
    this.scheduleStartDate = null
    this.startDate = null
    this.endDate = null
    this.shifts = []
    this.events = []
    this.currentShift = 0
  }

  setScheduleStartDate(date) {
    this.scheduleStartDate = date
  }

  addShift(type) {
    this.shifts.push(shifts[type])
  }

  getCurrentShift() {
    return this.shifts[this.currentShift]
  }

  getStartDate(setup) {
    let startDate = null

    const shift = this.getCurrentShift()

    if (!this.events.length) {
      startDate = new Date(`${this.scheduleStartDate} ${shift.startTime}`)      
    } else {
      startDate = new Date(this.endDate)
    }

    let endShift = new Date(`${startDate.toISOString().split('T')[0]} ${shift.endTime}`)
    let endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + setup)
    let hoursLeft = setup

    while(hoursLeft > 0) {
      if (endDate < endShift) { 
        startDate = endDate
        hoursLeft = 0
      } else if (endDate - endShift === 0) {
        startDate = new Date(`${endShift.toISOString().split('T')[0]} ${shift.startTime}`)
        startDate.setDate(endDate.getDate() + 1)
        hoursLeft = 0
      } else {
        hoursLeft -= (endShift - startDate) / 1000 / 3600
        
        endDate = new Date(`${endShift.toISOString().split('T')[0]} ${shift.startTime}`)
        endDate.setDate(endDate.getDate() + 1)
        endDate.setHours(endDate.getHours() + hoursLeft)

        endShift.setDate(endShift.getDate() + 1)
      }
    }

    this.startDate = startDate

    return startDate
  }

  isWorkableDay(date) {
    const shift = this.getCurrentShift()

    return shift.days.includes(date.getDay())
  }

  getNextAvailableDay(date) {
    const shift = this.getCurrentShift()
    const nextDate = new Date(`${date.toISOString().split('T')[0]} ${shift.startTime}`)

    nextDate.setDate(nextDate.getDate() + 1)

    while(!this.isWorkableDay(nextDate)) {
      nextDate.setDate(nextDate.getDate() + 1)
    }

    return nextDate
  }

  getEndDate(duration) {
    const shift = this.getCurrentShift()
    let endShift = new Date(`${this.startDate.toISOString().split('T')[0]} ${shift.endTime}`)
    let startShift = new Date(this.startDate)
    
    let endDate = new Date(this.startDate)

    endDate.setHours(endDate.getHours() +  duration)
    let hoursLeft = duration
    
    while(hoursLeft > 0) {
      if (endDate <= endShift) {
        this.endDate = endDate
        hoursLeft = 0
      } else {
        hoursLeft -= (endShift - startShift) / 1000 / 3600
        
        endDate = this.getNextAvailableDay(endShift)

        endShift = new Date(`${endDate.toISOString().split('T')[0]} ${shift.endTime}`)

        endDate.setHours(endDate.getHours() + hoursLeft)
        startShift = new Date(`${endShift.toISOString().split('T')[0]} ${shift.startTime}`)
      }
    }

    this.endDate = endDate

    return endDate
  }

  addEvent(event) {
    const startDate = this.getStartDate(event.setup)
    const endDate = this.getEndDate(event.duration)

    this.events.push({
      duration: event.duration,
      setup: event.setup,
      startDate,
      endDate
    })

    return {
      startDate,
      endDate 
    }
  }

  getEvents() {
    return this.events
  }

  print() {
    console.log('shifts', this.shifts)
    console.log('scheduleStartDate', this.scheduleStartDate)
    console.log('startDate', this.startDate)
    console.log('events', this.events)
  }
}


export default WorkingTimes
