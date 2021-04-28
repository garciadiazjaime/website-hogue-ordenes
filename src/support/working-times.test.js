import WorkingTimes from './working-times'

describe('working-times', () => {

  describe('when the day last long enough for a task', () => {
    it('completes the task the same day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
      wt.addShift(0)

      const events = [{
        duration: 8,
        setup: 0,
      }, ]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 8,
        "setup": 0,
        "startDate": new Date("2021-04-14T11:00:00.000Z"),
        "endDate": new Date("2021-04-14T19:00:00.000Z"),
      }, ]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the day does not last enough for a task', () => {
    it('completes the task the next day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
      wt.addShift(0)

      const events = [{
        duration: 16,
        setup: 0,
      }, ]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 16,
        "setup": 0,
        "startDate": new Date("2021-04-14T11:00:00.000Z"),
        "endDate": new Date("2021-04-15T17:00:00.000Z"),
      }, ]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the setup last longer than the day', () => {
    it('completes the task the next day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
      wt.addShift(0)

      const events = [{
        duration: 6,
        setup: 12,
      }, ]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 6,
        "setup": 12,
        "startDate": new Date("2021-04-15T13:00:00.000Z"),
        "endDate": new Date("2021-04-15T19:00:00.000Z"),
      }, ]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when the second task last longer than the current day', () => {
    it('continues the task the next day', () => {
      const dateWednesday = '4/14/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateWednesday)
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
      const dateTuesday = '4/13/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateTuesday)
      wt.addShift(0)

      const events = [{
        duration: 31,
        setup: 5
      }, ]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 31,
        "setup": 5,
        "startDate": new Date("2021-04-13T16:00:00.000Z"),
        "endDate": new Date("2021-04-16T17:00:00.000Z"),
      }, ]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when a task overlaps on an off day', () => {
    it('ends the task the next available day', () => {
      const dateFriday = '4/16/2021'

      const wt = new WorkingTimes()
      wt.setScheduleStartDate(dateFriday)
      wt.addShift(0)

      const events = [{
        duration: 12,
        setup: 0
      }, ]

      events.forEach((event) => wt.addEvent(event))

      const output = [{
        "duration": 12,
        "setup": 0,
        "startDate": new Date("2021-04-16T11:00:00.000Z"),
        "endDate": new Date("2021-04-19T13:00:00.000Z"),
      }, ]

      expect(wt.getEvents()).toEqual(output)
    })
  })

  describe('when there are multiple shifts', () => {
    describe('and the task extends to next shift', () => {
      it.skip('ends the task in the next shift', () => {
        const dateFriday = '4/16/2021'

        const wt = new WorkingTimes()
        wt.setScheduleStartDate(dateFriday)
        wt.addShift(0)
        wt.addShift(5)

        const events = [{
          duration: 12,
          setup: 0
        }]

        events.forEach((event) => wt.addEvent(event))

        const output = [{
          "duration": 12,
          "setup": 0,
          "startDate": new Date("2021-04-16T11:00:00.000Z"),
          "endDate": new Date("2021-04-19T13:00:00.000Z"),
        }, ]

        expect(wt.getEvents()).toEqual(output)
      })
    })
  })

  describe('when a shift is added', () => {
    it('updtes working times', () => {
      const wt = new WorkingTimes()
      wt.addShift(0)
      wt.addShift(5)

      expect(wt.getWorkingTimes()).toEqual([
        [1, "6:00", "16:00"],
        [1, "21:15", "06:15"],

        [2, "6:00", "16:00"],
        [2, "21:15", "06:15"],

        [3, "6:00", "16:00"],
        [3, "21:15", "06:15"],

        [4, "6:00", "16:00"],
        [4, "21:15", "06:15"],

        [5, "6:00", "16:00"],
        [5, "21:15", "06:15"]
      ])
    })
  })
})
