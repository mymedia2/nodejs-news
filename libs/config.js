var configFile = "./config.json";
if (process.env.NODE_ENV == "test") {
	configFile = "./test/config.json";
}

module.exports = require("nconf")
	.argv()
	.env()
	.file({ file: configFile })
;
