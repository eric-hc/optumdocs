module.exports = {
  title: 'Optum Open Source',
  tagline: 'Collaborating Well to Solve the Biggest Problems in Healthcare',
  url: 'https://optum.github.io/OptumDocs',
  baseUrl: '/OptumDocs/',
  favicon: 'img/favicon.ico',
  organizationName: 'Optum', // Usually your GitHub org/user name.
  projectName: 'OptumDocs', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Optum Open Source',
      logo: {
        alt: 'Optum Logo',
        src: 'img/Optum(R)_4C.png',
      },
      links: [
        {to: 'docs/doc1', label: 'Docs', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Optum, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
