CREATE TABLE paciente (
	numero_identificacion varchar(30) NOT NULL,
	nombre varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	CONSTRAINT paciente_PK PRIMARY KEY (numero_identificacion)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;

CREATE TABLE citas (
	id INT auto_increment NOT NULL,
	numero_identificacion varchar(100) NOT NULL,
	hora_fecha DATETIME NOT NULL,
	CONSTRAINT citas_PK PRIMARY KEY (id),
	CONSTRAINT citas_FK FOREIGN KEY (numero_identificacion) REFERENCES paciente(numero_identificacion)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
