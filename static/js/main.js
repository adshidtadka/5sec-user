$(function() {
  $("#stop").on("click", { isStop: true }, stopTimer);
  startLoading();
});

const INF = 999999;
const COUNTDOWN = 3;
const TIMER = 5;
const LOADING = 5;
let startTime, endTime;
let timeOutId;
let clickNum = 0;

const startLoading = function() {
  $("#table-thead").append("<th scope='col'>user</th>");
  loading(LOADING);
};

const loading = function(sec) {
  if (sec > 0) {
    $("#loading").text("Recruiting participants..." + String(sec) + "s");
    sec--;
    setTimeout(loading, 1000, sec);
  } else if (sec == 0) {
    $("#loading").remove();
    $("#table-thead").text("");
    $("#table-tbody").text("");

    startCountDown();
  }
};

const startCountDown = function() {
  startTime = new Date();
  endTime = new Date(startTime.getTime());
  endTime = endTime.setSeconds(endTime.getSeconds() + COUNTDOWN + TIMER);

  // start countdown
  countdown(COUNTDOWN);
};

const countdown = function(sec) {
  if (sec > 0) {
    $("#countdown").text($("#countdown").text() + " " + String(sec));
    sec--;
    setTimeout(countdown, 1000, sec--);
  } else if (sec == 0) {
    $("#countdown").text($("#countdown").text() + " START!");

    // start fadeout
    $("#timer").removeClass("show");
    $("#countdown").removeClass("show");
    $("#stop").prop("disabled", false);

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
    stopTimer({ data: { isStop: false } });
  }
};

const zeroPadding = function(num, length) {
  return ("0000000" + num).slice(-length);
};

const stopTimer = function(e) {
  let score;
  if (e.data.isStop) {
    clearTimeout(timeOutId);
    const result_str = $("#timer").text();
    score =
      parseInt(result_str.substr(0, 2)) * 100 +
      parseInt(result_str.substr(3, 2));
  } else {
    $("#timer").text("--:--");
    score = INF;
  }

  $("#timer").addClass("show");
  $("#stop").remove();

  $.ajax({
    url: "http://localhost:5000/result",
    type: "POST",
    data: {
      userName: $("#user-name").text(),
      score: score
    }
  })
    .done(data => {
      $("#table-thead").append(
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
      $("#table-tbody").append(tbody);
    })
    .fail(() => {
      $("#message").text("Fail");
    })
    .always(data => {
      console.log(data);
    });
};
