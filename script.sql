DROP DATABASE IF EXISTS barber;

CREATE DATABASE barber;
USE barber;

CREATE TABLE usuario (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha CHAR(64) NOT NULL,
    salt  CHAR(96) NOT NULL,
    cargo VARCHAR(30) NOT NULL,
    token VARCHAR(255),
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    CHECK (cargo = 'FUNCIONARIO' OR cargo = 'CLIENTE')
);

CREATE TABLE servico (
    id INT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    blocked BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(id)
);

CREATE TABLE compra (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'MARCADO',
    pagamento VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
    PRIMARY KEY(id),
    FOREIGN KEY(usuario_id) REFERENCES usuario(id),
    CHECK (estado = 'MARCADO' OR estado = 'REALIZADO' OR estado = 'CANCELADO'),
    CHECK (pagamento = 'PENDENTE' OR pagamento = 'REALIZADO')
);

CREATE TABLE compra_servico (
    compra_id INT NOT NULL,
    servico_id INT NOT NULL,
    PRIMARY KEY(compra_id, servico_id),
    FOREIGN KEY(compra_id) REFERENCES compra(id),
    FOREIGN KEY(servico_id) REFERENCES servico(id)
);

CREATE TRIGGER ucase_insert BEFORE INSERT ON usuario FOR EACH ROW
SET NEW.email = LOWER(NEW.email), NEW.senha = UPPER(NEW.senha), NEW.salt = UPPER(NEW.salt);

CREATE TRIGGER ucase_update BEFORE UPDATE ON usuario FOR EACH ROW
SET NEW.email = LOWER(NEW.email), NEW.senha = UPPER(NEW.senha), NEW.salt = UPPER(NEW.salt);

CREATE TRIGGER ccase_insert BEFORE INSERT ON compra FOR EACH ROW
SET NEW.estado = UPPER(NEW.estado), NEW.pagamento = UPPER(NEW.pagamento);

CREATE TRIGGER ccase_update BEFORE UPDATE ON compra FOR EACH ROW
SET NEW.estado = UPPER(NEW.estado), NEW.pagamento = UPPER(NEW.pagamento);

INSERT INTO usuario (email, senha, salt, cargo)
VALUES ('admin@barbershop.com',
        '8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918',
        '9FCD52BABCE64865C7FF54FEE0B2F85E27E2EFF3F2C4D6FE8A22442FBE64B80B5F54B3EEEE6CD327C899EBD558FE3635',
        'FUNCIONARIO');
        
INSERT INTO servico (descricao, valor)
VALUES  ("Corte de Cabelo", 20.00),
        ("Hidratacao", 30.00);
        
-- INSERT INTO servico (descricao, valor)
-- VALUES  ("Corte de Cabelo", 20.00),
--         ("Hidratacao", 30.00);

-- INSERT INTO compra (usuario_id) VALUES (1);
 
-- INSERT INTO compra_servico (compra_id, servico_id) VALUES (1, 1);
-- INSERT INTO compra_servico (compra_id, servico_id) VALUES (1, 2);

-- SELECT compra.id, servico.id, servico.descricao
-- FROM compra_servico
-- INNER JOIN compra ON compra.id = compra_servico.compra_id
-- INNER JOIN servico ON servico.id = compra_servico.servico_id
-- WHERE compra.id = 1;

-- SELECT compra.id, compra.estado, compra.pagamento, usuario.id, usuario.email, usuario.cargo
-- FROM compra
-- INNER JOIN usuario ON usuario.id = compra.id
-- WHERE usuario.email = 'admin@barbershop.com';