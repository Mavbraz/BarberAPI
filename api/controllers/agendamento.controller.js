"use strict";

const moment = require('moment');

const db = require("../helpers/db.helper");
const response = require("../helpers/response.helper");

module.exports = {
    visualizarAgendamentos: visualizarAgendamentos,
    visualizarAgendamentosCliente: visualizarAgendamentosCliente,
    solicitarAgendamento: solicitarAgendamento,
    atualizarAgendamento: atualizarAgendamento
}

function generateAllSchedule(array) {
    var values = {};

    array.forEach(element => {
        if (values[element.id] === undefined) {
            values[element.id] = { id: element.id, horario: element.horario, situacao: element.situacao, pagamento: element.pagamento, usuario_id: element.usuario_id, servicos: [{ id: element.servico_id, nome: element.servico_nome, descricao: element.servico_descricao, valor: element.servico_valor }]};
        } else {
            values[element.id].servicos.push({ id: element.servico_id, nome: element.servico_nome, descricao: element.servico_descricao, valor: element.servico_valor });
        }
    });

    return values;
}

function visualizarAgendamentos(req, res, next) {
    db.visualizarAgendamentos(function (result) {
        if (!(result instanceof Error)) {
            const schedules = generateAllSchedule(result);

            return response.sendSuccess(res, { total: Object.keys(schedules).length, agendamentos: Object.keys(schedules).map(element => { return schedules[element] }) });
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function visualizarAgendamentosCliente(req, res, next) {
    db.visualizarAgendamentosCliente(req.auth.sub, function (result) {
        if (!(result instanceof Error)) {
            const schedules = generateAllSchedule(result);

            return response.sendSuccess(res, { total: Object.keys(schedules).length, agendamentos: Object.keys(schedules).map(element => { return schedules[element] }) });
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}

function solicitarAgendamento(req, res, next) {
    const schedule = req.swagger.params['schedule'].value;
    schedule.cliente = req.auth.sub;

    if (schedule.cliente === undefined || schedule.horario === undefined || schedule.servicos === undefined) {
        return response.sendDefaultError(res, { message: "Error: 'client', 'horario' and 'servicos' are required" });
    }

    try {
        schedule.servicos = JSON.parse(schedule.servicos);
    }  catch (error) {
        return response.sendDefaultError(res, { message: "Error: 'servicos' need be a json array of services" });
    }
    
    if (schedule.servicos.length <= 0) {
        return response.sendDefaultError(res, { message: "Error: 'servicos' must have values" });
    }
    
    if (!moment.unix(schedule.horario).isValid()) {
        return response.sendDefaultError(res, { message: "Error: 'horario' is not valid" });
    }

    db.getUsuarioId(schedule.cliente, function (result_usuario) {
        if (!(result_usuario instanceof Error)) {
            schedule.cliente = result_usuario.id;

            db.solicitarAgendamento(schedule, function (result_agendamento) {
                if (!(result_agendamento instanceof Error)) {
                    const servicos = schedule.servicos.map(element => {
                        return [result_agendamento.insertId, element]
                    });

                    db.solicitarServicos(servicos, function (result_servicos) {
                        if (!(result_servicos instanceof Error)) {
                            return response.sendSuccess(res, { message: "Schedule created successfully" });
                        } else {
                            return response.sendDefaultError(res, { message: "Error: Service cant be requested" });
                        }
                    });
                } else {
                    return response.sendDefaultError(res, { message: "Error: Couldnt be possible create the schedule" });
                }
            });
        } else {
            return response.sendDefaultError(res, { message: "Error: User not found" });
        }
    });
}

function atualizarAgendamento(req, res, next) {
    var schedule = req.swagger.params['schedule'].value;
    schedule.id = req.swagger.params['id'].value;

    if (schedule.situacao === undefined || schedule.pagamento === undefined) {
        return response.sendDefaultError(res, { message: "Error: 'situacao' and 'pagamento' are required" });
    }

    if (schedule.situacao.toUpperCase() !== "MARCADO" && schedule.situacao.toUpperCase() !== "REALIZADO" && schedule.situacao.toUpperCase() !== "CANCELADO") {
        return response.sendDefaultError(res, { message: "Error: 'situacao' needs be 'MARCADO', 'REALIZADO' or 'CANCELADO'" });
    }

    if (schedule.pagamento.toUpperCase() !== "PENDENTE" && schedule.pagamento.toUpperCase() !== "REALIZADO") {
        return response.sendDefaultError(res, { message: "Error: 'situacao' needs be 'PENDENTE' or 'REALIZADO'" });
    }

    db.atualizarAgendamento(schedule, function (result) {
        if (!(result instanceof Error)) {
            if (result.affectedRows > 0) {
                return response.sendSuccess(res, { message: "Schedule updated" });
            } else {
                return response.sendDefaultError(res, { message: "Schedule not found" });
            }
        } else {
            return response.sendDefaultError(res, { message: result.message });
        }
    });
}