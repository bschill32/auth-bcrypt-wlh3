insert into users(name, email, password)
values (${name}, ${email}, ${password});

select id, name, email 
from users
where email = ${email}; 