import WorkingTimes from './working-times'

describe('working-times', () => {

  describe('when the day is long enough for a task', () => {
    it('completes the task the same day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
      wt.addShift(0)
      wt.setWorkingTimes()

      const events = [{
        duration: 8,
        setup: 0,
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 8,
        "setup": 0,
        "startDate": new Date("2021-04-14T11:00:00.000Z"),
        "endDate": new Date("2021-04-14T20:00:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the day is not long enough for a task', () => {
    it('completes the task the next day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
      wt.addShift(0)
      wt.setWorkingTimes()

      const events = [{
        duration: 16,
        setup: 0,
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 16,
        "setup": 0,
        "startDate": new Date("2021-04-14T11:00:00.000Z"),
        "endDate": new Date("2021-04-15T18:30:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the setup is longer than the day', () => {
    it('completes the task the next day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
      wt.addShift(0)
      wt.setWorkingTimes()

      const events = [{
        duration: 6,
        setup: 12,
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 6,
        "setup": 12,
        "startDate": new Date("2021-04-15T14:00:00.000Z"),
        "endDate": new Date("2021-04-15T21:00:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the second task last longer than the current day', () => {
    it('continues the task the next day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
      wt.addShift(0)
      wt.setWorkingTimes()

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
          "endDate": new Date("2021-04-14T20:00:00.000Z"),
        },
        {
          "duration": 6,
          "setup": 2,
          "startDate": new Date("2021-04-15T12:00:00.000Z"),
          "endDate": new Date("2021-04-15T18:30:00.000Z"),
        },
      ]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when a task takes longer than 3 days', () => {
    it('ends the task when expected', () => {
      const dateTuesday = '4/13/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateTuesday)
      wt.addShift(0)
      wt.setWorkingTimes()

      const events = [{
        duration: 31,
        setup: 5
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 31,
        "setup": 5,
        "startDate": new Date("2021-04-13T16:30:00.000Z"),
        "endDate": new Date("2021-04-16T21:00:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when a task overlaps on an off day', () => {
    it('ends the task the next available day', () => {
      const dateFriday = '4/16/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateFriday)
      wt.addShift(0)
      wt.setWorkingTimes()

      const events = [{
        duration: 12,
        setup: 0
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 12,
        "setup": 0,
        "startDate": new Date("2021-04-16T11:00:00.000Z"),
        "endDate": new Date("2021-04-19T14:00:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when there are multiple shifts', () => {
    describe('and the task extends to next shift', () => {
      it('ends the task in the next shift', () => {
        const dateFriday = '4/16/2021'

        const wt = new WorkingTimes()
        wt.setScheduleStartDate(dateFriday)
        wt.addShift(0)
        wt.addShift(4)
        wt.setWorkingTimes()

        const events = [{
          duration: 12,
          setup: 0
        }]

        events.forEach((event) => wt.addEvent(event))

        const output = [{
          "duration": 12,
          "setup": 0,
          "startDate": new Date("2021-04-16T11:00:00.000Z"),
          "endDate": new Date("2021-04-17T00:00:00.000Z"),
        }]

        expect(wt.getEvents()).toEqual(output)
      })
    })
  })

  describe('when a shift is added', () => {
    it('updtes working times', () => {
      const dateFriday = '5/7/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateFriday)
      wt.addShift(0)
      wt.addShift(5)
      wt.setWorkingTimes()

      expect(wt.getWorkingTimes()).toEqual([
        [5, '6:00', '10:00'],
        [5, '10:30', '14:00'],
        [5, '14:30', '16:00'],
        [5, '21:15', '01:30'],
        [6, '02:00', '04:30'],
        [6, '05:00', '06:15'],
        [1, '6:00', '10:00'],
        [1, '10:30', '14:00'],
        [1, '14:30', '16:00'],
        [1, '21:15', '01:30'],
        [2, '02:00', '04:30'],
        [2, '05:00', '06:15'],
        [2, '6:00', '10:00'],
        [2, '10:30', '14:00'],
        [2, '14:30', '16:00'],
        [2, '21:15', '01:30'],
        [3, '02:00', '04:30'],
        [3, '05:00', '06:15'],
        [3, '6:00', '10:00'],
        [3, '10:30', '14:00'],
        [3, '14:30', '16:00'],
        [3, '21:15', '01:30'],
        [4, '02:00', '04:30'],
        [4, '05:00', '06:15'],
        [4, '6:00', '10:00'],
        [4, '10:30', '14:00'],
        [4, '14:30', '16:00'],
        [4, '21:15', '01:30'],
        [5, '02:00', '04:30'],
        [5, '05:00', '06:15']
      ])
    })
  })

  describe('Error case [https://trello.com/c/3JeCvpmn]', () => {
    it('generates end instead of null value', () => {
      const dateFriday = '04/30/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateFriday)
      wt.addShift(0)
      wt.setWorkingTimes()

      const events = [{
          duration: 85.20,
          setup: 0
        },
        {
          duration: 85.20,
          setup: 1.33
        },
        {
          duration: 18,
          setup: 1.33
        }
      ]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
          "duration": 85.2,
          "setup": 0,
          "startDate": new Date("2021-04-30T11:00:00.000Z"),
          "endDate": new Date("2021-05-13T15:42:00.000Z"),
        },
        {
          "duration": 85.2,
          "setup": 1.33,
          "startDate": new Date("2021-05-13T17:01:00.000Z"),
          "endDate": new Date("2021-05-27T11:43:00.000Z"),
        },
        {
          "duration": 18,
          "setup": 1.33,
          "startDate": new Date("2021-05-27T13:02:00.000Z"),
          "endDate": new Date("2021-05-31T13:02:00.000Z"),
        }
      ]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('Error case [https://trello.com/c/3JeCvpmn]', () => {
    it('generates expected end date', () => {
      const dateMonday = '05/10/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateMonday)
      wt.addShift(0)
      wt.addShift(5)
      wt.setWorkingTimes()

      const events = [{
        duration: 85.20,
        setup: 0
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 85.2,
        "setup": 0,
        "startDate": new Date("2021-05-10T11:00:00.000Z"),
        "endDate": new Date("2021-05-17T11:12:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('https://trello.com/c/7eUJIQmA', () => {
    it('generates expected end date', () => {
      const dateFriday = '5/7/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateFriday)
      wt.addShift(0)
      wt.addShift(5)
      wt.setWorkingTimes()

      const events = [{
        duration: 15.05,
        setup: 0
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 15.05,
        "setup": 0,
        "startDate": new Date("2021-05-07T11:00:00.000Z"),
        "endDate": new Date("2021-05-08T08:48:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('https://trello.com/c/oi1GyfWQ', () => {
    it('skips sundays', () => {
      const dateFriday = '06/18/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateFriday)
      wt.addShift(0)
      wt.addShift(5)
      wt.setWorkingTimes()

      const events = [{
        duration: 12,
        setup: 0
      }, {
        duration: 7,
        setup: 2
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 12,
        "setup": 0,
        "startDate": new Date("2021-06-18T11:00:00.000Z"),
        "endDate": new Date("2021-06-19T05:15:00.000Z"),
      }, {
        "duration": 7,
        "setup": 2,
        "startDate": new Date("2021-06-19T07:45:00.000Z"),
        "endDate": new Date("2021-06-21T15:00:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('https://trello.com/c/RadBqzzq', () => {
    it('adjusts endSlot', () => {
      const dateTuesday = '06/22/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateTuesday)
      wt.addShift(0)
      wt.addShift(5)
      wt.setWorkingTimes()

      const events = [{
        duration: 17,
        setup: 10.5
      }]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 17,
        "setup": 10.5,
        "startDate": new Date("2021-06-23T03:45:00.000Z"),
        "endDate": new Date("2021-06-24T03:45:00.000Z"),
      }]

      expect(wt.getEvents()).toEqual(output)
    })
  })
})
