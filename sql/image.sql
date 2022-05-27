-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 20:14:20.0710
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS image_image_id_seq;

-- Table Definition
CREATE TABLE "public"."image" (
    "image_id" int4 NOT NULL DEFAULT nextval('image_image_id_seq'::regclass),
    "img_path" varchar(255) NOT NULL,
    "img_size" int4,
    "user_id" int4,
    CONSTRAINT "fk_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE,
    PRIMARY KEY ("image_id")
);

