-- -------------------------------------------------------------
-- TablePlus 5.1.0(468)
--
-- https://tableplus.com/
--
-- Database: test
-- Generation Time: 2022-11-25 09:13:19.3260
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
(2, 'test1', '$2b$10$ii0mIUqzXaFFV5UqcnL8/ODSQEiORzjjBZgLGwK94Kd5Xur6eL6ne', '산타클로스', 2, '루돌프', '메리크리스마스', '2022-11-23 02:04:35.647656+09');
