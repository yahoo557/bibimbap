CREATE SEQUENCE IF NOT EXISTS image_image_id_seq;

-- Table Definition
CREATE TABLE "public"."image" (
    "image_id" int4 NOT NULL DEFAULT nextval('image_image_id_seq'::regclass),
    "img_path" varchar(255) NOT NULL,
    "img_size" int4,
    "user_id" int4,
    CONSTRAINT "fk_users" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
    PRIMARY KEY ("image_id")
);



