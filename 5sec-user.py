import time
import datetime
from flask import Flask, render_template
import configparser
import sys

args = sys.argv
# config = configparser.ConfigParser()
# config.read("config.ini")

DEBUG = False
SERVER_NAME = "localhost:" + str(5000 + int(sys.argv[1]))

app = Flask(__name__)
app.config.from_object(__name__)


@app.route('/')
def index():
    return render_template('index.html', title="5sec stopwatch", user_name="user " + sys.argv[1])


if __name__ == '__main__':
    app.run()
