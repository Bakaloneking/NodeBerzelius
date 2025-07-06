-- ===================================================================
--                  CONFIGURAÇÃO INICIAL DO BANCO DE DADOS
-- ===================================================================

DROP DATABASE IF EXISTS `demoBerzelius`;
CREATE DATABASE IF NOT EXISTS `demoBerzelius` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `demoBerzelius`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- ===================================================================
--                      SEÇÃO 1: CRIAÇÃO DE TABELAS (ORDEM CORRIGIDA)
-- ===================================================================

--
-- Tabelas Base (sem dependências externas)
--
DROP TABLE IF EXISTS `serie`;
CREATE TABLE `serie` (
  `serid` int unsigned NOT NULL DEFAULT '0',
  `serdescricao` varchar(40) NOT NULL,
  PRIMARY KEY (`serid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `estafisi`;
CREATE TABLE `estafisi` (
  `estafisiid` int unsigned NOT NULL DEFAULT '0',
  `estafisidescricao` varchar(40) NOT NULL,
  PRIMARY KEY (`estafisiid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cargos`;
CREATE TABLE `cargos` (
  `cargid` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cargnome` VARCHAR(255),
  PRIMARY KEY (`cargid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `turmas`;
CREATE TABLE `turmas` (
  `turmid` INT UNSIGNED NOT NULL,
  `turnome` VARCHAR(255),
  `turmcreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `turmupdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`turmid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `disciplinas`;
CREATE TABLE `disciplinas` (
  `disc_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `disc_nome` VARCHAR(255) NOT NULL,            
  `disc_codigo` VARCHAR(20) UNIQUE DEFAULT NULL,
  `disc_descricao` TEXT NULL,
  PRIMARY KEY (`disc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `horarios_padrao`;
CREATE TABLE `horarios_padrao` (
  `hp_id` VARCHAR(10) NOT NULL,                 -- Um código único para o horário (Ex: 'M1', 'T3')
  `hp_turno` ENUM('Manhã', 'Tarde', 'Noite') NOT NULL,
  `hp_descricao` VARCHAR(50) NOT NULL,          -- Ex: '1º Horário (Manhã)'
  `hp_hora_inicio` TIME NOT NULL,
  `hp_hora_fim` TIME NOT NULL,
  PRIMARY KEY (`hp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tabelas Dependentes (Nível 1)
--
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `usuid` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usunome` VARCHAR(255),
  `usufoto_perfil` VARCHAR(255) NULL DEFAULT NULL, 
  `usucargo` INT UNSIGNED NOT NULL,
  `usuturma` INT UNSIGNED DEFAULT NULL,
  `usuemail` VARCHAR(255) NOT NULL,
  `ususenha` VARBINARY(255) NOT NULL,
  `usucreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuupdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuid`),
  UNIQUE KEY `uk_usuemail` (`usuemail`),
  CONSTRAINT `fk_usuarios_cargo` FOREIGN KEY (`usucargo`) REFERENCES `cargos` (`cargid`),
  CONSTRAINT `fk_usuarios_turma` FOREIGN KEY (`usuturma`) REFERENCES `turmas` (`turmid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `professor_turmas`;
CREATE TABLE `professor_turmas` (
  `pt_professor_usuid_fk` INT UNSIGNED NOT NULL, -- Chave estrangeira para o ID do professor
  `pt_turma_id_fk` INT UNSIGNED NOT NULL,        -- Chave estrangeira para o ID da turma
  PRIMARY KEY (`pt_professor_usuid_fk`, `pt_turma_id_fk`),
  CONSTRAINT `fk_pt_professor` FOREIGN KEY (`pt_professor_usuid_fk`) REFERENCES `usuarios` (`usuid`) ON DELETE CASCADE,
  CONSTRAINT `fk_pt_turma` FOREIGN KEY (`pt_turma_id_fk`) REFERENCES `turmas` (`turmid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `laboratorios`;
CREATE TABLE `laboratorios` (
  `labid` INT UNSIGNED NOT NULL,
  `labnome` VARCHAR(255),
  `lab_resp_usuid_fk` INT UNSIGNED NULL, 
  `labcreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `labupdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`labid`),
  CONSTRAINT `fk_lab_responsavel` FOREIGN KEY (`lab_resp_usuid_fk`) REFERENCES `usuarios` (`usuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `horario_turma`;
CREATE TABLE `horario_turma` (
  `ht_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ht_turma_id_fk` INT UNSIGNED NOT NULL,
  `ht_disciplina_id_fk` INT UNSIGNED NOT NULL,
  `ht_professor_usuid_fk` INT UNSIGNED NOT NULL,
  `ht_laboratorio_id_fk` INT UNSIGNED NOT NULL,
  `ht_dia_semana` TINYINT NOT NULL,              -- 1=Segunda, 2=Terça, etc.
  `ht_horario_padrao_id_fk` VARCHAR(10) NOT NULL, -- <-- Referência para a tabela de horários
  PRIMARY KEY (`ht_id`),
  CONSTRAINT `fk_ht_turma` FOREIGN KEY (`ht_turma_id_fk`) REFERENCES `turmas` (`turmid`),
  CONSTRAINT `fk_ht_disciplina` FOREIGN KEY (`ht_disciplina_id_fk`) REFERENCES `disciplinas` (`disc_id`),
  CONSTRAINT `fk_ht_professor` FOREIGN KEY (`ht_professor_usuid_fk`) REFERENCES `usuarios` (`usuid`),
  CONSTRAINT `fk_ht_laboratorio` FOREIGN KEY (`ht_laboratorio_id_fk`) REFERENCES `laboratorios` (`labid`),
  CONSTRAINT `fk_ht_horario_padrao` FOREIGN KEY (`ht_horario_padrao_id_fk`) REFERENCES `horarios_padrao` (`hp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `elemento`;
CREATE TABLE `elemento` (
  `eleid` int unsigned NOT NULL AUTO_INCREMENT,
  `elesimbolo` VARCHAR(3) NOT NULL,
  `elenome` varchar(255) NOT NULL,
  `eleprotons` int unsigned DEFAULT 0,
  `eleneutrons` int unsigned NOT NULL DEFAULT 0,
  `eleeletrons` int unsigned DEFAULT 0,
  `eleserid` int unsigned DEFAULT 0,
  `eleesfiid` int unsigned DEFAULT 0,
  `elepfusa` double NOT NULL DEFAULT '0',
  `elepebul` double NOT NULL DEFAULT '0',
  `eledescricao` TEXT NULL,
  PRIMARY KEY (`eleid`),
  UNIQUE KEY `uk_elenome` (`elenome`),
  KEY `eleprotons` (`eleprotons`),
  KEY `eleserid` (`eleserid`),
  KEY `eleesfiid` (`eleesfiid`),
  CONSTRAINT `elemento_ibfk_1` FOREIGN KEY (`eleprotons`) REFERENCES `elemento` (`eleid`),
  CONSTRAINT `elemento_ibfk_2` FOREIGN KEY (`eleserid`) REFERENCES `serie` (`serid`),
  CONSTRAINT `elemento_ibfk_3` FOREIGN KEY (`eleesfiid`) REFERENCES `estafisi` (`estafisiid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tabelas Dependentes (Nível 2)
--
DROP TABLE IF EXISTS `sessoes_aula`;
CREATE TABLE `sessoes_aula` (
  `sa_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sa_horario_id_fk` INT UNSIGNED NOT NULL, 
  `sa_data` DATE NOT NULL,                  
  `sa_tema_especifico` TEXT NULL,           
  `sa_observacoes` TEXT NULL,               
  `sa_created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sa_id`),
  CONSTRAINT `fk_sa_horario` FOREIGN KEY (`sa_horario_id_fk`) REFERENCES `horario_turma` (`ht_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `camaelet`;
CREATE TABLE `camaelet` (
  `camaeletid` int unsigned NOT NULL DEFAULT '0',
  `kcamaelet` tinyint DEFAULT 0,
  `lcamaelet` tinyint DEFAULT 0,
  `mcamaelet` tinyint DEFAULT 0,
  `ncamaelet` tinyint DEFAULT 0,
  `ocamaelet` tinyint DEFAULT 0,
  `pcamaelet` tinyint DEFAULT 0,
  `qcamaelet` tinyint DEFAULT 0,
  PRIMARY KEY (`camaeletid`),
  CONSTRAINT `camaelet_ibfk_1` FOREIGN KEY (`camaeletid`) REFERENCES `elemento` (`eleid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `distelet`;
CREATE TABLE `distelet` (
  `disteletid` int unsigned NOT NULL DEFAULT '0',
  `discamaeletid` char(1) NOT NULL,
  `sdistelet` tinyint DEFAULT 0,
  `pdistelet` tinyint DEFAULT 0,
  `ddistelet` tinyint DEFAULT 0,
  `fdistelet` tinyint DEFAULT 0,
  PRIMARY KEY (`disteletid`, `discamaeletid`),
  CONSTRAINT `distelet_ibfk_1` FOREIGN KEY (`disteletid`) REFERENCES `elemento` (`eleid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `substancias`;
CREATE TABLE `substancias` (
  `sub_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sub_nome` VARCHAR(255) NOT NULL,
  `sub_formula_quimica` VARCHAR(100) DEFAULT NULL,
  `sub_massa_molar` DECIMAL(15, 5) DEFAULT NULL,
  `sub_tipo` ENUM('elemento', 'Composto') NOT NULL,
  `sub_elemento_id_fk` INT UNSIGNED DEFAULT NULL,
  `sub_descricao` TEXT NULL,
  PRIMARY KEY (`sub_id`),
  UNIQUE KEY `uk_sub_nome` (`sub_nome`),
  CONSTRAINT `fk_substancia_elemento` FOREIGN KEY (`sub_elemento_id_fk`) REFERENCES `elemento` (`eleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tabelas Dependentes (Nível 3)
--
DROP TABLE IF EXISTS `composicao_compostos`;
CREATE TABLE `composicao_compostos` (
  `comp_substancia_id_fk` INT UNSIGNED NOT NULL,
  `comp_elemento_id_fk` INT UNSIGNED NOT NULL,
  `comp_quantidade_atomos` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`comp_substancia_id_fk`, `comp_elemento_id_fk`),
  CONSTRAINT `fk_composicao_substancia` FOREIGN KEY (`comp_substancia_id_fk`) REFERENCES `substancias` (`sub_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_composicao_elemento` FOREIGN KEY (`comp_elemento_id_fk`) REFERENCES `elemento` (`eleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `solucoes`;
CREATE TABLE `solucoes` (
  `sol_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sol_nome` VARCHAR(255) NOT NULL,
  `sol_solvente_id_fk` INT UNSIGNED NOT NULL,
  `sol_concentracao` DECIMAL(10, 5) DEFAULT NULL,
  `sol_unidade_conc` VARCHAR(20) DEFAULT NULL,
  `sol_descricao` TEXT NULL,
  PRIMARY KEY (`sol_id`),
  CONSTRAINT `fk_solucao_solvente` FOREIGN KEY (`sol_solvente_id_fk`) REFERENCES `substancias` (`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `laboratorio_inventario`;
CREATE TABLE `laboratorio_inventario` (
  `inv_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `inv_substancia_id_fk` INT UNSIGNED NOT NULL,
  `inv_marca` VARCHAR(100) NULL,
  `inv_lote` VARCHAR(100) NULL,
  `inv_quantidade` DECIMAL(10, 2) NOT NULL,
  `inv_unidade` VARCHAR(10) NOT NULL,
  `inv_localizacao` VARCHAR(100) DEFAULT NULL,
  `inv_data_validade` DATE DEFAULT NULL,
  PRIMARY KEY (`inv_id`),
  CONSTRAINT `fk_inventario_substancia` FOREIGN KEY (`inv_substancia_id_fk`) REFERENCES `substancias` (`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `vidrarias`;
CREATE TABLE `vidrarias` (
	`vid_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`vid_nome` VARCHAR(255) NOT NULL,
	`vid_imagem_path` VARCHAR(255) NOT NULL, -- Caminho para a imagem, ex: '/img/bequer.png'
	`vid_descricao` TEXT NULL,
	PRIMARY KEY (`vid_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tabelas Dependentes (Nível 4)
--
DROP TABLE IF EXISTS `solucao_componentes`;
CREATE TABLE `solucao_componentes` (
  `scomp_solucao_id_fk` INT UNSIGNED NOT NULL,
  `scomp_substancia_id_fk` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`scomp_solucao_id_fk`, `scomp_substancia_id_fk`),
  CONSTRAINT `fk_scomp_solucao` FOREIGN KEY (`scomp_solucao_id_fk`) REFERENCES `solucoes` (`sol_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_scomp_substancia` FOREIGN KEY (`scomp_substancia_id_fk`) REFERENCES `substancias` (`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ===================================================================
--                      SEÇÃO 2: CRIAÇÃO DE VIEWS
-- ===================================================================

CREATE OR REPLACE VIEW `v_elemento_detalhados` AS
SELECT
    e.elenome AS 'Nome',
    s.serdescricao AS 'Serie',
    es.estafisidescricao AS 'Estado_Fisico'
FROM elemento AS e
INNER JOIN serie AS s ON s.serid = e.eleserid
INNER JOIN estafisi AS es ON es.estafisiid = e.eleesfiid;

CREATE OR REPLACE VIEW `v_usuario_detalhados` AS
SELECT
    u.usunome AS 'Nome',
    c.cargnome AS 'Cargo'
FROM usuarios AS u
INNER JOIN cargos AS c ON c.cargid = u.usucargo;


-- ===================================================================
--                      SEÇÃO 3: CRIAÇÃO DE FUNÇÕES
-- ===================================================================

DELIMITER $$

CREATE FUNCTION `f_f_idelemento`(p_nome varchar(255)) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE v_num int unsigned;
    SET v_num = (SELECT eleid FROM elemento WHERE elenome = p_nome);
    RETURN v_num;
END$$

CREATE FUNCTION `f_f_estadofisico`(p_temp double, p_pfusa double, p_pebul double) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE v_estfis tinyint unsigned;
    IF p_pebul < p_temp THEN
        SET v_estfis = 3; -- Gasoso
    ELSEIF p_pfusa < p_temp THEN
        SET v_estfis = 2; -- Líquido
    ELSE
        SET v_estfis = 1; -- Sólido
    END IF;
    RETURN v_estfis;
END$$

CREATE FUNCTION `f_f_serie`(p_nome varchar(255)) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE v_serie tinyint unsigned;
    DECLARE v_numero_atomico int unsigned;
    SET v_numero_atomico = (SELECT eleid FROM elemento WHERE elenome = p_nome);
    
    IF v_numero_atomico IN (1,6,7,8,9,15,16,17,34,35,53) THEN SET v_serie = 1; -- Não Metais
    ELSEIF v_numero_atomico IN (3,11,19,37,55,87) THEN SET v_serie = 2; -- Alcalinos
    ELSEIF v_numero_atomico IN (4,12,20,38,56,88) THEN SET v_serie = 3; -- Alcalinos Terrosos
    ELSEIF v_numero_atomico IN (21,22,23,24,25,26,27,28,29,30,39,40,41,42,43,44,45,46,47,48,72,73,74,75,76,77,78,79,80,104,105,106,107,108,109,110,111,112) THEN SET v_serie = 4; -- Metais de Transição
    ELSEIF v_numero_atomico IN (5,14,32,33,51,52,85) THEN SET v_serie = 5; -- Semimetais
    ELSEIF v_numero_atomico IN (13,31,49,50,81,82,83,84,113,114,115,116,117) THEN SET v_serie = 6; -- Outros Metais
    ELSEIF v_numero_atomico IN (2,10,18,36,54,86,118) THEN SET v_serie = 7; -- Gases Nobres
    ELSEIF v_numero_atomico BETWEEN 57 AND 71 THEN SET v_serie = 8; -- Lantanoides
    ELSEIF v_numero_atomico BETWEEN 89 AND 103 THEN SET v_serie = 9; -- Actinoides
    ELSE SET v_serie = 0; -- Desconhecido
    END IF;
    RETURN v_serie;
END$$

DELIMITER ;

-- ===================================================================
--                   SEÇÃO 4: CRIAÇÃO DE PROCEDURES
-- ===================================================================

DELIMITER $$

CREATE PROCEDURE `sp_add_elemento`(p_nome VARCHAR(255),p_simbolo VARCHAR(3), p_neutrons INT, p_pfusa DOUBLE, p_pebul DOUBLE)
BEGIN
    DECLARE v_last_id INT UNSIGNED;
    INSERT INTO `elemento` (`elesimbolo`, `elenome`, `eleneutrons`, `elepfusa`, `elepebul`)
    VALUES ( p_simbolo, p_nome, p_neutrons, p_pfusa, p_pebul);
    
    SET v_last_id = LAST_INSERT_ID();

    UPDATE `elemento`
    SET
        `eleprotons`  = v_last_id,
        `eleeletrons` = v_last_id,
        `eleesfiid`   = (SELECT f_f_estadofisico(25, p_pfusa, p_pebul)),
        `eleserid`    = (SELECT f_f_serie(p_nome))
    WHERE `eleid` = v_last_id;
END$$

CREATE PROCEDURE `sp_add_aula`(p_lab INT, p_prof INT, p_turma INT, p_tema text, p_dia varchar(255), p_hora varchar(255))
BEGIN
	INSERT INTO `aulas` (`aullab`,`aulprof`,`aulturma`,`aultema`,`auldia`, `aulhora`) VALUES (p_lab, p_prof, p_turma, p_tema, p_dia, p_hora);
END$$

CREATE PROCEDURE `sp_add_usuario`(p_nome VARCHAR(255), p_cargo INT UNSIGNED, p_turma INT UNSIGNED, p_email VARCHAR(255), p_senha VARCHAR(255))
BEGIN
	DECLARE v_turma INT UNSIGNED;
    IF p_cargo = 3 THEN
		SET v_turma = p_turma;
	ELSE
		SET v_turma = NULL;
	END IF;
    
	INSERT INTO `usuarios` (`usunome`,`usucargo`,`usuturma`,`usuemail`,`ususenha`) VALUES (p_nome, p_cargo, v_turma, p_email, AES_ENCRYPT(p_senha,'CHAVE'));
END$$

CREATE PROCEDURE `sp_m_cargo`()
BEGIN
	SELECT `usunome` AS 'Nome', `cargnome` AS 'Cargo'
	FROM `usuarios`
    INNER JOIN `cargos` ON `cargid` = `usucargo`;
END$$

CREATE PROCEDURE `sp_lista_usuarios`()
BEGIN
	SELECT `usunome` AS "Nome", `cargnome` AS "Cargo"
	FROM `usuarios` 
	INNER JOIN `cargos` c on `cargid` = `usucargo`
	WHERE `usucargo` > 0;
END$$

CREATE PROCEDURE `sp_m_elemento`()
BEGIN
	SELECT `elenome` AS 'Nome', `serdescricao` AS 'Serie', `estafisidescricao` AS 'Estado Fisico'
	FROM `elemento`
	INNER JOIN `serie` ON `serid` = `eleserid`
    INNER JOIN `estafisi` ON `estafisiid` = `eleesfiid`;
END $$

CREATE PROCEDURE `sp_add_reagente_inventario`(
    p_nome_substancia VARCHAR(255),
    p_formula VARCHAR(100),
    p_massa_molar DECIMAL(15, 5),
    p_marca VARCHAR(100),
    p_lote VARCHAR(100),
    p_quantidade DECIMAL(10, 2),
    p_unidade VARCHAR(10),
    p_localizacao VARCHAR(100),
    p_validade DATE
)
BEGIN
    DECLARE v_substancia_id INT UNSIGNED;

    -- Verifica se a substância já existe, senão, a insere.
    SELECT sub_id INTO v_substancia_id FROM substancias WHERE sub_nome = p_nome_substancia;

    IF v_substancia_id IS NULL THEN
        INSERT INTO substancias (sub_nome, sub_formula_quimica, sub_massa_molar, sub_tipo)
        VALUES (p_nome_substancia, p_formula, p_massa_molar, 'Composto');
        SET v_substancia_id = LAST_INSERT_ID();
    END IF;

    -- Insere o item no inventário
    INSERT INTO laboratorio_inventario
      (inv_substancia_id_fk, inv_marca, inv_lote, inv_quantidade, inv_unidade, inv_localizacao, inv_data_validade)
    VALUES
      (v_substancia_id, p_marca, p_lote, p_quantidade, p_unidade, p_localizacao, p_validade);

END$$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_verificar_login`(p_email VARCHAR(255), p_senha VARCHAR(255))
BEGIN
	SELECT `usuid`,`usunome`,`usucargo`
    FROM `usuarios`
    WHERE `usuemail` = p_email AND ususenha = AES_ENCRYPT(p_senha, 'CHAVE');
END$$
DELIMITER ;
-- ===================================================================
--                     SEÇÃO 5: CRIAÇÃO DE TRIGGERS
-- ===================================================================

DELIMITER $$

CREATE TRIGGER `t_nomenovo_elemento` BEFORE INSERT ON `elemento`
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM elemento WHERE elenome = NEW.elenome) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ERRO: elemento com este nome já existe na tabela.';
    END IF;
END$$

CREATE TRIGGER `trg_after_elemento_insert_unified` AFTER INSERT ON `elemento`
FOR EACH ROW
BEGIN
    DECLARE v_1s, v_2s, v_2p, v_3s, v_3p, v_4s, v_3d, v_4p, v_5s, v_4d, v_5p, v_6s, v_4f, v_5d, v_6p, v_7s, v_5f, v_6d, v_7p TINYINT DEFAULT 0;
    DECLARE v_eletrons_restantes INT;
    
    INSERT INTO camaelet (camaeletid) VALUES (NEW.eleid);

    SET v_eletrons_restantes = NEW.eleid;
    
    IF v_eletrons_restantes > 0 THEN SET v_1s = LEAST(v_eletrons_restantes, 2); SET v_eletrons_restantes = v_eletrons_restantes - v_1s; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_2s = LEAST(v_eletrons_restantes, 2); SET v_eletrons_restantes = v_eletrons_restantes - v_2s; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_2p = LEAST(v_eletrons_restantes, 6); SET v_eletrons_restantes = v_eletrons_restantes - v_2p; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_3s = LEAST(v_eletrons_restantes, 2); SET v_eletrons_restantes = v_eletrons_restantes - v_3s; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_3p = LEAST(v_eletrons_restantes, 6); SET v_eletrons_restantes = v_eletrons_restantes - v_3p; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_4s = LEAST(v_eletrons_restantes, 2); SET v_eletrons_restantes = v_eletrons_restantes - v_4s; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_3d = LEAST(v_eletrons_restantes, 10); SET v_eletrons_restantes = v_eletrons_restantes - v_3d; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_4p = LEAST(v_eletrons_restantes, 6); SET v_eletrons_restantes = v_eletrons_restantes - v_4p; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_5s = LEAST(v_eletrons_restantes, 2); SET v_eletrons_restantes = v_eletrons_restantes - v_5s; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_4d = LEAST(v_eletrons_restantes, 10); SET v_eletrons_restantes = v_eletrons_restantes - v_4d; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_5p = LEAST(v_eletrons_restantes, 6); SET v_eletrons_restantes = v_eletrons_restantes - v_5p; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_6s = LEAST(v_eletrons_restantes, 2); SET v_eletrons_restantes = v_eletrons_restantes - v_6s; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_4f = LEAST(v_eletrons_restantes, 14); SET v_eletrons_restantes = v_eletrons_restantes - v_4f; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_5d = LEAST(v_eletrons_restantes, 10); SET v_eletrons_restantes = v_eletrons_restantes - v_5d; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_6p = LEAST(v_eletrons_restantes, 6); SET v_eletrons_restantes = v_eletrons_restantes - v_6p; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_7s = LEAST(v_eletrons_restantes, 2); SET v_eletrons_restantes = v_eletrons_restantes - v_7s; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_5f = LEAST(v_eletrons_restantes, 14); SET v_eletrons_restantes = v_eletrons_restantes - v_5f; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_6d = LEAST(v_eletrons_restantes, 10); SET v_eletrons_restantes = v_eletrons_restantes - v_6d; END IF;
    IF v_eletrons_restantes > 0 THEN SET v_7p = LEAST(v_eletrons_restantes, 6); SET v_eletrons_restantes = v_eletrons_restantes - v_7p; END IF;
    
    IF (v_1s > 0) THEN INSERT INTO distelet (disteletid, discamaeletid, sdistelet) VALUES (NEW.eleid, 'K', v_1s); END IF;
    IF (v_2s > 0 OR v_2p > 0) THEN INSERT INTO distelet (disteletid, discamaeletid, sdistelet, pdistelet) VALUES (NEW.eleid, 'L', v_2s, v_2p); END IF;
    IF (v_3s > 0 OR v_3p > 0 OR v_3d > 0) THEN INSERT INTO distelet (disteletid, discamaeletid, sdistelet, pdistelet, ddistelet) VALUES (NEW.eleid, 'M', v_3s, v_3p, v_3d); END IF;
    IF (v_4s > 0 OR v_4p > 0 OR v_4d > 0 OR v_4f > 0) THEN INSERT INTO distelet (disteletid, discamaeletid, sdistelet, pdistelet, ddistelet, fdistelet) VALUES (NEW.eleid, 'N', v_4s, v_4p, v_4d, v_4f); END IF;
    IF (v_5s > 0 OR v_5p > 0 OR v_5d > 0 OR v_5f > 0) THEN INSERT INTO distelet (disteletid, discamaeletid, sdistelet, pdistelet, ddistelet, fdistelet) VALUES (NEW.eleid, 'O', v_5s, v_5p, v_5d, v_5f); END IF;
    IF (v_6s > 0 OR v_6p > 0 OR v_6d > 0) THEN INSERT INTO distelet (disteletid, discamaeletid, sdistelet, pdistelet, ddistelet) VALUES (NEW.eleid, 'P', v_6s, v_6p, v_6d); END IF;
    IF (v_7s > 0 OR v_7p > 0) THEN INSERT INTO distelet (disteletid, discamaeletid, sdistelet, pdistelet) VALUES (NEW.eleid, 'Q', v_7s, v_7p); END IF;
END$$

CREATE TRIGGER `trg_distelet_after_insert_update_camaelet` AFTER INSERT ON `distelet`
FOR EACH ROW
BEGIN
    DECLARE v_total_camada TINYINT;
    SET v_total_camada = COALESCE(NEW.sdistelet, 0) + COALESCE(NEW.pdistelet, 0) + COALESCE(NEW.ddistelet, 0) + COALESCE(NEW.fdistelet, 0);

    IF NEW.discamaeletid = 'K' THEN UPDATE camaelet SET kcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'L' THEN UPDATE camaelet SET lcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'M' THEN UPDATE camaelet SET mcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'N' THEN UPDATE camaelet SET ncamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'O' THEN UPDATE camaelet SET ocamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'P' THEN UPDATE camaelet SET pcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'Q' THEN UPDATE camaelet SET qcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    END IF;
END$$

CREATE TRIGGER `trg_distelet_after_update_update_camaelet` AFTER UPDATE ON `distelet`
FOR EACH ROW
BEGIN
    DECLARE v_total_camada TINYINT;
    SET v_total_camada = COALESCE(NEW.sdistelet, 0) + COALESCE(NEW.pdistelet, 0) + COALESCE(NEW.ddistelet, 0) + COALESCE(NEW.fdistelet, 0);
    
    IF NEW.discamaeletid = 'K' THEN UPDATE camaelet SET kcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'L' THEN UPDATE camaelet SET lcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'M' THEN UPDATE camaelet SET mcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'N' THEN UPDATE camaelet SET ncamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'O' THEN UPDATE camaelet SET ocamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'P' THEN UPDATE camaelet SET pcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    ELSEIF NEW.discamaeletid = 'Q' THEN UPDATE camaelet SET qcamaelet = v_total_camada WHERE camaeletid = NEW.disteletid;
    END IF;

    IF OLD.discamaeletid != NEW.discamaeletid THEN
        IF OLD.discamaeletid = 'K' THEN UPDATE camaelet SET kcamaelet = 0 WHERE camaeletid = OLD.disteletid;
        ELSEIF OLD.discamaeletid = 'L' THEN UPDATE camaelet SET lcamaelet = 0 WHERE camaeletid = OLD.disteletid;
        ELSEIF OLD.discamaeletid = 'M' THEN UPDATE camaelet SET mcamaelet = 0 WHERE camaeletid = OLD.disteletid;
        ELSEIF OLD.discamaeletid = 'N' THEN UPDATE camaelet SET ncamaelet = 0 WHERE camaeletid = OLD.disteletid;
        ELSEIF OLD.discamaeletid = 'O' THEN UPDATE camaelet SET ocamaelet = 0 WHERE camaeletid = OLD.disteletid;
        ELSEIF OLD.discamaeletid = 'P' THEN UPDATE camaelet SET pcamaelet = 0 WHERE camaeletid = OLD.disteletid;
        ELSEIF OLD.discamaeletid = 'Q' THEN UPDATE camaelet SET qcamaelet = 0 WHERE camaeletid = OLD.disteletid;
        END IF;
    END IF;
END$$

CREATE TRIGGER `trg_distelet_after_delete_update_camaelet` AFTER DELETE ON `distelet`
FOR EACH ROW
BEGIN
    IF OLD.discamaeletid = 'K' THEN UPDATE camaelet SET kcamaelet = 0 WHERE camaeletid = OLD.disteletid;
    ELSEIF OLD.discamaeletid = 'L' THEN UPDATE camaelet SET lcamaelet = 0 WHERE camaeletid = OLD.disteletid;
    ELSEIF OLD.discamaeletid = 'M' THEN UPDATE camaelet SET mcamaelet = 0 WHERE camaeletid = OLD.disteletid;
    ELSEIF OLD.discamaeletid = 'N' THEN UPDATE camaelet SET ncamaelet = 0 WHERE camaeletid = OLD.disteletid;
    ELSEIF OLD.discamaeletid = 'O' THEN UPDATE camaelet SET ocamaelet = 0 WHERE camaeletid = OLD.disteletid;
    ELSEIF OLD.discamaeletid = 'P' THEN UPDATE camaelet SET pcamaelet = 0 WHERE camaeletid = OLD.disteletid;
    ELSEIF OLD.discamaeletid = 'Q' THEN UPDATE camaelet SET qcamaelet = 0 WHERE camaeletid = OLD.disteletid;
    END IF;
END$$

DELIMITER ;

-- ===================================================================
--                  SEÇÃO 6: INSERÇÃO DE DADOS (SEEDING)
-- ===================================================================

START TRANSACTION;

-- Inserção de dados nas tabelas de apoio (lookup tables)
LOCK TABLES `serie` WRITE;
/*!40000 ALTER TABLE `serie` DISABLE KEYS */;
INSERT INTO `serie` VALUES (0,'Desconhecido'),(1,'Não Metais'),(2,'Alcalinos'),(3,'Alcalinos Terrosos'),(4,'Metais de Transição'),(5,'Semimetais'),(6,'Outros Metais'),(7,'Gases Nobres'),(8,'Lantanoides'),(9,'Actinoides');
/*!40000 ALTER TABLE `serie` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `estafisi` WRITE;
/*!40000 ALTER TABLE `estafisi` DISABLE KEYS */;
INSERT INTO `estafisi` VALUES (0,'Erro'),(1,'Sólido'),(2,'Líquido'),(3,'Gasoso');
/*!40000 ALTER TABLE `estafisi` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
INSERT INTO `cargos` (`cargid`,`cargnome`) VALUES (0, 'Oculto'),(1, 'Tecnico'),(2, 'Professor'),(3, 'Aluno');
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `turmas` WRITE;
/*!40000 ALTER TABLE `turmas` DISABLE KEYS */;
INSERT INTO `turmas` (`turmid`, `turnome`) VALUES (420, 'IQI0420');
INSERT INTO `turmas` (`turmid`, `turnome`) VALUES (690, 'IQU0690');
INSERT INTO `turmas` (`turmid`, `turnome`) VALUES (240, 'IQU0240');
INSERT INTO `turmas` (`turmid`, `turnome`) VALUES (130, 'IQU0130');
/*!40000 ALTER TABLE `turmas` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `laboratorios` WRITE;
/*!40000 ALTER TABLE `laboratorios` DISABLE KEYS */;
-- Inserção dos dados especificando as colunas
INSERT INTO `laboratorios` (`labid`, `labnome`) VALUES (1, 'ANALÍTICA');
INSERT INTO `laboratorios` (`labid`, `labnome`) VALUES (2, 'FÍSICO-QUÍMICA');
INSERT INTO `laboratorios` (`labid`, `labnome`) VALUES (3, 'ORGÂNICA');
/*!40000 ALTER TABLE `laboratorios` ENABLE KEYS */;
UNLOCK TABLES;

-- Na SEÇÃO 6: INSERÇÃO DE DADOS (SEEDING)

LOCK TABLES `vidrarias` WRITE;
/*!40000 ALTER TABLE `vidrarias` DISABLE KEYS */;
INSERT INTO `vidrarias` (`vid_nome`, `vid_imagem_path`, `vid_descricao`) VALUES
('Tubo de Ensaio', '/img/Camada 2@2x.png', 'Usado para realizar reações em pequena escala.'),
('Béquer', '/img/Camada 3@2x.png', 'Recipiente de uso geral para misturar, aquecer e medir líquidos.'),
('Erlenmeyer', '/img/Camada 4@2x.png', 'Usado em titulações e para aquecer líquidos sob refluxo.'),
('Balão Volumétrico', '/img/Camada 5@2x.png', 'Usado para preparar soluções com concentrações precisas.'),
('Balão de Fundo Redondo', '/img/Camada 6@2x.png', 'Ideal para aquecimento uniforme de líquidos em processos de destilação.');
/*!40000 ALTER TABLE `vidrarias` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `horarios_padrao` WRITE;
/*!40000 ALTER TABLE `horarios_padrao` DISABLE KEYS */;
INSERT INTO `horarios_padrao` (`hp_id`, `hp_turno`, `hp_descricao`, `hp_hora_inicio`, `hp_hora_fim`) VALUES
-- Manhã
('M1', 'Manhã', '1º Horário (07:30 - 08:20)', '07:30:00', '08:20:00'),
('M2', 'Manhã', '2º Horário (08:20 - 09:10)', '08:20:00', '09:10:00'),
('M3', 'Manhã', '3º Horário (09:10 - 10:00)', '09:10:00', '10:00:00'),
('M4', 'Manhã', '4º Horário (10:20 - 11:10)', '10:20:00', '11:10:00'),
('M5', 'Manhã', '5º Horário (11:10 - 12:00)', '11:10:00', '12:00:00'),
-- Tarde
('T1', 'Tarde', '1º Horário (13:00 - 14:00)', '13:00:00', '14:00:00'),
('T2', 'Tarde', '2º Horário (14:00 - 15:00)', '14:00:00', '15:00:00'),
('T3', 'Tarde', '3º Horário (15:00 - 16:00)', '15:00:00', '16:00:00'),
('T4', 'Tarde', '4º Horário (16:00 - 17:00)', '16:00:00', '17:00:00'),
('T5', 'Tarde', '5º Horário (17:00 - 18:00)', '17:00:00', '18:00:00'),
-- Noite
('N1', 'Noite', '1º Horário (18:00 - 19:00)', '18:00:00', '19:00:00'),
('N2', 'Noite', '2º Horário (19:00 - 20:00)', '19:00:00', '20:00:00'),
('N3', 'Noite', '3º Horário (20:00 - 21:00)', '20:00:00', '21:00:00'),
('N4', 'Noite', '4º Horário (21:00 - 22:00)', '21:00:00', '22:00:00'),
('N5', 'Noite', '5º Horário (22:00 - 22:45)', '22:00:00', '22:45:00');
/*!40000 ALTER TABLE `horarios_padrao` ENABLE KEYS */;
UNLOCK TABLES;

-- Inserção de dados de usuários de exemplo
LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
CALL sp_add_usuario('Carlos',0,NULL,'adm0@email.com','2024');
CALL sp_add_usuario('Deborah',0,NULL,'adm1@email.com','2024');
CALL sp_add_usuario('Jorge',0,NULL,'adm2@email.com','2024');
CALL sp_add_usuario('Manoel',0,NULL,'adm3@email.com','2024');
CALL sp_add_usuario('Gustavo',0,NULL,'adm4@email.com','2024');
CALL sp_add_usuario('Esmeralda',0,NULL,'adm5@email.com','2024');
CALL sp_add_usuario('Larisa',0,NULL,'adm6@email.com','2024');
CALL sp_add_usuario('Thamiris',1,NULL,'tec1@email.com','tecnico');
CALL sp_add_usuario('Marcos',1,NULL,'tec2@email.com','tecnico');
CALL sp_add_usuario('João',1,NULL,'tec3@email.com','tecnico');
CALL sp_add_usuario('Kakashi',2,NULL,'prof0@email.com','12345');
CALL sp_add_usuario('Girafales',2,NULL,'prof1@email.com','12345');
CALL sp_add_usuario('Emmerson',2,NULL,'prof2@email.com','12345');
CALL sp_add_usuario('Leticia',3,240,'2024@ifam.edu.br','alun');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

-- Inserção de dados de usuários de exemplo
LOCK TABLES `elemento` WRITE;
CALL sp_add_elemento('Hidrogênio', 'H', 0, -259.14, -252.87);
CALL sp_add_elemento('Hélio', 'He', 2, -272.20, -268.93);
CALL sp_add_elemento('Lítio', 'Li', 4, 180.50, 1330.00);
CALL sp_add_elemento('Berílio', 'Be', 5, 1287.00, 2471.00);
CALL sp_add_elemento('Boro', 'B', 6, 2076.00, 4000.00);
CALL sp_add_elemento('Carbono', 'C', 6, 3550.00, 4827.00);
CALL sp_add_elemento('Nitrogênio', 'N', 7, -210.00, -195.79);
CALL sp_add_elemento('Oxigênio', 'O', 8, -218.79, -182.95);
CALL sp_add_elemento('Flúor', 'F', 10, -219.67, -188.11);
CALL sp_add_elemento('Neônio', 'Ne', 10, -248.59, -246.08);
CALL sp_add_elemento('Sódio', 'Na', 12, 97.79, 883.00);
CALL sp_add_elemento('Magnésio', 'Mg', 12, 650.00, 1091.00);
CALL sp_add_elemento('Alumínio', 'Al', 14, 660.32, 2519.00);
CALL sp_add_elemento('Silício', 'Si', 14, 1414.00, 3265.00);
CALL sp_add_elemento('Fósforo', 'P', 16, 44.15, 280.50);
CALL sp_add_elemento('Enxofre', 'S', 16, 115.21, 444.60);
CALL sp_add_elemento('Cloro', 'Cl', 18, -101.50, -34.04);
CALL sp_add_elemento('Argônio', 'Ar', 22, -189.34, -185.85);
CALL sp_add_elemento('Potássio', 'K', 20, 63.50, 759.00);
CALL sp_add_elemento('Cálcio', 'Ca', 20, 842.00, 1484.00);
CALL sp_add_elemento('Escândio', 'Sc', 24, 1541.00, 2836.00);
CALL sp_add_elemento('Titânio', 'Ti', 26, 1668.00, 3287.00);
CALL sp_add_elemento('Vanádio', 'V', 28, 1910.00, 3407.00);
CALL sp_add_elemento('Cromo', 'Cr', 28, 1907.00, 2671.00);
CALL sp_add_elemento('Manganês', 'Mn', 30, 1246.00, 2061.00);
CALL sp_add_elemento('Ferro', 'Fe', 30, 1538.00, 2862.00);
CALL sp_add_elemento('Cobalto', 'Co', 32, 1495.00, 2927.00);
CALL sp_add_elemento('Níquel', 'Ni', 31, 1455.00, 2913.00);
CALL sp_add_elemento('Cobre', 'Cu', 35, 1084.62, 2562.00);
CALL sp_add_elemento('Zinco', 'Zn', 35, 419.53, 907.00);
CALL sp_add_elemento('Gálio', 'Ga', 39, 29.76, 2229.00);
CALL sp_add_elemento('Germânio', 'Ge', 41, 938.20, 2833.00);
CALL sp_add_elemento('Arsênio', 'As', 42, 817.00, 614.00);
CALL sp_add_elemento('Selênio', 'Se', 45, 221.00, 685.00);
CALL sp_add_elemento('Bromo', 'Br', 45, -7.20, 58.80);
CALL sp_add_elemento('Criptônio', 'Kr', 48, -157.37, -153.41);
CALL sp_add_elemento('Rubídio', 'Rb', 48, 39.30, 688.00);
CALL sp_add_elemento('Estrôncio', 'Sr', 50, 777.00, 1382.00);
CALL sp_add_elemento('Ítrio', 'Y', 50, 1526.00, 3338.00);
CALL sp_add_elemento('Zircônio', 'Zr', 51, 1855.00, 4409.00);
CALL sp_add_elemento('Nióbio', 'Nb', 52, 2477.00, 4744.00);
CALL sp_add_elemento('Molibdênio', 'Mo', 54, 2623.00, 4639.00);
CALL sp_add_elemento('Tecnécio', 'Tc', 55, 2157.00, 4265.00);
CALL sp_add_elemento('Rutênio', 'Ru', 57, 2334.00, 4150.00);
CALL sp_add_elemento('Ródio', 'Rh', 58, 1964.00, 3695.00);
CALL sp_add_elemento('Paládio', 'Pd', 60, 1554.90, 2963.00);
CALL sp_add_elemento('Prata', 'Ag', 61, 961.78, 2162.00);
CALL sp_add_elemento('Cádmio', 'Cd', 64, 321.07, 767.00);
CALL sp_add_elemento('Índio', 'In', 66, 156.60, 2072.00);
CALL sp_add_elemento('Estanho', 'Sn', 69, 231.93, 2602.00);
CALL sp_add_elemento('Antimônio', 'Sb', 71, 630.63, 1587.00);
CALL sp_add_elemento('Telúrio', 'Te', 76, 449.51, 988.00);
CALL sp_add_elemento('Iodo', 'I', 74, 113.70, 184.30);
CALL sp_add_elemento('Xenônio', 'Xe', 77, -111.75, -108.10);
CALL sp_add_elemento('Césio', 'Cs', 78, 28.44, 671.00);
CALL sp_add_elemento('Bário', 'Ba', 81, 727.00, 1897.00);
CALL sp_add_elemento('Lantânio', 'La', 82, 918.00, 3464.00);
CALL sp_add_elemento('Cério', 'Ce', 82, 795.00, 3443.00);
CALL sp_add_elemento('Praseodímio', 'Pr', 82, 935.00, 3520.00);
CALL sp_add_elemento('Neodímio', 'Nd', 84, 1024.00, 3074.00);
CALL sp_add_elemento('Promécio', 'Pm', 84, 1042.00, 3000.00);
CALL sp_add_elemento('Samário', 'Sm', 88, 1072.00, 1794.00);
CALL sp_add_elemento('Európio', 'Eu', 89, 822.00, 1597.00);
CALL sp_add_elemento('Gadolínio', 'Gd', 93, 1312.00, 3273.00);
CALL sp_add_elemento('Térbio', 'Tb', 94, 1356.00, 3230.00);
CALL sp_add_elemento('Disprósio', 'Dy', 97, 1407.00, 2567.00);
CALL sp_add_elemento('Hólmio', 'Ho', 98, 1470.00, 2700.00);
CALL sp_add_elemento('Érbio', 'Er', 99, 1522.00, 2868.00);
CALL sp_add_elemento('Túlio', 'Tm', 100, 1545.00, 1950.00);
CALL sp_add_elemento('Itérbio', 'Yb', 103, 824.00, 1196.00);
CALL sp_add_elemento('Lutécio', 'Lu', 104, 1663.00, 3402.00);
CALL sp_add_elemento('Háfnio', 'Hf', 106, 2233.00, 4603.00);
CALL sp_add_elemento('Tântalo', 'Ta', 108, 3017.00, 5458.00);
CALL sp_add_elemento('Tungstênio', 'W', 110, 3422.00, 5555.00);
CALL sp_add_elemento('Rênio', 'Re', 111, 3186.00, 5596.00);
CALL sp_add_elemento('Ósmio', 'Os', 114, 3033.00, 5012.00);
CALL sp_add_elemento('Irídio', 'Ir', 115, 2446.00, 4428.00);
CALL sp_add_elemento('Platina', 'Pt', 117, 1768.30, 3825.00);
CALL sp_add_elemento('Ouro', 'Au', 118, 1064.18, 2856.00);
CALL sp_add_elemento('Mercúrio', 'Hg', 122, -38.83, 356.73);
CALL sp_add_elemento('Tálio', 'Tl', 124, 304.00, 1473.00);
CALL sp_add_elemento('Chumbo', 'Pb', 125, 327.46, 1749.00);
CALL sp_add_elemento('Bismuto', 'Bi', 126, 271.40, 1564.00);
CALL sp_add_elemento('Polônio', 'Po', 125, 254.00, 962.00);
CALL sp_add_elemento('Astato', 'At', 125, 302.00, 337.00);
CALL sp_add_elemento('Radônio', 'Rn', 136, -71.00, -61.70);
CALL sp_add_elemento('Frâncio', 'Fr', 136, 27.00, 677.00);
CALL sp_add_elemento('Rádio', 'Ra', 138, 700.00, 1737.00);
CALL sp_add_elemento('Actínio', 'Ac', 138, 1051.00, 3198.00);
CALL sp_add_elemento('Tório', 'Th', 142, 1750.00, 4788.00);
CALL sp_add_elemento('Protactínio', 'Pa', 140, 1572.00, 4027.00);
CALL sp_add_elemento('Urânio', 'U', 146, 1132.20, 4131.00);
CALL sp_add_elemento('Neptúnio', 'Np', 144, 639.00, 3902.00);
CALL sp_add_elemento('Plutônio', 'Pu', 150, 639.40, 3228.00);
CALL sp_add_elemento('Amerício', 'Am', 152, 1176.00, 2011.00);
CALL sp_add_elemento('Cúrio', 'Cm', 151, 1340.00, 3110.00);
CALL sp_add_elemento('Berquélio', 'Bk', 152, 986.00, 2627.00);
CALL sp_add_elemento('Califórnio', 'Cf', 153, 900.00, 1470.00);
CALL sp_add_elemento('Einstênio', 'Es', 153, 860.00, 996.00);
CALL sp_add_elemento('Férmio', 'Fm', 157, 1527.00, 0.00);
CALL sp_add_elemento('Mendelévio', 'Md', 157, 827.00, 0.00);
CALL sp_add_elemento('Nobélio', 'No', 157, 827.00, 0.00);
CALL sp_add_elemento('Laurêncio', 'Lr', 160, 1627.00, 0.00);
CALL sp_add_elemento('Rutherfórdio', 'Rf', 163, 0.00, 0.00);
CALL sp_add_elemento('Dúbnio', 'Db', 162, 0.00, 0.00);
CALL sp_add_elemento('Seabórgio', 'Sg', 165, 0.00, 0.00);
CALL sp_add_elemento('Bóhrio', 'Bh', 163, 0.00, 0.00);
CALL sp_add_elemento('Hássio', 'Hs', 169, 0.00, 0.00);
CALL sp_add_elemento('Meitnério', 'Mt', 170, 0.00, 0.00);
CALL sp_add_elemento('Darmstádio', 'Ds', 172, 0.00, 0.00);
CALL sp_add_elemento('Roentgênio', 'Rg', 171, 0.00, 0.00);
CALL sp_add_elemento('Copernício', 'Cn', 173, 0.00, 0.00);
CALL sp_add_elemento('Nihônio', 'Nh', 173, 0.00, 0.00);
CALL sp_add_elemento('Fleróvio', 'Fl', 175, 0.00, 0.00);
CALL sp_add_elemento('Moscóvio', 'Mc', 175, 0.00, 0.00);
CALL sp_add_elemento('Livermório', 'Lv', 177, 0.00, 0.00);
CALL sp_add_elemento('Tenesso', 'Ts', 176, 0.00, 0.00);
CALL sp_add_elemento('Oganessônio', 'Og', 176, 0.00, 0.00);
/*!40000 ALTER TABLE `elemento` ENABLE KEYS */;
UNLOCK TABLES;

COMMIT;

-- ===================================================================
--                   CONFIGURAÇÃO FINAL DA SESSÃO
-- ===================================================================

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump comple
