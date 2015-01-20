/*
 A NodeJS process cannot be debugged remotely, it accepts debugger connections on the localhost interface only.
 So you can't debug an application running in the VM with WebStorm running on your host.

 `Debugproxy.js` overcomes this limitation. It acts as a proxy, listening on port 5859 and forwarding data to and from
 Node's debug port 5858.

 Vagrant starts the `Debugproxy.js`, so it is always running. You need to configure WebStorm and run the application with
 debugging enabled.

 1. Configure WebStorm for remote debugging. Run -> Edit Configurations -> Add -> Node.js Remote Debug

 Name: dev.truecron.com
 Host: dev.truecron.com
 Port: 5859

 2. Start the application on the VM with debugging enabled.
 Use the `--debug-brk` option if you want to debug startup code. Node will wait for the debugger to attach.

 node --debug-brk server.js

 Use the `--debug` option to start the application and attach the debugger later.

 node --debug server.js

 You can also use the `supervisor` to restart the app on crashes and file changes:

 supervisor --force-watch -i public --debug server.js

 Or

 supervisor --force-watch -i public --debug-brk server.js

 3. Attach the WebStorm: Run -> Debug -> dev.truecron.com (`Alt+F5`).
 Check the status on the Debugger tab. It should say "Connected to dev.truecron.com:5859".

 Note if the `supervisor` restarts the application due to a crash or a changed file, you need to reconnect the debugger
 (`Alt+F5`).
*/
var net = require('net');
net.createServer(function (client) {
    var node = net.connect({ port: 5858 }, function () {
        client.pipe(node);
        node.pipe(client);
    });
}).listen(5859);
console.log('Run the application with --debug or --debug-brk option and connect WebStorm to port 5859.');
