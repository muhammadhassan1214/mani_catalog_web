import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div>
      <header className="rounded-xl bg-gradient-to-br from-brand-50 to-white border p-6 sm:p-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">About Alisha Beauties</h1>
          <p className="mt-3 text-lg text-gray-600">
            We manufacture and curate high‑quality products across Orthodontic, Dental, Beauty Care, Eyelash, Jewellery, and Surgical categories. Our focus is consistent quality, on‑time delivery, and collaborative development.
          </p>
        </div>
      </header>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">10+ yrs</p>
          <p className="mt-1 text-sm text-gray-600">Manufacturing experience</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">500+</p>
          <p className="mt-1 text-sm text-gray-600">Active catalog SKUs</p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-3xl font-bold text-gray-900">40+</p>
          <p className="mt-1 text-sm text-gray-600">Countries served</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">What we stand for</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Quality first</h3>
            <p className="mt-2 text-sm text-gray-700">
              From raw‑material selection to final inspection, we follow strict QA procedures to deliver consistent results.
            </p>
          </article>
          <article className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Customer partnership</h3>
            <p className="mt-2 text-sm text-gray-700">
              We co‑design custom products, packaging, and private‑label solutions tailored to your brand and market.
            </p>
          </article>
          <article className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Reliability</h3>
            <p className="mt-2 text-sm text-gray-700">
              Predictable lead times, clear communication, and flexible MOQs so you can plan with confidence.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Core capabilities</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ul className="rounded-lg border bg-white p-6 shadow-sm list-disc list-inside text-sm text-gray-700">
            <li>Precision machining, polishing, and surface finishing</li>
            <li>Injection molding and high‑tolerance assembly</li>
            <li>Stainless steel, titanium, and medical‑grade polymers</li>
            <li>Custom tooling, jigs, and fixtures</li>
            <li>Private labeling and custom packaging</li>
          </ul>
          <ul className="rounded-lg border bg-white p-6 shadow-sm list-disc list-inside text-sm text-gray-700">
            <li>Batch traceability and lot‑based QA records</li>
            <li>Sterilization‑ready workflows and documentation</li>
            <li>Design for manufacturability (DFM) reviews</li>
            <li>Rapid prototyping and sampling</li>
            <li>Export compliance and logistics support</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Quality and compliance</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Standards</h3>
            <p className="mt-2 text-sm text-gray-700">ISO‑aligned processes, incoming and outgoing QC, COA on request.</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Materials</h3>
            <p className="mt-2 text-sm text-gray-700">Certified material sourcing with batch traceability and MSDS.</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Sustainability</h3>
            <p className="mt-2 text-sm text-gray-700">Waste‑reduction, recyclable packaging, and energy‑aware practices.</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900">Our journey</h2>
        <ol className="mt-4 space-y-4">
          <li className="relative pl-6">
            <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-brand-700" aria-hidden="true" />
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-900">2015 — Founded</p>
              <p className="mt-1 text-sm text-gray-700">Started with a small line of precision beauty tools.</p>
            </div>
          </li>
          <li className="relative pl-6">
            <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-brand-700" aria-hidden="true" />
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-900">2019 — Expanded categories</p>
              <p className="mt-1 text-sm text-gray-700">Added dental and orthodontic instruments to the catalog.</p>
            </div>
          </li>
          <li className="relative pl-6">
            <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-brand-700" aria-hidden="true" />
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-900">2023 — Global distribution</p>
              <p className="mt-1 text-sm text-gray-700">Established logistics partnerships across 40+ countries.</p>
            </div>
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link to="/catalog" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow">
            <h2 className="text-lg font-semibold text-gray-900">Browse our catalog →</h2>
            <p className="mt-1 text-sm text-gray-700">Explore SKUs, specs, and images across all categories.</p>
          </Link>
          <Link to="/contact" className="rounded-lg border bg-white p-6 shadow-sm hover:shadow">
            <h2 className="text-lg font-semibold text-gray-900">Talk to our team →</h2>
            <p className="mt-1 text-sm text-gray-700">Request samples, MOQs, pricing, or private‑label details.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
