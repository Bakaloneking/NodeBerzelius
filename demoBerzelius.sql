CREATE DATABASE  IF NOT EXISTS `demoBerzelius` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `demoBerzelius`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `elemento`
--

DROP TABLE IF EXISTS `elemento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elemento` (
  `eleid` int unsigned NOT NULL AUTO_INCREMENT, -- ID do elemento e número atômico
  `elenome` varchar(255) NOT NULL, -- Nome do Elemento
  `eleprotons` int unsigned DEFAULT 0, -- qtd de Prótons
  `eleneutrons` int unsigned NOT NULL DEFAULT 0, -- qtd de Neutrons
  `eleeletrons` int unsigned DEFAULT 0, -- qtd de Elétrons
  `eleserid` int unsigned DEFAULT 0, -- Série do Elemento
  `eleesfiid` int unsigned DEFAULT 0, -- Estado do Elemento em temperatura ?natural?
  `elepfusa` double(5,2) NOT NULL DEFAULT 0,
  `elepebul` double(5,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`eleid`),
  KEY `eleprotons` (`eleprotons`),
  KEY `eleserid` (`eleserid`),
  KEY `eleesfiid` (`eleesfiid`),
  CONSTRAINT `elemento_ibfk_1` FOREIGN KEY (`eleprotons`) REFERENCES `elemento` (`eleid`),
  CONSTRAINT `elemento_ibfk_2` FOREIGN KEY (`eleserid`) REFERENCES `serie` (`serid`),
  CONSTRAINT `elemento_ibfk_3` FOREIGN KEY (`eleesfiid`) REFERENCES `estafisi` (`estafisiid`)
  
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping procedures for table `elemento`
--

DROP PROCEDURE IF EXISTS sp_add_elemento;
DELIMITER $$
CREATE PROCEDURE sp_add_elemento(p_nome varchar(255), p_neutrons int, p_pfusa double, p_pebul double)
BEGIN
	INSERT INTO `elemento` (`elenome`,`eleneutrons`,`elepfusa`,`elepebul`) VALUES (p_nome, p_neutrons, p_pfusa, p_pebul);
	UPDATE `elemento`
		SET `eleprotons` = (select f_f_idelemento(p_nome)),
        `eleeletrons` = (select f_f_idelemento(p_nome)),
        `eleesfiid` = (select f_f_estadofisico( 0, p_pfusa, p_pebul)),
        `eleserid` = (select f_f_serie(p_nome))
		WHERE `eleid` = (select f_f_idelemento(p_nome));
END $$
DELIMITER ;


--
-- Dumping functions for table `elemento`
--

DROP FUNCTION IF EXISTS f_f_idelemento;
DELIMITER $$
CREATE FUNCTION f_f_idelemento(p_nome varchar(255)) RETURNS INT
deterministic
BEGIN
	declare v_num tinyint unsigned default 0;
	set v_num = (select eleid
			from elemento
			where elenome = p_nome);
	RETURN v_num;
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS f_f_estadofisico;
DELIMITER $$
CREATE FUNCTION f_f_estadofisico(p_temp double, p_pfusa double, p_pebul double) RETURNS INT
deterministic
BEGIN
	declare v_estfis tinyint unsigned default 0;
	IF  p_pebul < p_temp then
		set v_estfis = 3;
    ELSEIF p_pfusa < p_temp then
		set v_estfis = 2;
	ELSE 
		set v_estfis = 1;
    END IF;
    RETURN v_estfis;
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS f_f_serie;
DELIMITER $$
CREATE FUNCTION f_f_serie(p_nome varchar(255)) RETURNS INT
deterministic
BEGIN
	declare v_serie tinyint unsigned default 0;
    declare v_neutrons tinyint unsigned default 0;
    set v_neutrons = (select f_f_idelemento(p_nome));
	IF v_neutrons in (1,6,7,8,9,15,16,17,34,35,35) then
		set v_serie = 1;
    ELSEIF v_neutrons in (3,11,19,37,55,87) then
		set v_serie = 2;
	ELSEIF v_neutrons in (4,12,20,38,56,88) then
		set v_serie = 3;
	ELSEIF v_neutrons in (21,22,23,24,25,26,27,28,29,30,39,40,41,42,43,44,45,46,47,48,72,73,74,75,76,77,78,79,80,104,105,106,107,108) then
		set v_serie = 4;
	ELSEIF v_neutrons in (5,14,32,33,51,52,85) then
		set v_serie = 5;
	ELSEIF v_neutrons in (13,31,49,50,81,82,83,84) then
		set v_serie = 6;
	ELSEIF v_neutrons in (2,10,18,36,54,86,118) then
		set v_serie = 7;
	ELSEIF v_neutrons in (57,58,59,60,61,62,63,64,65,66,67,68,69,70,71) then
		set v_serie = 8;
	ELSEIF v_neutrons in (89,90,91,92,93,94,95,96,97,98,99,100,101,102,103) then
		set v_serie = 9;
    ELSE 
		set v_serie = 0;
    END IF;
    RETURN v_serie;
END $$
DELIMITER ;

--
-- Dumping trigers for table `elemento`
--

DROP TRIGGER IF EXISTS t_nomenovo_elemento;
DELIMITER $$
CREATE TRIGGER t_nomenovo_elemento BEFORE INSERT ON elemento 
FOR EACH ROW
BEGIN
	if EXISTS (SELECT * FROM elemento WHERE elenome = NEW.elenome) then
		SIGNAL SQLSTATE '85555' SET message_text = 'ERRO, elemento já esta na tabela';
    end if;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS t_distele_elemento;
DELIMITER $$
CREATE TRIGGER t_distele_elemento AFTER INSERT ON elemento 
FOR EACH ROW
BEGIN
	declare v_letra char default 'k';
    declare v_cont tinyint unsigned default 0;
    while v_cont < 7 do
	INSERT INTO `distelet` (`disteletid`,`discamaeletid`) VALUES ((select f_f_idelemento(new.elenome)),v_letra);
    set v_cont = v_cont+1;
    set v_letra = (SELECT CONVERT(char(ascii(v_letra)+1), char));
    end while;
END $$
DELIMITER ;

--
-- Table structure for table `serie`
--

DROP TABLE IF EXISTS `serie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serie` (
  `serid` int unsigned NOT NULL DEFAULT '0', -- ID da Série
  `serdescricao` varchar(40) NOT NULL, -- Nome da Série
  PRIMARY KEY (`serid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serie`
--

LOCK TABLES `serie` WRITE;
/*!40000 ALTER TABLE `serie` DISABLE KEYS */;
INSERT INTO `serie` VALUES (0,'Desconhecido'),(1,'Não Metais'),(2,'Alcalinos'),(3,'Alcalinos Terrosos'),(4,'Metais de Transição Externa'),(5,'Semimetais'),(6,'Representativos'),(7,'Gases Nobres'),(8,'Lantanoides'),(9,'Actinoides');
/*!40000 ALTER TABLE `serie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadofisico`
--

DROP TABLE IF EXISTS `estafisi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estafisi` (
  `estafisiid` int unsigned NOT NULL DEFAULT '0', -- ID do Estado Fisico
  `estafisidescricao` varchar(40) NOT NULL, -- Nome do Estado Fisico
  PRIMARY KEY (`estafisiid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadofisico`
--

LOCK TABLES `estafisi` WRITE;
/*!40000 ALTER TABLE `estafisi` DISABLE KEYS */;
INSERT INTO `estafisi` VALUES (0,'Erro'),(1,'Sólido'),(2,'Líquido'),(3,'Gasoso');
/*!40000 ALTER TABLE `estafisi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camada eletronica`
--

DROP TABLE IF EXISTS `camaelet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camaelet` (
  `camaeletid` int unsigned NOT NULL DEFAULT '0', -- ID do Estado Fisico
  `kcamaelet` tinyint DEFAULT 0, -- Camada Eletronica K
  `lcamaelet` tinyint DEFAULT 0, -- Camada Eletronica L
  `mcamaelet` tinyint DEFAULT 0, -- Camada Eletronica M
  `ncamaelet` tinyint DEFAULT 0, -- Camada Eletronica N
  `ocamaelet` tinyint DEFAULT 0, -- Camada Eletronica O
  `pcamaelet` tinyint DEFAULT 0, -- Camada Eletronica P
  `qcamaelet` tinyint DEFAULT 0, -- Camada Eletronica Q
  PRIMARY KEY (`camaeletid`),
  CONSTRAINT `camaelet_ibfk_1` FOREIGN KEY (`camaeletid`) REFERENCES `elemento` (`eleid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camada eletronica`
--

LOCK TABLES `camaelet` WRITE;
/*!40000 ALTER TABLE `camaelet` DISABLE KEYS */;
-- INSERT INTO `distelet` VALUES (0,'Erro'),(1,'K'),(2,'L'),(3,'M'),(4,'N'),(5,'O'),(6,'P'),(7,'Q');
/*!40000 ALTER TABLE `camaelet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distribuição eletronica`
--

DROP TABLE IF EXISTS `distelet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distelet` (
  `disteletid` int unsigned NOT NULL DEFAULT '0', -- ID do Estado Fisico
  `discamaeletid` char DEFAULT '', 
  `sdistelet` tinyint DEFAULT 0, -- subCamada Eletronica s
  `pdistelet` tinyint DEFAULT 0, -- subCamada Eletronica p
  `ddistelet` tinyint DEFAULT 0, -- subCamada Eletronica d
  `fdistelet` tinyint DEFAULT 0, -- subCamada Eletronica f
  -- PRIMARY KEY (`disteletid`, `discamaeletid`),
  CONSTRAINT `distelet_ibfk_1` FOREIGN KEY (`disteletid`) REFERENCES `elemento` (`eleid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camada eletronica`
--

LOCK TABLES `distelet` WRITE;
/*!40000 ALTER TABLE `distelet` DISABLE KEYS */;
-- INSERT INTO `distelet` (`disteletid`,`discamaeletid`) VALUES ((select f_f_idelemento('Hidrogênio')),'k');
/*!40000 ALTER TABLE `distelet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `elemento`
--

LOCK TABLES `elemento` WRITE;
/*!40000 ALTER TABLE `elemento` DISABLE KEYS */;
call sp_add_elemento('Hidrogênio',0,-259.1,-252.9);
call sp_add_elemento('Hélio',2,-272,-269);
call sp_add_elemento('Lítio',3,180.54,1342);
call sp_add_elemento('Berílio',5,1287,2470);
/*!40000 ALTER TABLE `elemento` ENABLE KEYS */;
UNLOCK TABLES;

-- Gerenciamento de Aulas --

--
-- Table structure for table `aulas`
--

DROP TABLE IF EXISTS `aulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `aulas` (
`aulasid` INTEGER NOT NULL auto_increment , 
`aullab` VARCHAR(255),
`aulprof` VARCHAR(255),
`aulturma` VARCHAR(255),
`aultema` TEXT,
`auldia` VARCHAR(255),
`aulhora` VARCHAR(255),
`aulcreatedAtaul` DATETIME NOT NULL, 
`aulupdatedAtaul` DATETIME NOT NULL, 
PRIMARY KEY (`aulasid`)) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping Procedure for table `aulas`
--

DROP PROCEDURE IF EXISTS sp_add_aula;
DELIMITER $$
CREATE PROCEDURE sp_add_aula(p_lab varchar(255), p_prof varchar(255), p_turma varchar(255), p_tema text, p_dia varchar(255), p_hora varchar(255))
BEGIN
	INSERT INTO `aulas` (`aullab`,`aulprof`,`aulturma`,`aultema`,`auldia`, `aulhora`,`aulcreatedAtaul`,`aulupdatedAtaul`) VALUES (p_lab, p_prof, p_turma, p_tema, p_dia, p_hora, now(), now());
END $$
DELIMITER ;

--
-- Dumping data for table `aulas`
--



--
-- Table structure for table `turmas`
--

DROP TABLE IF EXISTS `turmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `turmas` (
`turmid` INTEGER NOT NULL, -- id da Turma
`turnome` VARCHAR(255), -- Nome de indentificação da turma
`turmcreatedAt` DATETIME NOT NULL, 
`turmupdatedAt` DATETIME NOT NULL, 
PRIMARY KEY (`turmid`)) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turmas`
--



--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `usuario` (
`usuid` INTEGER NOT NULL AUTO_INCREMENT, 
`usunome` VARCHAR(255),
`usucargo` TINYINT DEFAULT 0,
`usuemail` VARCHAR(255) NOT NULL,
`ususenha` VARCHAR(255) NOT NULL,
`usucreatedAt` DATETIME NOT NULL, 
`usuupdatedAt` DATETIME NOT NULL, 
PRIMARY KEY (`usuid`)) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping Procedure for table `usuario`
--

DROP PROCEDURE IF EXISTS sp_add_usuario;
DELIMITER $$
CREATE PROCEDURE sp_add_usuario(p_nome VARCHAR(255), p_cargo TINYINT, p_email VARCHAR(255), p_senha VARCHAR(255))
BEGIN
	INSERT INTO `usuario` (`usunome`,`usucargo`,`usuemail`,`ususenha`,`usucreatedAt`,`usuupdatedAt`) VALUES (p_nome, p_cargo, p_email, AES_ENCRYPT(p_senha,'CHAVE'), now(), now());
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_m_cargo;
DELIMITER $$
CREATE PROCEDURE sp_m_cargo()
BEGIN
	select `usunome` 'Nome', `cargnome` 'Cargo'
	from `usuario`
    inner join `cargos` on `cargid` = `usucargo`;
END $$
DELIMITER ;


--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
call sp_add_usuario('Carlos',0,'adm@email.com','2024');
call sp_add_usuario('Deborah',0,'adm@email.com','2024');
call sp_add_usuario('Jorge',0,'adm@email.com','2024');
call sp_add_usuario('Manoel',0,'adm@email.com','2024');
call sp_add_usuario('Gustavo',0,'adm@email.com','2024');
call sp_add_usuario('Esmeralda',0,'adm@email.com','2024');
call sp_add_usuario('Larisa',0,'adm@email.com','2024');
call sp_add_usuario('Thamiris',1,'tec@email.com','tecnico');
call sp_add_usuario('Marcos',1,'tec@email.com','tecnico');
call sp_add_usuario('João',1,'tec@email.com','tecnico');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `Cargos`
--

DROP TABLE IF EXISTS `cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `cargos` (
`cargid` INTEGER NOT NULL AUTO_INCREMENT, 
`cargnome` VARCHAR(255),
PRIMARY KEY (`cargid`)) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `cargos`
--

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
INSERT INTO `cargos` (`cargid`,`cargnome`) VALUES (0, 'Sem Cargo');
INSERT INTO `cargos` (`cargid`,`cargnome`) VALUES (1, 'Tecnico');
INSERT INTO `cargos` (`cargid`,`cargnome`) VALUES (2, 'Professor');
INSERT INTO `cargos` (`cargid`,`cargnome`) VALUES (3, 'Aluno');
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;
UNLOCK TABLES;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 20:40