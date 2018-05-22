"use strict";

const mysql = require('mysql');
const crypto = require('crypto');

module.exports = {
	registrarUsuario: registrarUsuario,
	loginUsuario: loginUsuario,
	visualizarServicos: visualizarServicos,
	criarServico: criarServico,
	saveToken: saveToken,
	verifyToken: verifyToken,
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

function registrarUsuario(registration, callback) {
	const con = createConnection();
	const user = { email: registration.email, senha: registration.senha, salt: crypto.randomBytes(48).toString('hex'), cargo: registration.cargo };
	con.query('INSERT INTO usuario SET ?', user, (err, res) => {
		if(err) {
	  		callback(err);
	  	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function loginUsuario(authentication, callback) {
	const con = createConnection();
	con.query('SELECT email, senha, salt, cargo, token FROM usuario WHERE email = ?', authentication.email, (err, res) => {
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

function visualizarServicos(callback) {
	const con = createConnection();
	con.query('SELECT id, descricao, valor FROM servico', [], (err, res) => {
	  if(err)  {
	  	callback(err);
	  } else {
		callback(res);
	  }
	});
	endConnection(con);
}

function criarServico(service, callback) {
	const con = createConnection();
	con.query('INSERT INTO servico set ?', { descricao: service.descricao, valor: service.valor }, (err, res) => {
		if(err) {
	  		callback(err);
	  	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function saveToken(authentication, token, callback) {
	const con = createConnection();
	con.query('UPDATE usuario SET token = ? WHERE email = ?', [token, authentication.email], (err, res) => {
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
	con.query('SELECT email, salt, cargo FROM usuario WHERE token = ?', token, (err, res) => {
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