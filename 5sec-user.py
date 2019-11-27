import time
import datetime
from flask import Flask, render_template

app = Flask(__name__)

user_name = "user 1"


@app.route('/')
def index():
    return render_template('index.html', title="5sec stopwatch", user_name=user_name)


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
