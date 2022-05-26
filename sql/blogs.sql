-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 17:22:52.5240
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS blogs_blog_id_seq;

-- Table Definition
CREATE TABLE "public"."blogs" (
    "blog_id" int4 NOT NULL DEFAULT nextval('blogs_blog_id_seq'::regclass),
    "blogname" varchar(255) NOT NULL,
    "object_list" _varchar,
    "owner" int4 NOT NULL,
    "thums_path" varchar(255),
    CONSTRAINT "fk_user" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON UPDATE CASCADE,
    PRIMARY KEY ("blog_id")
);

