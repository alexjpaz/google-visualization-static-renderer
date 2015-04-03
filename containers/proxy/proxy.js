var http = require('http');
var URL = require('url');

console.log('HELLO');

http.createServer(function (req, res) {
  console.log(req);

  try {
    console.log(req.url);

    var url = URL.parse(req.url, true);

    if(url.pathname === "/chart") {
      var json = JSON.parse(JSON.stringify(url.query.json));

      http.request({
        host: 'phantomjs',
        path: req.url
      }, function(response) {
        var str = '';

        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          var bin = new Buffer(str, 'base64');
          var expires = new Date();

          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': bin.length,
            'Cache-Control': 'public, max-age=600',
          });

          res.end(bin);
        });
      }).end();
    } else {
      res.writeHead(404);
      res.end();
    }
  } catch(e) {
    console.error(e);
    res.write(500, e.message);
    res.end();
  }


}).listen(80);
