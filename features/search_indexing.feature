Feature: Search engine indexing
  As the maintainer of the Health Flare website
  I want search engines to find every public page from one sitemap
  So that new posts and pages show up in search without manual submission

  # Search Console still has a 2018 sitemap at www.healthflare.org/sitemap.xml
  # that 404s. These checks run against the build output only; resubmitting
  # the sitemap in Search Console is a manual step after deploy.

  Scenario: The build publishes a sitemap at the site root
    When the built site is inspected
    Then a sitemap.xml file exists at the root of the build output
    And the sitemap is a valid sitemaps.org urlset

  Scenario: The sitemap lists every public page and nothing else
    When the built site is inspected
    Then every public HTML page in the build output is listed in the sitemap
    And the 404 page is not listed in the sitemap
    And every sitemap URL is an absolute https://healthflare.org URL
    And every sitemap URL resolves to a page in the build output

  Scenario: Blog posts carry their publish date
    When the built site is inspected
    Then every blog post in the sitemap has a lastmod date matching its front matter

  Scenario: robots.txt points crawlers at the sitemap
    When the built site is inspected
    Then a robots.txt file exists at the root of the build output
    And robots.txt allows crawling and names https://healthflare.org/sitemap.xml
