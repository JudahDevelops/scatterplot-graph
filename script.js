const m = {top: 50, bottom: 50, left: 50, right: 50};
const h = 700 - m.top - m.bottom;
const w = 900 - m.left - m.right;

const svg = d3.select("body")
    .append("svg")
    .attr("width", w + m.left + m.right)
    .attr("height", h + m.top + m.bottom)
    .append("g")
    .attr("transform", `translate(${m.left}, ${m.top})`);



fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => {
        const formatTime = d3.timeFormat("%M:%S");

        const parseTime = timeStr => {
            const [minutes, seconds] = timeStr.split(":").map(Number);
            const date = new Date();
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            date.setHours(0);
            return date;
        }

        const xScale = d3.scaleTime()
            .domain([d3.min(data, d => new Date("1993" + "-01-01")), d3.max(data, d => new Date(d.Year + "-12-31"))])
            .range([0, w]);

        const yScale = d3.scaleTime()
            .domain([d3.min(data, d => parseTime(d.Time)), d3.max(data, d => parseTime(d.Time))])
            .range([0, h]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

        svg.append("g")
            .attr("transform", `translate(0, ${h})`)
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(new Date(d.Year + "-01-01")))
            .attr("cy", d => yScale(parseTime(d.Time)))
            .attr("r", 6)
            .attr("fill", d => d.Doping === "" ? "orange" : "steelblue")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .on("mouseover", (event, d) => {
                const xPosition = xScale(new Date(d.Year + "-01-01")) + 20;
                const yPosition = yScale(parseTime(d.Time));

                svg.append("text")
                    .attr("class", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .text(d.Name + ": " + d.Nationality)
                    .attr("fill", "black")
                    .style("font-size", "14px")
                    .append("tspan")
                    .attr("x", xPosition)
                    .attr("y", yPosition + 15)
                    .text(`Year: ${d.Year}, Time: ${d.Time}`)
                    .append("tspan")
                    .attr("x", xPosition)
                    .attr("y", yPosition + 38)
                    .text(d.Doping);

                    const text = svg.select(".tooltip");
                    const bbox = text.node().getBBox();
                    const padding = 8;

                    svg.insert("rect", ".tooltip")
                    .attr("class", "tooltip")
                    .attr("x", bbox.x - padding)
                    .attr("y", bbox.y - padding)
                    .attr("width", bbox.width + padding * 2)
                    .attr("height", bbox.height + padding * 2)
                    .attr("fill", "skyblue")
                    .attr("rx", 10)
                    .attr("ry", 10);

            })
            .on("mouseout", (d) => {
                svg.selectAll(".tooltip").remove();
            });
        
    })
        