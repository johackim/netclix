FROM node:latest

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update --fix-missing
RUN apt-get install -y make
RUN make install
RUN make build

CMD ["node", "build/netclix.js"]
