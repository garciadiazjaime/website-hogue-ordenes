const shifts = [
  {
    title: 'L-V 6:00am A 4:00pm',
    breaksTitle: '10:00am A 10:30am - 2:00pm A 2:30pm',
    breaks: [['10:00', '10:30'], ['14:00', '14:30']],
    startTime: '6:00',
    endTime: '16:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    overtime: [0, 0, 0, 0, 0],
  },
  {
    title: 'L-S 6:00am A 2:00pm',
    breaksTitle: '9:30am A 10:00am',
    breaks: [['9:30', '10:00']],
    startTime: '6:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    overtime: [0, 0, 0, 0, 0, 0],
  },
  {
    title: 'L-S 2:00pm A 7:30pm',
    breaks: [['10:00', '10:30']],
    breaksTitle: '10:00am A 10:30am',
    breaks: [],
    startTime: '14:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    overtime: [0, 0, 0, 0, 0, 0],
  },
  {
    title: 'L-V 2:00pm A 11:15pm',
    breaksTitle: '5:00pm A 6:00pm',
    breaks: [['17:00', '18:00']],
    startTime: '14:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    overtime: [0, 0, 0, 0, 0],
  },
  {
    title: 'L-V 4:00pm A 1:00am',
    breaksTitle: '8:00pm A 9:00pm',
    breaks: [['20:00', '21:00']],
    startTime: '16:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    overtime: [0, 0, 0, 0, 0],
  },
  {
    title: 'L-V 9:15pm A 6:15am',
    breaksTitle: '1:30am A 2:00am - 4:30am A 5:00am',
    breaks: [['13:30', '14:00'], ['04:30', ['05:00']]],
    startTime: '21:15',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    overtime: [0, 0, 0, 0, 0],
  },
]

export {
  shifts
}
