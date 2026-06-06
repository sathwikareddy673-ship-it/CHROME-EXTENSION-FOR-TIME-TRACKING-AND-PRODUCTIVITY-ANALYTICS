fetch("http://localhost:5000/usage")
.then(response => response.json())
.then(data => {

    const tableBody = document.getElementById("tableBody");
    const analytics = document.getElementById("analytics");

    const productiveSites = [
        "github.com",
        "leetcode.com",
        "stackoverflow.com",
        "geeksforgeeks.org"
    ];

    let groupedData = {};

    data.forEach(item => {

        const site = item.website;

        // Hide unwanted sites
        if (
            site.includes("chatgpt.com") ||
            site.includes("localhost")
        ) {
            return;
        }

        if (!groupedData[site]) {
            groupedData[site] = 0;
        }

        groupedData[site] += parseFloat(item.minutes);
    });

    let productiveTime = 0;
    let unproductiveTime = 0;

    tableBody.innerHTML = "";

    Object.keys(groupedData).forEach(site => {

        const minutes = groupedData[site].toFixed(2);

        let category = "Unproductive";

        if (
            productiveSites.some(productive =>
                site.includes(productive)
            )
        ) {
            category = "Productive";
            productiveTime += parseFloat(minutes);
        } else {
            unproductiveTime += parseFloat(minutes);
        }

        tableBody.innerHTML += `
            <tr>
                <td>${site}</td>
                <td>${minutes}</td>
                <td>${category}</td>
            </tr>
        `;
    });

    const totalTime = productiveTime + unproductiveTime;

    const productivityScore =
        totalTime > 0
        ? ((productiveTime / totalTime) * 100).toFixed(2)
        : 0;

    let report = "Needs Improvement";

    if (productivityScore >= 80) {
        report = "Excellent";
    } else if (productivityScore >= 60) {
        report = "Good";
    } else if (productivityScore >= 40) {
        report = "Average";
    }

    analytics.innerHTML = `
        <h2>Analytics</h2>

        <p>
            <strong>Total Time:</strong>
            ${totalTime.toFixed(2)} Minutes
        </p>

        <p>
            <strong>Productive Time:</strong>
            ${productiveTime.toFixed(2)} Minutes
        </p>

        <p>
            <strong>Unproductive Time:</strong>
            ${unproductiveTime.toFixed(2)} Minutes
        </p>

        <p>
            <strong>Productivity Score:</strong>
            ${productivityScore}%
        </p>

        <h2>Weekly Productivity Report</h2>

        <p>
            <strong>Status:</strong>
            ${report}
        </p>
    `;

})
.catch(error => {
    console.error("Error:", error);
});