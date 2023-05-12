var notice = document.getElementById("notice");
var clocks = document.getElementById("timer");
var startBtn = document.getElementById("start");
var stopBtn = document.getElementById("stop");

var t = timer();
target_date = Date.parse("may 17, 2023 11:00:00");
// target_date = Date.parse("may 14, 2023 21:30:30");



function leftFillNum(num, targetLength) {
  return num.toString().padStart(targetLength, "0");
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const blink = async () => {
    console.log("blink executed");
    tdiv = document.getElementById("timer");
    for (let i = 0; i < 7; i++) {
      tdiv.style.visibility='hidden';
      await delay(100);

      tdiv.style.visibility='visible';
      await delay(300);
    } ;
}; 

function updateTimer() {

    now = new Date();
    diff = target_date - now;
    //console.log(diff)
    
    if (diff <= 0){
      // stop the countdown once we get into the target datetime
      diff = 0;
      blink();
      t.stop();
    }

    if (diff < 86400000 && notice){
      // remove the "event start notice" 24 hours prior end date
      notice.remove();
      notice = null;
      // and change time padding to align it better to page
      clocks.style.padding = "180px 0px 0px 0px";
      console.log("Remove notice");
    }


    days = Math.floor(diff / (1000 * 60 * 60 * 24));
    hours = Math.floor(diff / (1000 * 60 * 60));
    mins = Math.floor(diff / (1000 * 60));
    secs = Math.floor(diff / 1000);
    msecs = Math.floor(((diff) % 1000) / 100);

    d = days;
    h = hours - days * 24;
    m = mins - hours * 60;
    s = secs - mins * 60;
    ms = msecs;

    document.getElementById("timer")
        .innerHTML =
        //'<div>' + d + '<span>Days</span></div>' +
        '<div>' + leftFillNum(h,2) + '</div>:' + // '<span>Hours</span></div>' +
        '<div>' + leftFillNum(m,2) + '</div>:' + // '<span>Minutes</span></div>' +
        '<div>' + leftFillNum(s,2) + '</div>.' + // '<span>Seconds</span></div>' + 
        '<div>' + ms + '</div>'; // '<span>ms</span></div>';

    
}

//setInterval('updateTimer()', 10);
function timer() {
    var timer = null;

    function stop() {
      clearTimeout(timer);
    }

    function start() {
      timer  = setInterval(function(){
        updateTimer();
      }, 100);    
    }

    return {
      stop,
      start
    };
}




startBtn.addEventListener("click", function(){
  t.start();
}, false);

stopBtn.addEventListener("click", function(){
  t.stop();
}, false);


t.start();