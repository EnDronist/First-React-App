create table posts(
    id int primary key auto_increment,
    date date not null,
    header nvarchar(128) not null,
    comment_count int not null,
    description blob not null,
    user_id nvarchar(64) not null,
    tags blob not null,
    constraint user_ref foreign key (user_id) references users(id)
);
create table users(
    id int primary key auto_increment,
    registration_time timestamp not null default current_timestamp,
    username nvarchar(32) not null unique,
    password nvarchar(64) not null
);