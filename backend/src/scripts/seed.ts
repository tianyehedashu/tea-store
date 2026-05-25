import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  deleteProductsWorkflow,
  deleteInventoryItemWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
// 移除本地文件复制与自定义 URL 构造，改用前端公共静态资源路径

// 使用 Medusa 默认静态目录（/static）构造可访问的图片 URL
const backendStatic = (fileName: string) => {
  const base = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  return `${base}/static/${fileName}`
}

const coverrVideo = (
  slug: string,
  title: string,
  description: string,
  sourceUrl = "https://coverr.co/stock-video-footage/tea"
) => ({
  title,
  description,
  url: `https://cdn.coverr.co/videos/${slug}/1080p.mp4`,
  poster: `https://cdn.coverr.co/videos/${slug}/thumbnail?width=1280`,
  sourceLabel: "Coverr",
  sourceUrl,
})

const teaVideos = {
  teaPlantationField: coverrVideo(
    "coverr-indian-tea-plantation-field-3668",
    "Tea garden rows from above",
    "Aerial garden footage for origin and sourcing context.",
    "https://coverr.co/videos/indian-tea-plantation-field-b3xoxoobkk"
  ),
  teaPlantations: coverrVideo(
    "coverr-indian-tea-plantations-4182",
    "Tea terraces in motion",
    "Green tea terraces with a calm garden-to-cup mood."
  ),
  hotWaterTeaCup: coverrVideo(
    "coverr-hot-water-being-poured-into-a-cup-of-tea-8891",
    "Hot water over tea leaves",
    "Close-up brewing motion for product rituals."
  ),
  chaiPouring: coverrVideo(
    "coverr-pouring-chai-tea-into-cups-4442",
    "Warm tea service",
    "Tea poured into cups for deeper and spiced cup profiles."
  ),
  makingChai: coverrVideo(
    "coverr-making-chai-tea-in-india-8095",
    "Stovetop tea preparation",
    "A craft preparation scene for richer, patient cups."
  ),
  kettleToMug: coverrVideo(
    "coverr-pouring-hot-water-from-a-kettle-into-a-mug-6801",
    "Daily kettle pour",
    "Simple hot-water brewing motion for herbal and comfort teas."
  ),
  teaAtHome: coverrVideo(
    "coverr-woman-reading-a-book-and-drinking-tea-5917",
    "Quiet tea ritual",
    "A calm at-home tea moment for the culture and story section."
  ),
}

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const storeModuleService = container.resolve(Modules.STORE)

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"]
  const naCountries = ["us", "ca"]

  logger.info("Seeding store data...")
  const [store] = await storeModuleService.listStores()
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    })
    defaultSalesChannel = salesChannelResult
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
          {
            currency_code: "usd",
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  })
  logger.info("Seeding region data...")
  const regionModuleService = container.resolve(Modules.REGION)
  const existingRegions = await regionModuleService.listRegions()

  let region = existingRegions.find((r: any) => r.name === "Europe")
  let regionNA = existingRegions.find((r: any) => r.name === "North America")

  const regionsToCreate: any[] = []
  if (!region) {
    regionsToCreate.push({
      name: "Europe",
      currency_code: "eur",
      countries,
      payment_providers: ["pp_system_default"],
    })
  }
  if (!regionNA) {
    regionsToCreate.push({
      name: "North America",
      currency_code: "usd",
      countries: naCountries,
      payment_providers: ["pp_system_default"],
    })
  }

  if (regionsToCreate.length) {
    const { result: createdRegions } = await createRegionsWorkflow(
      container
    ).run({
      input: {
        regions: regionsToCreate,
      },
    })

    if (!region) {
      region = createdRegions.find((r: any) => r.name === "Europe")
    }
    if (!regionNA) {
      regionNA = createdRegions.find((r: any) => r.name === "North America")
    }
  }
  logger.info("Finished seeding regions.")

  logger.info("Seeding tax regions...")
  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code", "provider_id"],
  })

  const existingKey = new Set(
    (existingTaxRegions || []).map(
      (tr: any) => `${tr.country_code}:${tr.provider_id}`
    )
  )
  const desired = [
    ...countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
    ...naCountries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  ]
  const toCreate = desired.filter(
    (d) => !existingKey.has(`${d.country_code}:${d.provider_id}`)
  )

  if (toCreate.length) {
    await createTaxRegionsWorkflow(container).run({
      input: toCreate,
    })
  }
  logger.info("Finished seeding tax regions.")

  logger.info("Seeding stock location data...")
  let stockLocation: any
  {
    const { data: existingLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id", "name"],
    })
    const found = (existingLocations || []).find(
      (l: any) => l.name === "European Warehouse"
    )
    if (found) {
      stockLocation = found
    } else {
      const { result: stockLocationResult } =
        await createStockLocationsWorkflow(container).run({
          input: {
            locations: [
              {
                name: "European Warehouse",
                address: {
                  city: "Copenhagen",
                  country_code: "DK",
                  address_1: "",
                },
              },
            ],
          },
        })
      stockLocation = stockLocationResult[0]
    }
  }

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  })

  logger.info("Seeding fulfillment data...")
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      })
    shippingProfile = shippingProfileResult[0]
  }

  let fulfillmentSet: any
  {
    const { data: existingSets } = await query.graph({
      entity: "fulfillment_set",
      fields: ["id", "name", "service_zones.id"],
    })
    const foundSet = (existingSets || []).find(
      (s: any) => s.name === "European Warehouse delivery"
    )
    if (foundSet) {
      fulfillmentSet = foundSet
    } else {
      fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "European Warehouse delivery",
        type: "shipping",
        service_zones: [
          {
            name: "Europe",
            geo_zones: [
              {
                country_code: "gb",
                type: "country",
              },
              {
                country_code: "de",
                type: "country",
              },
              {
                country_code: "dk",
                type: "country",
              },
              {
                country_code: "se",
                type: "country",
              },
              {
                country_code: "fr",
                type: "country",
              },
              {
                country_code: "es",
                type: "country",
              },
              {
                country_code: "it",
                type: "country",
              },
              {
                country_code: "us",
                type: "country",
              },
              {
                country_code: "ca",
                type: "country",
              },
            ],
          },
        ],
      })
    }
  }

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  })

  {
    const serviceZoneId = fulfillmentSet.service_zones[0].id
    const desiredOptions = [
      {
        name: "Standard Shipping",
        price_type: "flat" as const,
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          ...(region ? [{ region_id: region.id, amount: 10 }] : []),
          ...(regionNA ? [{ region_id: regionNA.id, amount: 10 }] : []),
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq" as const,
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq" as const,
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat" as const,
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          ...(region ? [{ region_id: region.id, amount: 10 }] : []),
          ...(regionNA ? [{ region_id: regionNA.id, amount: 10 }] : []),
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq" as const,
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq" as const,
          },
        ],
      },
    ]

    const { data: existingOptions } = await query.graph({
      entity: "shipping_option",
      fields: ["id", "code", "provider_id", "service_zone_id"],
    })
    const existingOptionKey = new Set(
      (existingOptions || []).map(
        (o: any) => `${o.code}:${o.provider_id}:${o.service_zone_id}`
      )
    )
    const toCreateOptions = desiredOptions.filter(
      (o) =>
        !existingOptionKey.has(
          `${o.type.code}:${o.provider_id}:${o.service_zone_id}`
        )
    )
    if (toCreateOptions.length) {
      await createShippingOptionsWorkflow(container).run({
        input: toCreateOptions,
      })
    }
  }
  logger.info("Finished seeding fulfillment data.")

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  })
  logger.info("Finished seeding stock location data.")

  logger.info("Seeding publishable API key data...")

  // 检查是否已存在API密钥
  const { data: existingApiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "token", "type"],
  })

  let publishableApiKey: any = (existingApiKeys || []).find(
    (key: any) => key.title === "Webshop" && key.type === "publishable"
  )

  if (!publishableApiKey) {
    // 如果不存在，才创建新的
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
      container
    ).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    })
    publishableApiKey = publishableApiKeyResult[0]

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel[0].id],
      },
    })

    logger.info(
      `✅ New Publishable API Key created: ${publishableApiKey.token}`
    )
  } else {
    logger.info(
      `✅ Using existing Publishable API Key: ${publishableApiKey.token}`
    )
  }

  logger.info("Please add this to your frontend .env.local file:")
  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`)

  logger.info("Finished seeding publishable API key data.")

  logger.info("Seeding product data...")
  const desiredCategories = [
    { name: "Green Tea", is_active: true },
    { name: "Oolong Tea", is_active: true },
    { name: "Black Tea", is_active: true },
    { name: "Puer Tea", is_active: true },
    { name: "White Tea", is_active: true },
    { name: "Herbal Tea", is_active: true },
  ]

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })
  const existingCategoryNames = new Set(
    (existingCategories || []).map((c: any) => c.name)
  )
  const categoriesToCreate = desiredCategories.filter(
    (c) => !existingCategoryNames.has(c.name)
  )
  if (categoriesToCreate.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: categoriesToCreate,
      },
    })
  }
  const { data: categoryResult } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingProductHandles = new Set(
    (existingProducts || []).map((p: any) => p.handle)
  )

  // Removed apparel products - focusing only on tea products

  const teaListingMetadata = (
    overrides: Record<string, unknown>
  ): Record<string, unknown> => ({
    brand_name: "Zentee",
    item_form: "Loose Leaf",
    unit_count: 1,
    manufacturer: "Zentee Tea Co.",
    ingredients: "100% tea leaves.",
    allergen_information:
      "Packed in a facility that may also process tree nuts and gluten.",
    legal_disclaimer:
      "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.",
    country_of_origin: "China",
    ...overrides,
  })

  // Additional tea products for Tea Store domain
  const teaProducts = [
    {
      title: "Longjing Green Tea",
      category_ids: [
        categoryResult.find((cat) => cat.name === "Green Tea")!.id,
      ],
      description:
        "Early spring pan-roasted green tea from Hangzhou. Fresh, sweet, and nutty with chestnut notes.",
      handle: "longjing-green-tea",
      weight: 200,
      origin_country: "cn",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: backendStatic("longjing-1.jpg"),
      images: [
        { url: backendStatic("longjing-1.jpg") },
        { url: backendStatic("longjing-2.jpg") },
      ],
      metadata: {
        ...teaListingMetadata({
          organic_certified: true,
          caffeine_level: "Medium",
          bullet_points: [
            "Authentic Hangzhou Longjing pan-roasted green tea",
            "Early spring harvest with chestnut and sweet vegetal notes",
            "Loose leaf format for gongfu or Western steeping",
            "Premium grade leaves from West Lake terroir",
            "Packed fresh at source for vibrant aroma",
          ],
        }),
        tea_type: "green",
        origin_id: "longjing",
        grade: "premium",
        harvest_season: "spring",
        cultivar: "longjing #43",
        oxidation_level: 0,
        flavor_notes: ["chestnut", "fresh", "sweet"],
        media_videos: [
          {
            ...teaVideos.teaPlantationField,
            title: "Longjing garden view",
            placement: "gallery",
          },
        ],
        story_video: {
          ...teaVideos.hotWaterTeaCup,
          title: "Spring leaf to clear cup",
          description:
            "A short brewing reel pairs Longjing's garden story with gentle water temperature.",
          placement: "story",
        },
        brew_override: {
          water_temp_c: 80,
          leaf_gram_per_100ml: 3,
          brew_times: 3,
          time_plan: [
            { time_s: 15, note: "wake" },
            { time_s: 25 },
            { time_s: 35 },
          ],
          tips: "Use 80°C water, high leaf ratio, and short steeps to highlight sweetness.",
        },
      },
      options: [{ title: "Size", values: ["50g", "100g", "250g"] }],
      variants: [
        {
          title: "50g",
          sku: "TEA-LONGJING-50G",
          options: { Size: "50g" },
          prices: [
            { amount: 1200, currency_code: "eur" },
            { amount: 1400, currency_code: "usd" },
          ],
        },
        {
          title: "100g",
          sku: "TEA-LONGJING-100G",
          options: { Size: "100g" },
          prices: [
            { amount: 2200, currency_code: "eur" },
            { amount: 2600, currency_code: "usd" },
          ],
        },
        {
          title: "250g",
          sku: "TEA-LONGJING-250G",
          options: { Size: "250g" },
          prices: [
            { amount: 5200, currency_code: "eur" },
            { amount: 6000, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "Tieguanyin Oolong",
      category_ids: [
        categoryResult.find((cat) => cat.name === "Oolong Tea")!.id,
      ],
      description:
        "Fragrant oolong from Anxi, floral aroma with lingering sweetness.",
      handle: "tieguanyin-oolong",
      weight: 200,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: backendStatic("tieguanyin-1.jpg"),
      images: [
        { url: backendStatic("tieguanyin-1.jpg") },
        { url: backendStatic("tieguanyin-2.jpg") },
      ],
      metadata: {
        ...teaListingMetadata({
          caffeine_level: "Medium",
          bullet_points: [
            "Classic Anxi Tieguanyin oolong with orchid aroma",
            "Balanced oxidation for floral and honeyed finish",
            "Ideal for multiple short infusions",
            "Premium autumn harvest loose leaf",
            "Sourced from traditional Fujian gardens",
          ],
        }),
        tea_type: "oolong",
        origin_id: "anxi",
        grade: "premium",
        harvest_season: "autumn",
        cultivar: "tieguanyin",
        oxidation_level: 30,
        flavor_notes: ["floral", "orchid", "honey"],
        media_videos: [
          {
            ...teaVideos.teaPlantations,
            title: "Anxi terrace mood",
            placement: "gallery",
          },
        ],
        story_video: {
          ...teaVideos.hotWaterTeaCup,
          title: "Oolong leaves opening",
          description:
            "Hot water and short infusions show the rhythm behind fragrant Anxi oolong.",
          placement: "story",
        },
        brew_override: {
          water_temp_c: 95,
          leaf_gram_per_100ml: 4,
          brew_times: 5,
          time_plan: [
            { time_s: 15 },
            { time_s: 20 },
            { time_s: 25 },
            { time_s: 35 },
          ],
          tips: "Rinse quickly then short steeps to unlock floral aroma.",
        },
      },
      options: [{ title: "Size", values: ["50g", "100g", "250g"] }],
      variants: [
        {
          title: "50g",
          sku: "TEA-TGY-50G",
          options: { Size: "50g" },
          prices: [
            { amount: 1400, currency_code: "eur" },
            { amount: 1600, currency_code: "usd" },
          ],
        },
        {
          title: "100g",
          sku: "TEA-TGY-100G",
          options: { Size: "100g" },
          prices: [
            { amount: 2600, currency_code: "eur" },
            { amount: 3000, currency_code: "usd" },
          ],
        },
        {
          title: "250g",
          sku: "TEA-TGY-250G",
          options: { Size: "250g" },
          prices: [
            { amount: 6000, currency_code: "eur" },
            { amount: 7000, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "Yunnan Dianhong Black",
      category_ids: [
        categoryResult.find((cat) => cat.name === "Black Tea")!.id,
      ],
      description:
        "Malty and smooth black tea from Yunnan with honeyed sweetness.",
      handle: "yunnan-dianhong-black",
      weight: 200,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: backendStatic("dianhong-1.jpg"),
      images: [
        { url: backendStatic("dianhong-1.jpg") },
        { url: backendStatic("dianhong-2.jpg") },
      ],
      metadata: {
        ...teaListingMetadata({
          caffeine_level: "High",
          bullet_points: [
            "Yunnan Dianhong black tea with malt and honey sweetness",
            "Full oxidation for a bold yet smooth cup",
            "Excellent as morning tea or with milk",
            "Select grade spring harvest",
            "Loose leaf packed for freshness",
          ],
        }),
        tea_type: "black",
        origin_id: "yunnan",
        grade: "select",
        harvest_season: "spring",
        cultivar: "local",
        oxidation_level: 100,
        flavor_notes: ["malt", "honey", "sweet"],
        media_videos: [
          {
            ...teaVideos.hotWaterTeaCup,
            title: "Dianhong brew close-up",
            placement: "gallery",
          },
        ],
        story_video: {
          ...teaVideos.makingChai,
          title: "Warm preparation for a malty cup",
          description:
            "A richer preparation scene matches Dianhong's honeyed body and morning-tea character.",
          placement: "story",
        },
        brew_override: {
          water_temp_c: 96,
          leaf_gram_per_100ml: 3,
          brew_times: 3,
          time_plan: [{ time_s: 20 }, { time_s: 30 }, { time_s: 40 }],
          tips: "Use near-boiling water for a bold and smooth cup.",
        },
      },
      options: [{ title: "Size", values: ["50g", "100g", "250g"] }],
      variants: [
        {
          title: "50g",
          sku: "TEA-DIANHONG-50G",
          options: { Size: "50g" },
          prices: [
            { amount: 1000, currency_code: "eur" },
            { amount: 1200, currency_code: "usd" },
          ],
        },
        {
          title: "100g",
          sku: "TEA-DIANHONG-100G",
          options: { Size: "100g" },
          prices: [
            { amount: 1800, currency_code: "eur" },
            { amount: 2200, currency_code: "usd" },
          ],
        },
        {
          title: "250g",
          sku: "TEA-DIANHONG-250G",
          options: { Size: "250g" },
          prices: [
            { amount: 4200, currency_code: "eur" },
            { amount: 4800, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "Shu Puer Cake 2019",
      category_ids: [categoryResult.find((cat) => cat.name === "Puer Tea")!.id],
      description:
        "Classic ripe puer from Yunnan, earthy and smooth with dark sweetness.",
      handle: "shu-puer-cake-2019",
      weight: 357,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: backendStatic("puer-1.jpg"),
      images: [
        { url: backendStatic("puer-1.jpg") },
        { url: backendStatic("puer-2.jpg") },
      ],
      metadata: {
        ...teaListingMetadata({
          caffeine_level: "Medium",
          bullet_points: [
            "2019 ripe (shu) puer cake from Yunnan",
            "Earthy, smooth profile with date-like sweetness",
            "Aged fermentation for mellow depth",
            "Suitable for gongfu or thermos brewing",
            "Available in sample, tin, and cake sizes",
          ],
        }),
        tea_type: "puer",
        origin_id: "yunnan",
        grade: "shu",
        harvest_season: "2019",
        cultivar: "blend",
        oxidation_level: 100,
        flavor_notes: ["earthy", "dates", "smooth"],
        media_videos: [
          {
            ...teaVideos.chaiPouring,
            title: "Dark tea service",
            placement: "gallery",
          },
        ],
        story_video: {
          ...teaVideos.teaPlantationField,
          title: "Yunnan leaves with patient depth",
          description:
            "Garden footage anchors shu puer in Yunnan before the ripe fermentation story begins.",
          placement: "story",
        },
        brew_override: {
          water_temp_c: 98,
          leaf_gram_per_100ml: 4,
          brew_times: 6,
          time_plan: [
            { time_s: 10 },
            { time_s: 15 },
            { time_s: 20 },
            { time_s: 25 },
          ],
          tips: "Rinse 2x, then short steeps. Great for thermos brewing too.",
        },
      },
      options: [{ title: "Size", values: ["50g", "100g", "357g"] }],
      variants: [
        {
          title: "50g",
          sku: "TEA-PUER-50G",
          options: { Size: "50g" },
          prices: [
            { amount: 900, currency_code: "eur" },
            { amount: 1100, currency_code: "usd" },
          ],
        },
        {
          title: "100g",
          sku: "TEA-PUER-100G",
          options: { Size: "100g" },
          prices: [
            { amount: 1600, currency_code: "eur" },
            { amount: 1900, currency_code: "usd" },
          ],
        },
        {
          title: "357g",
          sku: "TEA-PUER-357G",
          options: { Size: "357g" },
          prices: [
            { amount: 3800, currency_code: "eur" },
            { amount: 4300, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "Silver Needle White Tea",
      category_ids: [
        categoryResult.find((cat) => cat.name === "White Tea")!.id,
      ],
      description:
        "Delicate white tea with subtle sweetness and natural freshness from Fujian.",
      handle: "silver-needle-white-tea",
      weight: 200,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: backendStatic("silver-needle-1.jpg"),
      images: [
        { url: backendStatic("silver-needle-1.jpg") },
        { url: backendStatic("silver-needle-2.jpg") },
      ],
      metadata: {
        ...teaListingMetadata({
          organic_certified: true,
          caffeine_level: "Low",
          bullet_points: [
            "Silver Needle white tea buds from Fujian",
            "Delicate floral sweetness with minimal astringency",
            "Hand-picked spring buds, premium grade",
            "Best enjoyed with lower-temperature water",
            "Loose leaf for mindful single-origin brewing",
          ],
        }),
        tea_type: "white",
        origin_id: "fujian",
        grade: "premium",
        harvest_season: "spring",
        cultivar: "da_bai",
        oxidation_level: 5,
        flavor_notes: ["sweet", "delicate", "floral"],
        media_videos: [
          {
            ...teaVideos.kettleToMug,
            title: "Gentle water for white tea",
            placement: "gallery",
          },
        ],
        story_video: {
          ...teaVideos.teaPlantations,
          title: "Fujian garden calm",
          description:
            "Tea terrace footage supports Silver Needle's delicate picking and minimal processing story.",
          placement: "story",
        },
        brew_override: {
          water_temp_c: 75,
          leaf_gram_per_100ml: 2,
          brew_times: 4,
          time_plan: [
            { time_s: 30 },
            { time_s: 45 },
            { time_s: 60 },
            { time_s: 90 },
          ],
          tips: "Use cooler water and gentle steeping to preserve delicate flavors.",
        },
      },
      options: [{ title: "Size", values: ["25g", "50g", "100g"] }],
      variants: [
        {
          title: "25g",
          sku: "TEA-WHITE-25G",
          options: { Size: "25g" },
          prices: [
            { amount: 1800, currency_code: "eur" },
            { amount: 2000, currency_code: "usd" },
          ],
        },
        {
          title: "50g",
          sku: "TEA-WHITE-50G",
          options: { Size: "50g" },
          prices: [
            { amount: 3200, currency_code: "eur" },
            { amount: 3600, currency_code: "usd" },
          ],
        },
        {
          title: "100g",
          sku: "TEA-WHITE-100G",
          options: { Size: "100g" },
          prices: [
            { amount: 6000, currency_code: "eur" },
            { amount: 6800, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "Chamomile Dreams",
      category_ids: [
        categoryResult.find((cat) => cat.name === "Herbal Tea")!.id,
      ],
      description:
        "Caffeine-free herbal blend with soothing chamomile flowers and lavender.",
      handle: "chamomile-dreams",
      weight: 100,
      origin_country: "de",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      thumbnail: backendStatic("chamomile-1.jpg"),
      images: [
        { url: backendStatic("chamomile-1.jpg") },
        { url: backendStatic("chamomile-2.jpg") },
      ],
      metadata: {
        ...teaListingMetadata({
          organic_certified: true,
          country_of_origin: "Germany",
          ingredients:
            "Chamomile flowers, lavender, natural flavors. Caffeine-free herbal blend.",
          bullet_points: [
            "Caffeine-free chamomile and lavender herbal blend",
            "Soothing floral cup ideal for evening relaxation",
            "USDA-style organic certified ingredients",
            "Loose leaf for full aroma extraction",
            "Naturally sweet—enjoy plain or with honey",
          ],
        }),
        tea_type: "herbal",
        origin_id: "blend",
        grade: "organic",
        harvest_season: "summer",
        cultivar: "blend",
        oxidation_level: 0,
        flavor_notes: ["floral", "honey", "calming"],
        caffeine_level: "caffeine-free",
        media_videos: [
          {
            ...teaVideos.kettleToMug,
            title: "Evening herbal pour",
            placement: "gallery",
          },
        ],
        story_video: {
          ...teaVideos.teaAtHome,
          title: "A quiet caffeine-free ritual",
          description:
            "A calm at-home tea moment fits chamomile's evening positioning and softer cup promise.",
          placement: "story",
        },
        brew_override: {
          water_temp_c: 100,
          leaf_gram_per_100ml: 2,
          brew_times: 1,
          time_plan: [{ time_s: 300, note: "5 minutes for full extraction" }],
          tips: "Perfect for evening relaxation. Add honey if desired.",
        },
      },
      options: [{ title: "Size", values: ["50g", "100g", "200g"] }],
      variants: [
        {
          title: "50g",
          sku: "TEA-CHAMOMILE-50G",
          options: { Size: "50g" },
          prices: [
            { amount: 800, currency_code: "eur" },
            { amount: 1000, currency_code: "usd" },
          ],
        },
        {
          title: "100g",
          sku: "TEA-CHAMOMILE-100G",
          options: { Size: "100g" },
          prices: [
            { amount: 1400, currency_code: "eur" },
            { amount: 1700, currency_code: "usd" },
          ],
        },
        {
          title: "200g",
          sku: "TEA-CHAMOMILE-200G",
          options: { Size: "200g" },
          prices: [
            { amount: 2600, currency_code: "eur" },
            { amount: 3000, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
  ]

  // Delete existing tea products and their inventory items to ensure fresh data
  const existingTeaProducts = (existingProducts || []).filter((p: any) =>
    teaProducts.some((tp) => tp.handle === p.handle)
  )

  if (existingTeaProducts.length) {
    logger.info(
      `Deleting ${existingTeaProducts.length} existing tea products to update with new images...`
    )

    // First, get all inventory items associated with these products
    for (const product of existingTeaProducts) {
      const { data: variants } = await query.graph({
        entity: "product_variant",
        filters: { product_id: product.id },
        fields: ["id", "inventory_items.id"],
      })

      // Delete inventory items first
      for (const variant of variants || []) {
        if (variant.inventory_items && Array.isArray(variant.inventory_items)) {
          for (const invItem of variant.inventory_items) {
            if (invItem && typeof invItem === "object" && "id" in invItem) {
              try {
                const inventoryItemId = (invItem as any).id
                await deleteInventoryItemWorkflow(container).run({
                  input: inventoryItemId,
                })
                logger.info(`Deleted inventory item: ${(invItem as any).id}`)
              } catch (error: any) {
                // Inventory item might already be deleted, continue
                logger.warn(
                  `Could not delete inventory item ${(invItem as any).id}: ${
                    error?.message || error
                  }`
                )
              }
            }
          }
        }
      }
    }

    // Then delete products
    const productIds = existingTeaProducts.map((p: any) => p.id)
    await deleteProductsWorkflow(container).run({
      input: { ids: productIds },
    })
    logger.info(`Deleted existing tea products for recreation`)
  }

  // Create all tea products (existing ones will be recreated with new images)
  logger.info(
    `Creating ${teaProducts.length} tea products with local images...`
  )
  await createProductsWorkflow(container).run({
    input: {
      products: teaProducts,
    },
  })
  logger.info("Finished seeding product data.")

  logger.info("Seeding inventory levels.")

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id", "location_id"],
  })
  const existingLevelsForLocation = new Set(
    (existingLevels || [])
      .filter((lvl: any) => lvl.location_id === stockLocation.id)
      .map((lvl: any) => lvl.inventory_item_id)
  )

  const inventoryLevels: CreateInventoryLevelInput[] = []
  for (const inventoryItem of inventoryItems) {
    if (existingLevelsForLocation.has(inventoryItem.id)) {
      continue
    }
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    }
    inventoryLevels.push(inventoryLevel)
  }

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryLevels,
      },
    })
  }

  logger.info("Finished seeding inventory levels data.")
}
