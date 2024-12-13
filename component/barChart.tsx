import dynamic from "next/dynamic";
import "chart.js/auto";
import { FC } from "react";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
	ssr: false,
});

type IBarChartProps = {
	labels: string[];
	data: number[];
};
const barData = {
	labels: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	datasets: [
		{
			label: "Average amount over Year",
			data: [
				1000, 2000, 3000, 5000, 25550, 3000, 10000, 10000, 10000, 10000,
				10000, 10000, 10000, 10000, 10000,
			],
			backgroundColor: [
				"rgba(255, 99, 132, 0.2)",
				"rgba(54, 162, 235, 0.2)",
				"rgba(255, 206, 86, 0.2)",
				"rgba(75, 192, 192, 0.2)",
				"rgba(153, 102, 255, 0.2)",
				"rgba(255, 159, 64, 0.2)",
			],
			borderColor: [
				"rgba(255, 99, 132, 1)",
				"rgba(54, 162, 235, 1)",
				"rgba(255, 206, 86, 1)",
				"rgba(75, 192, 192, 1)",
				"rgba(153, 102, 255, 1)",
				"rgba(255, 159, 64, 1)",
			],
			borderWidth: 1,
		},
	],
};
const BarChart: FC<IBarChartProps> = ({ data, labels }) => {
	return (
		<div style={{ width: "400px" }}>
			<h1>Invoice Amount</h1>
			<Bar
				data={{
					labels,
					datasets: [
						{
							...barData.datasets[0],
							data,
						},
					],
				}}
			/>
		</div>
	);
};
export default BarChart;
