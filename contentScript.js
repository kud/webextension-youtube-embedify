const createLink = (id, iconClass, text, url) => {
  const link = document.createElement("a")
  link.id = id
  link.className = "Embedify-link"
  link.href = url
  link.innerHTML = `<i class="${iconClass}"></i> ${text}`
  return link
}

const addLinksToYouTubePage = () => {
  if (!window.location.pathname.startsWith("/embed")) {
    return
  }

  if (document.querySelector(".Embedify-linkContainer")) {
    return
  }

  const container = document.createElement("div")
  container.className = "Embedify-linkContainer"

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

  container.appendChild(homeLink)
  container.appendChild(subscriptionsLink)

  document.body.appendChild(container)

  let hideTimeout

  const showLinks = () => {
    container.classList.add("Embedify-linkContainer--visible")
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
    hideTimeout = setTimeout(() => {
      if (!container.matches(":hover")) {
        container.classList.remove("Embedify-linkContainer--visible")
      }
    }, 1500)
  }

  document.addEventListener("mousemove", showLinks)
  container.addEventListener("mouseenter", () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
  })
  container.addEventListener("mouseleave", showLinks)
  showLinks()
}

const style = document.createElement("style")
style.textContent = `
  .Embedify-linkContainer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: row;
    gap: 300px;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    pointer-events: none; /* Always none */
  }
  .Embedify-linkContainer--visible {
    opacity: 1;
  }
  .Embedify-link {
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 5px;
    width: 220px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    cursor: pointer;
    transition: background-color 0.3s, opacity 0.3s, transform 0.3s;
    text-decoration: none;
    text-align: center;
    opacity: 0.8;
    pointer-events: auto; /* Allow pointer events */
  }
  .Embedify-link:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  .Embedify-link i {
    margin-right: 8px;
  }
`
document.head.appendChild(style)

const fontAwesomeLink = document.createElement("link")
fontAwesomeLink.rel = "stylesheet"
fontAwesomeLink.href =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
document.head.appendChild(fontAwesomeLink)

addLinksToYouTubePage()
