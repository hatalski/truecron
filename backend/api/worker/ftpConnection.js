/**
 * Created by estet on 10/26/14.
 */
module.exports = function(host, username, password, port, protocol)
{
    this.host = host;
    this.user = username;
    this.pass = password;
    this.protocol = protocol ? protocol:'ftp';
    if(port) {
        this.port = port;
    }
    else
    {
        this.port = 21;
    }
    this.debugMode = true;
};