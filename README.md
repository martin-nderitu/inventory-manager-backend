## React Redux Inventory Manager Backend

Backend for [react redux inventory manager](https://github.com/martin-nderitu/react-redux-inventory-manager)


### To get started

1. Clone this repo and ``cd inventory-manager-backend``
2. Run ``npm install`` or ``yarn install``
3. Create a ``.env`` file in the root directory with the following
   values (provide your own values):
   ```
   PORT=
   NODE_ENV=
   DB_NAME=
   TEST_DB_NAME=
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_DIALECT=
   ```
   For example:
   ```
   PORT=5000
   NODE_ENV=development
   DB_NAME=your_database_name
   TEST_DB_NAME=your_test_database_name
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_DIALECT=postgres
   ```
   NODE_ENV is either development, test, or production\
   DB_DIALECT is either postgres or mariadb
   

5. Run `npm start` or `yarn start` to start the app
