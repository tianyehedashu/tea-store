import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-sage-50 via-white to-cream-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 content-container">
        <div className="grid small:grid-cols-2 gap-16 items-center min-h-[90vh] py-20">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-8">
              {/* Seasonal indicator with cultural touch */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-sage-200/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-brand-400 rounded-full"></div>
                  <div className="w-0.5 h-0.5 bg-brand-300 rounded-full"></div>
                </div>
                <span className="text-sage-700 text-sm font-medium tracking-wide">
                  Tea with a Zen State of Mind
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-4xl small:text-5xl large:text-6xl font-light text-sage-900 leading-[1.1] tracking-tight">
                  Sip the
                  <span className="block font-medium text-brand-700 italic">
                    Calm
                  </span>
                </h1>

                <div className="space-y-4">
                  <p className="text-lg text-sage-700 leading-relaxed font-light">
                    Where zen meets tea ceremony - mindful living in every sip
                  </p>
                  <p className="text-base text-sage-600 leading-relaxed max-w-md">
                    Where eastern wisdom meets mindful living. Each cup invites
                    you to pause, breathe deeply, and find your center in the
                    gentle rhythm of tea ceremony.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col small:flex-row gap-4">
              <LocalizedClientLink
                href="/store"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-sage-900 text-white rounded-lg hover:bg-sage-800 transition-all duration-300 font-medium"
              >
                Discover Our Teas
                <div className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/guides"
                className="group inline-flex items-center gap-3 px-8 py-4 border border-sage-300 text-sage-700 rounded-lg hover:border-sage-400 hover:bg-sage-50 transition-all duration-300 font-medium"
              >
                Tea Wisdom
                <div className="w-5 h-5 group-hover:scale-110 transition-transform duration-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </LocalizedClientLink>
            </div>

            {/* Philosophical brand essence */}
            <div className="pt-8 space-y-4">
              <div className="w-16 h-px bg-gradient-to-r from-sage-300 to-transparent"></div>
              <p className="text-sm text-sage-500 italic font-light leading-relaxed">
                "Tea and Zen are one, the Way is within"
                <br />
                <span className="text-xs">— Ancient Tea Wisdom</span>
              </p>
            </div>
          </div>

          {/* Right Visual - Tea Culture Representation */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main visual container */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-sage-200/50 shadow-lg p-12 min-h-[550px] flex flex-col justify-center">
                <div className="space-y-8 text-center">
                  {/* Tea ceremony elements */}
                  <div className="relative mx-auto w-32 h-32">
                    {/* Tea cup silhouette */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sage-200 to-sage-300 rounded-full opacity-20"></div>
                    <div className="absolute inset-4 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 flex items-center justify-center">
                        {/* Simplified tea leaf icon */}
                        <svg
                          className="w-12 h-12 text-brand-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.5 12c0 .34-.03.68-.08 1.01L20 17l-1.5 1.5-3.99-2.58c-.33.05-.67.08-1.01.08-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8zM10 7v8l5.5-4L10 7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-light text-sage-900 tracking-wide">
                      Mindful Tea Ceremony
                    </h3>
                    <p className="text-sage-600 font-light leading-relaxed max-w-sm mx-auto">
                      Every sip becomes a meditation. In our busy lives, create
                      moments of tranquil mindfulness and let your spirit find
                      its natural center.
                    </p>
                  </div>

                  {/* Subtle cultural elements */}
                  <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-sage-300 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-sage-500 font-light">Mind</p>
                    </div>
                    <div className="w-8 h-px bg-sage-200"></div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-brand-300 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-sage-500 font-light">Body</p>
                    </div>
                    <div className="w-8 h-px bg-sage-200"></div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-cream-300 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-sage-500 font-light">Spirit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div
              className="absolute -top-4 -right-4 w-8 h-8 bg-brand-100 rounded-full opacity-60 animate-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="absolute -bottom-6 -left-6 w-6 h-6 bg-sage-200 rounded-full opacity-40 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-1/3 -right-8 w-4 h-4 bg-cream-200 rounded-full opacity-50 animate-pulse"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Gentle scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-3 text-sage-400 animate-pulse">
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-sage-300 to-transparent"></div>
          <div className="w-1.5 h-1.5 bg-sage-400 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
