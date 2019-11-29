import time
import datetime
from flask import Flask, render_template, send_from_directory
import configparser
import sys
import os
import requests
import json

args = sys.argv
# config = configparser.ConfigParser()
# config.read("config.ini")

DEBUG = False
SERVER_NAME = "localhost:" + str(5000 + int(sys.argv[1]))
user_name = "user " + sys.argv[1]

app = Flask(__name__)
app.config.from_object(__name__)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'), 'stopwatch.png')


@app.route('/')
def index():
    return render_template('index.html', user_name=user_name)


@app.route('/play')
def play():
    r = requests.post("http://localhost:5000/game")
    game = json.loads(r.text)["data"]["game"]
    r = requests.post("http://localhost:5000/player", data={"user_name": user_name, "game_id": game["id"]})
    player_num = json.loads(r.text)["data"]["player_num"]
    return render_template('play.html', user_name=user_name, game=game, player_num=player_num)


if __name__ == '__main__':
    app.run()
