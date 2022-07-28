const mysql = require("mysql");

var _conn;

exports.connectDb = () => {
    var con = mysql.createConnection({
        host: "localhost",
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: "whois"
    });
      
    con.connect(function(err) {
        if (err) throw err;
        else{
            console.log("Connected!");
            _conn = con;
        }
    });
}

exports.getDb = () => {
    if(_conn){
        return _conn;
    }
}