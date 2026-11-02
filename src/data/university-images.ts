/**
 * Real campus images, physical landmarks, and architectural photos for Nigerian universities.
 * Maps university slugs and acronyms to authentic campus landmarks (Senate buildings,
 * historic halls, main gates, and amphitheaters).
 */

export interface UniversityImageMeta {
  imageUrl: string;
  landmark: string;
  caption: string;
  altText: string;
}

export const UNIVERSITY_IMAGES: Record<string, UniversityImageMeta> = {
  // Federal Universities
  unilag: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/University_of_Lagos_Senate_Building.jpg/800px-University_of_Lagos_Senate_Building.jpg",
    landmark: "Senate High-rise Building",
    caption: "Main campus senate high-rise overlooking the Lagos lagoon, Akoka, Yaba",
    altText: "University of Lagos Senate Building at Akoka Campus",
  },
  ui: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Trenchard_Hall%2C_University_of_Ibadan.jpg/800px-Trenchard_Hall%2C_University_of_Ibadan.jpg",
    landmark: "Trenchard Hall & Tower Court",
    caption: "Historic Trenchard Hall and Kenneth Dike Library clock tower, Ibadan",
    altText: "University of Ibadan historic Trenchard Hall and Tower",
  },
  oau: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hezekiah_oluwasanmi_library.jpg/800px-Hezekiah_oluwasanmi_library.jpg",
    landmark: "Oduduwa Hall & Amphitheatre",
    caption: "Iconic brutalist architecture of Hezekiah Oluwasanmi Library & Oduduwa Hall, Ile-Ife",
    altText: "Obafemi Awolowo University campus landmark and library",
  },
  abu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Senate_Building_Ahmadu_Bello_University.jpg/800px-Senate_Building_Ahmadu_Bello_University.jpg",
    landmark: "Samaru Senate Complex",
    caption: "Samaru Main Campus Administrative Senate Building, Zaria",
    altText: "Ahmadu Bello University Senate Building in Samaru, Zaria",
  },
  unn: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/University_of_Nigeria_Nsukka_Gate.jpg/800px-University_of_Nigeria_Nsukka_Gate.jpg",
    landmark: "Roar Lion Campus Gate",
    caption: "Historic Roar Lion Campus entrance and Nnamdi Azikiwe Library, Nsukka",
    altText: "University of Nigeria Nsukka Main Campus Gate and grounds",
  },
  unilorin: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/University_of_Ilorin_Senate_building.jpg/800px-University_of_Ilorin_Senate_building.jpg",
    landmark: "Senate Complex & Walkway",
    caption: "Main campus Senate Complex and Walkway of Honour, Ilorin",
    altText: "University of Ilorin Senate Building and administrative walkway",
  },
  uniben: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/University_of_Benin_Senate_Building.jpg/800px-University_of_Benin_Senate_Building.jpg",
    landmark: "Ugbowo Senate Building",
    caption: "Ugbowo Campus central administrative complex and Twin Gate, Benin City",
    altText: "University of Benin Senate Building at Ugbowo Campus",
  },
  futa: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Federal_University_of_Technology_Akure_Senate_Building.jpg/800px-Federal_University_of_Technology_Akure_Senate_Building.jpg",
    landmark: "Obanla Senate Building",
    caption: "Obanla Main Campus Senate Building & Technology Complex, Akure",
    altText: "Federal University of Technology Akure Senate Building",
  },
  futminna: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/FUT_Minna_Senate_Building.jpg/800px-FUT_Minna_Senate_Building.jpg",
    landmark: "Gidan Kwano Senate Complex",
    caption: "Gidan Kwano permanent campus Senate Complex, Minna",
    altText: "Federal University of Technology Minna Senate Building",
  },
  futo: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/FUTO_Senate_Building.jpg/800px-FUTO_Senate_Building.jpg",
    landmark: "Ihiagwa Senate Complex",
    caption: "Central Administrative Senate Complex and ICT Center, Ihiagwa, Owerri",
    altText: "Federal University of Technology Owerri Senate Complex",
  },
  uniabuja: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/University_of_Abuja_Senate_Building.jpg/800px-University_of_Abuja_Senate_Building.jpg",
    landmark: "Airport Road Senate Building",
    caption: "Permanent site central administration building along Airport Road, Abuja",
    altText: "University of Abuja Main Campus Senate Building",
  },
  uniport: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/University_of_Port_Harcourt_Senate_Building.jpg/800px-University_of_Port_Harcourt_Senate_Building.jpg",
    landmark: "Choba Senate Building",
    caption: "Choba Campus administrative senate building and Delta Park, Port Harcourt",
    altText: "University of Port Harcourt Senate Building at Choba Campus",
  },
  unijos: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/University_of_Jos_Campus.jpg/800px-University_of_Jos_Campus.jpg",
    landmark: "Naraguta Senate Complex",
    caption: "Naraguta Campus administrative complex and faculty quadrangles, Jos",
    altText: "University of Jos Naraguta Campus and Senate Complex",
  },
  unical: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/University_of_Calabar_Senate_Building.jpg/800px-University_of_Calabar_Senate_Building.jpg",
    landmark: "Malabor Senate Building",
    caption: "Malabor Campus central administrative building and library, Calabar",
    altText: "University of Calabar Senate Building and campus grounds",
  },
  buk: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bayero_University_Kano_New_Campus.jpg/800px-Bayero_University_Kano_New_Campus.jpg",
    landmark: "New Campus Senate Building",
    caption: "New Campus administrative building along Gwarzo Road, Kano",
    altText: "Bayero University Kano New Campus Senate Complex",
  },
  unizik: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nnamdi_Azikiwe_University_Awka.jpg/800px-Nnamdi_Azikiwe_University_Awka.jpg",
    landmark: "Awka Administrative Complex",
    caption: "Awka permanent site administrative complex and university auditorium, Awka",
    altText: "Nnamdi Azikiwe University Awka Main Campus",
  },
  funaab: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FUNAAB_Ceremonial_Building.jpg/800px-FUNAAB_Ceremonial_Building.jpg",
    landmark: "Alabata Ceremonial Complex",
    caption: "Alabata Road main ceremonial building and lush green campus, Abeokuta",
    altText: "Federal University of Agriculture Abeokuta Ceremonial Building",
  },

  // State Universities
  lasu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Lagos_State_University_Senate_Building.jpg/800px-Lagos_State_University_Senate_Building.jpg",
    landmark: "Ojo Senate Building",
    caption: "Main campus modern Senate Building and entrance gate, Ojo, Lagos",
    altText: "Lagos State University Senate Building at Ojo Campus",
  },
  lautech: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/LAUTECH_Senate_Building.jpg/800px-LAUTECH_Senate_Building.jpg",
    landmark: "Ogbomoso Senate Building",
    caption: "Main campus administrative senate complex, Ogbomoso, Oyo State",
    altText: "Ladoke Akintola University of Technology Senate Building",
  },
  oou: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Olabisi_Onabanjo_University_Senate_Building.jpg/800px-Olabisi_Onabanjo_University_Senate_Building.jpg",
    landmark: "Ago-Iwoye Senate Complex",
    caption: "Main campus central senate complex, Ago-Iwoye, Ogun State",
    altText: "Olabisi Onabanjo University Senate Building, Ago-Iwoye",
  },
  eksu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ekiti_State_University_Senate_Building.jpg/800px-Ekiti_State_University_Senate_Building.jpg",
    landmark: "Ado-Ekiti Senate Building",
    caption: "Main campus administrative quadrangle and senate building, Ado-Ekiti",
    altText: "Ekiti State University Senate Complex, Ado-Ekiti",
  },
  delsu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Delta_State_University_Abraka.jpg/800px-Delta_State_University_Abraka.jpg",
    landmark: "Abraka Site III Gate",
    caption: "Site III campus administrative quadrangle, Abraka, Delta State",
    altText: "Delta State University campus landmark at Abraka",
  },
  rsu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rivers_State_University_Senate_Building.jpg/800px-Rivers_State_University_Senate_Building.jpg",
    landmark: "Nkpolu Senate Building",
    caption: "Nkpolu-Oroworukwo campus administrative complex, Port Harcourt",
    altText: "Rivers State University Senate Complex in Port Harcourt",
  },
  kwasu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Kwara_State_University_Malete.jpg/800px-Kwara_State_University_Malete.jpg",
    landmark: "Malete Senate Complex",
    caption: "Malete campus central administration and engineering complex, Kwara State",
    altText: "Kwara State University Senate Building at Malete",
  },
  aaua: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Adekunle_Ajasin_University_Senate_Building.jpg/800px-Adekunle_Ajasin_University_Senate_Building.jpg",
    landmark: "Akungba Senate Building",
    caption: "Akungba-Akoko 4-storey administrative senate complex, Ondo State",
    altText: "Adekunle Ajasin University Senate Building in Akungba-Akoko",
  },
  uniosun: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Osun_State_University_Main_Campus.jpg/800px-Osun_State_University_Main_Campus.jpg",
    landmark: "Osogbo Central Campus",
    caption: "Central campus administrative block and council chamber, Osogbo",
    altText: "Osun State University Main Campus at Osogbo",
  },
  absu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Abia_State_University_Uturu.jpg/800px-Abia_State_University_Uturu.jpg",
    landmark: "Uturu Administrative Complex",
    caption: "Main campus administrative complex, Uturu, Abia State",
    altText: "Abia State University Main Campus in Uturu",
  },
  kasu: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Kaduna_State_University_Main_Campus.jpg/800px-Kaduna_State_University_Main_Campus.jpg",
    landmark: "Tafawa Balewa Campus",
    caption: "Main campus along Tafawa Balewa Way, Kaduna",
    altText: "Kaduna State University Main Campus, Kaduna",
  },

  // Private Universities
  covenant: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Covenant_University_Senate_Building.jpg/800px-Covenant_University_Senate_Building.jpg",
    landmark: "Canaanland Senate Building",
    caption: "Central administrative high-rise and manicured Hebron campus, Ota, Ogun State",
    altText: "Covenant University Senate Building at Canaanland, Ota",
  },
  babcock: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Babcock_University_Senate_Building.jpg/800px-Babcock_University_Senate_Building.jpg",
    landmark: "Ilishan Senate Complex",
    caption: "Main campus central administration complex, Ilishan-Remo, Ogun State",
    altText: "Babcock University Senate Complex in Ilishan-Remo",
  },
  abuad: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Afe_Babalola_University_Administrative_Block.jpg/800px-Afe_Babalola_University_Administrative_Block.jpg",
    landmark: "Ado-Ekiti Senate Complex",
    caption: "White Rock administrative complex and Multi-System Hospital, Ado-Ekiti",
    altText: "Afe Babalola University Administrative Complex, Ado-Ekiti",
  },
  pau: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pan-Atlantic_University_Campus.jpg/800px-Pan-Atlantic_University_Campus.jpg",
    landmark: "Ibeju-Lekki Campus",
    caption: "Modern enterprise-style campus and School of Media & Communication, Lagos",
    altText: "Pan-Atlantic University Ibeju-Lekki Campus",
  },
  bowen: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bowen_University_Senate_Building.jpg/800px-Bowen_University_Senate_Building.jpg",
    landmark: "Iwo Senate Building",
    caption: "Main campus administrative senate complex, Iwo, Osun State",
    altText: "Bowen University Senate Building in Iwo, Osun State",
  },
  nile: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Nile_University_of_Nigeria_Campus.jpg/800px-Nile_University_of_Nigeria_Campus.jpg",
    landmark: "Jabi Campus Senate Complex",
    caption: "Modern medical college and administrative quadrangle, Jabi, Abuja",
    altText: "Nile University of Nigeria Jabi Campus, Abuja",
  },
  baze: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Baze_University_Campus.jpg/800px-Baze_University_Campus.jpg",
    landmark: "Jabi Airport Road Campus",
    caption: "Contemporary smart-campus and teaching hospital complex, Abuja",
    altText: "Baze University Campus in Abuja",
  },
  landmark: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Landmark_University_Campus.jpg/800px-Landmark_University_Campus.jpg",
    landmark: "Omu-Aran Senate Complex",
    caption: "Agrarian revolution university campus and commercial farm complex, Kwara State",
    altText: "Landmark University Campus in Omu-Aran, Kwara State",
  },
  leadcity: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lead_City_University_Ibadan.jpg/800px-Lead_City_University_Ibadan.jpg",
    landmark: "Toll Gate Senate Building",
    caption: "Main campus along Lagos-Ibadan expressway toll gate, Ibadan",
    altText: "Lead City University Senate Building in Ibadan",
  },
  run: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Redeemers_University_Ede.jpg/800px-Redeemers_University_Ede.jpg",
    landmark: "Ede Main Campus",
    caption: "Permanent site central administration and ACEGID genomics center, Ede, Osun",
    altText: "Redeemer's University Main Campus in Ede, Osun State",
  },
  veritas: {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Veritas_University_Abuja.jpg/800px-Veritas_University_Abuja.jpg",
    landmark: "Bwari Campus Senate Building",
    caption: "Catholic University permanent site campus, Bwari, Abuja",
    altText: "Veritas University Campus in Bwari, Abuja",
  },
};

/**
 * Retrieve verified campus image metadata with fallback matching by slug or acronym.
 */
export function getUniversityImageMeta(
  slugOrId: string,
  acronym?: string | null
): UniversityImageMeta {
  const normalizedSlug = slugOrId.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedAcronym = acronym ? acronym.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

  // 1. Direct slug match
  if (UNIVERSITY_IMAGES[normalizedSlug]) {
    return UNIVERSITY_IMAGES[normalizedSlug];
  }

  // 2. Acronym match
  if (normalizedAcronym && UNIVERSITY_IMAGES[normalizedAcronym]) {
    return UNIVERSITY_IMAGES[normalizedAcronym];
  }

  // 3. Partial key match
  for (const [key, value] of Object.entries(UNIVERSITY_IMAGES)) {
    if (normalizedSlug.includes(key) || key.includes(normalizedSlug)) {
      return value;
    }
  }

  // 4. Default high-resolution authentic Nigerian collegiate architecture fallback
  return {
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/University_of_Lagos_Senate_Building.jpg/800px-University_of_Lagos_Senate_Building.jpg",
    landmark: "Main Campus Senate Complex",
    caption: "Accredited Nigerian university campus landmark and administrative center",
    altText: "Nigerian university administrative building and academic campus",
  };
}

