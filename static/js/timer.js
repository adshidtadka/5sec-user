$(function() {
  $(document).on("click", "#action", action);
});

let endTime;
let timeOutId;
let clickNum = 0;

const action = function() {
  $(this).data("click", ++clickNum);
  clickNum = $(this).data("click");
  console.log(clickNum);
  if (clickNum == 1) {
    startTimer();
  } else if (clickNum == 2) {
    stopTimer();
  }
};

const startTimer = function() {
  getEndTime();
  createStopBtn();
  startFadeOut();
  timer();
};

const getEndTime = function() {
  endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + 5);
};

const createStopBtn = function() {
  $("#action").text("Stop");
  $("#action").removeClass("btn-light");
  $("#action").addClass("btn-danger");
};

const startFadeOut = function() {
  $("#timer").removeClass("show");
};

const timer = function() {
  const startTime = new Date();
  const diff = endTime - startTime;
  const times = 24 * 60 * 60 * 1000;
  const sec = (Math.floor((diff % times) / 1000) % 60) % 60;
  const ms = Math.floor((diff % times) / 10) % 100;

  if (diff >= 0) {
    $("#timer").text(zeroPadding(sec, 2) + ":" + zeroPadding(ms, 2));
    timeOutId = setTimeout(timer, 10);
  } else {
    $("#timer").addClass("show");
    $("#timer").text("--:--");
    $("#action").remove();
  }
};

const zeroPadding = function(num, length) {
  return ("0000000" + num).slice(-length);
};

const stopTimer = function() {
  clearTimeout(timeOutId);
  $("#timer").addClass("show");
  $("#action").remove();
};
