FROM openjdk:8

ADD . /javadir

EXPOSE 8090

WORKDIR /javadir

RUN pwd

RUN ls

RUN chmod 777 build.sh

RUN ["/bin/bash","-c","/javadir/build.sh"]

#CMD cat src/main/resources/static/addemployee.html

RUN apt-get -y update

#RUN java -version

RUN apt-get -y install maven

RUN ["mvn","install"]

WORKDIR target

ENTRYPOINT ["java","-jar","demo-0.0.1-SNAPSHOT.jar"] 
