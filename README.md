# Front-end for the blind test app

The app uses React.js with Redux.

https://blindtest.lucasderay.com

## Setup :

For the app the be fully operational, you'll need to create a `.env` file at root level and specifiy :

```
REACT_APP_CSRF_COOKIE_NAME=
REACT_APP_DOMAIN=localhost
REACT_APP_JWT_COOKIE_NAME=
REACT_APP_SERVER_DOMAIN_DEV=http://localhost:3002
REACT_APP_AUTH_COOKIE_NAME=
REACT_APP_STRIPE_PUBLIC_KEY=
REACT_APP_GOOGLE_PUBLIC_KEY=
```

## Running the app

```shell
yarn install
yarn start
```
