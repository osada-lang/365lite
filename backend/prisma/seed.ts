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

  // 2. Demo Agency Account
  const targetAgencyId = 'demo-agency-uuid';
  await prisma.shop.upsert({
    where: { id: targetAgencyId },
    update: {
      name: '代理店X',
      email: 'lite@dairiten.x',
      password: 'lite@dairiten.x',
      role: 'AGENCY',
      agency_name: '代理店X',
    },
    create: {
      id: targetAgencyId,
      name: '代理店X',
      email: 'lite@dairiten.x',
      password: 'lite@dairiten.x',
      role: 'AGENCY',
      agency_name: '代理店X',
      post_active: true,
    },
  });
  console.log('🏢 Agency account created/updated: lite@dairiten.x');

  // 3. Demo Store Account (Avenir Hair)
  const targetAvenirId = 'demo-store-uuid';
  const avenirExists = await prisma.shop.findUnique({ where: { id: targetAvenirId } });
  if (!avenirExists) {
    await prisma.shop.create({
      data: {
        id: targetAvenirId,
        name: '美髪改善サロン Avenir Hair',
        email: 'meoseiha@avenir',
        password: 'meoseiha@avenir',
        role: 'OWNER',
        agency_name: '代理店X',
        google_location_id: 'locations/demo-loc-365',
        google_drive_folder_id: '10c1rRfqpsdLRz_ZlOgEXJFR7BoVsRjXe',
        post_active: false,
      },
    });

    const mainKeywords = ['栄 美容室', '名古屋 髪質改善', '栄 カット', '髪質改善 サロン'];
    const subKeywords = ['完全個室サロン', '縮毛矯正 栄', '白髪染め 名古屋', 'トリートメント 推奨'];
    const fixedFooter = '店舗名: 美髪改善サロン Avenir Hair (アヴニールヘア)\n住所: 愛知県名古屋市中区栄3丁目\n営業時間: 10:00〜20:00 (完全予約制)\n定休日: 毎週月曜日\nご予約・お問い合わせはお気軽にどうぞ！';
    const customPrompt = '完全個室のリラックス空間と、髪を傷めない最先端の髪質改善トリートメント、そして丁寧なカウンセリング技術を上品かつ温かみのあるトーンでPRしてください。';

    const initialDrafts = [
      {
        dayIndex: 0,
        title: '今日投稿予定の下書き (Day 0)',
        text: '【髪質改善】栄駅徒歩5分の完全個室サロン Avenir Hair です。\n当サロンでは、お客様一人ひとりの髪質やクセに徹底的に向き合う「丁寧なカウンセリング技術」を大切にしています。\n\n栄で完全個室だからこそ、周りを気にせず髪のパサつきやダメージについて髪質改善トリートメントのご相談をいただけます。\n\n・オーダーメイド極上髪質改善メニュー\n・完全個室のリラックスできるサロン空間\n・髪を傷めない最先端トリートメント技術\n\nお客様の髪本来の輝きとサロントリートメントによる感動的な艶を引き出します。\nお体のメンテナンスを兼ねて、ぜひ下記の「詳細」ボタンよりご予約情報をご確認ください。',
        subKeywords: ['完全個室サロン', 'トリートメント 推奨'],
        imageFileId: '1ICy4qoD6qjOr-w4vD6T3I_xEAxMY0N4B'
      },
      {
        dayIndex: 1,
        title: '明日投稿予定の下書き (Day 1)',
        text: '【縮毛矯正】うねりやくせ毛でお悩みなら栄の「Avenir Hair」にお任せください。\n当サロンでは、髪を傷めない最先端の薬剤を使用し、髪質改善トリートメントを同時に配合した縮毛矯正をご提供しています。\n\n完全個室のリラックスした極上空間で、仕上がりは驚くほど柔らかく滑らかな艶髪を実現します。\n\n・うねりやクセを自然に抑える縮毛矯正\n・丁寧なカウンセリングでお悩み徹底解消\n・縮毛矯正と髪質改善のダブルアプローチ\n\n毎朝のスタイリングが感動するほど楽になりますよ。\n詳しくは詳細ボタンよりご予約や空き状況をご確認ください。',
        subKeywords: ['縮毛矯正 栄', '完全個室サロン'],
        imageFileId: '1YRczsnYk5_EpPhY3U7N2RjyyOF8629u_'
      },
      {
        dayIndex: 2,
        title: '明後日投稿予定の下書き (Day 2)',
        text: '【白髪染め】頭皮と髪を優しく守る栄の髪質改善カラーなら「Avenir Hair」です。\n「白髪は染めたいけれど髪のパサつきやダメージが気になる」とお悩みではありませんか？\n\n当サロン独自の髪質改善トリートメントを配合した、優しく低刺激なオーガニックカラーをご提案します。\n\n・白髪染めとトリートメントの極上融合\n・完全個室でゆったり過ごせる大人の隠れ家\n・髪質に合わせたオーダーメイド施術\n\n潤いに満ちた、若々しくしっとりまとまる美しい艶髪に仕上げます。\nぜひ下記の詳細ボタンより空き状況をご確認ください。',
        subKeywords: ['白髪染め 名古屋', 'トリートメント 推奨'],
        imageFileId: '1iLC1rMI5az8xd8nK8tOEK9ZuszpDFHwW'
      }
    ];

    await prisma.shopKeywords.create({
      data: {
        shop_id: targetAvenirId,
        main_keywords: JSON.stringify(mainKeywords),
        sub_keywords: JSON.stringify(subKeywords),
        fixed_footer: fixedFooter,
        custom_prompt: customPrompt,
        hp_url: 'https://avenir-hair-demo.example.com',
        hotpepper_url: 'https://beauty.hotpepper.jp/avenir-hair-demo',
        gbp_action_url: 'https://beauty.hotpepper.jp/avenir-hair-demo/reserve',
        post_time_hour: 9,
        draft_posts: JSON.stringify(initialDrafts),
      },
    });
    console.log('📝 Demo shop Avenir Hair & Keywords created successfully!');
  }

  // 4. 株式会社陽向 Store Account
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

  // 5. いいとこ鍼灸院 Store Account
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
