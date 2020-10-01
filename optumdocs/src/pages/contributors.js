import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import ContributorGrid from "../components/ContributorGrid";

function Communities() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title='Upstream Engineers'>
      <section className={"section-lg"}>
        <div className='container'>
          <div className={classnames("row", styles.responsiveCentered)}>
            <div className='col col--6 col--offset-3'>
              <h2 className='with-underline'>Upstream Engineers</h2>
              <p className=''>Our Impact on Public Projects is Growing Daily!</p>
            </div>
          </div>
          <ContributorGrid></ContributorGrid>
        </div>
      </section>
    </Layout>
  );
}

export default Communities;
