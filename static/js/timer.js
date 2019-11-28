$(function() {
  $(document).on("click", "#action", action);
});

const INF = 999999;
let endTime;
let timeOutId;
let clickNum = 0;

const action = function() {
  $(this).data("click", ++clickNum);
  clickNum = $(this).data("click");
  if (clickNum == 1) {
    startTimer();
  } else if (clickNum == 2) {
    stopTimer(false);
  }
};

const startTimer = function() {
  // set endTime
  endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() + 5);

  // create stop button
  $("#action").text("Stop");
  $("#action").removeClass("btn-light");
  $("#action").addClass("btn-danger");

  // start fadeout
  $("#timer").removeClass("show");

  // start timer
  timer();
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
    stopTimer(true);
  }
};

const zeroPadding = function(num, length) {
  return ("0000000" + num).slice(-length);
};

const stopTimer = function(isOver) {
  let score;
  if (isOver) {
    $("#timer").text("--:--");
    score = INF;
  } else {
    clearTimeout(timeOutId);
    const result_str = $("#timer").text();
    score =
      parseInt(result_str.substr(0, 2)) * 100 +
      parseInt(result_str.substr(3, 2));
  }

  $("#timer").addClass("show");
  $("#action").remove();

  $.ajax({
    url: "http://localhost:5000/result",
    type: "POST",
    data: {
      userName: $("#user-name").text(),
      score: score
    }
  })
    .done(data => {
      $("#result").text(data["results"]);
    })
    .fail(() => {
      $("#result").text("Fail");
    })
    .always(data => {
      console.log(data);
    });
};
