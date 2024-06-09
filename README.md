# MovieService
A seperated repo from https://github.com/MarcoBackman/ReactProjects

# How to setup and run (server - backend)

> Make sure to run server application before running beakflix application.<br/>
> server application serves as backend REST API server while beakflix serves as a dynamic frontend application.

1. First, install MongoDB environment locally or configure setup to connect to your mongoDB host.

   [Install mongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)

2. Then setup configuration file.
    - add `config.json` file at the repository root path.
    - fill in every credentials labeled with `{}` in the following json content.
    - when you have authentication setup for mongo db set `"hasAuth" : true` otherwise `"hasAuth" : true`.
    - When you have ssl configured for http communication, set `"cookie" : { "ssl" : false }` to `true`.
   ```json
   {
     "database": {
       "hasAuth" : false,
       "username" : "{YOUR_MONGODB_USERNAME}",
       "password" : "{YOUR_MONGODB_PW}",
       "host" : "{YOUR_MONGODB_HOST}",
       "port": "{YOUR_MONGODB_PORT}",
       "dbname" : "movieDemo"
     },
     "server": {
       "corsWhiteList" : ["http://localhost", "http://localhost:*", "http://127.0.0.1"],
       "port": "{YOUR_DESIRED_EXPRESS_SERVER_PORT}"
     },
     "session": {
       "sessionKey" : "{YOUR_RANDOM_SESSION_KEY}",
       "sessionTime" : 900000,
       "whiteListSession" : [
         "/user/login", "/user/signup", "/user/public-resource",
         "/movie/*",
         "/ops/liveCheck",
         "/security/*"
       ]
     },
     "cookie" : {
       "secret" : "{YOUR_SERVER_COOKIE_KEY}",
       "ssl" : false
     }
   }
   ```

3. Run server with following command under `.\MovieService\server\`
   ``` 
   npm start node ./src/app.js
    ```
   ![server-command](./img/server.png)

4. Import postman collection located at `server/postman/React-BeakFlix.postman_collection.json`
   
   Run postman requests or use curl
   ![postman](./img/postman.png)





# How to setup and run (beakflix - frontend)

Will be added soon.