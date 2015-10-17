KickStart is a boiler plate for Enterprise Web Applications. It is primarily a front-end solution and can be used with back-end written in any language. In addition the project includes few server side solutions located in "/api" folder. All front-end related source files are in "/web" folder.

## Installation

Before using project tools, you need to install NPM and NodeJS. To install dependencies run:
```
npm install --production             // for production
npm install                          // for development
```

To run development tasks configured in gulpfile.js run:
```
gulp dev
```

### JSON Back-End

Since data is read from static JSON files and cannot be modified, JSON back-end is purely for demo purposes. It is enabled by default. You can change it in "/web/app/home/config.js" file by modifying "context" property.
Configured work from yuorWwwwRoot/KickStart directory from (  for local web server -  http://localhost/KickStart/web/index.html  )


### NodeJS Back-End

To use NodeJS back-end you need to do a series of steps:
- Install and start MongoDB server (used for session storage)
- Install and start PostgreSQL DB server 
- Run SQL scripts in "/setup" folder
- Change DB configuration in "/api/node/conf.js" file
- Change "context" property to 'http://localhost:3000'
- Change "useApiMethod" property to  ''  

To run NodeJS locally
```
nodemon api/node/start.js
```

To start MongoDB (used for sessions)
```
mongod --dbpath /Users/vitali/Library/MongoDbData &
```

## Folder Structure

```
/api					- Server side code
	/json				- sample JSON back-end
	/node				- sample NodeJS back-end
		/admin				- admin module
		/shared				- shared components
		/mod-1				- module 1
		/mod-N				- module N
		/w2ui				- server side w2ui library
		/conf.js			- DB and other config
		/security.js		- security file
		/start.js			- server side STARTING POINT
/build					- Build folder
/log					- Logs
/node_modules			- NodeJS modules
/setup					- DB setup scripts
/web					- Front-End Code
	/app					- Application
		/mod-1				- module 1
		/mod-N				- module N
		/icons				- icon font icons
		/modules.js			- description of all modules
		/start.js			- client side STARTING POINT
	/libs					- 3rd party libraries
	index.html 				- index page
	login.html 				- login page
Gruntfile.js			- build tool config
package.json			- npm dependencies
README.md				- this read me file
```