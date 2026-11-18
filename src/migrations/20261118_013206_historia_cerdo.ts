import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_proyectos_simulador" ADD VALUE 'cerdo-historia';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proyectos" ALTER COLUMN "simulador" SET DATA TYPE text;
  ALTER TABLE "proyectos" ALTER COLUMN "simulador" SET DEFAULT 'ninguno'::text;
  DROP TYPE "public"."enum_proyectos_simulador";
  CREATE TYPE "public"."enum_proyectos_simulador" AS ENUM('ninguno', 'china-2024');
  ALTER TABLE "proyectos" ALTER COLUMN "simulador" SET DEFAULT 'ninguno'::"public"."enum_proyectos_simulador";
  ALTER TABLE "proyectos" ALTER COLUMN "simulador" SET DATA TYPE "public"."enum_proyectos_simulador" USING "simulador"::"public"."enum_proyectos_simulador";`)
}
