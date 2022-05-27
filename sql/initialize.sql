-- 놀다가 DB 초기 설정 SQL

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
    CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE,
    PRIMARY KEY ("blog_id")
);

CREATE SEQUENCE IF NOT EXISTS post_post_id_seq;

CREATE TABLE "public"."post" (
    "post_id" int4 NOT NULL DEFAULT nextval('post_post_id_seq'::regclass),
    "title" varchar(255) NOT NULL,
    "body" varchar(9999) NOT NULL,
    "user_id" int4 NOT NULL,
    "timestamp" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_post" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE CASCADE,
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
    "post" int4,
    CONSTRAINT "fk_post" FOREIGN KEY ("post") REFERENCES "public"."post"("post_id") ON UPDATE CASCADE,
    PRIMARY KEY ("image_id")
);

CREATE SEQUENCE IF NOT EXISTS object_template_template_id_seq;

CREATE TABLE "public"."object_template" (
    "template_id" int4 NOT NULL DEFAULT nextval('object_template_template_id_seq'::regclass),
    "model_path" varchar(50) NOT NULL,
    "thumbnail_path" varchar(50) NOT NULL,
    "placement_location" varchar(20) NOT NULL,
    PRIMARY KEY ("template_id")
);

CREATE SEQUENCE IF NOT EXISTS object_object_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_template_id_seq;
CREATE SEQUENCE IF NOT EXISTS object_post_id_seq;


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