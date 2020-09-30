import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ContributorCard from "../components/ContributorCard";
import axios from "axios";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import * as legoData from "../data/animations/legoloaading.json";

export default function ContributorGrid({ top, randomList }) {
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
        "https://raw.githubusercontent.com/Optum/optum.github.io/gh-pages-source/optumdocs/contributors.json"
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
    <div className={"ContributorGrid"}>
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
              return (
                <div className={"col col--4"}>
                  <ContributorCard
                    key={idx}
                    avatarUrl={props.avatarUrl}
                    name={props.name}
                    username={props.githubUsername}
                    userLocation={props.location}
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
