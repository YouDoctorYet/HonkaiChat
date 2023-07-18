# HonkaiChat

HonkaiChat lets Honkai Star Rail (HSR) fans easily chat with one another, choose their favorite HSR art background, profile avatar, and send cute Pom-pom stickers!

![HonkaiChat Chat Screen Demo Photo](img/notification)

Contents
========

 * [Why?](#why)
 * [Features](#features)
 * [Next Steps](#nextsteps)
 * [Dependencies](#dependencies)

### Why?
---

I've always wanted to utilize the  MERN stack to build SOMETHING. But none of my ideas sparked enough excitement. Until, HSR came around, and the lack of access to Pom-pom chat stickers finally pushed me into action. 

And so I made a messaging app that allows players to send the in-game Pom-pom stickers in real life!

### Features
---

Basic messaging app features (one-to-one chat, group chat, notifications, etc.) are all included.

![create group chat demo photo](img/create-group)

![edit group chat demo photo](img/edit-group)

![user search demo photo](img/search-user)


The unique features of this messaging app are the HSR-themed chat backgrounds and profile avatars.

![choose avatar demo photo](img/choose-avatar)

![choose background demo photo](img/choose-background)


User authentication in this application is primarily handled through JSON Web Tokens (JWT). Upon successful login, the server generates a JWT that encapsulates the user's identifier, and this token is sent back to the client. The client uses this token in subsequent requests to authenticate itself, and the server validates the JWT from incoming requests to authenticate the user.

![log in demo photo](img/login)


### Next Steps
---

Unfortunately, the tech job market has been tough, especially for recent grads. Between all the job apps, interviews, and leetcode grinds, I haven't had time to finish implementing the chat stickers features. 

The next steps I have planned are largely: 

1. bug fixes, most of which are rather minor, but I like to lay down solid ground before moving on to next big feature.
2. chat stickers backend (routes, models, controllers, apis, etc.)
3. chat stickers frontend (e.g. chat sticker modal)
4. deployment

### Dependencies
---

If you want to try this app for yourself, you would need to install a few dependencies first. 

First, visit ![official Node.js website's downloads page](https://nodejs.org/en/download) and download the LTS version.

Then, install these dependencies: 
```bash
$ npm install axios
$ npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
$ npm install socket.io
$ npm install mongoose
$ npm install -D nodemon
$ npm install dotenv
$ npm install express
$ npm install jsonwebtoken
$ npm install bcryptjs
$ npm install express-async-handler
```

Note 1: above assumes a React project created by Create React App or a similar tool, so you should already have react and react-dom. 

Note 2: Always ensure you're inside the correct directory in the terminal before running these commands.

Note 3: Remember to initialize your npm project with npm init if you haven't done so already.

 
