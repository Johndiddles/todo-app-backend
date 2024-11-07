# TODO APP BACKEND

This project represents my attempt at the HNG Premium Coding challenge.

## Objective

Develop a RESTful API that enables users to create, read, update, and delete (CRUD) tasks in a task management system. Emphasise error handling, authentication, and scalability throughout the development process.

## TECH STACK

This solution to the challenge was built using

- TypeScript
- Node JS
- Express JS
- MongoDB

## SETTING UP THE PROJECT

To setup the project, please take the following steps.

- Clone the repo.

```git
git clone https://github.com/johndiddles/todo-app-backend
```

- cd into the project

```linux
cd todo-app-backend
```

- install all dependencies

```npm
npm install
```

Before running the server, populate your process.env with the following variables

```env
PORT=<YOUR PORT ID>
MONGO_URI=<YOUR MONGO_DB URI>
JWT_SECRET_KEY=<YOUR JWT SECRET KEY>
```

- run the server

```npm
npm run dev
```

## TESTING THE ENDPOINTS

The endpoints can be tested using postman or any other api testing tool.

### AVAILABLE ENDPOINTS

All endpoints available presently are listed below.

`TASKS:`

- POST /v1/tasks : Creates a new task.
- GET /v1/tasks : Retrieves all tasks.
- GET /v1/tasks/:id : Retrieves a task by its ID.
- PUT /v1/tasks/:id : Updates an existing task by ID.
- DELETE /v1/tasks/:id : Deletes a task by ID.

`USER:`

- POST /v1/users/register : Creates a new task.
- GET /v1/users/login : Retrieves all tasks.
