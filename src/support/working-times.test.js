import WorkingTimes from './working-times'

describe('working-times', () => {

  describe('when the day last long enough for a task', () => {
    it('completes the task the same day', () => {
      const date = '4/14/2021'
  
      const wt = new WorkingTimes()
      wt.setScheduleStartDate(date)
      wt.addShift(0)
  
      const events = [{
          duration: 8,
          setup: 0,
        },
      ]
  
      events.forEach((event) => wt.addEvent(event))
  
      const output = [{
          "duration": 8,
          "setup": 0,
          "startDate": new Date("2021-04-14T11:00:00.000Z"),
          "endDate": new Date("2021-04-14T19:00:00.000Z"),
        },
      ]
  
      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the day does not last enough for a task', () => {
    it('completes the task the next day', () => {
      const date = '4/14/2021'
  
      const wt = new WorkingTimes()
      wt.setScheduleStartDate(date)
      wt.addShift(0)
  
      const events = [{
          duration: 16,
          setup: 0,
        },
      ]
  
      events.forEach((event) => wt.addEvent(event))
  
      const output = [{
          "duration": 16,
          "setup": 0,
          "startDate": new Date("2021-04-14T11:00:00.000Z"),
          "endDate": new Date("2021-04-15T17:00:00.000Z"),
        },
      ]
  
      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the setup last longer than the day', () => {
    it('completes the task the next day', () => {
      const date = '4/14/2021'
  
      const wt = new WorkingTimes()
      wt.setScheduleStartDate(date)
      wt.addShift(0)
  
      const events = [{
          duration: 6,
          setup: 12,
        },
      ]
  
      events.forEach((event) => wt.addEvent(event))
  
      const output = [{
          "duration": 6,
          "setup": 12,
          "startDate": new Date("2021-04-15T13:00:00.000Z"),
          "endDate": new Date("2021-04-15T19:00:00.000Z"),
        },
      ]
  
      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the second task last longer than the current day', () => {
    it('continues the task the next day', () => {

      const date = '4/14/2021'
  
      const wt = new WorkingTimes()
      wt.setScheduleStartDate(date)
      wt.addShift(0)
  
      const events = [{
          duration: 8,
          setup: 0,
        },
        {
          duration: 6,
          setup: 2
        },
      ]
  
      events.forEach((event) => wt.addEvent(event))
  
      const output = [{
          "duration": 8,
          "setup": 0,
          "startDate": new Date("2021-04-14T11:00:00.000Z"),
          "endDate": new Date("2021-04-14T19:00:00.000Z"),
        },
        {
          "duration": 6,
          "setup": 2,
          "startDate": new Date("2021-04-15T11:00:00.000Z"),
          "endDate": new Date("2021-04-15T17:00:00.000Z"),
        },
      ]
  
      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when a task takes longer than 3 days', () => {
    it('ends the task when expected', () => {
      const date = '4/14/2021'
  
      const wt = new WorkingTimes()
      wt.setScheduleStartDate(date)
      wt.addShift(0)
  
      const events = [
        {
          duration: 31,
          setup: 5
        },
      ]
  
      events.forEach((event) => wt.addEvent(event))
  
      const output = [
        {
          "duration": 31,
          "setup": 5,
          "startDate": new Date("2021-04-14T16:00:00.000Z"),
          "endDate": new Date("2021-04-17T17:00:00.000Z"),
        },
      ]
  
      expect(wt.getEvents()).toEqual(output)
    })
  })
})
