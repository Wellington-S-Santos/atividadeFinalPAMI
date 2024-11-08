create database crudApi;
use crudApi;

CREATE TABLE `crudApi`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cpf` varchar (12) NULL,
  `nome` VARCHAR(45) NULL,
  `idade` INT NULL,
  `cep` VARCHAR (8) NULL,
  `endereco` VARCHAR (20) NULL,
  `numero`INT NULL,
  PRIMARY KEY (`id`, `cpf`),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ) );
