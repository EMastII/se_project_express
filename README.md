# WTWR (What to Wear?): Back End

## Project Overview

The WTWR backend provides a REST API for storing and managing users and clothing items for the What to Wear application. It supports user creation, item creation, item deletion, item liking/unliking, and retrieving users and items from MongoDB.

## Features

- User registration via `POST /signup`
- User login via `POST /signin`
- Retrieve the current user with `GET /users/me`
- Update the current user with `PATCH /users/me`
- Retrieve users with `GET /users` and `GET /users/:userId`
- Create clothing items with `POST /items`
- Retrieve all items with `GET /items`
- Delete items with `DELETE /items/:id`
- Like items with `PUT /items/:id/likes`
- Unlike items with `DELETE /items/:id/likes`
- Validation of URLs and request data
- Error handling for invalid requests, invalid IDs, and missing resources

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- validator package for URL validation
- ESLint with Airbnb base config
- Prettier for code formatting
- Nodemon for local development

## Running the Project

- `npm run start` — launch server on `localhost:3001`
- `npm run dev` — launch server with hot reload enabled
- `npm run lint` — run the linter

## Notes

Before committing your code, update `sprint.txt` in the root folder with the current sprint number, for example `12`.
