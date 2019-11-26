FROM ubuntu:latest

RUN apt-get update
RUN apt-get install python3 python3-pip git -y

RUN pip3 install flask

RUN git clone https://github.com/adshidtadka/5sec-user

EXPOSE 5000

CMD [ "python3", "5sec-user/5sec-user.py" ]
