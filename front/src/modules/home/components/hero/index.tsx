import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <section className="relative w-full border-b border-ui-border-base bg-gradient-to-b from-brand-100/60 to-brand-50">
      <div className="content-container">
        <div className="relative z-10 grid small:grid-cols-2 gap-10 py-16 small:py-24">
          <div className="flex flex-col justify-center gap-6">
            <Heading level="h1" className="font-display text-3xl text-grey-90">
              Time for Tea
            </Heading>
            <p className="text-large-regular text-grey-70 max-w-prose">
              Discover curated Chinese teas — Longjing, Tieguanyin, Dianhong and more. Fresh harvest, thoughtful roasting, and modern brewing guidance.
            </p>
            <div className="flex gap-3">
              <Button className="brand-cta" asChild>
                <a href="/collections/all">Shop Teas</a>
              </Button>
              <a className="brand-outline" href="/guides">Brewing Guides</a>
            </div>
          </div>
          <div className="small:block hidden">
            <div className="brand-card h-full min-h-[320px] flex items-center justify-center">
              <div className="brand-badge">Spring Picks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
