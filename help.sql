/* Creating database */
create database if not exists nodejs;
use nodejs;

/* Creating tables */
create table users(
    id int primary key auto_increment,
    registration_time timestamp not null default current_timestamp,
    username nvarchar(32) not null unique,
    password nvarchar(64) not null
);
create table posts(
    id int primary key auto_increment,
    date timestamp not null default current_timestamp,
    header nvarchar(128) not null,
    description blob not null,
    comments_count int not null,
    tags blob not null,
    user_id int not null,
    constraint user_ref
        foreign key (user_id)
        references users(id)
);

/* Setting constraints */
alter table posts
    add constraint user_ref
    foreign key (user_id)
    references users(id);

/* Additional */
create table deleted_posts like posts;