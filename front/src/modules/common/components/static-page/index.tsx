import PageHero from "@modules/common/components/page-hero"

export type StaticSection = {
  heading: string
  paragraphs: string[]
}

type StaticPageProps = {
  eyebrow?: string
  title: string
  description?: string
  sections: StaticSection[]
}

export default function StaticPage({
  eyebrow,
  title,
  description,
  sections,
}: StaticPageProps) {
  return (
    <div className="min-h-screen bg-[#fffaf2]">
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <article className="content-container max-w-3xl py-12">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-sage-900 mb-4">
                {section.heading}
              </h2>
              <div className="space-y-4 text-sage-700 leading-relaxed">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  )
}
