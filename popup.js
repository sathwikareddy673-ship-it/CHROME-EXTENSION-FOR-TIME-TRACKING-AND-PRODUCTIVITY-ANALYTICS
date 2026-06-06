chrome.storage.local.get(["usage"], (result) => {

    const dataDiv = document.getElementById("data");
    const usage = result.usage || {};

    const productiveSites = [
        "github.com",
        "leetcode.com",
        "stackoverflow.com",
        "geeksforgeeks.org"
    ];

    let productiveTime = 0;
    let unproductiveTime = 0;
    let html = "";

    for (let site in usage) {

    // Hide ChatGPT and Chrome pages
    if (
        site.includes("chatgpt.com") ||
        site.includes("extensions") ||
        site.includes("newtab")
    ) {
        continue;
    }

        const minutes = (usage[site] / 60).toFixed(2);

        let category = "Unproductive";

        if (productiveSites.some(p => site.includes(p))) {
            category = "Productive";
            productiveTime += usage[site];
        } else {
            unproductiveTime += usage[site];
        }

        html += `
            <div class="site">
                <strong>${site}</strong><br>
                ${minutes} Minutes<br>
                Category: ${category}
            </div>
        `;
    }

    const totalTime = productiveTime + unproductiveTime;

    const productivityScore =
        totalTime > 0
            ? ((productiveTime / totalTime) * 100).toFixed(2)
            : 0;

    html += `
        <hr>

        <h3>Analytics</h3>

        <p><strong>Productive Time:</strong>
        ${(productiveTime / 60).toFixed(2)} Minutes</p>

        <p><strong>Unproductive Time:</strong>
        ${(unproductiveTime / 60).toFixed(2)} Minutes</p>

        <p><strong>Productivity Score:</strong>
        ${productivityScore}%</p>
    `;

    dataDiv.innerHTML = html;
});