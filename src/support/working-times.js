import {
  shifts
} from './shifts'

class WorkingTimes {
  constructor() {
    this.scheduleStartDate = null
    this.startDate = null
    this.endDate = null
    this.shifts = []
    this.events = []
    this.workingTimes = []
    this.currentShift = 0
    this.currentSlot = 0
  }

  setScheduleStartDate(date) {
    this.currentSlot = new Date(date).getDay()
    this.scheduleStartDate = date
    this.startDate = new Date(date)
  }

  addShift(type) {
    this.shifts.push(shifts[type])
  }

  getCurrentShift() {
    return this.shifts[this.currentShift]
  }

  getCurrentSlot() {
    return this.workingTimes[this.currentSlot]
  }

  getNextSlot() {
    const slot = (this.currentSlot + 1) % this.workingTimes.length
    this.currentSlot = slot

    return this.workingTimes[slot]
  }

  setWorkingTimes() {
    const workingTimes = []
    const weekDays = [0, 1, 2, 3, 4, 5, 6]

    weekDays.forEach(day => {
      this.shifts.forEach(shift => {
        const {
          startTime,
          endTime
        } = shift
        if (shift.days.includes(day)) {
          workingTimes.push([day, startTime, endTime])
        }

      })
    })

    this.workingTimes = workingTimes

    const firstDay = new Date(this.scheduleStartDate).getDay()
    this.currentSlot = workingTimes.reduce((accu, [day], index) => {
      if (!accu && day === firstDay) {
        accu = index
      }

      return accu
    }, null)

    this.currentDay = this.currentSlot[0]
  }

  getWorkingTimes() {
    return this.workingTimes
  }

  isWorkableDay(date) {
    const shift = this.getCurrentShift()

    return shift.days.includes(date.getDay())
  }

  getNextAvailableDay(date) {
    const shift = this.getCurrentShift()
    const nextDate = new Date(`${date.toISOString().split('T')[0]} ${shift.startTime}`)

    nextDate.setDate(nextDate.getDate() + 1)

    while (!this.isWorkableDay(nextDate)) {
      nextDate.setDate(nextDate.getDate() + 1)
    }

    return nextDate
  }

  getStartDate(setup) {
    const [, startTime] = this.getCurrentSlot()

    const date = new Date(`${this.startDate.toISOString().split('T')[0]} ${startTime}`)
    this.startDate = date

    return date
  }

  getEndDate(duration) {
    let [day, startTime, endTime] = this.getCurrentSlot()

    let startDate = new Date(this.startDate)
    let endDate = null

    let hoursLeft = duration
    let endSlot = new Date(`${startDate.toISOString().split('T')[0]} ${endTime}`)

    while (hoursLeft > 0) {
      hoursLeft -= (endSlot - startDate) / 1000 / 3600

      if (hoursLeft > 0) {
        [day, startTime, endTime] = this.getNextSlot()

        startDate = new Date(`${startDate.toISOString().split('T')[0]} ${startTime}`)
        endSlot = new Date(`${startDate.toISOString().split('T')[0]} ${endTime}`)
        if (endSlot < startDate) {
          endSlot.setDate(endSlot.getDate() + 1)
        }

        endDate = new Date(startDate)
        endDate.setHours(endDate.getHours() + hoursLeft)
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
    this.shifts.forEach(shift => console.log(shift))
    console.log('scheduleStartDate', this.scheduleStartDate)
    console.log('startDate', this.startDate)
    console.log('events', this.events)
  }
}


export default WorkingTimes
