const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding data template...');
  await prisma.template.createMany({
    data: [
      { 
        id: 'blue-classic', 
        name: 'BLUE CLASSIC', 
        image_url: '/frame-biru.png', 
        required_photos: 4, 
        is_system: true, 
        color: 'bg-blue-100' 
      },
      { 
        id: 'maroon-retro', 
        name: 'MAROON RETRO', 
        image_url: '/frame-merah.png', 
        required_photos: 3, 
        is_system: true, 
        color: 'bg-red-50' 
      }
    ],
    skipDuplicates: true, // Mencegah error jika dijalankan berkali-kali
  });
  console.log('Seeding berhasil!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });