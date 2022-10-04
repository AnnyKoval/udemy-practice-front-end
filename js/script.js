document.addEventListener("DOMContentLoaded", function (event) {
  const tabs = document.querySelectorAll(".tabheader__item"), // Tabs functional
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");

    tabs[i].classList.add("tabheader__item_active");
  }
  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          // item - это каждый tab в переборе, i - это номер элемента по порядку в массиве

          hideTabContent();
          showTabContent(i); // если пользователь кликнул на 3й таб - откроется меню для 3 таба и тд
        }
      });
    }
  });

  // Timer functional block

  const deadline = "2023-01-10";
  const endProposal = document.querySelector("#deadline");
  endProposal.innerHTML = `${deadline} o 00:00`;

  function getTimeRemaining(endtime) {
    // endtime будет приходить в формате строки
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date()); // 1) вызывает Date со строкой, получает количество миллисекунд до той дедлайна, 2) текущая дата в миллисекундах
    if (t <= 0) {
      // если дата дедлайна уже прошла, интерфейс отобразит 0 0 0 0
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      (days = Math.floor(t / (1000 * 60 * 60 * 24))), //количество миллисекунд до конца акции делим на количество мс в одном дне
        (hours = Math.floor((t / (1000 * 60 * 60)) % 24)), // поскольку нам нужен остаток, он отображается в часах, а не все количество часов до конца акции
        (minutes = Math.floor((t / 1000 / 60) % 60)), //также берет остаток минут, а не все количество минут до конца акции
        (seconds = Math.floor((t / 1000) % 60)); //также берет остаток секунд, а не все количество до конца акции
    }
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    //когда однозначное число, то перед ним будет добавлен 0
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds");
    timeInterval = setInterval(updateClock, 1000); // обновление таймера через секунду

    updateClock(); //убираем мигание верстки

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval); // если время вышло, то остановить таймер
      }
    }
  }
  setClock(".timer", deadline);

  //Modal windows block

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    modalCloseBtn = document.querySelector("[data-close]");

  function OpenModal() {
    modal.classList.add("show"); //присваиваем класс show при клике на кнопку
    modal.classList.remove("hide"); //и одновременно удаляем класс hide
    //можно также через метод toggle
    //modal.classList.toggle("show");
    document.body.style.overflow = "hidden"; // при п опытке скрола вниз, модалка не дает скролу двигаться вниз
    clearInterval(modalTimerID);
  }

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", OpenModal);
  });

  function closeModal() {
    modal.classList.add("hide"); // при нажатии на крестик модалка закрывается
    modal.classList.remove("show");
    //можно также через метод toggle
    //modal.classList.toggle("show");
    document.body.style.overflow = ""; //отменяем блок скрола
  }

  modalCloseBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    // по нажатию на любую точку экрана закрыть модалку
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      /* по нажатию кнопки esc закрыть модалку, при этом только по нажатию в режиме модалки, а не каждый раз
      при нажатиии esc */
      closeModal();
    }
  });

  const modalTimerID = setTimeout(OpenModal, 600000);
  //всплывает модалка через 10 min после открытия сайта

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      /*1 - это пролистанное пользователем, 2 - это оставшаяся видимая часть снизу
  страницы, 3 - общая видимая область всей страницы за вычетом 1 пикселя до конца */
      OpenModal();
      window.removeEventListener("scroll", showModalByScroll); //удаляет следующий показ модалки после первого отобоажения в конце стр
    }
  }

  window.addEventListener("scroll", showModalByScroll);
  //показать модалку, когда пользователь долистал до конца страницы

  //Dynamic content with classes for cards
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.parent = document.querySelector(parentSelector); //элемент, в который мы будем размещать карточку
      this.price = price;
      this.transfer = 36;
      this.changeToUAH(); //конвертация в грн
    }
    changeToUAH() {
      this.price = this.price * this.transfer;
    }
    render() {
      const element = document.createElement("div");
      element.innerHTML = `
         <div class="menu__item">
            <img src=${this.src} alt=${this.alt} />
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">
              ${this.descr}
            </div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
              <div class="menu__item-cost">Ціна:</div>
              <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
          </div>
      `;
      this.parent.append(element); //разместить элемент внутри родителя
    }
  }

  //создаем объект и вызываем рендер
  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фітнес"',
    'Меню "Фітнес" - це новий підхід к приготуванню блюд: більше свіжих овочів та фруктів. Продукт активних та здорових людей. Це абсолютно новий продукт з оптимальною ценою та високою якістю!',
    15,
    ".menu .container" //родительский селектор
  ).render();

  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Пісне"',
    "Меню “Пісне” - це ретельний відбір інгредієнтів: відсутність продуктів тваринного походження, молоко з мигдаля, вівса, кокоса або гречки, вірна кількість білків за рахунок тофу і вегетарианських стейків.",
    14,
    ".menu .container"
  ).render();

  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    "Меню “Преміум”",
    "В меню “Преміум” ми використовуємо не лише красивий дизайн пакування, але й якісне виконання блюд. Червона риба, морепродукти, фрукти - ресторанне меню без походу до ресторану!",
    21,
    ".menu .container"
  ).render();
});
