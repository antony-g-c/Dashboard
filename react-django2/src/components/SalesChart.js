import { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { DateRange } from "react-date-range";
import axios from "axios";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from "chart.js";
import { addDays, addMonths, format } from "date-fns";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../index.css'; // ✅ Make sure you have the fade CSS here!

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [period, setPeriod] = useState("day");
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [error, setError] = useState("");

  const [periodARange, setPeriodARange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [periodBRange, setPeriodBRange] = useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: addDays(new Date(), -7),
      key: 'selection'
    }
  ]);

  const [periodAData, setPeriodAData] = useState([]);
  const [periodBData, setPeriodBData] = useState([]);

  const normalizeSummary = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.summary)) return payload.summary;
    return [];
  };

  const toLocalDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getDayCount = (range) => {
    const start = new Date(range.startDate.getFullYear(), range.startDate.getMonth(), range.startDate.getDate());
    const end = new Date(range.endDate.getFullYear(), range.endDate.getMonth(), range.endDate.getDate());
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const rangeLabel = (range) => (
    `${format(range.startDate, "MMM d, yyyy")} - ${format(range.endDate, "MMM d, yyyy")}`
  );

  const adjustRange = useCallback((range) => {
    let start = range.startDate;
    let end;

    if (period === "custom") {
      return [{
        ...range,
        key: 'selection'
      }];
    }

    if (period === "day") {
      end = start;
    } else if (period === "week") {
      end = addDays(start, 6);
    } else if (period === "month") {
      end = addDays(addMonths(start, 1), -1);
    }

    return [{
      ...range,
      startDate: start,
      endDate: end,
      key: 'selection'
    }];
  }, [period]);

  const handleCurrentChange = (ranges) => {
    setPeriodARange(adjustRange(ranges.selection));
  };

  const handlePreviousChange = (ranges) => {
    setPeriodBRange(adjustRange(ranges.selection));
  };

  useEffect(() => {
    setPeriodARange((prev) => adjustRange(prev[0]));
    setPeriodBRange((prev) => adjustRange(prev[0]));
  }, [adjustRange]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const rangeA = periodARange[0];
      const rangeB = periodBRange[0];

      const aStart = toLocalDateString(rangeA.startDate);
      const aEnd = toLocalDateString(rangeA.endDate);

      try {
        if (compareEnabled) {
          const daysA = getDayCount(rangeA);
          const daysB = getDayCount(rangeB);
          if (daysA !== daysB) {
            setError(`Period lengths must match. Period A has ${daysA} day(s), Period B has ${daysB} day(s).`);
            return;
          }

          const bStart = toLocalDateString(rangeB.startDate);
          const bEnd = toLocalDateString(rangeB.endDate);
          const [aRes, bRes] = await Promise.all([
            axios.get("http://127.0.0.1:8000/api/sales-summary/", {
              params: { period, start: aStart, end: aEnd }
            }),
            axios.get("http://127.0.0.1:8000/api/sales-summary/", {
              params: { period, start: bStart, end: bEnd }
            })
          ]);
          setPeriodAData(normalizeSummary(aRes.data));
          setPeriodBData(normalizeSummary(bRes.data));
        } else {
          const aRes = await axios.get("http://127.0.0.1:8000/api/sales-summary/", {
            params: { period, start: aStart, end: aEnd }
          });
          setPeriodAData(normalizeSummary(aRes.data));
          setPeriodBData([]);
        }
        setError("");
      } catch (err) {
        console.error("Failed to fetch sales summary:", err.response?.data || err.message);
        setPeriodAData([]);
        setPeriodBData([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [period, compareEnabled, periodARange, periodBRange]);

  const maxPoints = compareEnabled
    ? Math.max(periodAData.length, periodBData.length)
    : periodAData.length;
  const labels = Array.from({ length: maxPoints }, (_, i) => `Day ${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: `Period A (${rangeLabel(periodARange[0])})`,
        data: periodAData.map(item => Number(item.total ?? 0)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2
      },
      ...(compareEnabled ? [{
        label: `Period B (${rangeLabel(periodBRange[0])})`,
        data: periodBData.map(item => Number(item.total ?? 0)),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.2
      }] : [])
    ]
  };

  return (
    <div>
      <h4>Sales Compare Mode</h4>
      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="compareSwitch"
          checked={compareEnabled}
          onChange={(e) => {
            setCompareEnabled(e.target.checked);
            if (!e.target.checked) {
              setPeriodBData([]);
              setError("");
            }
          }}
        />
        <label className="form-check-label" htmlFor="compareSwitch">
          Compare two periods
        </label>
      </div>
      <div className="mb-2">
        <label>Time Period: </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="form-select w-auto d-inline ms-2"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="d-flex gap-4">
        <div>
          <h6>Period A</h6>
          <DateRange
            editableDateInputs={true}
            onChange={handleCurrentChange}
            moveRangeOnFirstSelection={false}
            ranges={periodARange}
          />
        </div>

        {compareEnabled && (
          <div>
            <h6>Period B</h6>
            <DateRange
              editableDateInputs={true}
              onChange={handlePreviousChange}
              moveRangeOnFirstSelection={false}
              ranges={periodBRange}
            />
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <Line data={chartData} />
    </div>
  );
};

export default SalesChart;
