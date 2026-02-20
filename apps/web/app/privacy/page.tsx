export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 prose prose-slate dark:prose-invert">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p>
            When you use My Ledger, we collect minimal information required to provide the service:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Account Information:</strong> Your email address and basic profile details
              provided during sign-up (authenticated securely via Clerk).
            </li>
            <li>
              <strong>Financial Data:</strong> The ledgers (books), transactions, categories, and
              payment methods you explicitly create within the application.
            </li>
            <li>
              <strong>Usage Data:</strong> Basic usage analytics to ensure the performance and
              stability of the application.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>
            The information we collect is used solely to provide and improve the My Ledger service.
            We use your data to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Authenticate you and secure your account.</li>
            <li>
              Store and process your ledger transactions so you can access them across devices.
            </li>
            <li>Allow you to collaborate on ledgers with other users you explicitly invite.</li>
          </ul>
          <p className="mt-2 text-primary font-medium">
            We do not sell your personal or financial information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. Authentication is
            handled by Clerk, a leading authentication provider. Your financial data is stored in a
            secure relational database. However, please be aware that no method of transmission over
            the internet or method of electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
          <p>
            We may use third-party services (such as authentication providers like Clerk, or
            analytics like Vercel Speed Insights) which may collect information used to identify
            you. These services have their own privacy policies addressing how they use such
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us by visiting our
            GitHub repository and opening an issue.
          </p>
        </section>
      </div>
    </div>
  );
}
