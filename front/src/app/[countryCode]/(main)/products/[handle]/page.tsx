import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { getBrandName, getTeaMetadata } from "@lib/types/tea-product-metadata"
import ProductJsonLd from "@modules/products/components/product-json-ld"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

const SITE_NAME = "Zentee"

function truncateDescription(text: string | null | undefined, max = 160): string {
  if (!text) {
    return ""
  }
  const trimmed = text.replace(/\s+/g, " ").trim()
  if (trimmed.length <= max) {
    return trimmed
  }
  return `${trimmed.slice(0, max - 1)}…`
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const metadata = getTeaMetadata(product)
  const brand = getBrandName(metadata)
  const description = truncateDescription(product.description)

  return {
    title: `${product.title} | ${brand} | ${SITE_NAME}`,
    description: description || `${product.title} — ${brand}`,
    openGraph: {
      title: `${product.title} | ${SITE_NAME}`,
      description: description || product.title,
      images: product.images?.[0]?.url
        ? [product.images[0].url]
        : product.thumbnail
          ? [product.thumbnail]
          : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  return (
    <>
      <ProductJsonLd product={pricedProduct} countryCode={params.countryCode} />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
      />
    </>
  )
}
