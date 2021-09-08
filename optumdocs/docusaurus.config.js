module.exports = {
  title: "Optum Open Source",
  tagline: "Open Collaboration to Solve the Biggest Problems in Healthcare",
  url: "https://optum.github.io",
  baseUrl: "/",
  favicon: "img/open_source.svg",
  organizationName: "Optum", // Usually your GitHub org/user name.
  projectName: "optumdocs", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Optum Open Source",
      logo: {
        alt: "Optum Logo",
        src: "img/Optum(R)_4C.png",
      },
      items: [
        {
          position: "left",
          label: "Open Source Program Office",
          items: [
            { to: "communities", label: "Our Projects" },
            {
              to: "contributors",
              label: "Our Engineers",
            },
          ],
        },
        {
          to: "/blog",
          position: "left",
          label: "Blog",
          items: [
            { to: "blog/tags/culture", label: "Culture" },
            { to: "blog/tags/ml-ai", label: "ML/AI" },
          ],
        },

        {
          href: "https://www.youtube.com/watch?v=9sdASFlw0As",
          label: "Why Contribute to Open Source?",
          position: "right",
        },
        {
          href: "https://github.com/Optum",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Our Projects",
              to: "communities",
            },
            {
              label: "Our Engineers",
              to: "contributors",
            },
          ],
        },
        {
          title: "Administration",
          items: [
            {
              label: "Contributor Code of Conduct",
              to: "docs/optumcoc",
            },
            {
              label: "Individual Contributor License Agreement",
              to: "docs/optumicla",
            },
            {
              label: "Project Licensing",
              to: "docs/optumlic",
            },
            {
              label: "Code Attribution",
              to: "docs/attribution",
            },
          ],
        },
        {
          title: "Work With Us",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/Optum",
            },
            {
              label: "opensource@optum.com",
              href: "mailto:opensource@optum.com",
            },
            {
              label: "Career Opportunities",
              href:
                "https://careers.unitedhealthgroup.com/search-jobs?kw=&sp=&re=US&jf=20",
            },
          ],
        },
        {
          title: "Legal",
          items: [
            {
              label: `Terms of use`,
              href: `https://www.optum.com/terms-of-use.html`,
            },
            {
              label: `Privacy`,
              href: `https://www.optum.com/privacy-policy.html`,
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Optum, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
