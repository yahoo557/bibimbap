-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 17:24:15.8280
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS reply_reply_id_seq;

-- Table Definition
CREATE TABLE "public"."reply" (
    "reply_id" int4 NOT NULL DEFAULT nextval('reply_reply_id_seq'::regclass),
    "body" varchar(255) NOT NULL,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "post" int4 NOT NULL,
    "writer" int4 NOT NULL,
    CONSTRAINT "fk_post" FOREIGN KEY ("writer") REFERENCES "public"."posts"("id") ON UPDATE CASCADE,
    CONSTRAINT "fk_reply" FOREIGN KEY ("writer") REFERENCES "public"."users"("id") ON UPDATE CASCADE,
    PRIMARY KEY ("reply_id")
);

