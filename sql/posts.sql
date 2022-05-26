-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 17:24:01.9280
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS post_post_id_seq;

-- Table Definition
CREATE TABLE "public"."posts" (
    "id" int4 NOT NULL DEFAULT nextval('post_post_id_seq'::regclass),
    "title" varchar(255) NOT NULL,
    "body" varchar(9999) NOT NULL,
    "writer" int4 NOT NULL,
    "timestamp" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_post" FOREIGN KEY ("writer") REFERENCES "public"."users"("id") ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

