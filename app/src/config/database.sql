-- ==========================================
-- 1. LIMPEZA E CRIAÇÃO DO BANCO
-- ==========================================
DROP DATABASE IF EXISTS UCHOA_MARKET;
CREATE DATABASE UCHOA_MARKET;
USE UCHOA_MARKET;

-- ==========================================
-- 2. TABELAS DE CADASTRO BASE
-- ==========================================

CREATE TABLE Clientes (
    IdCliente INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    Telefone VARCHAR(15),
    Email VARCHAR(255) UNIQUE,
    Senha VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE Administradores (
    IdAdmin INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Telefone VARCHAR(15),
    CaminhoImagem VARCHAR(255),
    Cargo VARCHAR(100)
) ENGINE=InnoDB;

CREATE TABLE Empresas (
    IdEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    Telefone VARCHAR(15),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Senha VARCHAR(255) NOT NULL,
    Bairro VARCHAR(100),
    Rua VARCHAR(150),
    Cep VARCHAR(10)
) ENGINE=InnoDB;

CREATE TABLE Categorias (
    IdCategoria INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL,
    Descricao VARCHAR(255)
) ENGINE=InnoDB;

-- ==========================================
-- 3. TABELAS COM DEPENDÊNCIAS
-- ==========================================

CREATE TABLE Enderecos (
    IdEndereco INT PRIMARY KEY AUTO_INCREMENT,
    Rua VARCHAR(255),
    Cep VARCHAR(10),
    Bairro VARCHAR(100),
    Complemento VARCHAR(100),
    IdCliente INT,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Mesas (
    IdMesa INT PRIMARY KEY AUTO_INCREMENT,
    UUID VARCHAR(100) UNIQUE NOT NULL,
    ClienteAtual VARCHAR(100) DEFAULT NULL,
    Status ENUM('Livre', 'Ocupada', 'Atendimento', 'Reservada') DEFAULT 'Livre',
    Total DECIMAL(10,2) DEFAULT 0.00,
    IdEmpresa INT NOT NULL,
    FOREIGN KEY (IdEmpresa) REFERENCES Empresas(IdEmpresa) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Produtos (
    IdProduto INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(255) NOT NULL,
    Descricao TEXT,
    Preco DECIMAL(10,2) NOT NULL,
    Estoque INT DEFAULT 0,
    CaminhoImagem VARCHAR(255),
    IdCategoria INT,
    IdEmpresa INT NOT NULL,
    FOREIGN KEY (IdCategoria) REFERENCES Categorias(IdCategoria) ON DELETE SET NULL,
    FOREIGN KEY (IdEmpresa) REFERENCES Empresas(IdEmpresa) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Pedidos (
    IdPedido INT PRIMARY KEY AUTO_INCREMENT,
    DataPedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pendente', 'Em Preparo', 'Entregue', 'Finalizado', 'Cancelado') DEFAULT 'Pendente',
    ValorTotal DECIMAL(10,2) DEFAULT 0.00,
    IdEmpresa INT NOT NULL,
    IdMesa INT,
    FOREIGN KEY (IdEmpresa) REFERENCES Empresas(IdEmpresa) ON DELETE CASCADE,
    FOREIGN KEY (IdMesa) REFERENCES Mesas(IdMesa) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ItensPedidos (
    IdItemPedido INT PRIMARY KEY AUTO_INCREMENT,
    IdPedido INT NOT NULL,
    IdProduto INT NOT NULL,
    IdCliente INT NULL,
    Quantidade INT NOT NULL DEFAULT 1,
    PrecoUnitario DECIMAL(10,2) NOT NULL,
    Observacao TEXT,
    FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido) ON DELETE CASCADE,
    FOREIGN KEY (IdProduto) REFERENCES Produtos(IdProduto),
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE AdministradorEmpresa (
    IdAdmin INT,
    IdEmpresa INT,
    PRIMARY KEY (IdAdmin, IdEmpresa),
    FOREIGN KEY (IdAdmin) REFERENCES Administradores(IdAdmin) ON DELETE CASCADE,
    FOREIGN KEY (IdEmpresa) REFERENCES Empresas(IdEmpresa) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE SessoesMesas (
    IdSessao INT PRIMARY KEY AUTO_INCREMENT,
    IdMesa INT NOT NULL,
    IdCliente INT NULL,
    NomeClienteLog VARCHAR(100),
    DataAbertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    DataFechamento DATETIME NULL,
    Status ENUM('ativa', 'finalizada') DEFAULT 'ativa',
    ValorTotal DECIMAL(10,2) DEFAULT 0.00,
    TotalPedidos INT DEFAULT 0,
    FOREIGN KEY (IdMesa) REFERENCES Mesas(IdMesa) ON DELETE CASCADE,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==========================================
-- 4. CARGA DE DADOS (SEED)
-- ==========================================

INSERT INTO Administradores (Nome, Email, Senha, Telefone, Cargo)
VALUES ('Gustavo', 'gustavoverigarcia@gmail.com', '$2y$10$hxZKxW8.LGr0IatJ33/i/O4DloiFokdY7ya4z41AEfBMQ2ra89Xw6', '17997444480', 'dono');

INSERT INTO Empresas (Nome, Telefone, Email, Senha, Bairro, Rua, Cep)
VALUES ('Uchoa Market Store', '17999998888', 'contato@uchoa.com', 'hash_senha', 'Centro', 'Rua Principal, 10', '15828-000');

INSERT INTO AdministradorEmpresa (IdAdmin, IdEmpresa) VALUES (1, 1);

INSERT INTO Categorias (Nome, Descricao)
VALUES ('Burgers', 'Hambúrgueres'), ('Bebidas', 'Sucos e Refris');

INSERT INTO Clientes (Nome, Email)
VALUES ('Consumidor da Mesa', 'visitante@uchoa.com');

INSERT INTO Mesas (UUID, ClienteAtual, Status, IdEmpresa)
VALUES ('M1-JG7XGM', NULL, 'Livre', 1);

INSERT INTO Produtos (Nome, Descricao, Preco, Estoque, CaminhoImagem, IdCategoria, IdEmpresa)
VALUES ('X-picanha', 'Lanche sertanejo', 40.00, 50, 'https://link-da-imagem.com', 1, 1);

-- ==========================================
-- 5. TRIGGERS
-- ==========================================

-- 1. Mesa ocupada → abre sessão
DELIMITER $$
CREATE TRIGGER trg_abre_sessao
AFTER UPDATE ON Mesas
FOR EACH ROW
BEGIN
    IF OLD.Status = 'Livre' AND NEW.Status = 'Ocupada' THEN
        INSERT INTO SessoesMesas (IdMesa, NomeClienteLog, DataAbertura, Status, ValorTotal, TotalPedidos)
        VALUES (NEW.IdMesa, NEW.ClienteAtual, NOW(), 'ativa', 0.00, 0);
    END IF;
END$$
DELIMITER ;

-- 2. Mesa volta para Livre → fecha sessão ativa
DELIMITER $$
CREATE TRIGGER trg_fecha_sessao_mesa
AFTER UPDATE ON Mesas
FOR EACH ROW
BEGIN
    IF OLD.Status = 'Ocupada' AND NEW.Status = 'Livre' THEN
        UPDATE SessoesMesas
        SET
            DataFechamento = NOW(),
            Status         = 'finalizada'
        WHERE
            IdMesa = NEW.IdMesa
            AND Status = 'ativa';
    END IF;
END$$
DELIMITER ;

-- 3. Pedido finalizado → acumula valor na sessão ativa
DELIMITER $$
CREATE TRIGGER trg_atualiza_sessao_pedido
AFTER UPDATE ON Pedidos
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Finalizado' AND OLD.Status != 'Finalizado' THEN
        UPDATE SessoesMesas
        SET
            ValorTotal   = ValorTotal + NEW.ValorTotal,
            TotalPedidos = TotalPedidos + 1
        WHERE
            IdMesa = NEW.IdMesa
            AND Status = 'ativa';
    END IF;
END$$
DELIMITER ;

-- 4. Novo pedido inserido → já acumula valor na sessão ativa
--    (cobre o caso em que o pedido vai direto para Finalizado sem passar por UPDATE)
DELIMITER $$
CREATE TRIGGER trg_novo_pedido_sessao
AFTER INSERT ON Pedidos
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Finalizado' THEN
        UPDATE SessoesMesas
        SET
            ValorTotal   = ValorTotal + NEW.ValorTotal,
            TotalPedidos = TotalPedidos + 1
        WHERE
            IdMesa = NEW.IdMesa
            AND Status = 'ativa';
    END IF;
END$$
DELIMITER ;