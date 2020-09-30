import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Octicon, {Location, GitPullRequest, Repo} from '@primer/octicons-react';

export default function ContributorCard({
  avatarUrl,
  name,
  username,
  userLocation,
  pullRequests,
}) {
  let countsExtended = [];
  if (pullRequests) {
    var counts = pullRequests.reduce((p, c) => {
      if (c.communityRepository) {
        var name = c.communityRepository.githubRepository;
      }
      if (!p.hasOwnProperty(name)) {
        p[name] = 0;
      }
      p[name]++;
      return p;
    }, {});

    countsExtended = Object.keys(counts).map((k) => {
      return {name: k, count: counts[k]};
    });
  }
  return (
    <div className={'ContributorCard'}>
      <div className={'card'} style={styles.card}>
        <h4 style={styles.h4}>
          <div className="row">
            <div className="col-md-auto">
              <img style={styles.avatarImage} src={avatarUrl} />
            </div>
            <div className="col-md-auto">
              {name ? (
                <div>
                  <small>
                    <strong>{username} </strong> ({name})
                  </small>
                </div>
              ) : (
                <div>
                  <strong>{username} </strong>{' '}
                </div>
              )}
              {userLocation ? (
                <div>
                  <Octicon
                    icon={Location}
                    size="small"
                    verticalAlign="middle"
                  />{' '}
                  <small>{userLocation}</small>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </h4>
        <div className="card__body">
          <div className="row is-multiline">
            {countsExtended.map((props, idx) => {
              return (
                <div style={styles.repoBase}>
                  <span>
                    {' '}
                    <Octicon
                      icon={Repo}
                      size="small"
                      verticalAlign="middle"
                    />{' '}
                    <a
                      href={props.name}
                      target="_blank"
                      rel="noreferrer noopener">
                      {props.name}
                    </a>{' '}
                    ({props.count}{' '}
                    <Octicon
                      icon={GitPullRequest}
                      size="small"
                      verticalAlign="middle"
                    />
                    )
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  h4: {
    padding: 10,
    paddingBottom: 15,
    textAlign: 'left',
    borderBottom: '1px solid #000',
    margin: 0,
  },
  h5: {
    textTransform: 'uppercase',
    // opacity: 0.5,
    margin: '10px 0 0px 0',
    fontSize: '0.9em',
  },
  card: {
    border: '1px solid #000',
    boxShadow: 'none',
  },
  cardBase: {
    fontSize: '0.9em',
  },
  check: {
    width: 10,
    height: 10,
    marginRight: 10,
  },
  link: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  avatarImage: {
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    width: 40,
  },
  repoBase: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '0 15px 10px 15px',
    fontSize: '0.9em',
  },
};
