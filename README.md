# Example project

Student and assignments management system.

## Installation

1. Create a mysql database
2. Create a user with permissions on the database you created
3. download repo and create initial tables:
```
$ git clone https://github.com/SAAveva/assignments
$ cd assignments
$ mysql -D <DB_NAME> -u <USER> -p < ./scripts/create.sql
```
4. Start the server
```
$ cd server
$ npm run dev
```
5. In another terminal start the client
```
$ cd assignments/client
$ npm run dev
```



