## Before start
Run `npm install` in the root directory

Create a config.json in the root directory with the follow content:

```
{
	"mailer": {
		"user": "xxxx@126.com",
		"pwd": "xx",
		"host": "smtp.126.com",
		"port": 25
	},
	"mongod": {
		"url": "mongodb://xxxx:27017"
	}
}
```
## How to use

`node index.js` or `npm start` will start the cron job in js directly

`node index.js startOnce` or `npm run startOnce` will run the check once, you can work with the cron system

`node index.js {your mail} {series name} {series season}` to add listeners
