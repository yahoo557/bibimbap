-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 20:14:44.1120
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS reply_reply_id_seq;

-- Table Definition
CREATE TABLE "public"."reply" (
    "reply_id" int4 NOT NULL DEFAULT nextval('reply_reply_id_seq'::regclass),
    "body" varchar(255) NOT NULL,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "post_id" int4 NOT NULL,
    "user_id" int4 NOT NULL,
    CONSTRAINT "fk_post" FOREIGN KEY ("user_id") REFERENCES "public"."post"("post_id") ON UPDATE CASCADE,
    CONSTRAINT "fk_reply" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE,
    PRIMARY KEY ("reply_id")
);

