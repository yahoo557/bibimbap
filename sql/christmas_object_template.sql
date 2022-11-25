-- -------------------------------------------------------------
-- TablePlus 5.1.0(468)
--
-- https://tableplus.com/
--
-- Database: test
-- Generation Time: 2022-11-25 09:07:37.5860
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS object_template_template_id_seq;

-- Table Definition
CREATE TABLE "public"."object_template" (
    "template_id" int4 NOT NULL DEFAULT nextval('object_template_template_id_seq'::regclass),
    "model_path" varchar(255) NOT NULL,
    "thumbnail_path" varchar(255) NOT NULL,
    "placement_location" varchar(20) NOT NULL,
    PRIMARY KEY ("template_id")
);

INSERT INTO "public"."object_template" ("template_id", "model_path", "thumbnail_path", "placement_location") VALUES
(38, '/static/object_files/gift.glb', '/static/object_thumbnail/gift.png', 'floor'),
(39, '/static/object_files/santa_clauss_sleigh.glb', '/static/object_thumbnail/santa_clauss_sleigh.png', 'floor'),
(40, '/static/object_files/snowman.glb', '/static/object_thumbnail/snowman.png', 'floor'),
(41, '/static/object_files/fireplace.glb', '/static/object_thumbnail/fireplace.png', 'floor'),
(42, '/static/object_files/socks.glb', '/static/object_thumbnail/socks.png', 'wall'),
(43, '/static/object_files/christmas_tree_3.glb', '/static/object_thumbnail/christmas_tree_3.png', 'floor'),
(44, '/static/object_files/gift_box_1.glb', '/static/object_thumbnail/gift_box_1.png', 'floor'),
(45, '/static/object_files/gift_box_2.glb', '/static/object_thumbnail/gift_box_2.png', 'floor');
