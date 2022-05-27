-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 20:14:49.4220
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "user_id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "nickname" varchar(255) NOT NULL,
    "passwordq" int4 NOT NULL,
    "passworda" varchar(255) NOT NULL,
    "blogname" varchar(255) NOT NULL,
    "signupdate" timestamptz DEFAULT now(),
    PRIMARY KEY ("user_id")
);

INSERT INTO "public"."users" ("user_id", "username", "password", "nickname", "passwordq", "passworda", "blogname", "signupdate") VALUES
(2, 'test', '$2b$10$aZUILINAHHelc9rnAQIe.uAx/ioAT2Fv4r3S3QHIdHkSjTY8HfRFC', '추워도울어재끼는매미', 1, '봉곡초등학교', '충북 괴산 큐티 뽀이의 축산 일기', '2022-05-23 03:47:07.325344+09'),
(3, 'test2', '$2b$10$ob32ZBaw3SqjBUuTl/mp2.6Gn7YJr1g6EOYQy6lzUa37m8d038LFm', '멋쟁이를보면 우는 매미', 1, '봉곡초등학교', '충북 괴산 큐티 뽀이의 축산 일기', '2022-05-25 23:13:53.036365+09');
