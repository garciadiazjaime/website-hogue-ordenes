import { shifts } from "./shifts";

function getIsNextDay(currentDay, nextDay) {
  if (currentDay === nextDay) {
    return 0;
  }

  if (currentDay < nextDay) {
    return 1;
  }

  return 6 - currentDay + nextDay + 1;
}

function getDate(date, time) {
  const [month, day, year] = date.toLocaleDateString().split("/");

  return new Date(`${year}-${month}-${day} ${time}`);
}

function getEndSlot(date, time) {
  const endSlot = getDate(date, time);

  if (endSlot < date) {
    endSlot.setDate(endSlot.getDate() + 1);
  }

  return endSlot;
}

function getDay(day, startTime, shiftStartTime) {
  const date = new Date();
  const startDate = new Date(
    `${date.toISOString().split("T")[0]} ${startTime}`
  );
  const shiftStartDate = new Date(
    `${date.toISOString().split("T")[0]} ${shiftStartTime}`
  );

  return startDate >= shiftStartDate ? day : day + 1;
}

const weekDays = [0, 1, 2, 3, 4, 5, 6];

function getWorkDays(date) {
  const startDay = new Date(date).getDay();

  const index = weekDays.indexOf(startDay);

  return [...weekDays.slice(index), ...weekDays.slice(0, startDay)];
}

function adjustNextDayWhenSunday(startDate, isNextDay) {
  const day = new Date(startDate);
  day.setDate(day.getDate() + isNextDay);

  if (day.getDay() === 0) {
    return 0;
  }

  return isNextDay;
}

export const getOrders = (orders, catalog, wt, initialSetup, activeTab) => {
  return orders.map((order, index) => {
    const part = catalog[order.partId] || {};

    if (!part || !part.piecesByHour) {
      order.missingPart = true;
      part.piecesByHour = Infinity;
    }
    const overtime = Number.isInteger(parseInt(order.overtime))
      ? order.overtime
      : 0;
    const quantityCoverPerHour = order.quantity / part.piecesByHour;
    const duration =
      quantityCoverPerHour - overtime > 0
        ? quantityCoverPerHour - overtime
        : quantityCoverPerHour;
    order.duration = duration > 0 ? duration : 0;
    order.laborHours = order.quantity * part.hrsByPiece;

    const setup = index > 0 || initialSetup[activeTab] ? part.setup : 0;

    const { startDate: startDateEvent, endDate } = wt.addEvent({
      duration,
      setup,
    });

    order.desiredRIsDate = startDateEvent;
    order.desiredWantDate = endDate;
    order.setup = setup;

    return order;
  });
};

class WorkingTimes {
  constructor() {
    this.scheduleStartDate = null;
    this.startDate = null;
    this.endDate = null;
    this.shifts = [];
    this.events = [];
    this.workingTimes = [];
    this.currentShift = 0;
    this.currentSlot = 0;
    this.holidays = [];
  }

  setScheduleStartDate(date) {
    this.currentSlot = new Date(date).getDay();
    this.scheduleStartDate = date;
  }

  addShift(type) {
    this.shifts.push(shifts[type]);
  }

  addHolidays(holidays) {
    if (!Array.isArray(holidays) || !holidays.length) {
      return null;
    }

    holidays.forEach((item) => {
      this.holidays.push(new Date(item));
    });
  }

  getScheduleStartDate() {
    return this.scheduleStartDate;
  }

  getCurrentShift() {
    return this.shifts[this.currentShift];
  }

  getCurrentSlot() {
    return this.workingTimes[this.currentSlot];
  }

  getNextSlot() {
    let [day] = this.getCurrentSlot();
    const slotIndex = (this.currentSlot + 1) % this.workingTimes.length;
    this.currentSlot = slotIndex;

    const nextSlot = this.getCurrentSlot();
    const isNextDay = getIsNextDay(day, nextSlot[0]);

    return [nextSlot, isNextDay];
  }

  moveSlotTillNextDay() {
    let [, isNextDay] = this.getNextSlot();

    while (!isNextDay) {
      [, isNextDay] = this.getNextSlot();
    }

    return isNextDay;
  }

