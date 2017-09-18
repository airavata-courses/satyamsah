FROM openjdk:8

ADD . /webdir
WORKDIR /webdir

RUN chmod 777 mvninstall.sh
RUN pwd
RUN ./mvninstall.sh

RUN mvn clean install

WORKDIR /webdir/target
RUN pwd
EXPOSE 8090
RUN pwd
ENTRYPOINT ["java","-jar","demo-0.0.1-SNAPSHOT.jar"]
