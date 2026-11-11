import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_proyectos_graficos_archivo" AS ENUM('camaron-exportaciones');
  CREATE TYPE "public"."enum_proyectos_area" AS ENUM('analisis', 'ingenieria', 'ambos');
  CREATE TYPE "public"."enum_formacion_tipo" AS ENUM('titulo', 'bootcamp');
  CREATE TYPE "public"."enum_certificaciones_estado" AS ENUM('obtenida', 'en_preparacion');
  CREATE TYPE "public"."enum_mensajes_idioma_envio" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_registro_accesos_resultado" AS ENUM('ok');
  CREATE TABLE "proyectos_graficos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"archivo" "enum_proyectos_graficos_archivo" NOT NULL
  );
  
  CREATE TABLE "proyectos_graficos_locales" (
  	"titulo" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos_capturas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer NOT NULL
  );
  
  CREATE TABLE "proyectos_fuentes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"fecha_consulta" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "proyectos_fuentes_locales" (
  	"nombre" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "proyectos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"area" "enum_proyectos_area" DEFAULT 'ambos' NOT NULL,
  	"contiene_datos_simulados" boolean DEFAULT true,
  	"repositorio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "proyectos_locales" (
  	"publicado" boolean DEFAULT false,
  	"titulo" varchar,
  	"slug" varchar,
  	"resumen" varchar,
  	"pregunta_negocio" varchar,
  	"problema" jsonb,
  	"datos_limpieza" jsonb,
  	"metodo" jsonb,
  	"resultado" jsonb,
  	"aprendizajes" jsonb,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"notas_internas" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "proyectos_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "trayectoria" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"etapa_padre_id" integer,
  	"breve" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "trayectoria_locales" (
  	"publicado" boolean DEFAULT false,
  	"cargo" varchar,
  	"organizacion" varchar,
  	"periodo" varchar,
  	"descripcion" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "formacion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"tipo" "enum_formacion_tipo" NOT NULL,
  	"institucion" varchar NOT NULL,
  	"anio" varchar,
  	"nombre_en_credencial" varchar,
  	"verificacion_interna" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "formacion_locales" (
  	"publicado" boolean DEFAULT false,
  	"nombre" varchar,
  	"detalle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "certificaciones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"nombre" varchar NOT NULL,
  	"emisor" varchar NOT NULL,
  	"plataforma" varchar,
  	"anio" varchar,
  	"estado" "enum_certificaciones_estado" DEFAULT 'en_preparacion' NOT NULL,
  	"verificacion_interna" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "certificaciones_locales" (
  	"publicado" boolean DEFAULT false,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "servicios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "servicios_locales" (
  	"publicado" boolean DEFAULT false,
  	"nombre" varchar,
  	"descripcion" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "servicios_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "idiomas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "idiomas_locales" (
  	"publicado" boolean DEFAULT false,
  	"idioma" varchar,
  	"nivel" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credito" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_sm_url" varchar,
  	"sizes_sm_width" numeric,
  	"sizes_sm_height" numeric,
  	"sizes_sm_mime_type" varchar,
  	"sizes_sm_filesize" numeric,
  	"sizes_sm_filename" varchar,
  	"sizes_md_url" varchar,
  	"sizes_md_width" numeric,
  	"sizes_md_height" numeric,
  	"sizes_md_mime_type" varchar,
  	"sizes_md_filesize" numeric,
  	"sizes_md_filename" varchar,
  	"sizes_lg_url" varchar,
  	"sizes_lg_width" numeric,
  	"sizes_lg_height" numeric,
  	"sizes_lg_mime_type" varchar,
  	"sizes_lg_filesize" numeric,
  	"sizes_lg_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "mensajes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"apellido" varchar NOT NULL,
  	"correo" varchar NOT NULL,
  	"codigo_pais" varchar,
  	"telefono" varchar,
  	"area" varchar NOT NULL,
  	"mensaje" varchar NOT NULL,
  	"idioma_envio" "enum_mensajes_idioma_envio",
  	"atendido" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"totp_secret" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "registro_accesos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"usuario_id" integer,
  	"resultado" "enum_registro_accesos_resultado" DEFAULT 'ok',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rate_limit" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"clave" varchar NOT NULL,
  	"ventana" varchar NOT NULL,
  	"conteo" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "totp_attempts" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"proyectos_id" integer,
  	"trayectoria_id" integer,
  	"formacion_id" integer,
  	"certificaciones_id" integer,
  	"servicios_id" integer,
  	"idiomas_id" integer,
  	"media_id" integer,
  	"mensajes_id" integer,
  	"usuarios_id" integer,
  	"registro_accesos_id" integer,
  	"rate_limit_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "perfil" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre_publico" varchar DEFAULT 'Carlos Romero' NOT NULL,
  	"nombre_completo" varchar DEFAULT 'Carlos Eduardo Romero Huerta',
  	"foto_id" integer,
  	"linkedin" varchar,
  	"github" varchar,
  	"disponible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "perfil_locales" (
  	"titular" varchar,
  	"presentacion" varchar,
  	"sobre_mi" jsonb,
  	"ubicacion" varchar,
  	"seo_titulo" varchar,
  	"seo_descripcion" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "textos_sitio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textos_sitio_locales" (
  	"aviso_privacidad" jsonb,
  	"pie" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "proyectos_graficos" ADD CONSTRAINT "proyectos_graficos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_graficos_locales" ADD CONSTRAINT "proyectos_graficos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_graficos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_capturas" ADD CONSTRAINT "proyectos_capturas_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos_capturas" ADD CONSTRAINT "proyectos_capturas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_fuentes" ADD CONSTRAINT "proyectos_fuentes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_fuentes_locales" ADD CONSTRAINT "proyectos_fuentes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos_fuentes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_locales" ADD CONSTRAINT "proyectos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proyectos_texts" ADD CONSTRAINT "proyectos_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trayectoria" ADD CONSTRAINT "trayectoria_etapa_padre_id_trayectoria_id_fk" FOREIGN KEY ("etapa_padre_id") REFERENCES "public"."trayectoria"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trayectoria_locales" ADD CONSTRAINT "trayectoria_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trayectoria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "formacion_locales" ADD CONSTRAINT "formacion_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."formacion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certificaciones_locales" ADD CONSTRAINT "certificaciones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."certificaciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicios_locales" ADD CONSTRAINT "servicios_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "servicios_texts" ADD CONSTRAINT "servicios_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "idiomas_locales" ADD CONSTRAINT "idiomas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."idiomas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "registro_accesos" ADD CONSTRAINT "registro_accesos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proyectos_fk" FOREIGN KEY ("proyectos_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trayectoria_fk" FOREIGN KEY ("trayectoria_id") REFERENCES "public"."trayectoria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_formacion_fk" FOREIGN KEY ("formacion_id") REFERENCES "public"."formacion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificaciones_fk" FOREIGN KEY ("certificaciones_id") REFERENCES "public"."certificaciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_servicios_fk" FOREIGN KEY ("servicios_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_idiomas_fk" FOREIGN KEY ("idiomas_id") REFERENCES "public"."idiomas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensajes_fk" FOREIGN KEY ("mensajes_id") REFERENCES "public"."mensajes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registro_accesos_fk" FOREIGN KEY ("registro_accesos_id") REFERENCES "public"."registro_accesos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rate_limit_fk" FOREIGN KEY ("rate_limit_id") REFERENCES "public"."rate_limit"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "perfil" ADD CONSTRAINT "perfil_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "perfil_locales" ADD CONSTRAINT "perfil_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."perfil"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_sitio_locales" ADD CONSTRAINT "textos_sitio_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos_sitio"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "proyectos_graficos_order_idx" ON "proyectos_graficos" USING btree ("_order");
  CREATE INDEX "proyectos_graficos_parent_id_idx" ON "proyectos_graficos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_graficos_locales_locale_parent_id_unique" ON "proyectos_graficos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_graficos_locales_parent_id_idx" ON "proyectos_graficos_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_capturas_order_idx" ON "proyectos_capturas" USING btree ("_order");
  CREATE INDEX "proyectos_capturas_parent_id_idx" ON "proyectos_capturas" USING btree ("_parent_id");
  CREATE INDEX "proyectos_capturas_imagen_idx" ON "proyectos_capturas" USING btree ("imagen_id");
  CREATE INDEX "proyectos_fuentes_order_idx" ON "proyectos_fuentes" USING btree ("_order");
  CREATE INDEX "proyectos_fuentes_parent_id_idx" ON "proyectos_fuentes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "proyectos_fuentes_locales_locale_parent_id_unique" ON "proyectos_fuentes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_fuentes_locales_parent_id_idx" ON "proyectos_fuentes_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_updated_at_idx" ON "proyectos" USING btree ("updated_at");
  CREATE INDEX "proyectos_created_at_idx" ON "proyectos" USING btree ("created_at");
  CREATE INDEX "proyectos_slug_idx" ON "proyectos_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "proyectos_locales_locale_parent_id_unique" ON "proyectos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos_locales_parent_id_idx" ON "proyectos_locales" USING btree ("_parent_id");
  CREATE INDEX "proyectos_texts_order_parent" ON "proyectos_texts" USING btree ("order","parent_id");
  CREATE INDEX "trayectoria_etapa_padre_idx" ON "trayectoria" USING btree ("etapa_padre_id");
  CREATE INDEX "trayectoria_updated_at_idx" ON "trayectoria" USING btree ("updated_at");
  CREATE INDEX "trayectoria_created_at_idx" ON "trayectoria" USING btree ("created_at");
  CREATE UNIQUE INDEX "trayectoria_locales_locale_parent_id_unique" ON "trayectoria_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "trayectoria_locales_parent_id_idx" ON "trayectoria_locales" USING btree ("_parent_id");
  CREATE INDEX "formacion_updated_at_idx" ON "formacion" USING btree ("updated_at");
  CREATE INDEX "formacion_created_at_idx" ON "formacion" USING btree ("created_at");
  CREATE UNIQUE INDEX "formacion_locales_locale_parent_id_unique" ON "formacion_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "formacion_locales_parent_id_idx" ON "formacion_locales" USING btree ("_parent_id");
  CREATE INDEX "certificaciones_updated_at_idx" ON "certificaciones" USING btree ("updated_at");
  CREATE INDEX "certificaciones_created_at_idx" ON "certificaciones" USING btree ("created_at");
  CREATE UNIQUE INDEX "certificaciones_locales_locale_parent_id_unique" ON "certificaciones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "certificaciones_locales_parent_id_idx" ON "certificaciones_locales" USING btree ("_parent_id");
  CREATE INDEX "servicios_updated_at_idx" ON "servicios" USING btree ("updated_at");
  CREATE INDEX "servicios_created_at_idx" ON "servicios" USING btree ("created_at");
  CREATE UNIQUE INDEX "servicios_locales_locale_parent_id_unique" ON "servicios_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "servicios_locales_parent_id_idx" ON "servicios_locales" USING btree ("_parent_id");
  CREATE INDEX "servicios_texts_order_parent" ON "servicios_texts" USING btree ("order","parent_id");
  CREATE INDEX "idiomas_updated_at_idx" ON "idiomas" USING btree ("updated_at");
  CREATE INDEX "idiomas_created_at_idx" ON "idiomas" USING btree ("created_at");
  CREATE UNIQUE INDEX "idiomas_locales_locale_parent_id_unique" ON "idiomas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "idiomas_locales_parent_id_idx" ON "idiomas_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_sm_sizes_sm_filename_idx" ON "media" USING btree ("sizes_sm_filename");
  CREATE INDEX "media_sizes_md_sizes_md_filename_idx" ON "media" USING btree ("sizes_md_filename");
  CREATE INDEX "media_sizes_lg_sizes_lg_filename_idx" ON "media" USING btree ("sizes_lg_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "mensajes_updated_at_idx" ON "mensajes" USING btree ("updated_at");
  CREATE INDEX "mensajes_created_at_idx" ON "mensajes" USING btree ("created_at");
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE INDEX "registro_accesos_usuario_idx" ON "registro_accesos" USING btree ("usuario_id");
  CREATE INDEX "registro_accesos_updated_at_idx" ON "registro_accesos" USING btree ("updated_at");
  CREATE INDEX "registro_accesos_created_at_idx" ON "registro_accesos" USING btree ("created_at");
  CREATE INDEX "rate_limit_clave_idx" ON "rate_limit" USING btree ("clave");
  CREATE INDEX "rate_limit_ventana_idx" ON "rate_limit" USING btree ("ventana");
  CREATE INDEX "rate_limit_updated_at_idx" ON "rate_limit" USING btree ("updated_at");
  CREATE INDEX "rate_limit_created_at_idx" ON "rate_limit" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_proyectos_id_idx" ON "payload_locked_documents_rels" USING btree ("proyectos_id");
  CREATE INDEX "payload_locked_documents_rels_trayectoria_id_idx" ON "payload_locked_documents_rels" USING btree ("trayectoria_id");
  CREATE INDEX "payload_locked_documents_rels_formacion_id_idx" ON "payload_locked_documents_rels" USING btree ("formacion_id");
  CREATE INDEX "payload_locked_documents_rels_certificaciones_id_idx" ON "payload_locked_documents_rels" USING btree ("certificaciones_id");
  CREATE INDEX "payload_locked_documents_rels_servicios_id_idx" ON "payload_locked_documents_rels" USING btree ("servicios_id");
  CREATE INDEX "payload_locked_documents_rels_idiomas_id_idx" ON "payload_locked_documents_rels" USING btree ("idiomas_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_mensajes_id_idx" ON "payload_locked_documents_rels" USING btree ("mensajes_id");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_locked_documents_rels_registro_accesos_id_idx" ON "payload_locked_documents_rels" USING btree ("registro_accesos_id");
  CREATE INDEX "payload_locked_documents_rels_rate_limit_id_idx" ON "payload_locked_documents_rels" USING btree ("rate_limit_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "perfil_foto_idx" ON "perfil" USING btree ("foto_id");
  CREATE UNIQUE INDEX "perfil_locales_locale_parent_id_unique" ON "perfil_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "perfil_locales_parent_id_idx" ON "perfil_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "textos_sitio_locales_locale_parent_id_unique" ON "textos_sitio_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "textos_sitio_locales_parent_id_idx" ON "textos_sitio_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "proyectos_graficos" CASCADE;
  DROP TABLE "proyectos_graficos_locales" CASCADE;
  DROP TABLE "proyectos_capturas" CASCADE;
  DROP TABLE "proyectos_fuentes" CASCADE;
  DROP TABLE "proyectos_fuentes_locales" CASCADE;
  DROP TABLE "proyectos" CASCADE;
  DROP TABLE "proyectos_locales" CASCADE;
  DROP TABLE "proyectos_texts" CASCADE;
  DROP TABLE "trayectoria" CASCADE;
  DROP TABLE "trayectoria_locales" CASCADE;
  DROP TABLE "formacion" CASCADE;
  DROP TABLE "formacion_locales" CASCADE;
  DROP TABLE "certificaciones" CASCADE;
  DROP TABLE "certificaciones_locales" CASCADE;
  DROP TABLE "servicios" CASCADE;
  DROP TABLE "servicios_locales" CASCADE;
  DROP TABLE "servicios_texts" CASCADE;
  DROP TABLE "idiomas" CASCADE;
  DROP TABLE "idiomas_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "mensajes" CASCADE;
  DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "registro_accesos" CASCADE;
  DROP TABLE "rate_limit" CASCADE;
  DROP TABLE "totp_attempts" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "perfil" CASCADE;
  DROP TABLE "perfil_locales" CASCADE;
  DROP TABLE "textos_sitio" CASCADE;
  DROP TABLE "textos_sitio_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_proyectos_graficos_archivo";
  DROP TYPE "public"."enum_proyectos_area";
  DROP TYPE "public"."enum_formacion_tipo";
  DROP TYPE "public"."enum_certificaciones_estado";
  DROP TYPE "public"."enum_mensajes_idioma_envio";
  DROP TYPE "public"."enum_registro_accesos_resultado";`)
}
