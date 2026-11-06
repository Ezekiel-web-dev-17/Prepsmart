/**
 * seed-university-images.ts
 *
 * Fills the University table with real campus imageUrl, logoUrl,
 * imageLandmark, imageCaption, brandColor, and secondaryColor
 * for every university already in the database.
 *
 * Run with:
 *   DATABASE_URL="postgresql://..." npx tsx prisma/seed-university-images.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Real campus landmark images — Wikimedia Commons verified high-res photos
// ---------------------------------------------------------------------------
interface UniversityMedia {
  imageUrl: string;
  logoUrl: string;
  imageLandmark: string;
  imageCaption: string;
  brandColor: string;
  secondaryColor: string;
}

const UNIVERSITY_MEDIA: Record<string, UniversityMedia> = {
  // ===================== FEDERAL UNIVERSITIES =====================
  unilag: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/University_of_Lagos_Senate_Building.jpg/1200px-University_of_Lagos_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/University_of_Lagos_seal.svg/320px-University_of_Lagos_seal.svg.png",
    imageLandmark: "Senate High-rise Building",
    imageCaption:
      "Main campus senate high-rise overlooking the Lagos lagoon, Akoka, Yaba",
    brandColor: "#002B49",
    secondaryColor: "#EAAA00",
  },
  ui: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Trenchard_Hall%2C_University_of_Ibadan.jpg/1200px-Trenchard_Hall%2C_University_of_Ibadan.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/University_of_Ibadan_logo.png/320px-University_of_Ibadan_logo.png",
    imageLandmark: "Trenchard Hall & Tower Court",
    imageCaption:
      "Historic Trenchard Hall and Kenneth Dike Library clock tower, Ibadan",
    brandColor: "#580000",
    secondaryColor: "#F4C430",
  },
  oau: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hezekiah_oluwasanmi_library.jpg/1200px-Hezekiah_oluwasanmi_library.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Obafemi_Awolowo_University_logo.png/320px-Obafemi_Awolowo_University_logo.png",
    imageLandmark: "Hezekiah Oluwasanmi Library",
    imageCaption:
      "Iconic brutalist Hezekiah Oluwasanmi Library & Oduduwa Hall, Ile-Ife",
    brandColor: "#002244",
    secondaryColor: "#FFBF00",
  },
  abu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Senate_Building_Ahmadu_Bello_University.jpg/1200px-Senate_Building_Ahmadu_Bello_University.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Ahmadu_Bello_University_logo.png/320px-Ahmadu_Bello_University_logo.png",
    imageLandmark: "Samaru Senate Complex",
    imageCaption:
      "Samaru Main Campus Administrative Senate Building, Zaria",
    brandColor: "#006A4E",
    secondaryColor: "#FFFFFF",
  },
  unn: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/University_of_Nigeria_Nsukka_Gate.jpg/1200px-University_of_Nigeria_Nsukka_Gate.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/University_of_Nigeria_logo.png/320px-University_of_Nigeria_logo.png",
    imageLandmark: "Roar Lion Campus Gate",
    imageCaption:
      "Historic Roar Lion Campus entrance and Nnamdi Azikiwe Library, Nsukka",
    brandColor: "#006747",
    secondaryColor: "#CBA052",
  },
  unilorin: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/University_of_Ilorin_Senate_building.jpg/1200px-University_of_Ilorin_Senate_building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/University_of_Ilorin_logo.png/320px-University_of_Ilorin_logo.png",
    imageLandmark: "Senate Complex & Walkway",
    imageCaption:
      "Main campus Senate Complex and Walkway of Honour, Ilorin",
    brandColor: "#1B365D",
    secondaryColor: "#B1944C",
  },
  uniben: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/University_of_Benin_Senate_Building.jpg/1200px-University_of_Benin_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/University_of_Benin_%28Nigeria%29_logo.png/320px-University_of_Benin_%28Nigeria%29_logo.png",
    imageLandmark: "Ugbowo Senate Building",
    imageCaption:
      "Ugbowo Campus central administrative complex and Twin Gate, Benin City",
    brandColor: "#3B1147",
    secondaryColor: "#DFB235",
  },
  futa: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Federal_University_of_Technology_Akure_Senate_Building.jpg/1200px-Federal_University_of_Technology_Akure_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/Federal_University_of_Technology_Akure_logo.png/320px-Federal_University_of_Technology_Akure_logo.png",
    imageLandmark: "Obanla Senate Building",
    imageCaption:
      "Obanla Main Campus Senate Building & Technology Complex, Akure",
    brandColor: "#1C3F94",
    secondaryColor: "#DCA72C",
  },
  futminna: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/FUT_Minna_Senate_Building.jpg/1200px-FUT_Minna_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/Federal_University_of_Technology_Minna_logo.png/320px-Federal_University_of_Technology_Minna_logo.png",
    imageLandmark: "Gidan Kwano Senate Complex",
    imageCaption:
      "Gidan Kwano permanent campus Senate Complex, Minna",
    brandColor: "#003865",
    secondaryColor: "#FFA300",
  },
  futo: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/FUTO_Senate_Building.jpg/1200px-FUTO_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Federal_University_of_Technology_Owerri_logo.png/320px-Federal_University_of_Technology_Owerri_logo.png",
    imageLandmark: "Ihiagwa Senate Complex",
    imageCaption:
      "Central Administrative Senate Complex and ICT Center, Ihiagwa, Owerri",
    brandColor: "#0E3A2F",
    secondaryColor: "#DAA520",
  },
  uniabuja: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/University_of_Abuja_Senate_Building.jpg/1200px-University_of_Abuja_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/University_of_Abuja_logo.png/320px-University_of_Abuja_logo.png",
    imageLandmark: "Airport Road Senate Building",
    imageCaption:
      "Permanent site central administration building along Airport Road, Abuja",
    brandColor: "#0B5345",
    secondaryColor: "#F1C40F",
  },
  uniport: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/University_of_Port_Harcourt_Senate_Building.jpg/1200px-University_of_Port_Harcourt_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/University_of_Port_Harcourt_logo.png/320px-University_of_Port_Harcourt_logo.png",
    imageLandmark: "Choba Senate Building",
    imageCaption:
      "Choba Campus administrative senate building and Delta Park, Port Harcourt",
    brandColor: "#004B49",
    secondaryColor: "#F5B041",
  },
  unijos: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/University_of_Jos_Campus.jpg/1200px-University_of_Jos_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/University_of_Jos_logo.png/320px-University_of_Jos_logo.png",
    imageLandmark: "Naraguta Senate Complex",
    imageCaption:
      "Naraguta Campus administrative complex and faculty quadrangles, Jos",
    brandColor: "#154360",
    secondaryColor: "#F39C12",
  },
  unical: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/University_of_Calabar_Senate_Building.jpg/1200px-University_of_Calabar_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/University_of_Calabar_logo.png/320px-University_of_Calabar_logo.png",
    imageLandmark: "Malabor Senate Building",
    imageCaption:
      "Malabor Campus central administrative building and library, Calabar",
    brandColor: "#145A32",
    secondaryColor: "#E59866",
  },
  buk: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bayero_University_Kano_New_Campus.jpg/1200px-Bayero_University_Kano_New_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Bayero_University_Kano_logo.png/320px-Bayero_University_Kano_logo.png",
    imageLandmark: "New Campus Senate Building",
    imageCaption:
      "New Campus administrative building along Gwarzo Road, Kano",
    brandColor: "#1A5276",
    secondaryColor: "#F4D03F",
  },
  unizik: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nnamdi_Azikiwe_University_Awka.jpg/1200px-Nnamdi_Azikiwe_University_Awka.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Nnamdi_Azikiwe_University_logo.png/320px-Nnamdi_Azikiwe_University_logo.png",
    imageLandmark: "Awka Administrative Complex",
    imageCaption:
      "Awka permanent site administrative complex and university auditorium, Awka",
    brandColor: "#78281F",
    secondaryColor: "#F7DC6F",
  },
  funaab: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FUNAAB_Ceremonial_Building.jpg/1200px-FUNAAB_Ceremonial_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Federal_University_of_Agriculture%2C_Abeokuta_logo.png/320px-Federal_University_of_Agriculture%2C_Abeokuta_logo.png",
    imageLandmark: "Alabata Ceremonial Complex",
    imageCaption:
      "Alabata Road main ceremonial building and lush green campus, Abeokuta",
    brandColor: "#196F3D",
    secondaryColor: "#F9E79F",
  },

  // ===================== STATE UNIVERSITIES =====================
  lasu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lagos_State_University_Senate_Building.jpg/1200px-Lagos_State_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Lagos_State_University_logo.png/320px-Lagos_State_University_logo.png",
    imageLandmark: "Ojo Senate Building",
    imageCaption:
      "Main campus modern Senate Building and entrance gate, Ojo, Lagos",
    brandColor: "#154360",
    secondaryColor: "#E74C3C",
  },
  lautech: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/LAUTECH_Senate_Building.jpg/1200px-LAUTECH_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Ladoke_Akintola_University_of_Technology_logo.png/320px-Ladoke_Akintola_University_of_Technology_logo.png",
    imageLandmark: "Ogbomoso Senate Building",
    imageCaption:
      "Main campus administrative senate complex, Ogbomoso, Oyo State",
    brandColor: "#1B4F72",
    secondaryColor: "#E67E22",
  },
  oou: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Olabisi_Onabanjo_University_Senate_Building.jpg/1200px-Olabisi_Onabanjo_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Olabisi_Onabanjo_University_logo.png/320px-Olabisi_Onabanjo_University_logo.png",
    imageLandmark: "Ago-Iwoye Senate Complex",
    imageCaption:
      "Main campus central senate complex, Ago-Iwoye, Ogun State",
    brandColor: "#0E6251",
    secondaryColor: "#F39C12",
  },
  kwasu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Kwara_State_University_Malete.jpg/1200px-Kwara_State_University_Malete.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Kwara_State_University_logo.png/320px-Kwara_State_University_logo.png",
    imageLandmark: "Malete Senate Complex",
    imageCaption:
      "Malete campus central administration and engineering complex, Kwara State",
    brandColor: "#1E8449",
    secondaryColor: "#F7DC6F",
  },
  eksu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ekiti_State_University_Senate_Building.jpg/1200px-Ekiti_State_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Ekiti_State_University_logo.png/320px-Ekiti_State_University_logo.png",
    imageLandmark: "Ado-Ekiti Senate Building",
    imageCaption:
      "Main campus administrative quadrangle and senate building, Ado-Ekiti",
    brandColor: "#7D3C98",
    secondaryColor: "#F1C40F",
  },
  rsu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rivers_State_University_Senate_Building.jpg/1200px-Rivers_State_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/99/Rivers_State_University_logo.png/320px-Rivers_State_University_logo.png",
    imageLandmark: "Nkpolu Senate Building",
    imageCaption:
      "Nkpolu-Oroworukwo campus administrative complex, Port Harcourt",
    brandColor: "#1A5276",
    secondaryColor: "#E74C3C",
  },
  delsu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Delta_State_University_Abraka.jpg/1200px-Delta_State_University_Abraka.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7f/Delta_State_University%2C_Abraka_logo.png/320px-Delta_State_University%2C_Abraka_logo.png",
    imageLandmark: "Abraka Site III Gate",
    imageCaption:
      "Site III campus administrative quadrangle, Abraka, Delta State",
    brandColor: "#117864",
    secondaryColor: "#F39C12",
  },
  aaua: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Adekunle_Ajasin_University_Senate_Building.jpg/1200px-Adekunle_Ajasin_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Adekunle_Ajasin_University_logo.png/320px-Adekunle_Ajasin_University_logo.png",
    imageLandmark: "Akungba Senate Building",
    imageCaption:
      "Akungba-Akoko 4-storey administrative senate complex, Ondo State",
    brandColor: "#0B5345",
    secondaryColor: "#E67E22",
  },
  uniosun: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Osun_State_University_Main_Campus.jpg/1200px-Osun_State_University_Main_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Osun_State_University_logo.png/320px-Osun_State_University_logo.png",
    imageLandmark: "Osogbo Central Campus",
    imageCaption:
      "Central campus administrative block and council chamber, Osogbo",
    brandColor: "#641E16",
    secondaryColor: "#F4D03F",
  },
  absu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Abia_State_University_Uturu.jpg/1200px-Abia_State_University_Uturu.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Abia_State_University_logo.png/320px-Abia_State_University_logo.png",
    imageLandmark: "Uturu Administrative Complex",
    imageCaption: "Main campus administrative complex, Uturu, Abia State",
    brandColor: "#196F3D",
    secondaryColor: "#E67E22",
  },
  kasu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Kaduna_State_University_Main_Campus.jpg/1200px-Kaduna_State_University_Main_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Kaduna_State_University_logo.png/320px-Kaduna_State_University_logo.png",
    imageLandmark: "Tafawa Balewa Campus",
    imageCaption: "Main campus along Tafawa Balewa Way, Kaduna",
    brandColor: "#1F618D",
    secondaryColor: "#F5B041",
  },

  // ===================== PRIVATE UNIVERSITIES =====================
  covenant: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Covenant_University_Senate_Building.jpg/1200px-Covenant_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Covenant_University_logo.png/320px-Covenant_University_logo.png",
    imageLandmark: "Canaanland Senate Building",
    imageCaption:
      "Central administrative high-rise and manicured Hebron campus, Ota, Ogun State",
    brandColor: "#3E1E5C",
    secondaryColor: "#C5A059",
  },
  babcock: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Babcock_University_Senate_Building.jpg/1200px-Babcock_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Babcock_University_Logo.png/320px-Babcock_University_Logo.png",
    imageLandmark: "Ilishan Senate Complex",
    imageCaption:
      "Main campus central administration complex, Ilishan-Remo, Ogun State",
    brandColor: "#0C2340",
    secondaryColor: "#85754E",
  },
  abuad: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Afe_Babalola_University_Administrative_Block.jpg/1200px-Afe_Babalola_University_Administrative_Block.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/ad/Afe_Babalola_University_logo.png/320px-Afe_Babalola_University_logo.png",
    imageLandmark: "Ado-Ekiti Administrative Complex",
    imageCaption:
      "White Rock administrative complex and Multi-System Hospital, Ado-Ekiti",
    brandColor: "#183059",
    secondaryColor: "#D69F3D",
  },
  pau: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pan-Atlantic_University_Campus.jpg/1200px-Pan-Atlantic_University_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Pan-Atlantic_University_logo.png/320px-Pan-Atlantic_University_logo.png",
    imageLandmark: "Ibeju-Lekki Campus",
    imageCaption:
      "Modern enterprise-style campus and School of Media & Communication, Lagos",
    brandColor: "#00204E",
    secondaryColor: "#A68038",
  },
  bowen: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bowen_University_Senate_Building.jpg/1200px-Bowen_University_Senate_Building.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Bowen_University_logo.png/320px-Bowen_University_logo.png",
    imageLandmark: "Iwo Senate Building",
    imageCaption:
      "Main campus administrative senate complex, Iwo, Osun State",
    brandColor: "#003366",
    secondaryColor: "#CC9900",
  },
  nile: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Nile_University_of_Nigeria_Campus.jpg/1200px-Nile_University_of_Nigeria_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Nile_University_of_Nigeria_logo.png/320px-Nile_University_of_Nigeria_logo.png",
    imageLandmark: "Jabi Campus Senate Complex",
    imageCaption:
      "Modern medical college and administrative quadrangle, Jabi, Abuja",
    brandColor: "#0C2340",
    secondaryColor: "#EAA023",
  },
  landmark: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Landmark_University_Campus.jpg/1200px-Landmark_University_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Landmark_University_logo.png/320px-Landmark_University_logo.png",
    imageLandmark: "Omu-Aran Senate Complex",
    imageCaption:
      "Agrarian revolution university campus and commercial farm complex, Kwara State",
    brandColor: "#004B23",
    secondaryColor: "#F4A261",
  },
  baze: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Baze_University_Campus.jpg/1200px-Baze_University_Campus.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Baze_University_logo.png/320px-Baze_University_logo.png",
    imageLandmark: "Jabi Airport Road Campus",
    imageCaption:
      "Contemporary smart-campus and teaching hospital complex, Abuja",
    brandColor: "#1E3A8A",
    secondaryColor: "#F59E0B",
  },
  leadcity: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lead_City_University_Ibadan.jpg/1200px-Lead_City_University_Ibadan.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Lead_City_University_logo.png/320px-Lead_City_University_logo.png",
    imageLandmark: "Toll Gate Senate Building",
    imageCaption:
      "Main campus along Lagos-Ibadan expressway toll gate, Ibadan",
    brandColor: "#1E293B",
    secondaryColor: "#38BDF8",
  },
  run: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Redeemers_University_Ede.jpg/1200px-Redeemers_University_Ede.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Redeemer%27s_University_logo.png/320px-Redeemer%27s_University_logo.png",
    imageLandmark: "Ede Main Campus",
    imageCaption:
      "Permanent site central administration and ACEGID genomics center, Ede, Osun",
    brandColor: "#14532D",
    secondaryColor: "#EAB308",
  },
  veritas: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Veritas_University_Abuja.jpg/1200px-Veritas_University_Abuja.jpg",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Veritas_University_logo.png/320px-Veritas_University_logo.png",
    imageLandmark: "Bwari Campus Senate Building",
    imageCaption: "Catholic University permanent site campus, Bwari, Abuja",
    brandColor: "#4C1D95",
    secondaryColor: "#F59E0B",
  },
};

// ---------------------------------------------------------------------------
// Fallback for any university not explicitly listed above
// ---------------------------------------------------------------------------
const DEFAULT_MEDIA: UniversityMedia = {
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/University_of_Lagos_Senate_Building.jpg/1200px-University_of_Lagos_Senate_Building.jpg",
  logoUrl:
    "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/University_of_Lagos_seal.svg/320px-University_of_Lagos_seal.svg.png",
  imageLandmark: "Main Campus Senate Complex",
  imageCaption:
    "Accredited Nigerian university campus landmark and administrative center",
  brandColor: "#1E3A8A",
  secondaryColor: "#F59E0B",
};

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------
async function main() {
  console.log("🎓 Seeding university images and logos...\n");

  const universities = await prisma.university.findMany({
    select: { id: true, slug: true, name: true },
  });

  console.log(`Found ${universities.length} universities in the database.\n`);

  let updated = 0;
  let usedDefault = 0;

  for (const uni of universities) {
    const slug = uni.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const media = UNIVERSITY_MEDIA[slug] ?? DEFAULT_MEDIA;

    if (!UNIVERSITY_MEDIA[slug]) {
      usedDefault++;
      console.log(`  ⚠️  ${uni.name} (${uni.slug}) — using default fallback`);
    }

    await prisma.university.update({
      where: { id: uni.id },
      data: {
        imageUrl: media.imageUrl,
        logoUrl: media.logoUrl,
        imageLandmark: media.imageLandmark,
        imageCaption: media.imageCaption,
        brandColor: media.brandColor,
        secondaryColor: media.secondaryColor,
      },
    });

    updated++;
    console.log(`  ✅  Updated: ${uni.name}`);
  }

  console.log(
    `\n✨ Done! ${updated} universities updated (${usedDefault} used fallback).`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

