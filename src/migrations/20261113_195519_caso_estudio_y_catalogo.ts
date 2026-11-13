import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_proyectos_hallazgos_tono" AS ENUM('normal', 'destacado', 'riesgo');
  CREATE TYPE "public"."enum_proyectos_pasos_color" AS ENUM('ninguno', 'bronze', 'silver', 'gold');
  CREATE TYPE "public"."enum_proyectos_simulador" AS ENUM('ninguno', 'china-2024');
  CREATE TYPE "public"."enum_servicios_grupo" AS ENUM('datos', 'sistemas');
  CREATE TYPE "public"."enum_servicios_icono" AS ENUM('grafico', 'base', 'rayo', 'pantalla', 'caja');
  CREATE TYPE "public"."enum_servicios_estado" AS ENUM('disponible', 'proximamente');
  ALTER TYPE "public"."enum_proyectos_area" ADD VALUE 'web';
  CREATE TABLE "proyectos_destacados" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cifra" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_destacados_locales" (
  	"texto" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_hallazgos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cifra" varchar NOT NULL,
  	"tono" "enum_proyectos_hallazgos_tono" DEFAULT 'normal'
  );
  
  CREATE TABLE "proyectos_hallazgos_locales" (
  	"texto" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_pasos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"etiqueta" varchar NOT NULL,
  	"color" "enum_proyectos_pasos_color" DEFAULT 'ninguno'
  );
  
  CREATE TABLE "proyectos_pasos_locales" (
  	"titulo" varchar NOT NULL,
  	"texto" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_decisiones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "proyectos_decisiones_locales" (
  	"titulo" varchar NOT NULL,
  	"texto" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_enlaces" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_enlaces_locales" (
  	"texto" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_capturas_locales" (
  	"alt" varchar,
  	"titulo" varchar,
  	"leyenda" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "servicios_entregables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "servicios_entregables_locales" (
  	"texto" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "proyectos_capturas" ALTER COLUMN "imagen_id" DROP NOT NULL;
  ALTER TABLE "proyectos_capturas" ADD COLUMN "ruta" varchar;
  ALTER TABLE "proyectos" ADD COLUMN "destacado" boolean DEFAULT false;
  ALTER TABLE "proyectos" ADD COLUMN "portada_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN "portada_ruta" varchar;
  ALTER TABLE "proyectos" ADD COLUMN "simulador" "enum_proyectos_simulador" DEFAULT 'ninguno';
  ALTER TABLE "proyectos" ADD COLUMN "demo" varchar;
  ALTER TABLE "proyectos_locales" ADD COLUMN "titular" varchar;
  ALTER TABLE "proyectos_locales" ADD COLUMN "portada_alt" varchar;
  ALTER TABLE "proyectos_locales" ADD COLUMN "portada_etiqueta" varchar;
  ALTER TABLE "proyectos_locales" ADD COLUMN "ficha_tipo" varchar;
  ALTER TABLE "proyectos_locales" ADD COLUMN "ficha_periodo" varchar;
  ALTER TABLE "proyectos_locales" ADD COLUMN "ficha_fuentes_datos" varchar;
  ALTER TABLE "proyectos_locales" ADD COLUMN "ficha_calidad" varchar;
  ALTER TABLE "servicios" ADD COLUMN "grupo" "enum_servicios_grupo" DEFAULT 'datos' NOT NULL;
  ALTER TABLE "servicios" ADD COLUMN "icono" "enum_servicios_icono" DEFAULT 'grafico';
  ALTER TABLE "servicios" ADD COLUMN "estado" "enum_servicios_estado" DEFAULT 'disponible';
  ALTER TABLE "servicios" ADD COLUMN "proyecto_ejemplo_id" integer;
  ALTER TABLE "servicios" ADD COLUMN "demo_url" varchar;
  ALTER TABLE "servicios_locales" ADD COLUMN "dolor" varchar;
  ALTER TABLE "proyectos_destacados" ADD CONSTRAINT "proyectos_destacados_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_destacados_locales" ADD CONSTRAINT "proyectos_destacados_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_destacados"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_hallazgos" ADD CONSTRAINT "proyectos_hallazgos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_hallazgos_locales" ADD CONSTRAINT "proyectos_hallazgos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_hallazgos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_pasos" ADD CONSTRAINT "proyectos_pasos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_pasos_locales" ADD CONSTRAINT "proyectos_pasos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_pasos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_decisiones" ADD CONSTRAINT "proyectos_decisiones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_decisiones_locales" ADD CONSTRAINT "proyectos_decisiones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_decisiones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_enlaces" ADD CONSTRAINT "proyectos_enlaces_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_enlaces_locales" ADD CONSTRAINT "proyectos_enlaces_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_enlaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_capturas_locales" ADD CONSTRAINT "proyectos_capturas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_capturas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicios_entregables" ADD CONSTRAINT "servicios_entregables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicios_entregables_locales" ADD CONSTRAINT "servicios_entregables_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicios_entregables"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "proyectos_destacados_order_idx" ON "proyectos_destacados" USING btree ("_order");
  CREATE INDEX "proyectos_destacados_parent_id_idx" ON "proyectos_destacados" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_destacados_locales_locale_parent_id_unique" ON "proyectos_destacados_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_destacados_locales_parent_id_idx" ON "proyectos_destacados_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_hallazgos_order_idx" ON "proyectos_hallazgos" USING btree ("_order");
  CREATE INDEX "proyectos_hallazgos_parent_id_idx" ON "proyectos_hallazgos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_hallazgos_locales_locale_parent_id_unique" ON "proyectos_hallazgos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_hallazgos_locales_parent_id_idx" ON "proyectos_hallazgos_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_pasos_order_idx" ON "proyectos_pasos" USING btree ("_order");
  CREATE INDEX "proyectos_pasos_parent_id_idx" ON "proyectos_pasos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_pasos_locales_locale_parent_id_unique" ON "proyectos_pasos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_pasos_locales_parent_id_idx" ON "proyectos_pasos_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_decisiones_order_idx" ON "proyectos_decisiones" USING btree ("_order");
  CREATE INDEX "proyectos_decisiones_parent_id_idx" ON "proyectos_decisiones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_decisiones_locales_locale_parent_id_unique" ON "proyectos_decisiones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_decisiones_locales_parent_id_idx" ON "proyectos_decisiones_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_enlaces_order_idx" ON "proyectos_enlaces" USING btree ("_order");
  CREATE INDEX "proyectos_enlaces_parent_id_idx" ON "proyectos_enlaces" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_enlaces_locales_locale_parent_id_unique" ON "proyectos_enlaces_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_enlaces_locales_parent_id_idx" ON "proyectos_enlaces_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_capturas_locales_locale_parent_id_unique" ON "proyectos_capturas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_capturas_locales_parent_id_idx" ON "proyectos_capturas_locales" USING btree ("_parent_id");
  CREATE INDEX "servicios_entregables_order_idx" ON "servicios_entregables" USING btree ("_order");
  CREATE INDEX "servicios_entregables_parent_id_idx" ON "servicios_entregables" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "servicios_entregables_locales_locale_parent_id_unique" ON "servicios_entregables_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "servicios_entregables_locales_parent_id_idx" ON "servicios_entregables_locales" USING btree ("_parent_id");
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_portada_id_media_id_fk" FOREIGN KEY ("portada_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "servicios" ADD CONSTRAINT "servicios_proyecto_ejemplo_id_proyectos_id_fk" FOREIGN KEY ("proyecto_ejemplo_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "proyectos_portada_idx" ON "proyectos" USING btree ("portada_id");
  CREATE INDEX "servicios_proyecto_ejemplo_idx" ON "servicios" USING btree ("proyecto_ejemplo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proyectos_destacados" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_destacados_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_hallazgos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_hallazgos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_pasos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_pasos_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_decisiones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_decisiones_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_enlaces" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_enlaces_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "proyectos_capturas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "servicios_entregables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "servicios_entregables_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "proyectos_destacados" CASCADE;
  DROP TABLE "proyectos_destacados_locales" CASCADE;
  DROP TABLE "proyectos_hallazgos" CASCADE;
  DROP TABLE "proyectos_hallazgos_locales" CASCADE;
  DROP TABLE "proyectos_pasos" CASCADE;
  DROP TABLE "proyectos_pasos_locales" CASCADE;
  DROP TABLE "proyectos_decisiones" CASCADE;
  DROP TABLE "proyectos_decisiones_locales" CASCADE;
  DROP TABLE "proyectos_enlaces" CASCADE;
  DROP TABLE "proyectos_enlaces_locales" CASCADE;
  DROP TABLE "proyectos_capturas_locales" CASCADE;
  DROP TABLE "servicios_entregables" CASCADE;
  DROP TABLE "servicios_entregables_locales" CASCADE;
  ALTER TABLE "proyectos" DROP CONSTRAINT "proyectos_portada_id_media_id_fk";
  
  ALTER TABLE "servicios" DROP CONSTRAINT "servicios_proyecto_ejemplo_id_proyectos_id_fk";
  
  ALTER TABLE "proyectos" ALTER COLUMN "area" SET DATA TYPE text;
  ALTER TABLE "proyectos" ALTER COLUMN "area" SET DEFAULT 'ambos'::text;
  DROP TYPE "public"."enum_proyectos_area";
  CREATE TYPE "public"."enum_proyectos_area" AS ENUM('analisis', 'ingenieria', 'ambos');
  ALTER TABLE "proyectos" ALTER COLUMN "area" SET DEFAULT 'ambos'::"public"."enum_proyectos_area";
  ALTER TABLE "proyectos" ALTER COLUMN "area" SET DATA TYPE "public"."enum_proyectos_area" USING "area"::"public"."enum_proyectos_area";
  DROP INDEX "proyectos_portada_idx";
  DROP INDEX "servicios_proyecto_ejemplo_idx";
  ALTER TABLE "proyectos_capturas" ALTER COLUMN "imagen_id" SET NOT NULL;
  ALTER TABLE "proyectos_capturas" DROP COLUMN "ruta";
  ALTER TABLE "proyectos" DROP COLUMN "destacado";
  ALTER TABLE "proyectos" DROP COLUMN "portada_id";
  ALTER TABLE "proyectos" DROP COLUMN "portada_ruta";
  ALTER TABLE "proyectos" DROP COLUMN "simulador";
  ALTER TABLE "proyectos" DROP COLUMN "demo";
  ALTER TABLE "proyectos_locales" DROP COLUMN "titular";
  ALTER TABLE "proyectos_locales" DROP COLUMN "portada_alt";
  ALTER TABLE "proyectos_locales" DROP COLUMN "portada_etiqueta";
  ALTER TABLE "proyectos_locales" DROP COLUMN "ficha_tipo";
  ALTER TABLE "proyectos_locales" DROP COLUMN "ficha_periodo";
  ALTER TABLE "proyectos_locales" DROP COLUMN "ficha_fuentes_datos";
  ALTER TABLE "proyectos_locales" DROP COLUMN "ficha_calidad";
  ALTER TABLE "servicios" DROP COLUMN "grupo";
  ALTER TABLE "servicios" DROP COLUMN "icono";
  ALTER TABLE "servicios" DROP COLUMN "estado";
  ALTER TABLE "servicios" DROP COLUMN "proyecto_ejemplo_id";
  ALTER TABLE "servicios" DROP COLUMN "demo_url";
  ALTER TABLE "servicios_locales" DROP COLUMN "dolor";
  DROP TYPE "public"."enum_proyectos_hallazgos_tono";
  DROP TYPE "public"."enum_proyectos_pasos_color";
  DROP TYPE "public"."enum_proyectos_simulador";
  DROP TYPE "public"."enum_servicios_grupo";
  DROP TYPE "public"."enum_servicios_icono";
  DROP TYPE "public"."enum_servicios_estado";`)
}
