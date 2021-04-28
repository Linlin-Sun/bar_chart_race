d3.json('finaldata.json').then(data => {
    var groupedData = groupData(data, "Year", "CountryofLaunch");
    console.log("main groupedData=", groupedData);
    var countedGroupedData = countGroupedData(groupedData);
    console.log("main countedGroupedData=", countedGroupedData);
    plotChart(countedGroupedData);
});
async function plotChart(data) {
    const svg = d3.select("#chart")
    const svgWidth = svg.node().clientWidth;
    const svgHeight = svg.node().clientHeight;
    var chartMargin = {
        top: 60,
        left: 10,
        right: 100,
        bottom: 10
    };
    var chartWidth, chartHeight;
    chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
    const yearList = Array.from(data.keys())

    const fontSize = 16;
    const rectProperties = { height: 20, padding: 10 }
    const container = svg.append("g")
        .attr("transform", `translate(0, ${chartMargin.top})`)
        .classed("container", true)

    const update = (year) => {
        const presentData = processEachData(data.get(year));
        const widthScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(presentData), d => d.value)])
            .range([0, chartWidth - fontSize - 50])

        const sortedRange = [...presentData].sort((a, b) => b.value - a.value)

        container
            .selectAll("text")
            .data(presentData)
            .enter()
            .append("text")



        container
            .selectAll("text")
            .text(d => d.key + " " + d.value)
            .transition()
            .delay(500)
            .attr("x", d => widthScale(d.value) + fontSize)
            .attr("length", 100)
            .attr("y", (d, i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding) + fontSize)

        container
            .selectAll("rect")
            .data(presentData)
            .enter()
            .append("rect")

        container
            .selectAll("rect")
            .attr("x", 10)
            .transition()
            .delay(500)
            .attr("y", (d, i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding))
            .attr("width", d => d.value <= 0 ? 0 : widthScale(d.value))
            .attr("height", 20);

        const ticker = 500;
        const axisTop = svg
            .append('g')
            .classed('axis', true)
            .style("transform", "translate(10px, 20px)")
            .call(d3.axisTop(widthScale))
        axisTop
            .transition()
            .duration(ticker / 1.2)
            .ease(d3.easeLinear)
            .call(d3.axisTop(widthScale));
        const yearText = svg.append("g")
            .attr("transform", `translate(${chartWidth}, 0)`);
        yearText
            .append("text")           
            .attr("class", "Linlin")
            .text(year.toString())
            .transition()
            .delay(500)
            // .attr("x", chartWidth - fontSize - 50)
            .attr("x", 80)
            .attr("length", 300)
            .attr("y", 400);

    }
    for (const year of yearList) {
        update(year)
        await new Promise(done => setTimeout(() => done(), 500));
    }
}

function groupData(data, g1, g2) {
    return d3.group(data, d => d[g1], c => c[g2]);
}

function countGroupedData(data) {
    console.log("countGroupedData data=", data);
    var results = new Map();
    data.forEach((value, key) => {
        // console.log(key, value);
        results.set(key, {});
        value.forEach((value_inner, key_inner) => {
            // console.log(key_inner, value_inner);
            results.get(key)[key_inner] = value_inner.length;
        });
    });
    return results;
}

function processEachData(data) {
    // console.log("processEachData", data);
    return Object.keys(data)
        .map(key => ({ key, value: data[key] }))
        .sort((a, b) => b.value - a.value);

}