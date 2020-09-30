import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import GithubCard from "./GithubCard";
import axios from "axios";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import * as legoData from "../data/animations/legoloaading.json";

export default function CommunityGrid({ top, randomList }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: legoData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const result = await axios(
        "https://raw.githubusercontent.com/Optum/optum.github.io/gh-pages-source/optumdocs/communities.json"
      );
      if (Boolean(randomList)) {
        shuffleArray(result.data);
      }
      setData(result.data);

      setIsLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div className={"CommunityGrid"}>
      {isLoading ? (
        <FadeIn>
          <div>
            <Lottie options={defaultOptions} height={220} width={220} />
          </div>
        </FadeIn>
      ) : (
        <FadeIn>
          <div className='row is-multiline'>
            {data.slice(0, top).map((props, idx) => {
              const title = props.organization + "/" + props.repository;
              return (
                <div className={"col col--6"}>
                  <GithubCard
                    key={idx}
                    title={title}
                    description={props.description}
                    href={props.githubRepository}
                    stars={props.stars}
                    issues={props.issues}
                    handle={props.githubRepository}
                    watchers={props.watchers}
                    forks={props.forks}
                    pullRequests={props.pullRequests}
                  />
                </div>
              );
            })}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
