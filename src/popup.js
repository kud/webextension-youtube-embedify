document.addEventListener("DOMContentLoaded", () => {
  const featureIcon = document.getElementById("feature-icon")
  const statusBanner = document.getElementById("status-banner")

  const updateUI = (isEnabled) => {
    featureIcon.style.opacity = isEnabled ? "1" : "0.5"
    statusBanner.textContent = isEnabled ? "Enabled" : "Disabled"
    statusBanner.classList.toggle("Popup-statusBanner--disabled", !isEnabled)
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
})
