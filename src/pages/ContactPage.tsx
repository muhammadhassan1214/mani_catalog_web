import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Placeholder submit — wire to backend or email service later
    setSubmitted(true)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Contact Us</h1>
      <p className="mt-1 text-sm text-gray-600">Have a question about our products or manufacturing capabilities? Reach out and our team will get back to you.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          {submitted ? (
            <div role="status" className="rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Thanks for contacting us</h2>
              <p className="mt-2 text-sm text-gray-700">We received your message and will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input id="name" name="name" type="text" required className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company (optional)</label>
                  <input id="company" name="company" type="text" className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" name="message" required rows={6} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="inline-flex items-center rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                  Send message
                </button>
              </div>
            </form>
          )}
        </section>

        <aside className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
          <dl className="mt-3 space-y-3 text-sm text-gray-700">
            <div>
              <dt className="font-medium text-gray-900">Email</dt>
              <dd><a href="mailto:info@example.com" className="text-brand-700 hover:text-brand-800">info@example.com</a></dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Phone</dt>
              <dd>+1 (555) 000-0000</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Address</dt>
              <dd>123 Industrial Ave, Suite 100, Your City, Country</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Hours</dt>
              <dd>Mon–Fri, 9:00–18:00</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}

