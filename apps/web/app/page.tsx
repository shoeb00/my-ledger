export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            Simple shared ledgers.
            <br />
            Focus on your entries, not auth.
          </h1>
          <p className="mt-4 max-w-prose text-slate-600">
            Create books, invite teammates, and record transactions with ease. Sign in or sign up to
            get started—no passwords to remember.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/sign-up"
              className="group inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:shadow-md"
            >
              Get started free
              <svg
                className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/sign-in"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              I already have an account
            </a>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            By continuing you agree to our Terms and acknowledge our Privacy Policy.
          </p>
        </div>

        {/* Right side illustration */}
        <div className="w-full">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-700">Sample Book</div>
                <div className="text-xs text-slate-400">#1234</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Balance</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">₹42,180</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Credits</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">₹1,20,000</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Debits</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">₹77,820</div>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Description</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { d: '10 Nov', t: 'Stationery', a: '-₹320' },
                      { d: '09 Nov', t: 'Client payment', a: '+₹25,000' },
                      { d: '08 Nov', t: 'Snacks', a: '-₹180' },
                    ].map((row, idx) => (
                      <tr key={idx} className="odd:bg-white even:bg-slate-50">
                        <td className="px-3 py-2 text-slate-600">{row.d}</td>
                        <td className="px-3 py-2 text-slate-800">{row.t}</td>
                        <td className="px-3 py-2 font-medium text-slate-900">{row.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 pb-12 text-xs text-slate-500">
        © {new Date().getFullYear()} my-ledger. All rights reserved.
      </footer>
    </div>
  );
}
