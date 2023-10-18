create database prods

create table productos (
    id serial primary key,
    descripcion varchar(50)
);

insert into productos (descripcion) values ('Producto 1');
insert into productos (descripcion) values ('Producto 2');
insert into productos (descripcion) values ('Producto 3');