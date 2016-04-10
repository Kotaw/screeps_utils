var _ = require("./underscore-min")
var https = require("https");
var fs = require('fs');
var rl = require("readline");


var email = "kotawi0i0i@gmail.com"
var branches = ["default","learning"]

console.log("Branches : "+branches.join(","))
console.log("email :"+email)

var read = require('read')
read({ prompt: 'password: ', silent: true }, function(er, password) {
	branches.forEach(branch => {

		var options = {
			hostname: 'screeps.com',
			port: 443,
			path: '/api/user/code?branch='+branch,
		    method: 'GET',
			auth: email + ':' + password
		}


		var req = https.request(options, (res) => {
			//console.log(`STATUS: ${res.statusCode}`);
			//console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

			res.setEncoding('utf8');

			var data = '';

			res.on('data', (chunk) => {
				data+=chunk
			});
			res.on('end', () => {
				data = JSON.parse(data);
				//console.log(data)
				if(data.ok) {

					if (!fs.existsSync(data.branch)){
						fs.mkdirSync(data.branch);
						console.log("Created Folder %s",data.branch)
					}

					_.each(data.modules,(file,name)=>{
						if(file){
							fs.writeFile(`${data.branch}/${name}.js`, file, function(err) {
									if(err) {
										return console.log(err);
									}

									console.log("wrote file %s/%s.js",data.branch,name);
								});
						}
					})
				}
				else {
					console.error('Error while pulling from Screeps: '+util.inspect(data));
				}
			})
		})

		req.on('error', (e) => {
		  console.log(`problem with request: ${e.message}`);
		});

		req.end()

	})

})