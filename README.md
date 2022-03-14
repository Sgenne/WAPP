# WAPP 

We have created a web application where users can post and discuss their thoughts and images around different subjects. We were inspired by websites such as reddit and flashback.

## Frontend

The frontend code can be found in the cliend folder. The React components that make up the user interface are located within the src/UI folder. This folder is further partitioned into subfolders. Each such subfolder consists of components related to the same area. The only exception being the src/UI/common folder which contains reusable components used within multiple areas of the application. 

The src/context folder contains AuthContext.tsx which is used throughtout the application when determining whether the user is signed in or not, and when changing the sign in status of the user. 

the src/utils folder contains modules providing utility functions used in multiple parts of the application.

## Backend

The backend code is located in the server folder. 

Mongoose schemas and models are created in files located under src/db.

The src/imageStorage folder contains image.storage.ts which allows us to store images in google cloud.

src/middleware contains our custom middleware.

src/model contains interfaces representing the core entities that our application has been built around such as threads, comments, and users.

The src/router and src/service contains routers and services. 

## Documentation

Our final report can be found <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">here.</a>


