# Specify a base image
FROM node:alpine as builder

# Specify a working directory
WORKDIR '/app'

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app
RUN yarn run build


# Run phase
FROM nginx
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html

CMD ["yarn", "start"]
