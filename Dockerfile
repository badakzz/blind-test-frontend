# Specify a base image
FROM node:alpine as builder

# Specify a working directory
WORKDIR '/app'

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile

# Copy the rest of the code
COPY . .

# dev
# ARG ENV_CONTENTS
# RUN echo "$ENV_CONTENTS" > .env

# Build the app
RUN yarn run build

# dev
# RUN printenv

# Run phase
FROM nginx

# EXPOSE 80
COPY nginx.conf /etc/nginx/nginx.conf.template
COPY /docker_scripts/start.sh /start.sh

CMD ["/start.sh"]