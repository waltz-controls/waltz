FROM node:12-alpine as BUILD

ARG NODE_AUTH_TOKEN

RUN echo "//npm.pkg.github.com/:_authToken=$NODE_AUTH_TOKEN" >> ~/.npmrc

RUN apk add --no-cache wget

COPY . /src

WORKDIR /src

RUN npm install

RUN npm run build

RUN npm run war

RUN wget https://github.com/waltz-controls/user-context/releases/download/0.5/user-context.war

FROM tomcat:9-jdk11

COPY --from=BUILD /src/dist/waltz.war /usr/local/tomcat/webapps

COPY --from=BUILD /src/user-context.war /usr/local/tomcat/webapps

