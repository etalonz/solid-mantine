const Solid = require("vite-plugin-solid");
const Paths = require("vite-tsconfig-paths").default;

module.exports = {
  stories: ["../../src/**/*.story.@(ts|tsx)"],
  addons: ["storybook-dark-mode"],
  framework: "@storybook/html",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config, { configType }) {
    config.plugins.unshift(Solid({ hot: false }));
    config.plugins.unshift(Paths({ root: "../../." }));
    config.server.fs.allow = ["../.."];
    return config;
  },
};
