CREATE TABLE IF NOT EXISTS Session (
	id varchar(40) NOT NULL,
	`key` varchar(30),
	value varchar(30),
	created timestamp NOT NULL default CURRENT_TIMESTAMP,

	CONSTRAINT UC_session UNIQUE (id, `key`)
);

CREATE TABLE IF NOT EXISTS Teacher (
	id integer AUTO_INCREMENT PRIMARY KEY,
	fullname varchar(30) NOT NULL,
	gov_id varchar(9) NOT NULL,
	session_id varchar(40),

	FOREIGN KEY (session_id) REFERENCES Session(id)
);

CREATE TABLE IF NOT EXISTS Student (
	id integer AUTO_INCREMENT PRIMARY KEY,
	first_name varchar(15) NOT NULL,
	last_name varchar(15) NOT NULL,
	grade integer NOT NULL,
	phone varchar(10) NOT NULL,
	teacher_id integer,

	FOREIGN KEY (teacher_id) REFERENCES Teacher(id)
);

CREATE TABLE Assignment (
	id integer AUTO_INCREMENT PRIMARY KEY,
	teacher_id integer NOT NULL,
	title varchar(256),
	content varchar(255),

	FOREIGN KEY (teacher_id) REFERENCES Teacher(id)
);
