FROM ubuntu:latest

RUN apt-get update
RUN apt-get install python3 python3-pip -y

RUN pip3 install flask configparser requests

RUN mkdir /app
COPY . /app

EXPOSE 5001

CMD python3 /app/5sec-user.py 1
