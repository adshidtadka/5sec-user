const INF = 999999;
const COUNTDOWN = 3;
const TIMER = 5;
const userName = $("#user-name").text();
let gameId;
let endLoadingTime, endTimerTime;
let timerTimeOut, getPlayersTimeOut;
let fetchedPlayers = [];

$(function() {
  $("#stop").on("click", { isStop: true }, stopTimer);
  createGame();
});

const createGame = function() {
  $.ajax({
    url: "http://localhost:5000/game",
    type: "POST"
  }).done(res => {
    endLoadingTime = new Date(res.game.start_time);
    gameId = res.game.id;
    createPlayer();
  });
};

const createPlayer = function() {
  $.ajax({
    url: "http://localhost:5000/player",
    type: "POST",
    data: {
      userName: userName,
      gameId: gameId
    }
  }).done(() => {
    loading();
    getPlayers();
  });
};

const getPlayers = function() {
  $.ajax({
    url: "http://localhost:5000/player",
    type: "GET",
    data: {
      gameId: gameId
    }
  }).done(res => {
    let tbody;
    res.players.forEach((row, index) => {
      if (fetchedPlayers.includes(row["user_name"]) == false) {
        tbody +=
          "<tr><th scope='row'>" +
          String(parseInt(index) + 1) +
          "</th><td>" +
          row["user_name"] +
          "</td></tr>";
        fetchedPlayers.push(row["user_name"]);
      }
    });
    $("#table-tbody").append(tbody);
  });
  getPlayersTimeOut = setTimeout(getPlayers, 200);
};

const loading = function() {
  const remainTime = getRemainTime(endLoadingTime);
  if (remainTime.time >= 0) {
    $("#message").text(
      "Recruiting participants..." + String(remainTime.sec) + "s"
    );
    setTimeout(loading, 1000);
  } else {
    $("#message").text("");
    $("#message").removeClass("loading");

    clearTimeout(getPlayersTimeOut);

    countdown(COUNTDOWN);
  }
};

const countdown = function(sec) {
  if (sec > 0) {
    $("#countdown").text($("#countdown").text() + " " + String(sec));
    sec--;
    setTimeout(countdown, 1000, sec--);
  } else if (sec == 0) {
    $("#countdown").text($("#countdown").text() + " START!");
    $("#timer").removeClass("show");
    $("#countdown").removeClass("show");
    $("#stop").prop("disabled", false);

    const nowTime = new Date();
    endTimerTime = nowTime.setSeconds(nowTime.getSeconds() + TIMER);
    timer();
  }
};

const timer = function() {
  const remainTime = getRemainTime(endTimerTime);

  if (remainTime.time >= 0) {
    $("#timer").text(
      zeroPadding(remainTime.sec, 2) + ":" + zeroPadding(remainTime.ms, 2)
    );
    timerTimeOut = setTimeout(timer, 10);
  } else {
    stopTimer({ data: { isStop: false } });
  }
};

const stopTimer = function(e) {
  let score;
  if (e.data.isStop) {
    clearTimeout(timerTimeOut);
    const score_str = $("#timer").text();
    score =
      parseInt(score_str.substr(0, 2)) * 100 + parseInt(score_str.substr(3, 2));
  } else {
    $("#timer").text("--:--");
    score = INF;
  }

  $("#timer").addClass("show");
  $("#stop").remove();
  $("#table-thead").text("");
  $("#table-tbody").text("");

  postScore(score);
};

const postScore = function(score) {
  $.ajax({
    url: "http://localhost:5000/result",
    type: "POST",
    data: {
      userName: userName,
      gameId: gameId,
      score: score
    }
  });
  getResults();
};

const getResults = function() {
  $.ajax({
    url: "http://localhost:5000/result",
    type: "GET",
    data: {
      gameId: gameId
    }
  }).done(data => {
    $("#table-thead").append(
      "<tr><th scope='col'>#</th><th scope='col'>user</th><th scope='col'>score</th></tr>"
    );
    let tbody;
    data["players"].forEach((row, index) => {
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
  });
};

const zeroPadding = function(num, length) {
  return ("0000000" + num).slice(-length);
};

const gaussian = function(mean, stdev) {
  var y2;
  var use_last = false;
  return function() {
    var y1;
    if (use_last) {
      y1 = y2;
      use_last = false;
    } else {
      var x1, x2, w;
      do {
        x1 = 2.0 * Math.random() - 1.0;
        x2 = 2.0 * Math.random() - 1.0;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
    }

    return mean + stdev * y1;
  };
};

const getRemainTime = function(endTime) {
  const nowTime = new Date();
  const diff = endTime - nowTime;
  const times = 24 * 60 * 60 * 1000;
  const sec = (Math.floor((diff % times) / 1000) % 60) % 60;
  const ms = Math.floor((diff % times) / 10) % 100;
  return { time: diff, sec: sec, ms: ms };
};
