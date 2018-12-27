CREATE USER 'dev'@'localhost' IDENTIFIED BY 'dev';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON *.* TO 'dev'@'localhost';
CREATE DATABASE  IF NOT EXISTS `progetto` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `progetto`;
CREATE DATABASE  IF NOT EXISTS `progetto` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `progetto`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: progetto
-- ------------------------------------------------------
-- Server version	5.6.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `coordinatore`
--

DROP TABLE IF EXISTS `coordinatore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coordinatore` (
  `emailCoordinatore` varchar(50) NOT NULL,
  `password` varchar(64) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `codiceFiscale` varchar(16) NOT NULL,
  `via` varchar(100) NOT NULL,
  `ruolo` varchar(30) NOT NULL,
  `recapito` varchar(20) NOT NULL,
  `bio` varchar(500) DEFAULT NULL,
  `facolta` varchar(100) NOT NULL,
  PRIMARY KEY (`emailCoordinatore`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coordinatore`
--

LOCK TABLES `coordinatore` WRITE;
/*!40000 ALTER TABLE `coordinatore` DISABLE KEYS */;
INSERT INTO `coordinatore` VALUES ('fferrucci1@unisa.it','ff123456','Filomena','Ferrucci','FFFLMN80R10M082K','via niiiiiiiiiii','prof. ordinario','+39123456789',NULL,'Song a meglj'),('fferrucci2@unisa.it','ff123456','Filomena','Ferrucci','FFFLMN80R10M082K','via niiiiiiiiiii','prof. ordinario','+39123456789',NULL,'Song a meglj'),('fferrucci4@unisa.it','ff123456','Filomena','Ferrucci','FFFLMN80R10M082K','via niiiiiiiiiii','prof. ordinario','+39123456789','XdUYZl','Song a meglj'),('fferrucci5@unisa.it','ff123456','Filomena','Ferrucci','FFFLMN80R10M082K','via niiiiiiiiiii','prof. ordinario','+39123456789','zyukey','Song a meglj'),('fferrucci6@unisa.it','ff123456','Filomena','Ferrucci','FFFLMN80R10M082K','via niiiiiiiiiii','prof. ordinario','+39123456789','ExyPEH','Song a meglj'),('fferrucci7@unisa.it','ff123456','Filomena','Lb5th','FFFLMN80R10M082K','via niiiiiiiiiii','prof.ordinario','+39123456789','XOaFNnymtc','Song a megli');
/*!40000 ALTER TABLE `coordinatore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento`
--

DROP TABLE IF EXISTS `documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documento` (
  `idDocumento` int(8) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(5) NOT NULL,
  `titolo` varchar(100) NOT NULL,
  `contenuto` longblob NOT NULL,
  `idTimeline` int(8) NOT NULL,
  `emailCoordinatore` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idDocumento`),
  KEY `ID_Timeline` (`idTimeline`),
  KEY `Email_Coordinatore` (`emailCoordinatore`),
  CONSTRAINT `documento_ibfk_2` FOREIGN KEY (`emailCoordinatore`) REFERENCES `coordinatore` (`emailCoordinatore`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_idTimeline` FOREIGN KEY (`idTimeline`) REFERENCES `timeline` (`idTimeline`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento`
--

LOCK TABLES `documento` WRITE;
/*!40000 ALTER TABLE `documento` DISABLE KEYS */;
/*!40000 ALTER TABLE `documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `idPost` int(8) NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `ora` time NOT NULL,
  `tag` varchar(30) NOT NULL,
  `fissato` tinyint(1) NOT NULL,
  `emailStudente` varchar(50) DEFAULT NULL,
  `emailCoordinatore` varchar(50) DEFAULT NULL,
  `post` varchar(300) NOT NULL,
  PRIMARY KEY (`idPost`),
  KEY `Email_Studente` (`emailStudente`),
  KEY `Email_Coordinatore` (`emailCoordinatore`),
  CONSTRAINT `fk_emailCoordinatore` FOREIGN KEY (`emailCoordinatore`) REFERENCES `coordinatore` (`emailCoordinatore`),
  CONSTRAINT `fk_emailStudente` FOREIGN KEY (`emailStudente`) REFERENCES `studente` (`emailStudente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `risposta`
--

DROP TABLE IF EXISTS `risposta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `risposta` (
  `idRisposta` int(8) NOT NULL AUTO_INCREMENT,
  `risposta` varchar(300) NOT NULL,
  `data` date NOT NULL,
  `ora` time NOT NULL,
  `idPost` int(8) NOT NULL,
  `emailStudente` varchar(50) DEFAULT NULL,
  `emailCoordinatore` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idRisposta`),
  KEY `ID_Post` (`idPost`),
  KEY `Email_Studente` (`emailStudente`),
  KEY `Email_Coordinatore` (`emailCoordinatore`),
  CONSTRAINT `fk_idPost` FOREIGN KEY (`idPost`) REFERENCES `post` (`idPost`),
  CONSTRAINT `risposta_ibfk_2` FOREIGN KEY (`emailStudente`) REFERENCES `studente` (`emailStudente`),
  CONSTRAINT `risposta_ibfk_3` FOREIGN KEY (`emailCoordinatore`) REFERENCES `coordinatore` (`emailCoordinatore`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `risposta`
--

LOCK TABLES `risposta` WRITE;
/*!40000 ALTER TABLE `risposta` DISABLE KEYS */;
/*!40000 ALTER TABLE `risposta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studente`
--

DROP TABLE IF EXISTS `studente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `studente` (
  `emailStudente` varchar(50) NOT NULL,
  `password` varchar(64) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `codiceFiscale` varchar(16) NOT NULL,
  `via` varchar(100) NOT NULL,
  `recapito` varchar(20) NOT NULL,
  `facolta` varchar(100) NOT NULL,
  `matricola` varchar(10) NOT NULL,
  `status` enum('Normale','Partito','Tornato') NOT NULL,
  `bio` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`emailStudente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studente`
--

LOCK TABLES `studente` WRITE;
/*!40000 ALTER TABLE `studente` DISABLE KEYS */;
INSERT INTO `studente` VALUES ('pippo1@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale',NULL),('pippo2@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale',NULL),('pippo30@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale','BA5eZ'),('pippo31@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale','koDUL'),('pippo32@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale','s1gS0'),('pippo34@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della comunicazione','1098765432','Normale','8D7np'),('pippo38@studenti.unisa.it','pippoplutoepaper','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale','OU0FhmS8o5'),('pippo3@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale',NULL),('pippo50@studenti.unisa.it','pippoplutoepaperino','pippo','pluto','PPPPLT80R10M082K','via walt disney 23','+39123456789','Scienze della prenotazione','1098765432','Normale',NULL);
/*!40000 ALTER TABLE `studente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline`
--

DROP TABLE IF EXISTS `timeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeline` (
  `idTimeline` int(8) NOT NULL AUTO_INCREMENT,
  `Progresso` int(3) NOT NULL,
  `emailStudente` varchar(50) NOT NULL,
  `emailCoordinatore` varchar(50) NOT NULL,
  PRIMARY KEY (`idTimeline`),
  KEY `Email_Studente` (`emailStudente`),
  KEY `Email_Coordinatore` (`emailCoordinatore`),
  CONSTRAINT `timeline_ibfk_1` FOREIGN KEY (`emailStudente`) REFERENCES `studente` (`emailStudente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `timeline_ibfk_2` FOREIGN KEY (`emailCoordinatore`) REFERENCES `coordinatore` (`emailCoordinatore`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline`
--

LOCK TABLES `timeline` WRITE;
/*!40000 ALTER TABLE `timeline` DISABLE KEYS */;
/*!40000 ALTER TABLE `timeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vota`
--

DROP TABLE IF EXISTS `vota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vota` (
  `idVoto` int(8) NOT NULL AUTO_INCREMENT,
  `voto` decimal(1,1) NOT NULL,
  `idPost` int(8) NOT NULL,
  `emailStudente` varchar(50) DEFAULT NULL,
  `emailCoordinatore` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idVoto`),
  KEY `ID_Post` (`idPost`),
  KEY `Email_Studente` (`emailStudente`),
  KEY `Email_Coordinatore` (`emailCoordinatore`),
  CONSTRAINT `fk_vota_idPost` FOREIGN KEY (`idPost`) REFERENCES `post` (`idPost`),
  CONSTRAINT `vota_ibfk_2` FOREIGN KEY (`emailStudente`) REFERENCES `studente` (`emailStudente`),
  CONSTRAINT `vota_ibfk_3` FOREIGN KEY (`emailCoordinatore`) REFERENCES `coordinatore` (`emailCoordinatore`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vota`
--

LOCK TABLES `vota` WRITE;
/*!40000 ALTER TABLE `vota` DISABLE KEYS */;
/*!40000 ALTER TABLE `vota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votazione`
--

DROP TABLE IF EXISTS `votazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votazione` (
  `idTimeline` int(8) NOT NULL,
  `emailStudente` varchar(50) NOT NULL,
  `nomeEsame` varchar(50) NOT NULL,
  `voto` int(2) NOT NULL,
  PRIMARY KEY (`idTimeline`,`emailStudente`),
  KEY `Email_Studente` (`emailStudente`),
  CONSTRAINT `fk_votazione_idTimeline` FOREIGN KEY (`idTimeline`) REFERENCES `timeline` (`idTimeline`),
  CONSTRAINT `votazione_ibfk_2` FOREIGN KEY (`emailStudente`) REFERENCES `studente` (`emailStudente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votazione`
--

LOCK TABLES `votazione` WRITE;
/*!40000 ALTER TABLE `votazione` DISABLE KEYS */;
/*!40000 ALTER TABLE `votazione` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-22 18:51:01
