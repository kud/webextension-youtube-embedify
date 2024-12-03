const createLink = (id, iconClass, text, url) => {
  const button = document.createElement("button")
  button.id = id
  button.className =
    "ytp-button ytp-share-button ytp-show-share-title ytp-share-button-visible Embedify-link"
  button.title = text
  button.setAttribute("aria-label", text)
  button.setAttribute("aria-haspopup", "true")
  button.innerHTML = `<div class="ytp-icon ytp-share-icon" style="font-size: 24px;"><i class="${iconClass}"></i></div><div class="ytp-title ytp-share-title"><span>${text}</span></div>`
  button.addEventListener("click", () => {
    window.location.href = url
  })
  return button
}

const addLinksToYouTubePage = () => {
  if (!window.location.pathname.startsWith("/embed")) {
    return
  }

  const targetElement = document.querySelector(".ytp-chrome-top-buttons")
  if (!targetElement) {
    // Wait for the target element to be available
    const observer = new MutationObserver(() => {
      const targetElement = document.querySelector(".ytp-chrome-top-buttons")
      if (targetElement) {
        observer.disconnect()
        addLinksToYouTubePage()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return
  }

  if (
    document.querySelector("#Embedify-homeLink") ||
    document.querySelector("#Embedify-subscriptionsLink")
  ) {
    return
  }

  const homeLink = createLink(
    "Embedify-homeLink",
    "fas fa-home",
    "Home",
    "https://www.youtube.com",
  )
  const subscriptionsLink = createLink(
    "Embedify-subscriptionsLink",
    "fas fa-list",
    "Subscriptions",
    "https://www.youtube.com/feed/subscriptions",
  )

  targetElement.insertBefore(subscriptionsLink, targetElement.firstChild)
  targetElement.insertBefore(homeLink, targetElement.firstChild)
}

const style = document.createElement("style")
style.textContent = `
  .Embedify-link .ytp-title span {
    transition: background-color 0.3s, border-radius 0.3s, transform 0.1s;
    padding: 4px 10px;
  }

  .Embedify-link:hover .ytp-title span {
      background-color: #222;
      border-radius: 4px;
      transform: scale(0.95);
      display: block;
  }

  .Embedify-link .ytp-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
document.head.appendChild(style)

const fontAwesomeLink = document.createElement("link")
fontAwesomeLink.rel = "stylesheet"
fontAwesomeLink.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
document.head.appendChild(fontAwesomeLink)

addLinksToYouTubePage()
