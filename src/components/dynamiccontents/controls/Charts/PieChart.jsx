import { useEffect, useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function PieChart(props) {
    const chartRef = useRef(null); // Reference for the chart div
    
    useEffect(() => {
        if (!chartRef.current) return;

        if(!props.elmtData || props.elmtData=="")return;

        let root = am5.Root.new(chartRef.current); // Directly attach to the React-managed DOM node

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push( 
            am5percent.PieChart.new(root, {
              layout: root.verticalHorizontal
            }) 
        );
        
        let data = [];

        data = props.elmtData?  props.elmtData : data
          
        // Create series
        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                name: "Series",
                valueField: "value",
                categoryField: "key"
            })
        );
        series.data.setAll(data);

         // Add animations explicitly to the series
         series.appear(1000, 100); // 1000ms for duration, 100ms delay
         chart.appear(1000, 100); // Animate the chart itself
         
          
        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50),
            layout: root.horizontalLayout
        }));
          
        legend.data.setAll(series.dataItems);

        return () => {
            root.dispose(); // Cleanup when the component unmounts
        };
    }, [props.elmtData]);

    return (
        <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>
    );
}

export default PieChart;
