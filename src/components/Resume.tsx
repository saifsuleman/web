import type { ResumeContent } from '../schemas/resume';

type ResumeProps = {
  content: ResumeContent;
};

export default function Resume({ content }: ResumeProps) {
  const { profile, summary, experience, education, projects, skills, certifications, links } = content;

  return (
    <main className="resume" aria-label="Resume">
      <header className="resume-header">
        <h1>{profile.name}</h1>
        <p className="role">{profile.title}</p>
        <p className="meta">
          <span>{profile.location}</span>
          {profile.email && (
            <>
              <span aria-hidden="true"> · </span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </>
          )}
          {profile.phone && (
            <>
              <span aria-hidden="true"> · </span>
              <span>{profile.phone}</span>
            </>
          )}
        </p>
      </header>

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading">Summary</h2>
        <p>{summary}</p>
      </section>

      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading">Experience</h2>
        {experience.map((job) => (
          <article className="resume-entry" key={`${job.company}-${job.role}-${job.startDate}`}>
            <header>
              <h3>
                {job.role} · {job.company}
              </h3>
              <p className="entry-meta">
                <span>{job.location}</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={job.startDate}>{job.startDate}</time> –{' '}
                {job.endDate === 'Present' ? <span>{job.endDate}</span> : <time dateTime={job.endDate}>{job.endDate}</time>}
              </p>
            </header>
            <ul>
              {job.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section aria-labelledby="education-heading">
        <h2 id="education-heading">Education</h2>
        {education.map((item) => (
          <article className="resume-entry" key={`${item.institution}-${item.degree}`}>
            <h3>{item.degree}</h3>
            <p>{item.institution}</p>
            <p className="entry-meta">
              <time dateTime={item.startDate}>{item.startDate}</time> – <time dateTime={item.endDate}>{item.endDate}</time>
            </p>
          </article>
        ))}
      </section>

      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>
        {projects.map((project) => (
          <article className="resume-entry" key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            {project.links?.length ? (
              <ul className="inline-links" aria-label={`${project.name} links`}>
                {project.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading">Skills</h2>
        {skills.map((skillGroup) => (
          <p key={skillGroup.category}>
            <strong>{skillGroup.category}:</strong> {skillGroup.items.join(', ')}
          </p>
        ))}
      </section>

      <section aria-labelledby="certifications-heading">
        <h2 id="certifications-heading">Certifications</h2>
        <ul>
          {certifications.map((cert) => (
            <li key={`${cert.name}-${cert.year}`}>
              {cert.name} — {cert.issuer} ({cert.year})
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="links-heading">
        <h2 id="links-heading">Links</h2>
        <ul className="inline-links">
          {links.map((link) => (
            <li key={link.url}>
              <a href={link.url}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
