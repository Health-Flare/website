export default function (eleventyConfig) {
  // Only the blog is templated; the hand-authored marketing pages are
  // copied through untouched (see passthrough copies below).
  eleventyConfig.setTemplateFormats(["md", "njk"]);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/index.html": "index.html" });
  eleventyConfig.addPassthroughCopy({ "src/privacy.html": "privacy.html" });
  eleventyConfig.addPassthroughCopy({ "src/404.html": "404.html" });
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

  eleventyConfig.addFilter("topicLabel", (topic) =>
    topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByTag("posts").sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("innerFlarePosts", (collectionApi) =>
    collectionApi
      .getFilteredByTag("inner-flare-posts")
      .sort((a, b) => b.date - a.date)
  );

  // "posts" / "inner-flare-posts" are structural tags used to build the
  // collections above, not topics readers browse by, so they're excluded
  // from the topic lists below.
  const structuralTags = new Set(["posts", "inner-flare-posts", "all", "nav"]);

  const topicsFrom = (posts) => {
    const tags = new Set();
    posts.forEach((post) =>
      (post.data.tags || []).forEach((tag) => {
        if (!structuralTags.has(tag)) tags.add(tag);
      })
    );
    return [...tags].sort();
  };

  eleventyConfig.addCollection("postTopics", (collectionApi) =>
    topicsFrom(collectionApi.getFilteredByTag("posts"))
  );

  eleventyConfig.addCollection("innerFlarePostTopics", (collectionApi) =>
    topicsFrom(collectionApi.getFilteredByTag("inner-flare-posts"))
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
