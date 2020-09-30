import React from "react";
import { matchPath } from "react-router";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Octicon, {
  Person,
  Repo,
  Eye,
  GitPullRequest,
  IssueOpened,
  RepoForked,
  Star,
} from "@primer/octicons-react";

export default function GithubCard({
  title,
  description,
  href,
  stars,
  handle,
  issues,
  watchers,
  forks,
  pullRequests,
}) {
  let countsExtended = [];
  if (pullRequests) {
    var counts = pullRequests.reduce((p, c) => {
      if (c.contributor) {
        var name = c.contributor.githubUsername;
      }
      if (!p.hasOwnProperty(name)) {
        p[name] = 0;
      }
      p[name]++;

      return p;
    }, {});

    countsExtended = Object.keys(counts).map((k) => {
      return { name: k, count: counts[k] };
    });
  }

  return (
    <div className={"card"} style={styles.card}>
      <div className='card__body'>
        <Link to={handle}>
          {" "}
          <big>{title}</big>
        </Link>
        <div>
          <small>{description}</small>
        </div>
      </div>
      <hr style={styles.hr} />
      <div style={styles.cardBase}>
        <div className='row is-multiline'>
          {countsExtended.map((props, idx) => {
            return (
              <div style={styles.repoBase}>
                <span>
                  {" "}
                  <Octicon
                    icon={Person}
                    size='small'
                    verticalAlign='middle'
                  />{" "}
                  <a
                    href={"https://github.com/" + props.name}
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    {props.name}
                  </a>{" "}
                  ({props.count}{" "}
                  <Octicon
                    icon={GitPullRequest}
                    size='small'
                    verticalAlign='middle'
                  />
                  )
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {countsExtended.length > 0 ? <hr style={styles.hr} /> : <div></div>}
      <div style={styles.cardBase}>
        <div>
          {" "}
          <a href={href} target='_blank' rel='noreferrer noopener'>
            {" "}
            <Octicon icon={Repo} size='small' verticalAlign='middle' /> {handle}{" "}
          </a>
        </div>
        {issues ? (
          <div>
            {issues}{" "}
            <Octicon icon={IssueOpened} size='small' verticalAlign='middle' />{" "}
          </div>
        ) : (
          <div></div>
        )}
        {forks ? (
          <div>
            {forks}{" "}
            <Octicon icon={RepoForked} size='small' verticalAlign='middle' />{" "}
          </div>
        ) : (
          <div></div>
        )}
        {watchers ? (
          <div>
            {watchers}{" "}
            <Octicon icon={Eye} size='small' verticalAlign='middle' />{" "}
          </div>
        ) : (
          <div></div>
        )}
        {stars ? (
          <div>
            {stars} <Octicon icon={Star} size='small' verticalAlign='middle' />{" "}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

const styles = {
  hr: {
    margin: "15px 0 10px 0",
  },
  h3: {
    margin: 0,
    textTransform: "capitalize",
  },
  card: {
    border: "1px solid #000",
    boxShadow: "none",
  },
  cardBase: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "0 15px 10px 15px",
    fontSize: "0.8em",
  },
  repoBase: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5px 15px 0 15px",
    fontSize: "0.9em",
  },
};
