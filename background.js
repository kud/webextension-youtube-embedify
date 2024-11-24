let isEnabled = true

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

const convertToWatchUrl = (url) => {
  const urlObj = new URL(url)

  if (
    urlObj.hostname === "www.youtube.com" &&
    urlObj.pathname.startsWith("/embed")
  ) {
    const videoId = urlObj.pathname.split("/")[2]
    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`
    }
  }
  return url
}

const handleNavigation = (details) => {
  if (!isEnabled) return
  const embedUrl = convertToEmbedUrl(details.url)
  if (embedUrl !== details.url) {
    browser.tabs.update(details.tabId, { url: embedUrl })
  }
}

const handleToggleFeature = (enabled) => {
  isEnabled = enabled
  browser.storage.local.set({ isEnabled })

  if (isEnabled) {
    browser.tabs
      .query({ url: "*://www.youtube.com/watch?v=*" })
      .then((tabs) => {
        tabs.forEach((tab) => {
          const embedUrl = convertToEmbedUrl(tab.url)
          if (embedUrl !== tab.url) {
            browser.tabs.update(tab.id, { url: embedUrl })
          }
        })
      })
  } else {
    browser.tabs.query({ url: "*://www.youtube.com/embed/*" }).then((tabs) => {
      tabs.forEach((tab) => {
        const watchUrl = convertToWatchUrl(tab.url)
        if (watchUrl !== tab.url) {
          browser.tabs.update(tab.id, { url: watchUrl })
        }
      })
    })
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleFeature") {
    handleToggleFeature(message.enabled)
  }
})

browser.storage.local.get("isEnabled").then((result) => {
  if (result.isEnabled !== undefined) {
    isEnabled = result.isEnabled
  } else {
    isEnabled = true
    browser.storage.local.set({ isEnabled: true })
  }
})

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
