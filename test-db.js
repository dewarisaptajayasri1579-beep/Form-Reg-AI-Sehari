import dotenv from 'dotenv';
dotenv.config();
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Mencoba koneksi ke database...');
  
  if (process.env.DATABASE_URL) {
    try {
      const dbUrl = new URL(process.env.DATABASE_URL);
      console.log('Host Database:', dbUrl.host);
      console.log('Nama Database:', dbUrl.pathname.replace('/', ''));
    } catch(e) {
      console.log('URL Database format tidak valid');
    }
  } else {
    console.log('DATABASE_URL: TIDAK TERSEDIA');
  }
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ BERHASIL: Database terhubung dengan baik!');
  } catch (error) {
    console.error('❌ GAGAL: Tidak bisa terhubung ke database.');
    console.error('Detail Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
