This is easy to use Vagrant configuration of **all in one dev servers**

Instruction
-----------

To create virtual servers you should run these commands:

    cd truecron\infrastructure\dev\
    vagrant up

Now you have new just created application and database servers. 

###Application
Application should be already ready to use. Open in your browser:

    http://192.168.3.10:3000/

But if you want to enter to application server: 

    vagrant ssh application

And run our other simple hello world node js application:

    node /var/www/server/hellocron.js --port=3001

Now switch to your PC and check in your browser:

    http://192.168.3.10:3001/


Your should see our hello world page. :)

###Database
Database should be already to use. Two ways to use.

####From application host
To connecto to database from application host just start psql with database host address:

     psql -h 192.168.3.10

####From database host
To connecto to database from application host just start psql:

     psql

### WebStorm

Please be sure you create project for all TrueCron folder. Not only for truecron repo or vagrant repo. 
So you should have such directories in your WebStorm project:
    .idea
    truecron

Ensure you correct setup VSC configuration for project. Go File -> Settings -> Version control and click all red "Add root" for "Unregistered Git root"

Next Go to Tools -> Deployment -> Options and check options:
    
    Operations logging: Details
    [x] Create empty directories
    Upload changed files automatically to the default server: Always
    [x] Upload external changes

Finally Go to Tools -> Deployment -> Configurations:
    Click "+" (add configuration)
        Name: dev.truecron.com
        Type: SFTP

    Click dev.truecron.com in list and click icon "Use as default" it is near "+", "-"
        SFTP host: dev.truecron.com
        Root path: /var/www
        Username: vagrant
	Auth type: Password
	Password: vagrant
	[x] Save password
	Click "Test SFTP Connection". You should see "Successfully connected to dev.truecron.com"
	Go tab "Mappings" and Deployment path on server: /

Now and time to time you should to full sync. Go to Project tree sidebar. Select top root item "TrueCron" and in context menu click "Upload to dev.truecron.com"

If you want your changes to be uploaded automatically, go to Tools -> Deployment and set the Automatic Upload option.

All ready to start application. Just do
    vagrant reload application


### Debugging
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


