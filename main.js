let now = new Date(); // сегодня
let nowMonth = now.getMonth(); // сегодняшний месяц
let nowYear = now.getFullYear(); // сегодняшний год
let selectedDay = "";
const Months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
]; // названия месяцев
const wd = [6, 0, 1, 2, 3, 4, 5]; // дни недели
const events = [
  ["2020-03-26", "ДР", "Алина"],
  ["2020-03-28", "Свадьба", "Никита"],
  ["2020-04-28", "ДР", "Даша"],
  ["2020-05-28", "Праздник", "Алеся"],
  ["2020-03-24", "ДР", "Зина"],
  ["2020-03-24", "Вечеринка", "Леша"]
];

const tbody = document.querySelector("tbody");
const back = document.getElementById("back");
const next = document.getElementById("next");
let nameOfMonth = document.getElementById("month");
let nameOfYear = document.getElementById("year");
const newEvent = document.getElementById("newEvent");
const event = document.getElementById("event");
const form = document.getElementById("form");

function getWeekDay(year, month, day) {
  const d = new Date(year, month, day);
  const weekDay = d.getDay();
  return weekDay;
} // находит день недели у даты (year, month, day)

function getDaysInMonth(month) {
  switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31;
      break;
    case 3:
    case 5:
    case 8:
    case 10:
      return 30;
      break;
    default:
      return 28;
  }
} // подсчет количества дней в месяце

function renderMonth(year, month) {
  let N = 0;
  let selectedDay = "";
  nameOfMonth.innerText = `${Months[nowMonth]}`;
  form.innerText = "";
  event.innerText = "";
  tbody.innerText = "";
  tbody.insertAdjacentHTML(
    "beforeend",
    `<tr week="${N}">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>`
  ); // формирование первой строки в таблице

  let DaysInMonth = getDaysInMonth(month);

  if (DaysInMonth == 28) {
    if (year % 4 === 0 && !(year % 100 === 0)) {
      DaysInMonth++;
    } else {
      if (year % 400 === 0) {
        DaysInMonth++;
      }
    }
  } // високосный год

  for (let i = 1; i <= DaysInMonth; i++) {
    const weekDay = getWeekDay(year, month, i); // день недели дня (0 - воскресенье)

    if (i == 1 && weekDay == 1) {
      tbody.firstElementChild.remove();
      N--;
    } // проверка на первый день недели - понедельник

    if (weekDay == 1) {
      tbody.insertAdjacentHTML(
        "beforeend",
        `<tr week="${N + 1}">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>`
      );
      N++;
    } // переход на новую строку заполнения недели

    tbody.children[N].children[wd[weekDay]].innerText = `${i}`; // вставка даты в td
    tbody.children[N].children[wd[weekDay]].setAttribute(
      "date",
      `${year}-${month < 10 ? "0" + (month + 1) : month + 1}-${
        i < 10 ? "0" + i : i
      }`
    ); // добавление атрибута date со значением в формате "yyyy-mm-dd"

    if (weekDay == 6 || weekDay == 0) {
      tbody.children[N].children[wd[weekDay]].classList.add("dayOff");
    }
    if (
      i == now.getDate() &&
      month == now.getMonth() &&
      year == now.getFullYear()
    ) {
      tbody.children[N].children[wd[weekDay]].classList.add("today");
    } // стилизация сегодняшнего дня
    let countEventsInDay = 0;
    for (let j = 0; j < events.length; j++) {
      if (
        new Date(events[j][0]).getFullYear() == year &&
        new Date(events[j][0]).getMonth() == month &&
        new Date(events[j][0]).getDate() == i
      ) {
        countEventsInDay++;
        if (countEventsInDay > 1) {
          tbody.children[N].children[wd[weekDay]].lastElementChild.remove();
        } // проверка на количество событий
        tbody.children[N].children[wd[weekDay]].classList.add("event");
        tbody.children[N].children[wd[weekDay]].insertAdjacentHTML(
          "beforeend",
          `<span class="countEvents">${countEventsInDay}</span>`
        );
      }
    } // стилизация дня, у которого есть событие, подсчет количества событий в этот день
  }

  let selectedBefore = "";
  tbody.addEventListener("click", function(e) {
    if (selectedBefore != "") {
      selectedBefore.classList.remove("selectedDay");
    }
    selectedBefore = e.target;
    selectedDay = e.target.getAttribute("date");
    event.innerText = "";
    if (e.target.hasAttribute("date")) {
      e.target.classList.add("selectedDay");
    }

    if (e.target.classList.contains("event") && e.target.hasAttribute("date")) {
      let date = e.target.getAttribute("date");
      for (let i = 0; i < events.length; i++) {
        if (date == events[i][0]) {
          event.insertAdjacentHTML(
            "beforeend",
            `<div class="discription">
          <div class="titleEvent">Событие: ${events[i][1]}</div>
          <div class="textEvent">Описание: ${events[i][2]}</div>
        </div>`
          );
        }
      }
    } else if (e.target.hasAttribute("date")) {
      event.insertAdjacentHTML("beforeend", `Событий нет`);
    }
  }); // описание события кликнутого дня

  let clicksNewEvent = 0;

  newEvent.addEventListener("click", function() {
    clicksNewEvent++;
    if (clicksNewEvent >= 1) {
      form.innerText = "";
    }
    form.insertAdjacentHTML(
      "beforeend",
      `<div>Title: </div><input id="title" type="text" />
    <div>Text: </div><input id="text" type="text" />
    <button id="addEvent" type="button">Добавить событие</button>`
    );
    const addEvent = document.getElementById("addEvent");
    const title = document.getElementById("title");
    const text = document.getElementById("text");
    addEvent.addEventListener("click", function() {
      if (title.value == "" || text.value == "") {
        alert("Введите данные корректно");
      } else if (selectedDay == "") {
        alert("Выберете день");
      } else {
        events.push([selectedDay, title.value, text.value]);
        title.value = "";
        text.value = "";
        renderMonth(now.getFullYear(), nowMonth);
      }
    });
  }); // добавление нового события
}

back.addEventListener("click", function() {
  if (nowMonth == 0) {
    nowMonth = 11;
    nowYear--;
  } else {
    nowMonth--;
  }
  nameOfMonth.innerText = `${Months[nowMonth]}`;
  nameOfYear.value = `${nowYear}`;
  renderMonth(nowYear, nowMonth);
}); // нажатие на "месяц назад"

next.addEventListener("click", function() {
  if (nowMonth == 11) {
    nowMonth = 0;
    nowYear++;
  } else {
    nowMonth++;
  }
  nameOfMonth.innerText = `${Months[nowMonth]}`;
  nameOfYear.value = `${nowYear}`;
  renderMonth(nowYear, nowMonth);
}); // нажатие на "месяц вперед"

nameOfYear.addEventListener("change", function() {
  Y = nameOfYear.value;
  renderMonth(Y, nowMonth);
}); // нажатие на "изменение года"

renderMonth(nowYear, nowMonth); // прорисовка сегодняшнего месяца (в первый раз)
