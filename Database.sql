SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `progetto` ;

CREATE SCHEMA IF NOT EXISTS `progetto` DEFAULT CHARACTER SET utf8 ;
USE `progetto` ;

DROP TABLE IF EXISTS `progetto`.`coordinatore` ;

CREATE TABLE IF NOT EXISTS `progetto`.`coordinatore` (
  `Email_Coordinatore` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(16) NOT NULL,
  `Nome` VARCHAR(100) NOT NULL,
  `Cognome` VARCHAR(100) NOT NULL,
  `Codice_Fiscale` VARCHAR(16) NOT NULL,
  `Via` VARCHAR(100) NOT NULL,
  `Recapito` VARCHAR(20) NOT NULL,
  `Ruolo` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`Email_Coordinatore`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `progetto`.`studente` ;

CREATE TABLE IF NOT EXISTS `progetto`.`studente` (
  `Email_Studente` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(16) NOT NULL,
  `Nome` VARCHAR(100) NOT NULL,
  `Cognome` VARCHAR(100) NOT NULL,
  `Codice_Fiscale` VARCHAR(16) NOT NULL,
  `Via` VARCHAR(100) NOT NULL,
  `Recapito` VARCHAR(20) NOT NULL,
  `Facoltà` VARCHAR(100) NOT NULL,
  `Matricola` VARCHAR(10) NOT NULL,
  `Status` ENUM('Normale', 'Partito', 'Tornato') NOT NULL,
  PRIMARY KEY (`Email_Studente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `progetto`.`timeline` ;

CREATE TABLE IF NOT EXISTS `progetto`.`timeline` (
  `ID_Timeline` INT(8) NOT NULL,
  `Progresos` INT(3) NOT NULL,
  `Email_Studente` VARCHAR(50) NOT NULL,
  `Email_Coordinatore` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`ID_Timeline`),
  INDEX `Email_Studente` (`Email_Studente` ASC),
  INDEX `Email_Coordinatore` (`Email_Coordinatore` ASC),
  CONSTRAINT `timeline_ibfk_1`
    FOREIGN KEY (`Email_Studente`)
    REFERENCES `progetto`.`studente` (`Email_Studente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `timeline_ibfk_2`
    FOREIGN KEY (`Email_Coordinatore`)
    REFERENCES `progetto`.`coordinatore` (`Email_Coordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `progetto`.`documento` ;

CREATE TABLE IF NOT EXISTS `progetto`.`documento` (
  `ID_Documento` INT(8) NOT NULL,
  `Tipo` VARCHAR(5) NOT NULL,
  `Titolo` VARCHAR(100) NOT NULL,
  `Contenuto` LONGBLOB NOT NULL,
  `ID_Timeline` INT(8) NOT NULL,
  `Email_Coordinatore` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Documento`),
  INDEX `ID_Timeline` (`ID_Timeline` ASC),
  INDEX `Email_Coordinatore` (`Email_Coordinatore` ASC),
  CONSTRAINT `documento_ibfk_1`
    FOREIGN KEY (`ID_Timeline`)
    REFERENCES `progetto`.`timeline` (`ID_Timeline`),
  CONSTRAINT `documento_ibfk_2`
    FOREIGN KEY (`Email_Coordinatore`)
    REFERENCES `progetto`.`coordinatore` (`Email_Coordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `progetto`.`post` ;

CREATE TABLE IF NOT EXISTS `progetto`.`post` (
  `ID_Post` INT(8) NOT NULL,
  `Data` DATE NOT NULL,
  `Ora` TIME NOT NULL,
  `Tag` VARCHAR(30) NOT NULL,
  `Fissato` TINYINT(1) NOT NULL,
  `Email_Studente` VARCHAR(50) NULL DEFAULT NULL,
  `Email_Coordinatore` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Post`),
  INDEX `Email_Studente` (`Email_Studente` ASC),
  INDEX `Email_Coordinatore` (`Email_Coordinatore` ASC),
  CONSTRAINT `post_ibfk_1`
    FOREIGN KEY (`Email_Studente`)
    REFERENCES `progetto`.`studente` (`Email_Studente`),
  CONSTRAINT `post_ibfk_2`
    FOREIGN KEY (`Email_Coordinatore`)
    REFERENCES `progetto`.`coordinatore` (`Email_Coordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `progetto`.`risposta` ;

CREATE TABLE IF NOT EXISTS `progetto`.`risposta` (
  `ID_Risposta` INT(8) NOT NULL,
  `Risposta` VARCHAR(300) NOT NULL,
  `Data` DATE NOT NULL,
  `Ora` TIME NOT NULL,
  `ID_Post` INT(8) NOT NULL,
  `Email_Studente` VARCHAR(50) NULL DEFAULT NULL,
  `Email_Coordinatore` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Risposta`),
  INDEX `ID_Post` (`ID_Post` ASC),
  INDEX `Email_Studente` (`Email_Studente` ASC),
  INDEX `Email_Coordinatore` (`Email_Coordinatore` ASC),
  CONSTRAINT `risposta_ibfk_1`
    FOREIGN KEY (`ID_Post`)
    REFERENCES `progetto`.`post` (`ID_Post`),
  CONSTRAINT `risposta_ibfk_2`
    FOREIGN KEY (`Email_Studente`)
    REFERENCES `progetto`.`studente` (`Email_Studente`),
  CONSTRAINT `risposta_ibfk_3`
    FOREIGN KEY (`Email_Coordinatore`)
    REFERENCES `progetto`.`coordinatore` (`Email_Coordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `progetto`.`vota` ;

CREATE TABLE IF NOT EXISTS `progetto`.`vota` (
  `ID_Voto` INT(8) NOT NULL,
  `Voto` DECIMAL(1,1) NOT NULL,
  `ID_Post` INT(8) NOT NULL,
  `Email_Studente` VARCHAR(50) NULL DEFAULT NULL,
  `Email_Coordinatore` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`ID_Voto`),
  INDEX `ID_Post` (`ID_Post` ASC),
  INDEX `Email_Studente` (`Email_Studente` ASC),
  INDEX `Email_Coordinatore` (`Email_Coordinatore` ASC),
  CONSTRAINT `vota_ibfk_1`
    FOREIGN KEY (`ID_Post`)
    REFERENCES `progetto`.`post` (`ID_Post`),
  CONSTRAINT `vota_ibfk_2`
    FOREIGN KEY (`Email_Studente`)
    REFERENCES `progetto`.`studente` (`Email_Studente`),
  CONSTRAINT `vota_ibfk_3`
    FOREIGN KEY (`Email_Coordinatore`)
    REFERENCES `progetto`.`coordinatore` (`Email_Coordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `progetto`.`votazione` ;

CREATE TABLE IF NOT EXISTS `progetto`.`votazione` (
  `ID_Timeline` INT(8) NOT NULL,
  `Email_Coordinatore` VARCHAR(50) NOT NULL,
  `Nome_Esame` VARCHAR(50) NOT NULL,
  `Voto` INT(2) NOT NULL,
  PRIMARY KEY (`ID_Timeline`, `Email_Coordinatore`),
  INDEX `Email_Coordinatore` (`Email_Coordinatore` ASC),
  CONSTRAINT `votazione_ibfk_1`
    FOREIGN KEY (`ID_Timeline`)
    REFERENCES `progetto`.`timeline` (`ID_Timeline`),
  CONSTRAINT `votazione_ibfk_2`
    FOREIGN KEY (`Email_Coordinatore`)
    REFERENCES `progetto`.`coordinatore` (`Email_Coordinatore`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
