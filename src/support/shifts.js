const shifts = [
  {
    title: 'M-F 6am-4pm',
    breaksTitle: '10:00am A 10:30am - 2:00pm A 2:30pm',
    breaks: [['10:00', '10:30'], ['14:00', '14:30']],
    startTime: '6:00',
    endTime: '16:00',
    slots: [
      ['6:00', '10:00'],
      ['10:30', '14:00'],
      ['14:30', '16:00']
    ],
    daysTitle: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    days: [1, 2, 3, 4, 5],
  },
  {
    title: 'M-S 6am-2pm',
    breaksTitle: '9:30am A 10:00am',
    breaks: [['9:30', '10:00']],
    startTime: '6:00',
    endTime: '14:00',
    slots: [
      ['6:00', '9:30'],
      ['10:00', '14:00']
    ],
    daysTitle: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    days: [1, 2, 3, 4, 5, 6],
  },
  {
    title: 'M-S 2pm-7:30pm',
    breaks: [['10:00', '10:30']],
    breaksTitle: '10:00am A 10:30am',
    breaks: [],
    startTime: '14:00',
    endTime: '19:30',
    slots: [
      ['14:00', '17:30'],
      ['18:00', '19:30']
    ],
    daysTitle: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    days: [1, 2, 3, 4, 5, 6],
  },
  {
    title: 'M-F 2pm-11:15pm',
    breaksTitle: '5:00pm A 6:00pm',
    breaks: [['17:00', '18:00']],
    startTime: '14:00',
    endTime: '23:15',
    slots: [
      ['14:00', '17:00'],
      ['18:00', '23:15']
    ],
    daysTitle: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    days: [1, 2, 3, 4, 5],
  },
  {
    title: 'M-F 4pm-1am',
    breaksTitle: '8:00pm A 9:00pm',
    breaks: [['20:00', '21:00']],
    startTime: '16:00',
    endTime: '01:00',
    slots: [
      ['16:00', '20:00'],
      ['21:00', '01:00']
    ],
    daysTitle: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    days: [1, 2, 3, 4, 5],
  },
  {
    title: 'M-F 9:15pm-6:15am',
    breaksTitle: '1:30am A 2:00am - 4:30am A 5:00am',
    breaks: [['01:30', '02:00'], ['04:30', '05:00']],
    startTime: '21:15',
    endTime: '06:15',
    slots: [
      ['21:15', '01:30'],
      ['02:00', '04:30'],
      ['05:00', '06:15']
    ],
    daysTitle: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    days: [1, 2, 3, 4, 5],
  },
]

export {
  shifts
}
