-- 놀다가 DB 초기 설정 SQL

CREATE USER bibimbap PASSWORD 'bi1234';
CREATE DATABASE noldaga OWNER bibimbap;

USE noldaga;

USE test;
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

CREATE TABLE "public"."users" (
    "user_id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar(255) NOT NULL,
    "password" varchar(255) NOT NULL,
    "nickname" varchar(255) NOT NULL,
    "passwordq" int4 NOT NULL,
    "passworda" varchar(255) NOT NULL,
    "blogname" varchar(255) NOT NULL,
    "signupdate" timestamptz DEFAULT now(),
    PRIMARY KEY ("user_id")
);

CREATE SEQUENCE IF NOT EXISTS blogs_blog_id_seq;

CREATE TABLE "public"."blog" (
    "blog_id" int4 NOT NULL DEFAULT nextval('blogs_blog_id_seq'::regclass),
    "blogname" varchar(255) NOT NULL,
    "object_list" _varchar,
    "user_id" int4 NOT NULL,
    "thums_path" varchar(255),
    CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
    PRIMARY KEY ("blog_id")
);

CREATE SEQUENCE IF NOT EXISTS post_post_id_seq;

CREATE TABLE "public"."post" (
    "post_id" int4 NOT NULL DEFAULT nextval('post_post_id_seq'::regclass),
    "title" varchar(255) NOT NULL,
    "body" varchar(9999) NOT NULL,
    "user_id" int4 NOT NULL,
    "timestamp" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_post" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
    PRIMARY KEY ("post_id")
);

CREATE SEQUENCE IF NOT EXISTS reply_reply_id_seq;

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

CREATE SEQUENCE IF NOT EXISTS image_image_id_seq;

CREATE TABLE "public"."image" (
    "image_id" int4 NOT NULL DEFAULT nextval('image_image_id_seq'::regclass),
    "img_path" varchar(255) NOT NULL,
    "img_size" int4,
    "user_id" int4,
    "post_id" int4,
    CONSTRAINT "fk_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
    PRIMARY KEY ("image_id")
);

CREATE SEQUENCE IF NOT EXISTS object_template_template_id_seq;

CREATE TABLE "public"."object_template" (
    "template_id" int4 NOT NULL DEFAULT nextval('object_template_template_id_seq'::regclass),
    "model_path" varchar(255) NOT NULL,
    "thumbnail_path" varchar(255) NOT NULL,
    "placement_location" varchar(20) NOT NULL,
    PRIMARY KEY ("template_id")
);

CREATE SEQUENCE IF NOT EXISTS object_object_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_template_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_post_id_seq;


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


INSERT INTO "public"."object_template" ("template_id", "model_path", "thumbnail_path", "placement_location") VALUES
(1, '/static/object_files/Old_Bicycle.glb', '/static/object_thumbnail/Old_Bicycle.png', 'floor'),
(2, '/static/object_files/Plants_on_table.gltf', '/static/object_thumbnail/Plants_on_table.png', 'floor'),
(3, '/static/object_files/Evita_chandelier.glb', '/static/object_thumbnail/Evita_chandelier.png', 'ceiling'),
(4, '/static/object_files/angle_clock.glb', '/static/object_thumbnail/angle_clock.png', 'wall'),
(5, '/static/object_files/Books_Magazines.gltf', '/static/object_thumbnail/Books_Magazines.png', 'floor'),
(6, '/static/object_files/Coffee_table.glb', '/static/object_thumbnail/Coffee_table.png', 'floor'),
(7, '/static/object_files/HepBurn_Sofa.glb', '/static/object_thumbnail/HepBurn_Sofa.png', 'floor'),
(8, '/static/object_files/Paintings.glb', '/static/object_thumbnail/Paintings.png', 'floor'),
(9, '/static/object_files/Shoe_cabinet.gltf', '/static/object_thumbnail/Shoe_cabinet.png', 'floor'),
(10, '/static/object_files/Single_Pouf.glb', '/static/object_thumbnail/Single_Pouf.png', 'floor'),
(11, '/static/object_files/Stand_light.glb', '/static/object_thumbnail/Stand_light.png', 'floor'),
(12, '/static/object_files/Table.glb', '/static/object_thumbnail/Table.png', 'floor'),
(13, '/static/object_files/bookcases_from_secrets_neighbor.glb', '/static/object_thumbnail/bookcases_from_secrets_neighbor.png', 'floor'),
(14, '/static/object_files/desk.glb', '/static/object_thumbnail/desk.png', 'floor'),
(15, '/static/object_files/desktop_computer.glb', '/static/object_thumbnail/desktop_computer.png', 'floor'),
(16, '/static/object_files/ikea_hallbyra_1950.glb', '/static/object_thumbnail/ikea_hallbyra_1950.png', 'floor'),
(17, '/static/object_files/plant1.glb', '/static/object_thumbnail/plant1.png', 'floor'),
(18, '/static/object_files/plant2.gltf', '/static/object_thumbnail/plant2.png', 'floor'),
(19, '/static/object_files/retro_television.glb', '/static/object_thumbnail/retro_television.png', 'floor'),
(20, '/static/object_files/shoes_rack.glb', '/static/object_thumbnail/shoes_rack.png', 'floor'),
(21, '/static/object_files/table_and_chairs.glb', '/static/object_thumbnail/table_and_chairs.png', 'floor'),
(22, '/static/object_files/wooden_table.glb', '/static/object_thumbnail/wooden_table.png', 'floor');

