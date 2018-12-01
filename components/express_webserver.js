var express = require('express');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var debug = require('debug')('botkit:webserver');
var request=require('request')
module.exports = function(controller, bot) {


    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    // import express middlewares that are present in /components/express_middleware
    var normalizedPath = require("path").join(__dirname, "express_middleware");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        require("./express_middleware/" + file)(webserver, controller);
    });

    webserver.use(express.static('public'));


    webserver.listen(process.env.PORT || 3000, null, function() {

        debug('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);

    });

    // import all the pre-defined routes that are present in /components/routes
    var normalizedPath = require("path").join(__dirname, "routes");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
      require("./routes/" + file)(webserver, controller);
    });

   

    request.post('https://graph.facebook.com/me/subscribed_apps?subscribed_fields=messages&access_token=' + process.env.page_token,
function (err, res, body) {
if (err) {
controller.log('Could not subscribe to page messages');
}
else {
controller.log('Successfully subscribed to Facebook events:', body);
console.log('Botkit activated');

  // start ticking to send conversation messages
  controller.startTicking();
}

}
);
 controller.webserver = webserver;
    return webserver;

}


