import {
  shifts
} from './shifts'

function getIsNextDay(currentDay, nextDay) {
  if (currentDay === nextDay) {
    return 0
  }

  if (currentDay < nextDay) {
    return 1
  }

  return (6 - currentDay) + nextDay + 1
}

function getDate(date, time) {
  const [month, day, year] = date.toLocaleDateString().split('/')

  return new Date(`${year}-${month}-${day} ${time}`)
}

function getDay(day, startTime, shiftStartTime) {
  const date = new Date()
  const startDate = new Date(`${date.toISOString('T')[0]} ${startTime}`)
  const shiftStartDate = new Date(`${date.toISOString('T')[0]} ${shiftStartTime}`)

  return startDate >= shiftStartDate ? day : day + 1
}

const weekDays = [0, 1, 2, 3, 4, 5, 6]

function getWorkDays(date) {
  const startDay = new Date(date).getDay()

  const index = weekDays.indexOf(startDay)

  return [...weekDays.slice(index), ...weekDays.slice(0, startDay)]
}

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
  }

  addShift(type) {
    this.shifts.push(shifts[type])
  }

  getScheduleStartDate() {
    return this.scheduleStartDate
  }

  getCurrentShift() {
    return this.shifts[this.currentShift]
  }

  getCurrentSlot() {
    return this.workingTimes[this.currentSlot]
  }

  getNextSlot() {
    let [ day ] = this.getCurrentSlot()
    const slot = (this.currentSlot + 1) % this.workingTimes.length
    this.currentSlot = slot

    const nextSlot = this.getCurrentSlot()
    const isNextDay = getIsNextDay(day, nextSlot[0])

    return [nextSlot, isNextDay]
  }

  setWorkingTimes() {
    const workingTimes = []
    const workDays = getWorkDays(this.getScheduleStartDate())

    workDays.forEach(day => {
      this.shifts.forEach(shift => {
        const {
          startTime: shiftStartTime,
          slots
        } = shift

        if (shift.days.includes(day)) {
          slots.forEach(([startTime, endTime]) => {
            const dayAdjusted = getDay(day, startTime, shiftStartTime)

            workingTimes.push([dayAdjusted, startTime, endTime])
          })
        }
      })
    })

    this.workingTimes = workingTimes

    const firstDay = new Date(this.scheduleStartDate).getDay()
    this.currentSlot = workingTimes.reduce((accu, [day], index) => {
      if (accu === undefined && day === firstDay) {
        accu = index
      }

      return accu
    }, undefined)

    if (!Number.isInteger(this.currentSlot)) {
      return alert('Invalid Start Date')
    }

    this.startDate = new Date(`${this.scheduleStartDate} ${this.workingTimes[this.currentSlot][1]}`)
    this.endDate = new Date(this.startDate)
    this.currentDay = this.currentSlot[0]

    return true
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
    const nextDate = getDate(date, shift.startTime)

    nextDate.setDate(nextDate.getDate() + 1)

    while (!this.isWorkableDay(nextDate)) {
      nextDate.setDate(nextDate.getDate() + 1)
    }

    return nextDate
  }

  getStartDate(setup) {
    const startDate = this.calculateStartEndDate(setup, this.endDate)

    this.startDate = new Date(startDate)

    return startDate
  }

  getEndDate(duration) {
    const endDate = this.calculateStartEndDate(duration, this.startDate)

    this.endDate = new Date(endDate)

    return endDate
  }

  calculateStartEndDate(duration, date) {
    if (Number.isNaN(duration)) {
      return console.log(`invalid duration: ${duration}`)
    }

    let [ , , endTime] = this.getCurrentSlot()

    let startDate = new Date(date)
    let endDate = null

    let hoursLeft = duration
    let endSlot = getDate(startDate, endTime)

    if (!hoursLeft) {
      endDate = new Date(startDate)
    }

    while (hoursLeft > 0) {
      const slotTime = (endSlot - startDate) / 1000 / 3600

      if (hoursLeft <= slotTime) {
        endDate = new Date(startDate)
        endDate.setMinutes(endDate.getMinutes() + (hoursLeft * 60))
      }
      
      hoursLeft -= slotTime

      if (hoursLeft > 0) {
        let [[, startTime, endTime], isNextDay] = this.getNextSlot()

        startDate = getDate(startDate, startTime)
        startDate.setDate(startDate.getDate() + isNextDay)

        endSlot = getDate(startDate, endTime)
        if (endSlot < startDate) {
          endSlot.setDate(endSlot.getDate() + 1)
        }
      }
    }

    return endDate
  }

  addEvent({ duration, setup }) {
    const startDate = this.getStartDate(setup)
    const endDate = this.getEndDate(duration)

    this.events.push({
      duration,
      setup,
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
