import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Who we are</>,
    imageUrl: 'img/family.svg',
    description: (
      <>
        OptumTech is a world-wide team, 28K strong, committed to solving the
        most challenging problems in healthcare with open source technologies.
      </>
    ),
  },
  {
    title: <>Our Community Projects</>,
    imageUrl: 'img/coder.svg',
    description: (
      <>
        This is the home for original projects created in the course of our daily
        work and now shared with the open source community.  We welcome your
        involvement to grow and shape our efforts.
      </>
    ),
  },
  {
    title: <>Get involved</>,
    imageUrl: 'img/deploy.svg',
    description: (
      <>
        Our communities are growing.  Choose a project and get involved at any level
        from documentation to testing to code.  Our projects are released
        with a Contributor Code of Conduct and your contributions are subject to
        a project Contributor License Agreement.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/optumprojects')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
