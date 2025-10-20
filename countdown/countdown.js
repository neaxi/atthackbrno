/*
cases to be covered:
#1 - > 2 days till start => top logo + notice + 2 lines of timer
#2 - > 1 days till start => top logo + notice + line of timer
#3 - > 10 sec till start => top logo + huge countdown (sec+ms only ?)
#4 - > event started => top logo + line of timer + bottom banner
#5 - > event ended =>  top logo + line of timer + bottom banner

ensure scaling via scroll
*/

var notice = document.getElementById("notice");
var timer_text = document.getElementById("timer");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
var daysElement = document.getElementById("days");

var t = timer();
var target_date = Date.parse("nov 21, 2025 11:00:00");
// time-date test cases, see header
// var target_date = new Date().getTime() + (48 * 60 * 60 * 1000) + (10 * 1000); // + 48h 10s
// var target_date = new Date().getTime() + (24 * 60 * 60 * 1000) + (70 * 1000); // + 24h 1m 10s//
// var target_date = new Date().getTime() + (24 * 60 * 60 * 1000) + (10 * 1000); // + 24h 10s
// var target_date = new Date().getTime() + 15 * 1000; // + 15s

var msg_notice = "starts in";
var msg_notice_less_than_minute = "Get ready!";

// banner changes not implemented. using CSS background-image instead
// var ban_go_top = "resources/banner_go_top_2024.png";
// var ban_go_bottom = "resources/banner_go_bottom.png";

// var ban_before_top = "resources/banner_go_top_2024.png";
// var ban_before_bottom = "resources/banner_more_time_bottom.jpg";

var timer_color_change_index = 0;

function leftFillNum(num, targetLength) {
  return num.toString().padStart(targetLength, "0");
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const blink = async () => {
  console.log("blink executed");
  tdiv = document.getElementById("timer");
  for (let i = 0; i < 7; i++) {
    tdiv.style.visibility = "hidden";
    await delay(100);

    tdiv.style.visibility = "visible";
    await delay(300);
  }
};

function updateTextStyles(daysRemaining) {
  // modify font size and margin/spacing fore each event phase
  if (daysRemaining >= 2) {
    // X days + timer
    notice.style.fontSize = "5vw";
    daysElement.style.fontSize = "16vw";
    timer_text.style.fontSize = "16vw";
  } else if (daysRemaining >= 1 && daysRemaining < 2) {
    // last 24h pre-event
    notice.style.fontSize = "5vw";
    notice.style.marginTop = "15%";
    timer_text.style.marginTop = "7%";
    timer_text.style.fontSize = "19vw";
  } else {
    // live event countdown timer
    //timer_text.style.marginTop = "14%";
    timer_text.style.marginTop = "20%"; //without bottom logo
    timer_text.style.fontSize = "18.5vw";
  }
}

function updateBanners(daysRemaining) {
  /* 
     the original idea was to change banners and their size based on the remaining time
     ....fuckit.jpg
  */

  //top banner now controlled via "background-image"
  //const bannerTop = document.getElementById("banner_top");
  const bannerBottom = document.getElementById("banner_bottom");

  // Modify content of banner_top and banner_bottom based on daysRemaining
  if (daysRemaining < 1) {
    //bannerTop.innerHTML = `<img src="${ban_go_top}" width="40%">`;
    //bannerBottom.innerHTML = `<img src="${ban_go_bottom}" width="85%">`;
  } else {
    // bannerTop.innerHTML = `<img src="${ban_before_top}" width="50%">`;
    // bannerBottom.innerHTML = `<img src="${ban_before_bottom}" height="400">`;
  }
}

function updateNotice(d, h, m) {
  // console.log(d, h, m)

  // message 1 min prior the event start
  if (notice) {
    notice.textContent = msg_notice;
  }

  // message 1 min prior the event start
  if (notice && d == 1 && m < 1 && h == 0) {
    notice.innerHTML = msg_notice_less_than_minute.fontcolor("red");
  }

  if (d == 0 && h < 24 && notice) {
    // remove the "event start notice" 24 hours prior end date
    // because that's the start time of the event
    notice.remove();
    notice = null;
    console.log("Remove notice");
  }
}

function updateTime() {
  timer = document.getElementById("timer");
  daysElement = document.getElementById("days");

  // if the remaining time is less than 24 hours, remove the "Days" line
  if (days > 1) {
    daysElement.innerHTML = "<div>" + d + " Days</div>";
  } else {
    daysElement.innerHTML = "";
  }

  const timeString = leftFillNum(h, 2) + ":" + leftFillNum(m, 2) + ":" + leftFillNum(s, 2) + "." + ms;
  let spans = timer_text.querySelectorAll('span');

  if (spans.length === 0) {
    for (let i = 0; i < timeString.length; i++) {
      let span = document.createElement('span');
      span.textContent = timeString[i];
      timer_text.appendChild(span);
    }
    spans = timer_text.querySelectorAll('span');
  } else {
    for (let i = 0; i < timeString.length; i++) {
      spans[i].textContent = timeString[i];
    }
  }

  // change color of timer during last 10 sec, char by char to red
  if (d == 0 && h == 0 && m == 0 && s < 10) {
    for (let i = 0; i <= 9 - s; i++) {
      spans[i].classList.add('red');
    }
  }
}

function refreshDisplay() {
  now = new Date();
  diff = target_date - now;
  //console.log(diff)

  if (diff <= 0) {
    // stop the countdown once we get into the target datetime
    diff = 0;
    blink();
    t.stop();
  }

  // get the numbers
  days = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours = Math.floor(diff / (1000 * 60 * 60));
  mins = Math.floor(diff / (1000 * 60));
  secs = Math.floor(diff / 1000);
  msecs = Math.floor((diff % 1000) / 100);

  d = days;
  h = hours % 24;
  m = mins % 60;
  s = secs % 60;
  ms = msecs;

  updateBanners(days);
  updateNotice(d, h, m);
  updateTextStyles(days);
  updateTime(diff);
}

//setInterval('refreshDisplay()', 10);
function timer() {
  var timer = null;

  function stop() {
    clearTimeout(timer);
  }

  function start() {
    timer = setInterval(function () {
      refreshDisplay();
    }, 100);
  }

  return {
    stop,
    start,
  };
}

startBtn.addEventListener(
  "click",
  function () {
    t.start();
  },
  false
);

stopBtn.addEventListener(
  "click",
  function () {
    t.stop();
  },
  false
);

t.start();
