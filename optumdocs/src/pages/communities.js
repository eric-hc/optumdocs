import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import CommunityGrid from '../components/CommunityGrid';

function Communities() {
  return (
    <Layout title="Approved Public Communities">
      <section className={'section-lg'}>
        <div className="container">
          <div className={classnames('row', styles.responsiveCentered)}>
            <div className="col col--6 col--offset-3">
              <h2 className="with-underline">Approved Public Communities</h2>
              <p className="">
                Approved community repos to get familiar with their current
                issues.
              </p>
            </div>
          </div>
          <CommunityGrid></CommunityGrid>
        </div>
      </section>
    </Layout>
  );
}

export default Communities;
