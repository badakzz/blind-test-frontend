# Specify a base image
FROM node:alpine as builder

# Specify a working directory
WORKDIR '/app'

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile

# Copy the rest of the code
COPY . .

ARG ENV_CONTENTS
RUN echo "$ENV_CONTENTS" > .env

# Build the app
RUN yarn run build

RUN printenv

# Run phase
FROM nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html
