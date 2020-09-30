import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import CommunityGrid from '../components/CommunityGrid';



function Communities() {
  return (

    <Layout title="Public Community Contributions">
      <section className={'section-lg'}>
        <div className="container">
          <div className={classnames('row', styles.responsiveCentered)}>
            <div className="col col--6 col--offset-3">
              <h2 className="with-underline">Public Community Contributions</h2>
              <p className="">
                Community repos where our Optum Engineers are active contributors.  This list is updated dynamically on a daily basis as we expand our efforts across the Open Source ecosystem. We have also included projects published by Optum and invite active participation and feedback as we build these communities into valuable public resources.
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
