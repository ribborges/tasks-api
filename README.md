# Tasks: Your to-do app ☑️

A simple tasks/to-do app with categories. Develop with TypeScript, Express, MongoDB, cookie-parser and JWT.

## Features

- User authentication (login, registration) with JWT
- Protected routes
- Task management with categories
- CRUD operations for resources
- Error handling

## Prerequisites

- Node.js
- npm

## Running with npm

1. Download and install [node.js](https://nodejs.org/en).

2. ### Set the .env variables
    - MONGO_URI (MongoDB connection string)
    - PORT (The default port of the server)
    - SECRET (Secret string for password hashing)
    - CLIENT_URL (Array of URLs separated by comma, for CORS)

3. Open your terminal/cmd on the repo directory

4. Install dependencies

```bash
> npm install
```

5. Start the app

```bash
> npm run dev
```

[WEB APP repo](https://github.com/ribborges/tasks-web)
[MOBILE APP repo](https://github.com/ribborges/tasks-mobile)