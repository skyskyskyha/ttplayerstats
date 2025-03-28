import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, width = 800, height = 500 }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data.length) return;

        const parseDate = d3.timeParse('%Y-%m-%d');
        const formattedData = data.map((d) => ({
            date: parseDate(d.Date),
            rank: +d.Rank,
        }));

        const margin = { top: 20, right: 30, bottom: 50, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const xScale = d3.scaleTime()
            .domain(d3.extent(formattedData, (d) => d.date))
            .range([0, innerWidth]);

        const maxObservedRank = d3.max(formattedData, d => d.rank);
        const yMax = Math.max(20, maxObservedRank);

        const yScale = d3.scaleLinear()
            .domain([yMax, 1])
            .range([innerHeight, 0]);

        const line = d3.line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.rank))
            .curve(d3.curveMonotoneX);

        const mainGroup = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // 绘制动画效果的折线
        const path = mainGroup.append('path')
            .datum(formattedData)
            .attr('fill', 'none')
            .attr('stroke', '#ff6600')
            .attr('stroke-width', 2)
            .attr('d', line);

        const totalLength = path.node().getTotalLength();

        path
            .attr('stroke-dasharray', totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);

        // 添加数据点和交互
        const dots = mainGroup.selectAll('circle')
            .data(formattedData)
            .enter()
            .append('circle')
            .attr('cx', (d) => xScale(d.date))
            .attr('cy', (d) => yScale(d.rank))
            .attr('r', 4)
            .attr('fill', '#ff6600')
            .attr('opacity', 0);

        dots.transition()
            .delay((_, i) => (i / formattedData.length) * 2000)
            .attr('opacity', 1);

        // 创建tooltip div
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '5px 10px')
            .style('border-radius', '4px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0);

        dots.on('mouseover', (event, d) => {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`Date: ${d3.timeFormat('%Y-%m')(d.date)}<br/>Rank: ${d.rank}`)
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 20}px`);
        })
            .on('mousemove', (event) => {
                tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 20}px`);
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0);
            });

        mainGroup.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(12).tickFormat(d3.timeFormat('%Y-%m')))
            .selectAll('text')
            .attr('transform', 'rotate(45)')
            .style('text-anchor', 'start');

        mainGroup.append('g')
            .call(d3.axisLeft(yScale).ticks(20));


        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height )
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('fill', 'white')
            .text('Time');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('fill', 'white')
            .text('Rank');

        // 清除tooltip
        return () => {
            tooltip.remove();
        };

    }, [data, height, width]);

    return <svg ref={svgRef}></svg>;
};

export default LineChart;
