# Olayers
v 0.5.0

[![Build Status](https://travis-ci.org/irvinemd55/olayers.svg?branch=master)](https://travis-ci.org/irvinemd55/olayers)
[![Coverage Status](https://coveralls.io/repos/github/irvinemd55/olayers/badge.svg?branch=master)](https://coveralls.io/github/irvinemd55/olayers?branch=master)

### Team
[Irvine Downing](https://github.com/irvinemd55) |
[Stephen Anderson](https://github.com/Sanderson239) |
[Jaren Escueta](https://github.com/jjron) |
[David Porter](https://github.com/thegrimheep)

## Description
A RESTful API that provides a social media platform for cosplayers, their fans, and cosplay vendors. A new user can sign up for an account and create a profile, make or update posts associated with their profile, and upload or delete their own photos. Users can also retrieve the profiles, posts, and photos of other users. Express routes the client requests and responses to and from the server at any given endpoint. Models for user, profile, post, and photo are made through mongoose and stored in respective MongoDB collections. Uploaded photos are stored using AWS S3 service.

## Models

### User Model
- **username**
  - *String*
  - input, required, unique
- **email**
  - *String*
  - input, required, unique
- **password**
  - *String*
  - input, required
- **findHash**
  - self-generated, unique

### Profile Model
- **name**
  - *String*
  - input, required
- **bio**
  - *String*
  - input, optional
- **location**
  - *String*
  - input, required
- **dateJoined**
  - *Date*
  - self-generated, required, default=Date.now
- **interests**
  - *[Array]*
  - input, optional
- **costumesWorn**
  - *[Array]*
  - input, required
- **eventsAttended**
  - *[Array]*
  - input, optional
- **eventsCreated**
  - *[Array]*
  - input, optional
- **cosplayer**
  - *Boolean*
  - input, required
- **vendor**
  - *Boolean*
  - input, required
- **fan**
  - *Boolean*
  - input, required
- **profilePic**
  - added by Photo model, optional
- **posts**
  - *[Array]*
  - populated by Post model, optional
- **userID**
  - added by User model, required

### Post Model
- **description**
  - *String*
  - input, required
- **timePosted**
  - *Date*
  - self-generated, required, default=Date.now
- **likes**
  - *Number*
  - self-generated, required, default=0
- **photoID**
  - added by Photo model, optional
- **profileID**
  - added by Profile model, required
- **userID**
  - added by User model, required

### Photo Model
- **name**
  - *String*
  - input, required
- **description**
  - *String*
  - input, optional
- **location**
  - *String*
  - input, optional
- **dateUploaded**
  - *Date*
  - self-generated, required, default=Date.now
- **objectKey**
  - *String*
  - added by AWS, required, unique
- **imageURI**
  - *String*
  - added by AWS, required, unique
- **userID**
  - added by User model, required
- **postID**
  - added by Post model, optional
- **profileID**
  - added by Profile model, optional

## Routes
### User Routes
###### Signup
- `POST /api/signup`
  - Create a user
  - `200 OK`
  - `400 Bad Request`
  - `404 Not Found`
  - `409 Conflict`

###### Login
- `GET /api/login`
  - Requires basic auth via username:password
  - Provides JSON web token for requests requiring authorization
  - `200 OK`
  - `401 Unauthorized`

### Profile Routes
###### Create a profile
- `POST /api/profiles`
  - Requires authorization

###### Retrieve a profile
- `GET /api/profiles/:id`
  - profileID parameter

###### Retrieve the user's own profile
- `GET /api/profiles/me/myprofile`
  - Requires authorization

###### Retrieve profiles of all users
- `GET /api/profiles`
  - Requires authorization

### Post Routes
###### Create a post
- `POST /api/posts`
  - Requires authorization

###### Retrieve a post
- `GET /api/posts/:id`
  - postID parameter

###### Retrieve the user's own posts
- `GET /api/posts/me/myposts`
  - Requires authorization

###### Retrieve posts of all users
- `GET /api/posts`
  - Requires authorization

###### Update one of the user's existing posts
- `PUT /api/posts/me/myposts/:id`
  - postID parameter
  - Requires authorization

### Photo Routes
###### Upload a profile pic
- `POST /api/profiles/:id/photos`
  - profileID parameter
  - Requires authorization

###### Upload a photo in a post
- `POST /api/posts/:id/photos`
  - postID parameter
  - Requires authorization

###### Delete a photo
- `DELETE /api/photos/:id`
  - photoID parameter
  - Requires authorization

## Middleware
- **basic-auth-middleware**
  - implements the user login feature
- **bearer-auth-middleware**
  - implements the token authentication for POST, GET, and DELETE routes
- **jsonParser**
  - parses JSON
- **error middleware**
  - handles errors

## Issues
The Olayers development team may be reached via the Issues tab for this repo on GitHub.
