FROM openjdk:8

ADD . /javadir

EXPOSE 8090

WORKDIR /javadir

RUN pwd

RUN ls

RUN chmod 777 build.sh

CMD ["bash", "build.sh"]

RUN apt-get -y update

RUN java -version

RUN apt-get -y install maven

RUN mvn install

WORKDIR target

CMD ["java","-jar","demo-0.0.1-SNAPSHOT.jar"] 
