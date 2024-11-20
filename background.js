const convertToEmbedUrl = (url) => {
  const urlObj = new URL(url)

  if (urlObj.hostname === "www.youtube.com" && urlObj.pathname === "/watch") {
    const videoId = urlObj.searchParams.get("v")
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
  }
  return url
}

const handleNavigation = (details) => {
  const embedUrl = convertToEmbedUrl(details.url)
  if (embedUrl !== details.url) {
    browser.tabs.update(details.tabId, { url: embedUrl })
  }
}

const navigationFilters = {
  url: [{ hostEquals: "www.youtube.com", pathEquals: "/watch" }],
}

browser.webNavigation.onBeforeNavigate.addListener(
  handleNavigation,
  navigationFilters,
)
browser.webNavigation.onCompleted.addListener(
  handleNavigation,
  navigationFilters,
)
browser.webNavigation.onHistoryStateUpdated.addListener(
  handleNavigation,
  navigationFilters,
)
