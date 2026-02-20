export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose prose-slate dark:prose-invert">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using My Ledger, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
          <p>
            My Ledger is a free, web-based tool designed to help users track personal and business
            debts, credits, and transactions. It is intended for informational tracking purposes
            only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Not Financial Advice</h2>
          <p>
            <strong className="text-destructive">Disclaimer:</strong> The content and tools provided
            within My Ledger do not constitute professional financial, accounting, or legal advice.
            The creator(s) of My Ledger are not licensed financial advisors. You should not make
            financial decisions based solely on the data or calculations provided by this
            application. Always consult with a qualified professional before making any significant
            financial decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, My Ledger and its developers shall not be liable
            for any indirect, incidental, special, consequential or punitive damages, or any loss of
            profits or revenues, whether incurred directly or indirectly, or any loss of data, use,
            goodwill, or other intangible losses, resulting from (a) your access to or use of or
            inability to access or use the service; (b) any conduct or content of any third party on
            the service; or (c) unauthorized access, use or alteration of your transmissions or
            content.
          </p>
          <p className="mt-2">
            The software is provided &quot;as is&quot;, without warranty of any kind, express or
            implied. In no event shall the authors or copyright holders be liable for any claim,
            damages or other liability arising from, out of or in connection with the software.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. User Data and Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You
            agree that you are solely responsible for any activity that occurs under your account.
            We reserve the right to terminate accounts, remove or edit content, or cancel service at
            our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Modifications to Service</h2>
          <p>
            We reserve the right at any time to modify or discontinue, temporarily or permanently,
            the service (or any part thereof) with or without notice. You agree that My Ledger shall
            not be liable to you or to any third party for any modification, suspension, or
            discontinuance of the service.
          </p>
        </section>
      </div>
    </div>
  );
}
