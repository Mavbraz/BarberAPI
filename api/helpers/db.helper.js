"use strict";

const mysql = require('mysql');
const crypto = require('crypto');

module.exports = {
    // User methods
    registrarUsuario: registrarUsuario,
    loginUsuario: loginUsuario,
    getUsuarioId: getUsuarioId,
    visualizarUsuario: visualizarUsuario,
    atualizarUsuario: atualizarUsuario,
    removerUsuario: removerUsuario,
    desbloquearUsuario: desbloquearUsuario,

    // Service methods
    visualizarServicos: visualizarServicos,
    criarServico: criarServico,
    visualizarServico: visualizarServico,
    atualizarServico: atualizarServico,
    removerServico: removerServico,
    desbloquearServico: desbloquearServico,

    // Schedule methods
    visualizarAgendamentos: visualizarAgendamentos,
    visualizarAgendamentosCliente: visualizarAgendamentosCliente,
    solicitarAgendamento: solicitarAgendamento,
    solicitarServicos: solicitarServicos,
    atualizarAgendamento: atualizarAgendamento,

    // Token methods
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
    con.query('INSERT INTO usuario SET ?', { nome: user.nome, cpf: user.cpf, email: user.email, senha: user.senha, salt: crypto.randomBytes(48).toString('hex'), cargo: user.cargo }, (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function loginUsuario(authentication, callback) {
    const con = createConnection();
    con.query('SELECT nome, cpf, email, senha, salt, cargo, token FROM usuario WHERE email = ? AND blocked = FALSE', authentication.email, (err, res) => {
        if (err) {
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

function getUsuarioId(email, callback) {
    const con = createConnection();
    con.query('SELECT id FROM usuario WHERE email = ?', [email], (err, res) => {
        if (err) {
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

function visualizarUsuario(email, callback) {
    const con = createConnection();
    con.query('SELECT nome, cpf, email, cargo FROM usuario WHERE email = ?', [email], (err, res) => {
        if (err) {
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
    var save = { nome: user.nome };
    if (user.senha !== undefined) {
        save.senha = user.senha;
    }
    con.query('UPDATE usuario SET ? WHERE email = ? AND blocked = FALSE', [save, user.email], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function removerUsuario(email, callback) {
    const con = createConnection();
    con.query('UPDATE usuario SET blocked = TRUE WHERE email = ? AND blocked = FALSE', [email], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function desbloquearUsuario(email, callback) {
    const con = createConnection();
    con.query('UPDATE usuario SET blocked = FALSE WHERE email = ? AND blocked = TRUE', [email], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function visualizarServicos(callback) {
    const con = createConnection();
    con.query('SELECT id, nome, descricao, valor FROM servico WHERE blocked = FALSE', [], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function criarServico(service, callback) {
    const con = createConnection();
    con.query('INSERT INTO servico SET ?', { nome: service.nome, descricao: service.descricao, valor: service.valor }, (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function visualizarServico(id, callback) {
    const con = createConnection();
    con.query('SELECT id, nome, descricao, valor FROM servico WHERE id = ? AND blocked = FALSE', [id], (err, res) => {
        if (err) {
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
    con.query('UPDATE servico SET ? WHERE id = ? AND blocked = FALSE', [{ nome: service.nome, descricao: service.descricao, valor: service.valor }, service.id], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function removerServico(id, callback) {
    const con = createConnection();
    con.query('UPDATE servico SET blocked = TRUE WHERE id = ? AND blocked = FALSE', [id], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function desbloquearServico(id, callback) {
    const con = createConnection();
    con.query('UPDATE servico SET blocked = FALSE WHERE id = ? AND blocked = TRUE', [id], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function visualizarAgendamentos(callback) {
    const con = createConnection();
    con.query('SELECT agendamento.id, agendamento.horario, agendamento.situacao, agendamento.pagamento, usuario.id as usuario_id, servico.id as servico_id, servico.nome as servico_nome, servico.descricao as servico_descricao, servico.valor as servico_valor FROM agendamento ' +
    'INNER JOIN agendamento_servico ON agendamento_servico.agendamento_id = agendamento.id ' +
    'INNER JOIN usuario ON usuario.id = agendamento.usuario_id ' +
    'INNER JOIN servico ON servico.id = agendamento_servico.servico_id', [], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function visualizarAgendamentosCliente(email, callback) {
    const con = createConnection();
    con.query('SELECT agendamento.id, agendamento.horario, agendamento.situacao, agendamento.pagamento, usuario.email as usuario_id, servico.id as servico_id, servico.nome as servico_nome, servico.descricao as servico_descricao, servico.valor as servico_valor FROM agendamento ' +
    'INNER JOIN agendamento_servico ON agendamento_servico.agendamento_id = agendamento.id ' +
    'INNER JOIN usuario ON usuario.id = agendamento.usuario_id ' +
    'INNER JOIN servico ON servico.id = agendamento_servico.servico_id ' +
    'WHERE usuario.email = ?', [email], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function solicitarAgendamento(schedule, callback) {
    const con = createConnection();
    con.query('INSERT INTO agendamento SET ?', [{usuario_id: schedule.cliente, horario: schedule.horario}], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function solicitarServicos(services, callback) {
    const con = createConnection();
    con.query('INSERT INTO agendamento_servico (agendamento_id, servico_id) VALUES ?', [services], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function atualizarAgendamento(schedule, callback) {
    const con = createConnection();
    con.query('UPDATE agendamento SET ? WHERE id = ?', [{ situacao: schedule.situacao, pagamento: schedule.pagamento }, schedule.id], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function saveToken(authentication, token, callback) {
    const con = createConnection();
    con.query('UPDATE usuario SET token = ? WHERE email = ? AND blocked = FALSE', [token, authentication.email], (err, res) => {
        if (err) {
            callback(err);
        } else {
            callback(res);
        }
    });
    endConnection(con);
}

function verifyToken(token, callback) {
    const con = createConnection();
    con.query('SELECT email, salt, cargo FROM usuario WHERE token = ? AND blocked = FALSE', token, (err, res) => {
        if (err) {
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