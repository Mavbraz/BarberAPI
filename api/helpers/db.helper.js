"use strict";

const mysql = require('mysql');
const crypto = require('crypto');

module.exports = {
	registrar: registrar,
	saveToken: saveToken,
	verifyToken: verifyToken,
	login: login
}

function createConnection() {
	return mysql.createConnection({
	  host: 'localhost',
	  user: 'mavbraz',
	  password: '123',
	  database: 'barber'
	});
}

function endConnection(con) {
	con.end();
}

function registrar(email, password, cargo, callback) {
	const con = createConnection();
	const user = { email: email, senha: password, salt: crypto.randomBytes(48).toString('hex'), cargo: cargo };
	con.query('INSERT INTO user SET ?', user, (err, res) => {
		if(err) {
	  		callback(err);
	  	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function saveToken(email, token, callback) {
	const con = createConnection();
	con.query('UPDATE user SET token = ? WHERE email = ?', [token, email], (err, res) => {
	 	if(err)  {
	  		callback(err);
	 	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function verifyToken(token, callback) {
	const con = createConnection();
	con.query('SELECT email, salt, cargo FROM user WHERE token = ?', token, (err, res) => {
	  if(err) {
	  	callback(null);
	  } else {
	  	if (res.length > 0) {
			callback(res[0]);
		} else {
			callback(null);
		}
	  }
	});
	endConnection(con);
}

function login(email, password, callback) {
	const con = createConnection();
	con.query('SELECT email, senha, salt, cargo, token FROM user WHERE email = ?', email, (err, res) => {
	  if(err)  {
	  	callback(err);
	  } else {
	  	if (res.length > 0) {
			callback(res[0]);
		} else {
			callback(new Error("Error: Credentials incorrect"));
		}
	  }
	});
	endConnection(con);
}