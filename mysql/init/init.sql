-- docker 好像是默认创建远程用户的
-- mysql8 默认字符集就是 utf8mb4
-- use mysql

-- update `user` set host='%' where user ='root';

-- flush privileges;

-- grant all privileges on *.* to 'root'@'%'with grant option;

-- update user set plugin='mysql_native_password' where user='root';


--grant all privileges on *.* to 'bk';
--flush privileges;
