// PARAMETERS

const ACTIVITY_ID = 2;
const TASK_ID = 5;
const LOCATION_ID = 3;

// DOM elements

const selectors = {
  timeEntryButtons: () => document.querySelectorAll('[title="+ Time Entry"]'),
  currentDayCancelBtn: () => document.querySelectorAll('input[value="Cancel"]')[3],
  submitFullTimesheetBtn: () => document.querySelectorAll('input[value="Submit Time Entries"]'),
  currentDaySubmitBtn: () => document.getElementById('saveNewTimeEntryBtn'),
  locationDropdown: () => document.querySelectorAll('select[class="AllTimeFields"]')[2],
  taskDropdown: () => document.querySelectorAll('select[class="AllTimeFields"]')[1],
  workHoursInput: () => document.getElementsByClassName('EntryUnitsText')[0],
  activityDropdown: () => document.getElementsByClassName('ResourceActivityName')[1],
};

// UTILS

var nap = (time) => new Promise((res) => setTimeout(res, time));
var getLuckyWorkHours = () => Math.floor(Math.random() * 3.1) + 8;

var openDropdown = (element) => {
  element.style.position = 'fixed';
  element.style.top = 0;
  element.style.right = 0;
  const event = document.createEvent('MouseEvents');
  event.initMouseEvent('mousedown', true, true, window);
  element.dispatchEvent(event);
};

// HELPERS

async function openTimeEntry(timeEntryBtn) {
  console.log(`Clicking timeEntry button for current day..`);
  timeEntryBtn.click();
  await nap(2000);
}

async function entryActivity() {
  const activityDropdown = selectors.activityDropdown();
  openDropdown(activityDropdown);
  const targetValue = activityDropdown.children[ACTIVITY_ID].value;
  console.log(`Selecting WH option with value "${targetValue}"`);
  activityDropdown.value = targetValue;
  activityDropdown.dispatchEvent(new Event('change'));
  await nap(3000);
}

async function entryHours(hoursDay) {
  const workHours = hoursDay || getLuckyWorkHours();
  console.log(`Entering working hours: ${workHours}`);
  selectors.workHoursInput().value = workHours;
}

async function entryTask() {
  const taskDropdown = selectors.taskDropdown();
  const targetTask = taskDropdown.children[TASK_ID].value;
  console.log(`Selecting Task "${targetTask}"`);
  taskDropdown.value = targetTask;
  taskDropdown.dispatchEvent(new Event('change'));
  await nap(100);
}

async function entryLocation() {
  const locationDropdown = selectors.locationDropdown();
  const targetLocation = locationDropdown.children[LOCATION_ID].value;
  console.log(`Selecting Location "${targetLocation}"`);
  locationDropdown.value = targetLocation;
  locationDropdown.dispatchEvent(new Event('change'));
  await nap(1000);
}

const submitCurrentDay = () => {
  if (window.isTest) {
    selectors.currentDayCancelBtn().click();
    console.log('Cancelled.');
  } else {
    selectors.currentDaySubmitBtn().click();
    console.log('Saved.');
  }
};

async function enterTimeEntry(timeEntryBtn, hoursDay) {
  await openTimeEntry(timeEntryBtn);
  await entryActivity();
  await entryHours(hoursDay);
  await entryTask();
  await entryLocation();
  submitCurrentDay();
}

const submitAll = () => selectors.submitFullTimesheetBtn().click();

async function submit(times = []) {
  const timeEntryBtns = selectors.timeEntryButtons();
  for (let id = 0; id < 5; ++id) {
    console.log(`Processing day ${id + 1}`);
    const currentTimeEntryBtn = timeEntryBtns[id];
    const currentValue = times[id];
    await enterTimeEntry(currentTimeEntryBtn, currentValue);
  }
  if (!window.isTest) {
    console.log('Submitting full timesheet..');
    submitAll();
    console.log('Have a good weekend! 🏖 😎 🍹');
  } else {
    console.log('Stop breaking stuff! 🔥 🤖 🔥');
  }
}

// USAGE:
// submit() -> for random values ~8-10
// submit([8,9,8,9,10]) -> enter weekdays values in order
// window.isTest = 1; submit();
