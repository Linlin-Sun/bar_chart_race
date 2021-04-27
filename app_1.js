d3.json('finaldata.json').then(data => {
    var groupedData = groupData(data, "Year", "CountryofLaunch");
    console.log("main groupedData=", groupedData); 
    var countedGroupedData = countGroupedData(groupedData);
    console.log("main countedGroupedData=", countedGroupedData);
    plotChart(countedGroupedData);
});

function plotChart(data) {
    const svg = d3.select("#chart")
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;

    const yearList = Array.from(data.keys())
    console.log("yearList=", yearList);
    const year = yearList[1];
    console.log("year=", year);
    console.log(data.get(year));
    const presentData = processEachData(data.get(year));
    console.log("presentData=", presentData);
            
    const widthScale = d3.scaleLinear()
                      .domain([0, d3.max(Object.values(presentData), d => parseInt(d.value))])
                      .range([0, width])

    const container = svg.append("g")
                          .classed("container", true)
    const rectProperties = {height: 20, padding: 10}
    
    container.selectAll("rect")
              .data(presentData)
              .enter()
              .append("rect")
              .attr("x", 10)
              .attr("y", (d,i) => i * (rectProperties.height + rectProperties.padding))
              .attr("width", d => widthScale(parseInt(d.value)))
              .attr("height", rectProperties.height);
}

function groupData(data, g1, g2) { 
    return d3.group(data, d => d[g1], c => c[g2]);
}

function countGroupedData(data) { 
    console.log("countGroupedData data=", data);
    var results = new Map();
    data.forEach((value, key) => {
        // console.log(key, value);
        results.set(key, new Map());
        value.forEach((value_inner, key_inner) => {
            // console.log(key_inner, value_inner);
            results.get(key)[key_inner] = value_inner.length;
        });
    });
    return results;
}

function processEachData(data) {
    console.log("processEachData", data);

    return Object.keys(data)
                .map(key => ({key, value: data[key]}))
                .sort((a,b) => b.value-a.value) ;
    
}

