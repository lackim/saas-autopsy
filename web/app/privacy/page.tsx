import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy — saas-autopsy",
  description: "Privacy information for the saas-autopsy project website.",
};

const repositoryUrl = "https://github.com/lackim/saas-autopsy";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy notice"
      intro="A short explanation of what this project website does—and deliberately does not—collect."
    >
      <section>
        <h2>About this website</h2>
        <p>
          This website provides information about saas-autopsy. It does not use first-party
          analytics, advertising trackers, contact forms, or non-essential cookies.
        </p>
      </section>

      <section>
        <h2>Hosting and technical data</h2>
        <p>
          The hosting provider may process technical request data such as an IP address, browser
          details, and request timestamps to deliver and secure the site. The provider&apos;s own
          privacy notice applies to that processing.
        </p>
      </section>

      <section>
        <h2>External links</h2>
        <p>
          Links to package registries, source-code hosts, and other third-party services take you
          to websites governed by their own privacy policies.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For questions about this notice, contact the project maintainers through the{" "}
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
            project repository
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
