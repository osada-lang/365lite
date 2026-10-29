import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting 365LITE database seeding...');

  // 1. Admin Account
  const adminId = 'admin-365lite-uuid';
  const masterPassword = process.env.MASTER_ADMIN_PASSWORD || 'silver-ringo-815-park';
  const masterEmail = process.env.MASTER_ADMIN_EMAIL || 'admin@365lite.jp';
  await prisma.shop.upsert({
    where: { id: adminId },
    update: {
      email: masterEmail,
      password: masterPassword,
      role: 'ADMIN',
    },
    create: {
      id: adminId,
      name: '365ライト システム管理本部',
      email: masterEmail,
      password: masterPassword,
      role: 'ADMIN',
      google_location_id: null,
      google_drive_folder_id: null,
      post_active: false,
    },
  });
  console.log(`👮 Admin account created/updated: ${masterEmail}`);

  // 2. Clean up fake demo accounts (代理店X, Avenir Hair)
  const demoIds = ['demo-agency-uuid', 'demo-store-uuid'];
  for (const id of demoIds) {
    await prisma.shopKeywords.deleteMany({ where: { shop_id: id } });
    await prisma.shop.deleteMany({ where: { id } });
  }
  await prisma.shop.deleteMany({
    where: {
      email: { in: ['meoseiha@avenir', 'lite@dairiten.x'] }
    }
  });
  console.log('🧹 Cleaned up fake demo accounts (代理店X, Avenir Hair).');

  // 3. 株式会社陽向 Store Account
  const targetHinataId = 'shop-hinata-uuid';
  const hinataExists = await prisma.shop.findUnique({ where: { id: targetHinataId } });
  if (!hinataExists) {
    await prisma.shop.create({
      data: {
        id: targetHinataId,
        name: '株式会社陽向',
        email: 'hinata.ry.2314@gmail.com',
        password: 'hinata.ry.2314@gmail.com',
        role: 'OWNER',
        agency_name: '365ライト（直営店契約）',
        google_location_id: 'locations/9086385394219336208',
        google_drive_folder_id: '1kodi_iDiI7lfNdRh8t03DHk8b2PZQuGA',
        post_active: true,
      },
    });
    console.log('🏢 Store account created: 株式会社陽向');
  }

  // 4. いいとこ鍼灸院 Store Account
  const targetIitokoId = 'shop-iitoko-uuid';
  const iitokoExists = await prisma.shop.findUnique({ where: { id: targetIitokoId } });
  if (!iitokoExists) {
    await prisma.shop.create({
      data: {
        id: targetIitokoId,
        name: 'いいとこ鍼灸院',
        email: 'yeyuebinye99@gmail.com',
        password: 'iitoko-pass-7824',
        role: 'OWNER',
        agency_name: '365ライト（直営店契約）',
        google_location_id: 'locations/12155833518075984673',
        google_drive_folder_id: '1V7bcq1G3wKL9J3ID-UjmJZs_XBJZNQYy',
        post_active: false,
        post_start_date: new Date('2026-11-01T00:00:00.000Z'),
        is_medical: true,
      },
    });

    const iitokoMainKeywords = ['鍼灸院', '鍼灸 治療', '自律神経 鍼灸', '肩こり 腰痛 鍼灸', 'いいとこ鍼灸院'];
    const iitokoSubKeywords = ['東洋医学 ケア', '国家資格保有', '丁寧な問診', '自律神経の乱れ', '根本アプローチ', 'お体のメンテナンス'];
    const iitokoFooter = '━━━━━━━━━━━━━━━━\nいいとこ鍼灸院\n📍 住所: 店舗情報より\n📞 お気軽にお問い合わせ・ご相談ください。\n━━━━━━━━━━━━━━━━';
    const iitokoPrompt = '東洋医学に基づいた丁寧な問診と、自律神経の乱れや慢性的な体の不調に寄り添う施術の魅力をお伝えしてください。誇大広告や効果効能の断定は避け、医療広告ガイドラインに配慮した誠実で安心感のある文章にしてください。';

    await prisma.shopKeywords.create({
      data: {
        shop_id: targetIitokoId,
        main_keywords: JSON.stringify(iitokoMainKeywords),
        sub_keywords: JSON.stringify(iitokoSubKeywords),
        fixed_footer: iitokoFooter,
        custom_prompt: iitokoPrompt,
        post_time_hour: 9,
      },
    });
    console.log('🏢 Store account & medical keywords created: いいとこ鍼灸院');
  } else {
    await prisma.shop.update({
      where: { id: targetIitokoId },
      data: { is_medical: true }
    });
    console.log('🏢 Updated いいとこ鍼灸院 to medical prompt (is_medical: true)');
  }

  // 5. 岐阜医療科大学可児キャンパス Store Account
  const targetGifuMsId = 'shop-gifu-ms-uuid';
  const gifuMsExists = await prisma.shop.findFirst({
    where: {
      OR: [
        { id: targetGifuMsId },
        { email: 'gumsbd@u-gifu-ms.ac.jp' }
      ]
    }
  });

  if (!gifuMsExists) {
    await prisma.shop.create({
      data: {
        id: targetGifuMsId,
        name: '岐阜医療科大学可児キャンパス',
        email: 'gumsbd@u-gifu-ms.ac.jp',
        password: 'gums-kani-7842',
        role: 'OWNER',
        agency_name: '株式会社フェライズ',
        google_location_id: 'locations/17588616379376794749',
        google_drive_folder_id: '1qxqWG9bHEUwZZGKutgTo5PfnlDQPPwON',
        post_active: false,
        is_medical: false,
      },
    });
    console.log('🏢 Store account created: 岐阜医療科大学可児キャンパス (gumsbd@u-gifu-ms.ac.jp)');
  }

  console.log('🟢 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
