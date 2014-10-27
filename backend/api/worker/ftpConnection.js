/**
 * Created by estet on 10/26/14.
 */
module.exports = function(host, username, password, protocol, port)
{
    this.host = host;
    this.username = username;
    this.password = password;
    this.protocol = protocol ? protocol:'ftp';
    if(port) {
        this.port = port;
    }
};