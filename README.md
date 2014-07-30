# KickStart

To install all dependencies that are described in package.json file
```
sudo npm install --production             // for production
sudo npm install                          // for development
```

To start the application do the following
```
node api/start.js
```

or better

```
nodemon api/start.js
```

To start mongodb (used for sessions)
```
mongod --dbpath /Users/vitali/Library/MongoDbData
```

## Directory Structure

```
/api				- Server Side Code
	/admin				- admin module
	/shared				- shared components
	/mod-1				- module 1
	/mod-N				- module N
	/w2ui				- server side w2ui library
	/conf.js			- DB and other config
	/security.js		- security file
	/start.js			- server side STARTING POINT
/build				- Build folder
/log				- Logs
/node_modules		- Node.JS modules
/setup				- DB setup scripts
/web				- Client Side Code (JavaScript/HTML/CSS)
	/app				- Application
		/mod-1				- module 1
		/mod-N				- module N
		/icons				- icon font icons
		/modules.js			- description of all modules
		/start.js			- client side STARTING POINT
	/libs				- 3rd Party Libraries
	index.html 			- SPA Staring Point
	login.html 			- SPA Login
Gruntfile.js		- Build tool config
package.json		- npm dependencies
README.md			- this read me file
```