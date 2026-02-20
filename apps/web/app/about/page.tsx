export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose prose-slate dark:prose-invert">
      <h1 className="text-3xl font-bold tracking-tight mb-6">About My Ledger</h1>

      <p className="text-lg text-muted-foreground mb-8">
        My Ledger is a free, open-source alternative to traditional mobile cashbook apps, designed
        specifically with privacy and simplicity in mind.
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Why I built this</h2>
          <p>
            I built My Ledger because I was tired of using cashbook apps that were clunky, filled
            with ads, and locked my personal financial data into proprietary ecosystems. I wanted a
            clean, fast, and modern interface where I could easily track credits and debits without
            worrying about my data being sold.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Privacy First</h2>
          <p>
            Your data belongs to you. My Ledger does not sell your transaction data, show you
            targeted advertisements, or track your financial habits. Authentication is handled
            securely by Clerk, and your data is stored safely in a managed database.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create multiple distinct ledgers (books) for different needs.</li>
            <li>Collaborate by adding editors and viewers.</li>
            <li>Tag transactions by custom categorized labels and payment methods.</li>
            <li>Zero ads, subscriptions, or paywalls.</li>
          </ul>
        </section>

        <section className="pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">Open Source</h2>
          <p className="mb-4">
            This project is proudly open source. You can view the code, contribute, or connect with
            the creator below:
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/shoeb00/my-ledger"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              View on GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shoeb0/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              Connect on LinkedIn
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
