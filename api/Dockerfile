FROM node:dubnium

# Create app directory
WORKDIR /usr/src/app
ENV HOME=/usr/src/app


COPY . .

RUN yarn install  && yarn build

RUN  chmod -R g+rw . && chmod -R g+rwx .config
EXPOSE 3000

RUN ln -fs /bin/bash /bin/sh

CMD [ "yarn", "start:prod" ]
USER 1011
