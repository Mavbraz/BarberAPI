"use strict";

const mysql = require('mysql');
const crypto = require('crypto');

module.exports = {
	// User methods
	registrarUsuario: registrarUsuario,
	loginUsuario: loginUsuario,
	atualizarUsuario: atualizarUsuario,
	removerUsuario: removerUsuario,

	// Service methods
	visualizarServicos: visualizarServicos,
	criarServico: criarServico,
	visualizarServico: visualizarServico,
	atualizarServico: atualizarServico,
	removerServico: removerServico,
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

function registrarUsuario(user, callback) {
	const con = createConnection();
	con.query('INSERT INTO usuario SET ?', { email: user.email, senha: user.senha, salt: crypto.randomBytes(48).toString('hex'), cargo: user.cargo }, (err, res) => {
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
	con.query('SELECT email, senha, salt, cargo, token FROM usuario WHERE email = ? AND blocked = 0', authentication.email, (err, res) => {
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

function atualizarUsuario(user, callback) {
	const con = createConnection();
	con.query('UPDATE usuario SET ? WHERE id = ? WHERE blocked = 0', [{ email: user.email, senha: user.senha, cargo: user.cargo }, user.id], (err, res) => {
		if(err) {
	  		callback(err);
	  	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function removerUsuario(id, callback) {
	const con = createConnection();
	con.query('UPDATE usuario SET blocked = 1 WHERE id = ? AND blocked = 0', [id], (err, res) => {
		if(err) {
	  		callback(err);
	  	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function visualizarServicos(callback) {
	const con = createConnection();
	con.query('SELECT id, descricao, valor FROM servico WHERE blocked = 0', [], (err, res) => {
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
	con.query('INSERT INTO servico SET ?', { descricao: service.descricao, valor: service.valor }, (err, res) => {
		if(err) {
	  		callback(err);
	  	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function visualizarServico(id, callback) {
	const con = createConnection();
	con.query('SELECT id, descricao, valor FROM servico WHERE id = ? AND blocked = 0', [id], (err, res) => {
	  if(err)  {
	  	callback(err);
	  } else {
		if (res.length > 0) {
			callback(res[0]);
		} else {
			callback(new Error("Error: Service not found"));
		}
	  }
	});
	endConnection(con);
}

function atualizarServico(service, callback) {
	const con = createConnection();
	con.query('UPDATE servico SET ? WHERE id = ? AND blocked = 0', [{ descricao: service.descricao, valor: service.valor }, service.id], (err, res) => {
		if(err) {
	  		callback(err);
	  	} else {
	  		callback(res);
		}
	});
	endConnection(con);
}

function removerServico(id, callback) {
	const con = createConnection();
	con.query('UPDATE servico SET blocked = 1 WHERE id = ? AND blocked = 0', [id], (err, res) => {
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
	con.query('UPDATE usuario SET token = ? WHERE email = ? AND blocked = 0', [token, authentication.email], (err, res) => {
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
	con.query('SELECT email, salt, cargo FROM usuario WHERE token = ? AND blocked = 0', token, (err, res) => {
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