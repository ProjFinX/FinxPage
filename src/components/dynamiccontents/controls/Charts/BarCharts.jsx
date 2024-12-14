import { useLayoutEffect, useRef } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as a from "@amcharts/amcharts5/percent"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function BarCharts(props) {
  const chartRef = useRef(null); // Reference for the chart div

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    let root = am5.Root.new(chartRef.current); // Directly attach to the React-managed DOM node

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
     // am5xy.PieChart.new(root, {})
    );

    // Define data
    let data = [{
      category: "Research",
      value1: 1000,
      value2: 588
    }, {
      category: "Marketing",
      value1: 1200,
      value2: 1800
    }, {
      category: "Sales",
      value1: 850,
      value2: 1230
    }];

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    // Create X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "category"
      })
    );
    xAxis.data.setAll(data);

    // Create series
    let series1 = chart.series.push(
      (root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value1",
        categoryXField: "category"
      })
    );
    series1.data.setAll(data);

    let series2 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value2",
        categoryXField: "category"
      })
    );
    series2.data.setAll(data);

    // Add legend
    let legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    return () => {
      root.dispose(); // Cleanup when the component unmounts
    };
  }, []);

  return (
    <div ref={chartRef} style={{ width: "500px", height: "500px" }}></div>
  );
}

export default BarCharts;
