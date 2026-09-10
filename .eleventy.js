export default function (eleventyConfig) {
  // Only the blog is templated; the hand-authored marketing pages are
  // copied through untouched (see passthrough copies below).
  eleventyConfig.setTemplateFormats(["md", "njk"]);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/index.html": "index.html" });
  eleventyConfig.addPassthroughCopy({ "src/privacy.html": "privacy.html" });
  eleventyConfig.addPassthroughCopy({
    "src/inner-flare/index.html": "inner-flare/index.html",
  });
  eleventyConfig.addPassthroughCopy({
    "src/inner-flare/privacy.html": "inner-flare/privacy.html",
  });

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  eleventyConfig.addFilter("htmlDateString", (dateObj) =>
    new Date(dateObj).toISOString().slice(0, 10)
  );

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByTag("posts").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("innerFlarePosts", (collectionApi) =>
    collectionApi
      .getFilteredByTag("inner-flare-posts")
      .sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist",
    },
  };
}
