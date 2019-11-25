import time
from datetime import date
from flask import Flask, render_template

app = Flask(__name__)

user_name = "user 1"


@app.route('/')
def index():
    return render_template('index.html', title="5sec stopwatch", user_name=user_name)


@app.route('/play')
def play():
    start_time = date.today()
    start_time_str = start_time.strftime("%Y/%m/%d %H:%M:%S")
    return render_template('play.html', title="5sec stopwatch | play", user_name=user_name, start_time=start_time_str)


if __name__ == '__main__':
    app.run()