  setWorkingTimes() {
    const workingTimes = [];
    const workDays = getWorkDays(this.getScheduleStartDate());

    workDays.forEach((day) => {
      this.shifts.forEach((shift) => {
        const { startTime: shiftStartTime, slots } = shift;

        if (shift.days.includes(day)) {
          slots.forEach(([startTime, endTime]) => {
            const dayAdjusted = getDay(day, startTime, shiftStartTime);

            workingTimes.push([dayAdjusted, startTime, endTime]);
          });
        }
      });
    });

    this.workingTimes = workingTimes;

    const firstDay = new Date(this.scheduleStartDate).getDay();
    this.currentSlot = workingTimes.reduce((accu, [day], index) => {
      if (accu === undefined && day === firstDay) {
        accu = index;
      }

      return accu;
    }, undefined);

    if (!Number.isInteger(this.currentSlot)) {
      return alert("Invalid Start Date");
    }

    this.startDate = new Date(
      `${this.scheduleStartDate} ${this.workingTimes[this.currentSlot][1]}`
    );
    this.endDate = new Date(this.startDate);

    return true;
  }

  getWorkingTimes() {
    return this.workingTimes;
  }

  getStartDate(setup) {
    let startDateAdjusted = new Date(this.endDate);

    while (this.isHoliday(startDateAdjusted)) {
      startDateAdjusted.setDate(startDateAdjusted.getDate() + 1);
      startDateAdjusted = this.calculateStartEndDate(setup, startDateAdjusted);
    }

    const startDate = this.calculateStartEndDate(setup, startDateAdjusted);

    this.startDate = new Date(startDate);

    return startDate;
  }

  getEndDate(duration) {
    const endDate = this.calculateStartEndDate(duration, this.startDate);

    let endDateAdjusted = new Date(endDate);

    while (this.isHoliday(endDateAdjusted)) {
      endDateAdjusted.setDate(endDateAdjusted.getDate() + 1);
      endDateAdjusted = this.calculateStartEndDate(0, endDateAdjusted);
    }

    this.endDate = new Date(endDateAdjusted);

    return endDateAdjusted;
  }

  isHoliday(date) {
    if (!this.holidays.length || !date) {
      return false;
    }

    return !!this.holidays.find(
      (holiday) =>
        holiday.getFullYear() === date.getFullYear() &&
        holiday.getMonth() === date.getMonth() &&
        holiday.getDate() === date.getDate()
    );
  }

  calculateStartEndDate(duration, date) {
    if (Number.isNaN(duration)) {
      return console.log(`invalid duration: ${duration}`);
    }

    let [, , endTime] = this.getCurrentSlot();

    let startDate = new Date(date);
    let endDate = null;

    let hoursLeft = duration;
    let endSlot = getEndSlot(startDate, endTime);

    if (!hoursLeft) {
      endDate = new Date(startDate);
    }

    while (hoursLeft > 0) {
      const slotTime = (endSlot - startDate) / 1000 / 3600;

      if (hoursLeft <= slotTime) {
        endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + hoursLeft * 60);
      }

      hoursLeft -= slotTime;

      if (hoursLeft > 0) {
        let [[, startTime, endTime], isNextDay] = this.getNextSlot();

        startDate = getDate(startDate, startTime);

        isNextDay = adjustNextDayWhenSunday(startDate, isNextDay);

        startDate.setDate(startDate.getDate() + isNextDay);

        while (this.isHoliday(startDate)) {
          isNextDay = this.moveSlotTillNextDay();
          startDate.setDate(startDate.getDate() + isNextDay);
        }

        endSlot = getEndSlot(startDate, endTime);
        if (endSlot < startDate) {
          endSlot.setDate(endSlot.getDate() + 1);
        }
      }
    }

    return endDate;
  }

  addEvent({ duration, setup }) {
    const startDate = this.getStartDate(setup);
    const endDate = this.getEndDate(duration);

    this.events.push({
      duration,
      setup,
      startDate,
      endDate,
    });

    return {
      startDate,
      endDate,
    };
  }

  getEvents() {
    return this.events;
  }

  print() {
    this.shifts.forEach((shift) => console.log(shift));
    console.log("scheduleStartDate", this.scheduleStartDate);
    console.log("startDate", this.startDate);
    console.log("events", this.events);
  }
}

export default WorkingTimes;
