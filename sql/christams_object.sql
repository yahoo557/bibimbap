-- -------------------------------------------------------------
-- TablePlus 5.1.0(468)
--
-- https://tableplus.com/
--
-- Database: test
-- Generation Time: 2022-11-25 09:07:27.4750
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS object_object_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_template_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_post_id_seq;

-- Table Definition
CREATE TABLE "public"."object" (
    "object_id" int4 NOT NULL DEFAULT nextval('object_object_id_seq'::regclass),
    "model_path" varchar(255) NOT NULL,
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
(17, '/static/object_files/gift/scene.gltf', 3, '{0,-2,3.815813326883309}', '2022-11-23 10:01:40.336708+09', '2022-11-23 10:01:40.336708+09', 38, -1),
(18, '/static/object_files/santa_clauss_sleigh.glb', 1, '{-2,-1.5,3}', '2022-11-23 10:12:57.930778+09', '2022-11-23 10:12:57.930778+09', 39, -1),
(20, '/static/object_files/snowman.glb', 2, '{2.4999999701976776,-1.5,3.9192746971895414}', '2022-11-23 11:10:29.460589+09', '2022-11-23 11:10:29.460589+09', 40, -1),
(21, '/static/object_files/fireplace.glb', 3, '{3.1272900359669076,-1.4,1.512668845458975}', '2022-11-23 11:42:14.992948+09', '2022-11-23 11:42:14.992948+09', 41, -1),
(22, '/static/object_files/socks.glb', 1, '{3.5,-0.31105834447993497,0.9747026951834353}', '2022-11-23 13:47:06.187878+09', '2022-11-23 13:47:06.187878+09', 42, -1),
(23, '/static/object_files/socks.glb', 1, '{3.5,-0.31105834447993497,1.4747026951834352}', '2022-11-23 13:47:06.187878+09', '2022-11-23 13:47:06.187878+09', 42, -1),
(24, '/static/object_files/socks.glb', 1, '{3.5,-0.31105834447993497,1.9747026951834352}', '2022-11-23 13:47:06.187878+09', '2022-11-23 13:47:06.187878+09', 42, -1),
(25, '/static/object_files/gift_box_1.glb', 0, '{0.7818866396917707,-2,3.738926194641274}', '2022-11-24 15:56:28.12967+09', '2022-11-24 15:56:28.12967+09', 44, -1),
(26, '/static/object_files/gift_box_2.glb', 0, '{0.3991190089145319,-2,3.1175313367076223}', '2022-11-24 16:01:02.700909+09', '2022-11-24 16:01:02.700909+09', 45, -1);
