# auth-web-app

## To Run

The entire application runs off one command:
```make deploy```

To access the application, enter ```localhost:3000``` into your browser.

### .env

CONSTRING=postgres://admin:root@postgres:5432/postgres  
PORT=3000  
ADMINPASSWORD=admin   
ACCESS_SECRET_TOKEN=  

### pgAdmin & PostgresDB

The ```init.sql``` script is automatically run by docker-compose and creates the necessary tables for the application.

To view the database using pgAdmin:
Connect to ```localhost:5050```. Login in with username and password (as dictated on the docker-compose.yml for the pgAdmin service)  
Register a new server. Input ```postgres``` for the hostname, and the username and password (as dictated on the docker-compose.yml for the postgres service).

There is a 10 second delay before the node.js container runs it's ```npm start``` command. This is because it needs to wait for postgres to create the table. In case 10 seconds is not enough time, the node.js app can be stopped and ran until it loads without error.

### ACCESS SECRET TOKEN

1. Open new terminal
2. Run ```npm i crypto```
3. Start a ```node``` session.
4. Run ```require('crypto').randomBytes(64).toString('hex')```.
5. Use the generated string to populate the secret token.

###

Admins accounts can delete an account with the url ```localhost:3000/users/delete-user```.
A master password has been set up if a password for another account has been forgotten. This is specified in the ```.env``` file.