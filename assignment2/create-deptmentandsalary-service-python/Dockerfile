FROM python:3

ADD . /pythondir

EXPOSE 5002

WORKDIR /pythondir

RUN apt-get update && apt-get install -y python-pip

RUN pip install --no-cache-dir -r requirements.txt

CMD python ./salary.py
