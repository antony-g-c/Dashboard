import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

// ✅ Register required Chart.js elements:
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProcessingTime = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/processing-time-report/")
      .then((res) => setReport(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!report) return <p>Loading processing time report...</p>;

  const chartData = {
    labels: report.individual_orders?.map((order) => `Order #${order.order_id}`),
    datasets: [
      {
        label: "Processing Time (Days)",
        data: report.individual_orders?.map((order) => order.processing_time),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Processing Time per Order",
      },
    },
  };

  return (
    <div className="mt-4">
      <h4>Processing Time Report</h4>
      <p>
        Average Processing Time:{" "}
        <strong>
          {report.average_processing_time_days?.toFixed(2) || "N/A"}
        </strong>{" "}
        days
      </p>
      <p>
        Total Shipped Orders:{" "}
        <strong>{report.total_shipped_orders || 0}</strong>
      </p>
      <h6>Individual Processing Times:</h6>
          <table className="table table-bordered table-striped mt-2">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Created At</th>
                <th>Shipped At</th>
                <th>Processing Time (Days)</th>
              </tr>
            </thead>
            <tbody>
              {report.individual_orders && report.individual_orders.length > 0 ? (
                report.individual_orders.map((entry) => (
                  <tr key={entry.order_id}>
                    <td>#{entry.order_id}</td>
                    <td>{entry.created_at}</td>
                    <td>{entry.shipped_at}</td>
                    <td>{entry.processing_time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No shipped orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
      <h6>Processing Time Chart:</h6>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ProcessingTime;