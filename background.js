let currentSite = "";
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);

        if (!tab.url || !tab.url.startsWith("http")) {
            return;
        }

        if (currentSite) {
            saveTime(currentSite);
        }

        currentSite = new URL(tab.url).hostname;
        startTime = Date.now();

    } catch (error) {
        console.log("Ignored invalid URL");
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (
        changeInfo.status === "complete" &&
        tab.url &&
        tab.url.startsWith("http")
    ) {

        if (currentSite) {
            saveTime(currentSite);
        }

        currentSite = new URL(tab.url).hostname;
        startTime = Date.now();
    }
});

function saveTime(site) {

    const seconds = Math.floor(
        (Date.now() - startTime) / 1000
    );

    if (seconds <= 0) return;

    // Ignore unwanted sites
    if (
        site.includes("chatgpt.com") ||
        site.includes("localhost") ||
        site.includes("extensions") ||
        site.includes("newtab")
    ) {
        return;
    }

    // Save in Chrome Storage
    chrome.storage.local.get(["usage"], (result) => {

        let usage = result.usage || {};

        usage[site] =
            (usage[site] || 0) + seconds;

        chrome.storage.local.set({ usage });
    });

    // Save in MongoDB
    fetch("http://localhost:5000/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            website: site,
            minutes: Number(
                (seconds / 60).toFixed(2)
            ),
            date: new Date()
        })
    })
    .then(response => response.json())
    .then(data => console.log("Saved:", data))
    .catch(error => console.log(error));
}