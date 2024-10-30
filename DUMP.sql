DROP DATABASE IF EXISTS mini_projeto_ebd2;
CREATE DATABASE mini_projeto_ebd2;
USE mini_projeto_ebd2;
DROP TABLE IF EXISTS mini_projeto_ebd2.products;
CREATE TABLE mini_projeto_ebd2.products(
	id INT not null primary key auto_increment,
    name varchar(50) not null,
    price decimal(10,2) not null default 0,
    description varchar(500) not null
);

INSERT INTO mini_projeto_ebd2.products (
	name,
    price,
    description
) VALUES (
	'ROLEX SUBMARINER',
    12000,
    'Descrição do relógio de pulso'
);

INSERT INTO mini_projeto_ebd2.products (
	name,
    price,
    description
) VALUES (
	'ROLEX DAYTONA',
    230000,
    'Descrição do relógio de pulso'
);
