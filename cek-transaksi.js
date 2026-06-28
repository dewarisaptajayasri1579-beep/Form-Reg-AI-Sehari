import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔍 Sedang mengambil data dari tabel transactions...');
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { created_at: 'desc' }
    });
    
    console.log(`✅ Ditemukan ${transactions.length} data transaksi.`);
    
    if (transactions.length > 0) {
      console.log('Data Terbaru:');
      console.log(transactions[0]);
    } else {
      console.log('Tabel transactions masih kosong.');
    }
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat membaca tabel:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
