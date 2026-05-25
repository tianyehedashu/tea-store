/**
 * 与 backend seed 中 product.metadata.origin_id 对齐的产地目录。
 * Sanity 无数据时作为 Origins 页回落内容；上线 CMS 后以 Sanity 为准。
 */
import { CDN_VIDEO_ASSETS } from "@lib/constants/video-assets"
import { CdnVideo } from "@lib/types/cdn-video"

export type OriginCatalogEntry = {
  slug: string
  title: string
  country?: string
  region?: string
  mountain?: string
  flavorProfile?: string[]
  summary: string
  description: string
  climate?: string
  soil?: string
  altitude?: string
  harvestSeason?: string
  highlights?: string[]
  teaStyles?: string[]
  history?: string
  /** Next public 路径，如 /images/origins/longjing-hero.jpg */
  heroImagePath?: string
  heroVideo?: CdnVideo
  storyVideo?: CdnVideo
  productHandles: string[]
}

export const ORIGIN_CATALOG: OriginCatalogEntry[] = [
  {
    slug: "longjing",
    title: "West Lake Longjing",
    country: "China",
    region: "Zhejiang",
    mountain: "Hangzhou, West Lake",
    flavorProfile: ["chestnut", "fresh", "sweet", "vegetal"],
    summary:
      "Misty lake hills and hand-panning traditions shape China's most celebrated green tea.",
    description:
      "Longjing (Dragon Well) grows on the gentle slopes around West Lake in Hangzhou, where spring mist and careful pan-firing create a signature flat leaf and nutty sweetness. Gardens here favor early harvests—often before Qingming—when buds are tight and aroma is at its brightest. Zentee sources from partners who follow traditional kill-green and pressing in woks rather than belt roasting, preserving the chestnut and fresh pea notes collectors expect.",
    climate:
      "Humid subtropical with lake-moderated temperatures; frequent spring fog slows leaf growth and concentrates flavor.",
    soil: "Acidic red and yellow earth with granite undertones; well-drained terraces above the lake.",
    altitude: "100–350 m",
    harvestSeason: "Early spring (pre-Qingming buds most prized)",
    teaStyles: ["Pan-roasted green tea (Longjing / Dragon Well)"],
    highlights: [
      "UNESCO-adjacent terroir around West Lake cultural landscape",
      "Hand-panning in iron woks for flat, jade-green leaves",
      "Ming Qian (pre-Qingming) harvest commands premium sweetness",
      "Pairs with light seafood and vegetarian dishes",
    ],
    history:
      "Longjing received imperial favor during the Qing dynasty and remains a benchmark for Chinese green tea. The name refers to an old well whose water was said to twist like a dragon—local lore still shapes how the tea is marketed and enjoyed today.",
    heroImagePath: "/images/origins/longjing-hero.jpg",
    heroVideo: CDN_VIDEO_ASSETS.teaPlantationField,
    storyVideo: {
      ...CDN_VIDEO_ASSETS.hotWaterTeaCup,
      title: "Spring leaf to clear cup",
      description:
        "A short brewing reel pairs Longjing's garden story with the gentle water temperature that keeps green tea sweet.",
    },
    productHandles: ["longjing-green-tea"],
  },
  {
    slug: "anxi",
    title: "Anxi Oolong Country",
    country: "China",
    region: "Fujian",
    mountain: "Anxi County",
    flavorProfile: ["floral", "orchid", "honey", "creamy"],
    summary:
      "High-elevation gardens in southern Fujian—the birthplace of Tieguanyin and floral oolongs.",
    description:
      "Anxi sits in the rolling hills of Fujian's interior, where Tieguanyin and related cultivars thrive in rocky, mineral-rich soil. Skilled farmers balance oxidation and roasting to highlight orchid aromatics without losing the tea's natural honeyed finish. Our Anxi-sourced oolongs are crafted for gongfu service: short infusions that open layer after layer of fragrance.",
    climate:
      "Subtropical monsoon with high rainfall; mountain valleys trap mist through autumn harvests.",
    soil: "Sandy loam over granite and shale; low pH suits tieguanyin cultivars.",
    altitude: "600–1,000 m",
    harvestSeason: "Spring and autumn (autumn often more aromatic)",
    teaStyles: [
      "Light-roasted oolong (Tieguanyin)",
      "Semi-oxidized ball-rolled oolong",
    ],
    highlights: [
      "Home of the Tieguanyin cultivar and ball-rolled oolong craft",
      "Rocky soils contribute minerality and long-lasting aftertaste",
      "Ideal for multiple short steeps in gaiwan or yixing pot",
      "Floral profile without heavy charcoal roast",
    ],
    history:
      "Legends tie Tieguanyin to a devout farmer and a vision of Guanyin; whether myth or marketing, the cultivar has defined Anxi's economy for centuries. Modern gardens blend heritage processing with selective oxidation for export and specialty markets.",
    heroImagePath: "/images/origins/anxi-hero.jpg",
    heroVideo: CDN_VIDEO_ASSETS.teaPlantations,
    storyVideo: {
      ...CDN_VIDEO_ASSETS.teaPlantations,
      title: "Oolong country in motion",
      description:
        "Terraced green slopes help frame Anxi's layered oxidation and roasting traditions before the cup opens.",
    },
    productHandles: ["tieguanyin-oolong"],
  },
  {
    slug: "yunnan",
    title: "Yunnan Highlands",
    country: "China",
    region: "Yunnan",
    mountain: "Dianhong & Puer gardens",
    flavorProfile: ["malt", "honey", "earthy", "dates"],
    summary:
      "Ancient tea forests, bold black teas, and aged puer from China's southwestern frontier.",
    description:
      "Yunnan's biodiversity and elevation span create one of the world's most distinctive tea landscapes—from sun-dried puer in Xishuangbanna to malty Dianhong blacks in Lincang. Large-leaf assamica varieties yield rich, forgiving cups that take milk well or age for years in cake form. Zentee highlights both everyday drinking blacks and cellar-worthy shu puer for collectors exploring depth and calm energy.",
    climate:
      "Plateau monsoon and subtropical zones; warm winters allow year-round leaf growth in many areas.",
    soil: "Rich red clay and forest humus; ancient tree roots draw minerals from deep strata.",
    altitude: "1,200–2,000 m (gardens vary widely)",
    harvestSeason: "Spring through autumn; puer maocha often spring-picked",
    teaStyles: [
      "Dianhong black tea",
      "Sheng and shu puer (compressed cakes)",
      "Sun-dried large-leaf reds",
    ],
    highlights: [
      "Assamica large-leaf genetics unique to the region",
      "Shu puer wet-pile fermentation for earthy, smooth profiles",
      "Dianhong golden tips prized for malt and honey",
      "Suitable for thermos brewing and long aging",
    ],
    history:
      "Yunnan is often cited as a cradle of tea culture, with trade routes carrying compressed tea north for centuries. Today's market blends village maocha with factory blending—transparency in harvest year and fermentation matters for serious drinkers.",
    heroImagePath: "/images/origins/yunnan-hero.jpg",
    heroVideo: CDN_VIDEO_ASSETS.teaPlantationField,
    storyVideo: {
      ...CDN_VIDEO_ASSETS.makingChai,
      title: "Highland leaves, patient brewing",
      description:
        "A warm preparation scene gives Yunnan's black teas and puer a slower, richer visual rhythm.",
    },
    productHandles: ["yunnan-dianhong-black", "shu-puer-cake-2019"],
  },
  {
    slug: "fujian",
    title: "Fujian White Tea Gardens",
    country: "China",
    region: "Fujian",
    mountain: "Fuding & Zhenghe",
    flavorProfile: ["sweet", "delicate", "floral", "hay"],
    summary:
      "Coastal and inland Fujian—where silver needles and white peonies are withered with minimal handling.",
    description:
      "Fujian's white tea tradition favors gentle withering and baking over rolling or heavy oxidation, letting bud and leaf structure show through in the cup. Fuding Silver Needle and nearby styles emphasize downy buds picked in clear spring weather. The result is a pale liquor, soft sweetness, and low astringency—ideal for slow mornings or mindful brewing at lower temperatures.",
    climate:
      "Maritime-influenced subtropical coast; inland pockets cooler for slow withering.",
    soil: "Red and yellow acidic soils; coastal humidity supports even drying.",
    altitude: "400–800 m",
    harvestSeason: "Early spring (bud-only picks for Silver Needle)",
    teaStyles: ["Silver Needle (Bai Hao Yin Zhen)", "White Peony (Bai Mu Dan)"],
    highlights: [
      "Minimal processing preserves natural bud sweetness",
      "Organic and traditional shade-drying common in premium lots",
      "Low caffeine relative to many blacks; gentle on the stomach",
      "Best with 75–85°C water and longer first steep",
    ],
    history:
      "White tea's commercial rise is relatively recent compared to green or oolong, yet Fujian processors have codified grades around bud count and leaf ratio. Export demand has expanded gardens while rewarding hand-picked spring lots.",
    heroImagePath: "/images/origins/fujian-hero.jpg",
    heroVideo: CDN_VIDEO_ASSETS.teaPlantations,
    storyVideo: {
      ...CDN_VIDEO_ASSETS.kettleToMug,
      title: "Gentle water for delicate buds",
      description:
        "Soft pouring motion matches Fujian white tea's minimal processing and lower-temperature brewing style.",
    },
    productHandles: ["silver-needle-white-tea"],
  },
]
