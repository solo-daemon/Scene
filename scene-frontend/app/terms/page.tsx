import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use & Privacy Policy | Scene</title>
        <meta name="description" content="Read the terms and privacy policy for Scene, a travel social platform." />
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-6">
          Terms of Use & Privacy Policy
        </h1>
        <p className="text-gray-600 text-center">Effective Date: March 25, 2025</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">1. Overview</h2>
          <p className="text-gray-700 mt-2">
            Scene is a travel social platform currently in beta, connecting users over shared travel interests, events, and experiences.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">2. Acceptance of Terms</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>You are at least 13 years old.</li>
            <li>You have provided accurate and truthful information.</li>
            <li>You will comply with all applicable laws and regulations.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">3. User Conduct</h2>
          <p className="text-gray-700">
            Users must not misuse the platform, post harmful content, or impersonate others. Violations may result in suspension or termination.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">4. Information We Collect</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li><strong>Email Address:</strong> Account creation & management.</li>
            <li><strong>Phone Number:</strong> Verification & communication.</li>
            <li><strong>Profile Info:</strong> Display name & avatar.</li>
            <li><strong>Location Data:</strong> Scene discovery & suggestions.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">5. Google Calendar Integration</h2>
          <p className="text-gray-700">
            If you connect your Google Calendar, we only access read-only event metadata and do not store or modify your events.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">6. Use of Data</h2>
          <p className="text-gray-700">
            We use your data to improve platform features and personalize experiences. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">7. Location Data Usage</h2>
          <p className="text-gray-700">
            Location data helps suggest nearby events or users. Access is optional and can be revoked in your device settings.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">8. Data Storage & Security</h2>
          <p className="text-gray-700">
            We implement security measures, but as Scene is in beta, you acknowledge potential system limitations.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">9. Your Rights</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Request access to your data.</li>
            <li>Ask for data correction or deletion.</li>
            <li>Disconnect Google Calendar anytime.</li>
            <li>Delete your Scene account.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
          <p className="text-gray-700">
            Scene is provided "as is" in beta. We are not responsible for service interruptions, bugs, or third-party issues.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">11. Changes to These Terms</h2>
          <p className="text-gray-700">
            We may update these terms. Continued use after changes implies acceptance.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">12. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions, reach us at: <strong>email: a_prakash1@me.iitr.ac.in</strong>
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Scene Technologies (Beta)</strong><br />
            Roorkee, Uttarakhand – 247667, India
          </p>
        </section>
      </div>
    </>
  );
}