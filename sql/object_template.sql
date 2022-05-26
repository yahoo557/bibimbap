-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-26 17:23:18.2760
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS object_template_template_id_seq;

-- Table Definition
CREATE TABLE "public"."object_template" (
    "template_id" int4 NOT NULL DEFAULT nextval('object_template_template_id_seq'::regclass),
    "model_path" varchar(50) NOT NULL,
    "thumbnail_path" varchar(50) NOT NULL,
    "placement_location" varchar(20) NOT NULL,
    PRIMARY KEY ("template_id")
);

