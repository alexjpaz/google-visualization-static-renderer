var http = require('http');

http.createServer(function (req, res) {

  try {
    http.request({
      host: '192.168.59.103',
      port: 8080,
      path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
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
  } catch(e) {
    console.error(e);
  }


}).listen(9999);
