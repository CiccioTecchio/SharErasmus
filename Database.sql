-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema progetto
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema progetto
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `progetto` DEFAULT CHARACTER SET utf8 ;
USE `progetto` ;

-- -----------------------------------------------------
-- Table `progetto`.`coordinatore`
-- -----------------------------------------------------
DROP TABLE IF EXISTS 'progetto'.'coordinatore' ;

CREATE TABLE IF NOT EXISTS `progetto`.`coordinatore` (
  `emailCoordinatore` VARCHAR(50) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `cognome` VARCHAR(100) NOT NULL,
  `codiceFiscale` VARCHAR(16) NOT NULL,
  `via` VARCHAR(100) NOT NULL,
  `ruolo` VARCHAR(30) NOT NULL,
  `recapito` VARCHAR(20) NOT NULL,
  `bio` VARCHAR(500) NULL DEFAULT NULL,
  `facolta` VARCHAR(100) NOT NULL,
  `imgProfilo` LONGBLOB NULL,
  PRIMARY KEY (`emailCoordinatore`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `progetto`.`studente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS 'progetto'.'studente' ;

CREATE TABLE IF NOT EXISTS `progetto`.`studente` (
  `emailStudente` VARCHAR(50) NOT NULL,
  `password` VARCHAR(64) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `cognome` VARCHAR(100) NOT NULL,
  `codiceFiscale` VARCHAR(16) NOT NULL,
  `via` VARCHAR(100) NOT NULL,
  `recapito` VARCHAR(20) NOT NULL,
  `facolta` VARCHAR(100) NOT NULL,
  `matricola` VARCHAR(10) NOT NULL,
  `status` ENUM('Normale', 'Partito', 'Tornato') NOT NULL,
  `bio` VARCHAR(500) NULL DEFAULT NULL,
  `imgProfilo` LONGBLOB NULL,
  PRIMARY KEY (`emailStudente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `progetto`.`timeline`
-- -----------------------------------------------------
DROP TABLE IF EXISTS 'progetto'.'timeline' ;

CREATE TABLE IF NOT EXISTS `progetto`.`timeline` (
  `idTimeline` INT(8) NOT NULL AUTO_INCREMENT,
  `progresso` INT(3) NOT NULL,
  `emailStudente` VARCHAR(50) NOT NULL,
  `emailCoordinatore` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idTimeline`),
  INDEX `Email_Studente` (`emailStudente` ASC),
  INDEX `Email_Coordinatore` (`emailCoordinatore` ASC),
  CONSTRAINT `timeline_ibfk_1`
    FOREIGN KEY (`emailStudente`)
    REFERENCES `progetto`.`studente` (`emailStudente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `timeline_ibfk_2`
    FOREIGN KEY (`emailCoordinatore`)
    REFERENCES `progetto`.`coordinatore` (`emailCoordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `progetto`.`documento`
-- -----------------------------------------------------
DROP TABLE IF EXISTS 'progetto'.'documento' ;

CREATE TABLE IF NOT EXISTS `progetto`.`documento` (
  `idDocumento` INT(8) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(5) NOT NULL,
  `titolo` VARCHAR(100) NOT NULL,
  `contenuto` LONGBLOB NOT NULL,
  `idTimeline` INT(8) NOT NULL,
  `emailCoordinatore` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`idDocumento`),
  INDEX `ID_Timeline` (`idTimeline` ASC),
  INDEX `Email_Coordinatore` (`emailCoordinatore` ASC),
  CONSTRAINT `documento_ibfk_2`
    FOREIGN KEY (`emailCoordinatore`)
    REFERENCES `progetto`.`coordinatore` (`emailCoordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idTimeline`
    FOREIGN KEY (`idTimeline`)
    REFERENCES `progetto`.`timeline` (`idTimeline`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `progetto`.`post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS 'progetto'.'post' ;

CREATE TABLE IF NOT EXISTS `progetto`.`post` (
  `idPost` INT(8) NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `ora` TIME NOT NULL,
  `tag` VARCHAR(30) NOT NULL,
  `fissato` TINYINT(1) NOT NULL,
  `emailStudente` VARCHAR(50) NULL DEFAULT NULL,
  `emailCoordinatore` VARCHAR(50) NULL DEFAULT NULL,
  `post` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`idPost`),
  INDEX `Email_Studente` (`emailStudente` ASC),
  INDEX `Email_Coordinatore` (`emailCoordinatore` ASC),
  CONSTRAINT `fk_emailCoordinatore`
    FOREIGN KEY (`emailCoordinatore`)
    REFERENCES `progetto`.`coordinatore` (`emailCoordinatore`),
  CONSTRAINT `fk_emailStudente`
    FOREIGN KEY (`emailStudente`)
    REFERENCES `progetto`.`studente` (`emailStudente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `progetto`.`risposta`
-- -----------------------------------------------------

DROP TABLE IF EXISTS 'progetto'.'risposta' ;

CREATE TABLE IF NOT EXISTS `progetto`.`risposta` (
  `idRisposta` INT(8) NOT NULL AUTO_INCREMENT,
  `risposta` VARCHAR(300) NOT NULL,
  `data` DATE NOT NULL,
  `ora` TIME NOT NULL,
  `idPost` INT(8) NOT NULL,
  `emailStudente` VARCHAR(50) NULL DEFAULT NULL,
  `emailCoordinatore` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`idRisposta`),
  INDEX `ID_Post` (`idPost` ASC),
  INDEX `Email_Studente` (`emailStudente` ASC),
  INDEX `Email_Coordinatore` (`emailCoordinatore` ASC),
  CONSTRAINT `fk_idPost`
    FOREIGN KEY (`idPost`)
    REFERENCES `progetto`.`post` (`idPost`),
  CONSTRAINT `risposta_ibfk_2`
    FOREIGN KEY (`emailStudente`)
    REFERENCES `progetto`.`studente` (`emailStudente`),
  CONSTRAINT `risposta_ibfk_3`
    FOREIGN KEY (`emailCoordinatore`)
    REFERENCES `progetto`.`coordinatore` (`emailCoordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `progetto`.`vota`
-- -----------------------------------------------------
DROP TABLE IF EXISTS 'progetto'.'vota' ;

CREATE TABLE IF NOT EXISTS `progetto`.`vota` (
  `idVoto` INT(8) NOT NULL AUTO_INCREMENT,
  `voto` DECIMAL(1,1) NOT NULL,
  `idPost` INT(8) NOT NULL,
  `emailStudente` VARCHAR(50) NULL DEFAULT NULL,
  `emailCoordinatore` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`idVoto`),
  INDEX `ID_Post` (`idPost` ASC),
  INDEX `Email_Studente` (`emailStudente` ASC),
  INDEX `Email_Coordinatore` (`emailCoordinatore` ASC),
  CONSTRAINT `fk_vota_idPost`
    FOREIGN KEY (`idPost`)
    REFERENCES `progetto`.`post` (`idPost`),
  CONSTRAINT `vota_ibfk_2`
    FOREIGN KEY (`emailStudente`)
    REFERENCES `progetto`.`studente` (`emailStudente`),
  CONSTRAINT `vota_ibfk_3`
    FOREIGN KEY (`emailCoordinatore`)
    REFERENCES `progetto`.`coordinatore` (`emailCoordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `progetto`.`votazione`
-- -----------------------------------------------------

DROP TABLE IF EXISTS 'progetto'.'votazione' ;

CREATE TABLE IF NOT EXISTS `progetto`.`votazione` (
  `idTimeline` INT(8) NOT NULL,
  `emailStudente` VARCHAR(50) NOT NULL,
  `nomeEsame` VARCHAR(50) NOT NULL,
  `voto` INT(2) NOT NULL,
  PRIMARY KEY (`idTimeline`, `emailStudente`),
  INDEX `Email_Studente` (`emailStudente` ASC),
  CONSTRAINT `fk_votazione_idTimeline`
    FOREIGN KEY (`idTimeline`)
    REFERENCES `progetto`.`timeline` (`idTimeline`),
  CONSTRAINT `votazione_ibfk_2`
    FOREIGN KEY (`emailStudente`)
    REFERENCES `progetto`.`studente` (`emailStudente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
