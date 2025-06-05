const eleventyEjs = require('@11ty/eleventy-plugin-ejs');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyEjs);
  eleventyConfig.ignores.add('README.md');
  return {
    dir: {
      input: '.',
      includes: 'includes',
      output: 'dist',
    },
    htmlTemplateEngine: 'ejs',
  };
};
