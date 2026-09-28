import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms — saas-autopsy",
  description: "Basic website terms for the saas-autopsy project.",
};

const repositoryUrl = "https://github.com/lackim/saas-autopsy";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Website terms"
      intro="Basic terms for using this informational project website."
    >
      <section>
        <h2>Informational purpose</h2>
        <p>
          This website describes saas-autopsy and provides links to its software, documentation,
          and source code. Content may change without notice.
        </p>
      </section>

      <section>
        <h2>Software license</h2>
        <p>
          Use, copying, modification, and distribution of the software are governed by the license
          published with the project, not by these website terms.
        </p>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          The website and project information are provided on an &quot;as is&quot; and &quot;as
          available&quot; basis, without warranties of accuracy, availability, or fitness for a
          particular purpose to the extent permitted by law.
        </p>
      </section>

      <section>
        <h2>External services</h2>
        <p>
          Third-party websites and services linked from this site are responsible for their own
          content, availability, and terms.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be raised with the project maintainers through the{" "}
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
            project repository
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
