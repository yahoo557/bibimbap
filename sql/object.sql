-- -------------------------------------------------------------
-- TablePlus 4.6.6(422)
--
-- https://tableplus.com/
--
-- Database: noldaga
-- Generation Time: 2022-05-28 16:50:04.6820
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS object_object_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_template_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_post_id_seq;

-- Table Definition
CREATE TABLE "public"."object" (
    "object_id" int4 NOT NULL DEFAULT nextval('object_object_id_seq'::regclass),
    "model_path" varchar(50) NOT NULL,
    "model_rotation" int4 NOT NULL,
    "model_position" _float8 NOT NULL,
    "create_date" timestamptz,
    "update_date" timestamptz,
    "template_id" int4 NOT NULL DEFAULT nextval('object_template_id_seq'::regclass),
    "post_id" int4 NOT NULL DEFAULT nextval('object_post_id_seq'::regclass),
    CONSTRAINT "object_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."object_template"("template_id"),
    PRIMARY KEY ("object_id")
);

INSERT INTO "public"."object" ("object_id", "model_path", "model_rotation", "model_position", "create_date", "update_date", "template_id", "post_id") VALUES
(1, 'object_files/Old_Bicycle.glb', 0, '{0,-3,1}', NULL, NULL, 1, 1);
