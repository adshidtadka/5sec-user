$(function() {
  countDown();
});

const countDown = function() {
  var startTime = new Date();
  //カウントダウンの終了期日を記入↓
  var endTime = new Date(startTime.getTime());
  endTime.setSeconds(endTime.getSeconds() + 5);
  var diff = endTime - startTime;
  var times = 24 * 60 * 60 * 1000;
  var sec = (Math.floor((diff % times) / 1000) % 60) % 60;
  var ms = Math.floor((diff % times) / 10) % 100;
  if (diff > 0) {
    $("#timer").text(sec + "秒" + ms);
    setTimeout(countDown, 10);
  } else {
    $("#timer").text("終了しました！");
  }
};
