import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import useChartSize from './useChartSize';

const RadarBarChart = ({ data }) => {
    const ref = useRef();
    if (!data || data.length === 0) 
        data = [0,0,0,0,0,0];
    useEffect(() => {
        const labels = ['Serving', 'Defense', 'Speed', 'Experience', 'Power', 'Skill'];
        const radius = 160;
        const levels = 5;
        const maxValue = 5;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const width = 400;
        const height = 400;
        const centerX = width / 2;
        const centerY = height / 2;

        svg.attr('width', width).attr('height', height);

        const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

        // 网格线
        for (let level = 1; level <= levels; level++) {
            const r = (radius / levels) * level;
            g.append('polygon')
                .attr('points', labels.map((_, i) => {
                    const angle = (Math.PI * 2 / labels.length) * i;
                    const x = r * Math.sin(angle);
                    const y = -r * Math.cos(angle);
                    return `${x},${y}`;
                }).join(' '))
                .attr('stroke', '#ccc')
                .attr('fill', 'none');
        }

        // 标签
        labels.forEach((label, i) => {
            const angle = (Math.PI * 2 / labels.length) * i;
            const x = (radius + 25) * Math.sin(angle);
            const y = -(radius + 25) * Math.cos(angle);
            g.append('text')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('font-size', 16)
                .attr('fill', '#b22222') // 深红色
                .text(label);
        });

        // 雷达区域路径
        const radarLine = d3.lineRadial()
            .radius((d, i) => (d / maxValue) * radius)
            .angle((d, i) => (i * 2 * Math.PI / data.length))
            .curve(d3.curveLinearClosed);

        // 动画初始数据：从0开始
        const initialData = data.map(() => 0);

        const path = g.append('path')
            .datum(initialData)
            .attr('fill', 'rgba(255, 0, 0, 0.4)')
            .attr('stroke', '#ff0000')
            .attr('stroke-width', 2)
            .attr('d', radarLine);

        // 动画过渡到真实数据
        path.transition()
            .duration(1000)
            .attrTween('d', function () {
                const interpolator = d3.interpolateArray(initialData, data);
                return function (t) {
                    return radarLine(interpolator(t));
                };
            });

    }, [data]);

    return <svg ref={ref}></svg>
};

export default RadarBarChart;
