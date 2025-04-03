import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import useChartSize from './useChartSize';

const WinsBarChart = ({ data }) => {
    const ref = useRef();
    const tooltipRef = useRef();
    const [containerRef, { width, height }] = useChartSize();
    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const margin = { top: 40, right: 20, bottom: 50, left: 60 };
        // const width = 700 - margin.left - margin.right;
        // const height = 300;

        const chart = svg
            .attr('width', width + margin.left + margin.right - 100)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const y = d3
            .scaleBand()
            .domain(data.map(d => d.year))
            .range([0, height - margin.top - margin.bottom])
            .padding(0.3);

        const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.wins + d.losses)])
            .range([0, width]);

        chart.append('g')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '12px');

        const tooltip = d3.select(tooltipRef.current);

        // Draw wins bar with animation
        chart.selectAll('.wins')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'wins')
            .attr('y', d => y(d.year))
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('width', 0)
            .attr('fill', '#1a8577')
            .on('mouseover', (event, d) => {
                tooltip
                    .style('display', 'block')
                    .html(`<strong>${d.year}</strong><br/>Wins: ${d.wins}`)
                    .style('left', event.pageX + 10 + 'px')
                    .style('top', event.pageY - 28 + 'px');
            })
            .on('mouseout', () => tooltip.style('display', 'none'))
            .transition()
            .duration(800)
            .attr('width', d => x(d.wins));

        // Draw losses bar with animation
        chart.selectAll('.losses')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'losses')
            .attr('y', d => y(d.year))
            .attr('height', y.bandwidth())
            .attr('x', d => x(d.wins))
            .attr('width', 0)
            .attr('fill', 'gray')
            .on('mouseover', (event, d) => {
                tooltip
                    .style('display', 'block')
                    .html(`<strong>${d.year}</strong><br/>Losses: ${d.losses}`)
                    .style('left', event.pageX + 10 + 'px')
                    .style('top', event.pageY - 28 + 'px');
            })
            .on('mouseout', () => tooltip.style('display', 'none'))
            .transition()
            .duration(800)
            .attr('width', d => x(d.losses));

        // Wins label
        chart.selectAll('.winText')
            .data(data)
            .enter()
            .append('text')
            .attr('x', 5)
            .attr('y', d => (y(d.year) ?? 0) + y.bandwidth() / 2 + 4)
            .text(d => d.wins)
            .attr('fill', 'white')
            .style('font-weight', 'bold');

        // Losses label
        chart.selectAll('.lossText')
            .data(data)
            .enter()
            .append('text')
            .attr('x', d => x(d.wins) + 5)
            .attr('y', d => (y(d.year) ?? 0) + y.bandwidth() / 2 + 4)
            .text(d => d.losses)
            .attr('fill', 'white')
            .style('font-weight', 'bold');


        // Legend
        const legend = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${height - 10})`);

        legend.append('rect')
            .attr('x', 0)
            .attr('y', -10)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', '#1a8577');

        legend.append('text')
            .attr('x', 20)
            .attr('y', 0)
            .text('Wins')
            .attr('fill', 'white')
            .style('font-size', '12px');

        legend.append('rect')
            .attr('x', 70)
            .attr('y', -10)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'gray');

        legend.append('text')
            .attr('x', 90)
            .attr('y', 0)
            .text('Losses')
            .attr('fill', 'white')
            .style('font-size', '12px');
    }, [data, width, height]);

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <svg ref={ref}></svg>
            <div
                ref={tooltipRef}
                style={{
                    position: 'absolute',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                    display: 'none',
                    fontSize: '13px',
                    zIndex: 10,
                }}
            />
        </div>
    );
};

export default WinsBarChart;
