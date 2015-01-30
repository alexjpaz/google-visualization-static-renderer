var webPage = require('webpage');
var server = require('webserver').create();

var page = webPage.create();

page.viewportSize = { width: 1920, height: 1080 };


page.open("http://www.google.com", function start(status) {

console.log("Ready");
  server.listen(8080, function(request, response) {
    var base64Image = page.renderBase64('PNG');
    response.write(base64Image);
    response.close();
});


});
