-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 17:23:02.2760
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS image_image_id_seq;

-- Table Definition
CREATE TABLE "public"."image" (
    "image_id" int4 NOT NULL DEFAULT nextval('image_image_id_seq'::regclass),
    "img_path" varchar(255) NOT NULL,
    "img_size" int4,
    "post" int4,
    CONSTRAINT "fk_post" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE,
    PRIMARY KEY ("image_id")
);

