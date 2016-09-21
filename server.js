const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const worker = cluster.worker;
    console.log('worker id:', worker.id);
    http.createServer((req, res) => {
        res.writeHead(200);
        // kill worker affter request
        setTimeout(function() {
            worker.kill();
        }, 200)
        res.end('hello world\n');
    }).listen(8000);
}
