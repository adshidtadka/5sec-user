$(function() {
  $(document).on("click", "#action", action);
});

const INF = 999999;
const COUNTDOWN = 3;
const TIMER = 5;
let startTime, endTime;
let timeOutId;
let clickNum = 0;

const action = function() {
  $(this).data("click", ++clickNum);
  clickNum = $(this).data("click");
  if (clickNum == 1) {
    // set startTime and endTime
    startTime = new Date();
    endTime = new Date(startTime.getTime());
    endTime = endTime.setSeconds(endTime.getSeconds() + COUNTDOWN + TIMER);

    // start countdown
    countdown(COUNTDOWN);
  } else if (clickNum == 2) {
    stopTimer(false);
  }
};

const countdown = function(num) {
  if (num > 0) {
    $("#countdown").text($("#countdown").text() + " " + String(num));
    num--;
    setTimeout(countdown, 1000, num);
  } else if (num == 0) {
    $("#countdown").text($("#countdown").text() + " START!");

    // create stop button
    $("#action").text("Stop");
    $("#action").removeClass("btn-light");
    $("#action").addClass("btn-danger");

    // start fadeout
    $("#timer").removeClass("show");
    $("#countdown").removeClass("show");

    // start timer
    timer();
  }
};

const timer = function() {
  const nowTime = new Date();
  const diff = endTime - nowTime;
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
      $("#result-thead").append(
        "<tr><th scope='col'>#</th><th scope='col'>user</th><th scope='col'>score</th></tr>"
      );
      let tbody;
      data["results"].forEach((row, index) => {
        tbody +=
          "<tr><th scope='row'>" +
          String(parseInt(index) + 1) +
          "</th > <td>" +
          row["user_name"] +
          "</td><td>" +
          row["score"] +
          "</td></tr>";
      });
      $("#result-tbody").append(tbody);
    })
    .fail(() => {
      $("#message").text("Fail");
    })
    .always(data => {
      console.log(data);
    });
};
