$(function() {
  getEndTime();
  startFadeOut();
  countDown();
  $(document).on("click", "#stop", stop);
});

let endTime;
let timeOutId;

const getEndTime = function() {
  endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + 5);
};

const countDown = function() {
  const startTime = new Date();
  const diff = endTime - startTime;
  const times = 24 * 60 * 60 * 1000;
  const sec = (Math.floor((diff % times) / 1000) % 60) % 60;
  const ms = Math.floor((diff % times) / 10) % 100;

  if (diff > 0) {
    $("#timer").text(zeroPadding(sec, 2) + ":" + zeroPadding(ms, 2));
    timeOutId = setTimeout(countDown, 10);
  } else {
    $("#timer").text("00:00");
  }
};

const zeroPadding = function(num, length) {
  return ("0000000" + num).slice(-length);
};

const startFadeOut = function() {
  $("#timer").removeClass("show");
};

const stop = function() {
  clearTimeout(timeOutId);
  $("#timer").addClass("show");
  $(this).remove();
};
