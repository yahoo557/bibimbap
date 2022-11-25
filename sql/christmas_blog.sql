-- -------------------------------------------------------------
-- TablePlus 5.1.0(468)
--
-- https://tableplus.com/
--
-- Database: test
-- Generation Time: 2022-11-25 09:13:48.5570
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS blogs_blog_id_seq;

-- Table Definition
CREATE TABLE "public"."blog" (
    "blog_id" int4 NOT NULL DEFAULT nextval('blogs_blog_id_seq'::regclass),
    "blogname" varchar(255) NOT NULL,
    "object_list" _varchar,
    "user_id" int4 NOT NULL,
    "thums_path" varchar(255),
    CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
    PRIMARY KEY ("blog_id")
);

INSERT INTO "public"."blog" ("blog_id", "blogname", "object_list", "user_id", "thums_path") VALUES
(2, '메리크리스마스', '{17,18,19,20,21,22,23,24,25,26}', 2, NULL);
