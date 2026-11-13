import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "articulos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"fecha" timestamp(3) with time zone NOT NULL,
  	"portada_id" integer,
  	"portada_ruta" varchar,
  	"proyecto_id" integer,
  	"notas_internas" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articulos_locales" (
  	"publicado" boolean DEFAULT false,
  	"titulo" varchar,
  	"slug" varchar,
  	"resumen" varchar,
  	"portada_alt" varchar,
  	"contenido" jsonb,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articulos_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "articulos_id" integer;
  ALTER TABLE "articulos" ADD CONSTRAINT "articulos_portada_id_media_id_fk" FOREIGN KEY ("portada_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articulos" ADD CONSTRAINT "articulos_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articulos_locales" ADD CONSTRAINT "articulos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articulos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articulos_texts" ADD CONSTRAINT "articulos_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articulos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articulos_portada_idx" ON "articulos" USING btree ("portada_id");
  CREATE INDEX "articulos_proyecto_idx" ON "articulos" USING btree ("proyecto_id");
  CREATE INDEX "articulos_updated_at_idx" ON "articulos" USING btree ("updated_at");
  CREATE INDEX "articulos_created_at_idx" ON "articulos" USING btree ("created_at");
  CREATE INDEX "articulos_slug_idx" ON "articulos_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "articulos_locales_locale_parent_id_unique" ON "articulos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articulos_locales_parent_id_idx" ON "articulos_locales" USING btree ("_parent_id");
  CREATE INDEX "articulos_texts_order_parent" ON "articulos_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articulos_fk" FOREIGN KEY ("articulos_id") REFERENCES "public"."articulos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_articulos_id_idx" ON "payload_locked_documents_rels" USING btree ("articulos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articulos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articulos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "articulos_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "articulos" CASCADE;
  DROP TABLE "articulos_locales" CASCADE;
  DROP TABLE "articulos_texts" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_articulos_fk";
  
  DROP INDEX "payload_locked_documents_rels_articulos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "articulos_id";`)
}
