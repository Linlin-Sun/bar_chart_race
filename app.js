d3.json('finaldata.json').then(data => {
    // var groupedData = groupData(data, "Year", "CountryofLaunch");
    // console.log("main groupedData=", groupedData);
    // var countedGroupedData = countGroupedData(groupedData);
    // console.log("main countedGroupedData=", countedGroupedData);
    var groupedData = groupBy(data, "Year");
    console.log("main groupedData=", groupedData);
    var countedGroupedData = {};
    Object.entries(groupedData).forEach(([key, value]) => {
        var count_by_country = countBy(value, "CountryofLaunch");
        countedGroupedData[key] = count_by_country;
    });
    console.log("main countedGroupedData=", countedGroupedData);
    plotChart(countedGroupedData);
});

var svg, svgWidth, svgHeight;

var chartMargin = {
    top: 30,
    left: 10,
    right: 100,
    bottom: 10
};
const TRANSITION_TIME = 500;
svg = d3.select("#chart").append("svg").attr("style", "width: 80vw;height: 80vh");
svgWidth = svg.node().clientWidth;
svgHeight = svg.node().clientHeight;

function cleanupSVG() {
    d3.select("#topAxis").remove();
    // d3.select("#currentyear").remove();
    
}

async function plotChart(data) {
    var chartWidth, chartHeight;
    chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
    // var yearList = Object.keys(data).slice(0, 1);
    var yearList = Object.keys(data);
    console.log(yearList);

    const fontSize = 16;
    const rectProperties = { height: 20, padding: 10 };
    const container = svg.append("g")
        .attr("transform", `translate(0, ${chartMargin.top})`)
        .classed("container", true);

    const update = (year) => {
        console.log(year);
        
        cleanupSVG();
        const presentData = processEachData(data[year]);
        console.log("presentData=", presentData);
        const widthScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(presentData), d => d.value)])
            .range([0, chartWidth - fontSize - 50]);
        // const sortedRange = [...presentData].sort((a, b) => b.value - a.value);
        const sortedRange = presentData.sort((a, b) => b.value - a.value);
        container
            .selectAll("text")
            .data(presentData)
            .enter()
            .append("text");

        container
            .selectAll("text")
            .text(d => d.key + " " + d.value)
            .transition()
            .delay(TRANSITION_TIME)
            .attr("x", d => widthScale(d.value) + fontSize)
            .attr("length", 100)
            .attr("y", (d, i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding) + fontSize);

        container
            .selectAll("rect")
            .data(presentData)
            .enter()
            .append("rect");

        container
            .selectAll("rect")
            .attr("x", 10)
            .transition()
            .delay(TRANSITION_TIME)
            .attr("y", (d, i) => sortedRange.findIndex(e => e.key === d.key) * (rectProperties.height + rectProperties.padding))
            .attr("width", d => d.value <= 0 ? 0 : widthScale(d.value))
            .attr("height", 20)
            .attr("fill", "#ad10b5");

        const ticker = 500;
        const axisTop = svg
            .append('g')
            .attr("id", "topAxis")
            .classed('axis', true)
            .style("transform", "translate(10px, 20px)")
            .call(d3.axisTop(widthScale));
        axisTop
            .transition()
            .duration(ticker / 1.2)
            .ease(d3.easeLinear)
            .call(d3.axisTop(widthScale));
        const yearText = svg.append("g").attr("id", "currentyear") 
            .attr("transform", `translate(${chartWidth}, 0)`);
        yearText
            .append("text")
            .text(year.toString())
            .transition()
            .delay(TRANSITION_TIME)
            // .attr("x", chartWidth - fontSize - 50)
            .attr("x", 20)
            .attr("length", 300)
            .attr("y", 20);

    }
    for (const year of yearList) {
        update(year)
        await new Promise(done => setTimeout(() => done(), TRANSITION_TIME));
    }
}

function processEachData(data) {
    // console.log("processEachData", data);
    return Object.keys(data)
        .map(key => ({ key, value: data[key] }))
        .sort((a, b) => b.value - a.value);

}