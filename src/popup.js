document.addEventListener("DOMContentLoaded", () => {
  const featureIcon = document.getElementById("feature-icon")

  const updateUI = (isEnabled) => {
    featureIcon.style.opacity = isEnabled ? "1" : "0.5"
    featureIcon.title = isEnabled ? "Disable YT Embedify" : "Enable YT Embedify"
  }

  browser.storage.local.get("isEnabled").then((result) => {
    const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true
    updateUI(isEnabled)
  })

  featureIcon.addEventListener("click", () => {
    browser.storage.local.get("isEnabled").then((result) => {
      const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true
      const newIsEnabled = !isEnabled
      browser.runtime.sendMessage({
        action: "toggleFeature",
        enabled: newIsEnabled,
      })
      browser.storage.local.set({ isEnabled: newIsEnabled })
      updateUI(newIsEnabled)
    })
  })

  browser.theme.getCurrent().then((theme) => {
    if (theme.colors) {
      document.body.style.backgroundColor = theme.colors.popup || "#fff"
      document.body.style.color = theme.colors.popup_text || "#000"
      document.querySelectorAll(".Popup-button").forEach((button) => {
        button.style.color = "#fff"
      })
      const title = document.querySelector(".Popup-title")
      title.style.color = theme.colors.popup_text || "#000"
    }
  })
})
