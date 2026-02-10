import { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import { DateRange } from "react-date-range";
import axios from "axios";
import { CSSTransition } from 'react-transition-group';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from "chart.js";
import { addDays, addMonths } from "date-fns";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../index.css'; // ✅ Make sure you have the fade CSS here!

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [period, setPeriod] = useState("day");
  const [showCompare, setShowCompare] = useState(false);
  const [showCalendars, setShowCalendars] = useState(true);

  const [currentRange, setCurrentRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [previousRange, setPreviousRange] = useState([
    {
      startDate: addDays(new Date(), -7),
      endDate: addDays(new Date(), -7),
      key: 'selection'
    }
  ]);

  const [currentData, setCurrentData] = useState([]);
  const [previousData, setPreviousData] = useState([]);

  const fadeRef = useRef(null); // ✅ Fix findDOMNode warning

  const adjustRange = (range) => {
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
  };

  const handleCurrentChange = (ranges) => {
    setCurrentRange(adjustRange(ranges.selection));
  };

  const handlePreviousChange = (ranges) => {
    setPreviousRange(adjustRange(ranges.selection));
  };

  const handleFetch = () => {
    const currentStart = currentRange[0].startDate.toISOString().slice(0, 10);
    const currentEnd = currentRange[0].endDate.toISOString().slice(0, 10);
    const previousStart = previousRange[0].startDate.toISOString().slice(0, 10);
    const previousEnd = previousRange[0].endDate.toISOString().slice(0, 10);

    axios.get(`http://127.0.0.1:8000/api/sales-summary/`, {
      params: { period, start: currentStart, end: currentEnd }
    }).then(res => {
      if (Array.isArray(res.data)) {
        setCurrentData(res.data);
      } else {
        console.error("Unexpected current data format:", res.data);
        setCurrentData([]);
      }
    });

    if (showCompare) {
      axios.get(`http://127.0.0.1:8000/api/sales-summary/`, {
        params: { period, start: previousStart, end: previousEnd }
      }).then(res => {
        if (Array.isArray(res.data)) {
          setPreviousData(res.data);
        } else {
          console.error("Unexpected previous data format:", res.data);
          setPreviousData([]);
        }
      });
    } else {
      setPreviousData([]);
    }

    setShowCalendars(false); // ✅ Hide calendars when showing chart
  };

  const chartData = {
    labels: (Array.isArray(currentData) ? currentData : currentData?.summary || []).map(item => item.period?.slice(0, 10) || ''),
    datasets: [
      {
        label: "Current Period",
        data: (Array.isArray(currentData) ? currentData : currentData?.summary || []).map(item => item.total),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2
      },
      ...(showCompare ? [{
        label: "Previous Period",
        data: (Array.isArray(previousData) ? previousData : previousData?.summary || []).map(item => item.total),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.2
      }] : [])
    ]
  };

  return (
    <div>
      <h4>Sales Compare Mode</h4>

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

      <CSSTransition
        in={showCalendars}
        timeout={300}
        classNames="fade"
        nodeRef={fadeRef}
        unmountOnExit
      >
        <div ref={fadeRef}>
          {!showCompare && (
            <>
              <h6>Current Period</h6>
              <DateRange
                editableDateInputs={true}
                onChange={handleCurrentChange}
                moveRangeOnFirstSelection={false}
                ranges={currentRange}
              />
              <button
                className="btn btn-outline-primary mb-3"
                onClick={() => setShowCompare(true)}
              >
                + Compare with another period
              </button>
            </>
          )}

          {showCompare && (
            <>
              <div className="d-flex gap-4">
                <div>
                  <h6>Current Period</h6>
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleCurrentChange}
                    moveRangeOnFirstSelection={false}
                    ranges={currentRange}
                  />
                </div>

                <div>
                  <h6>Previous Period</h6>
                  <DateRange
                    editableDateInputs={true}
                    onChange={handlePreviousChange}
                    moveRangeOnFirstSelection={false}
                    ranges={previousRange}
                  />
                </div>
              </div>
              <button
                className="btn btn-outline-danger mt-2"
                onClick={() => setShowCompare(false)}
              >
                Disable Compare Mode
              </button>
            </>
          )}
        </div>
      </CSSTransition>

      {showCalendars ? (
        <button className="btn btn-primary mb-3" onClick={handleFetch}>
          Show Chart
        </button>
      ) : (
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => setShowCalendars(true)}
        >
          Change Time Period
        </button>
      )}

      <Line data={chartData} />
    </div>
  );
};

export default SalesChart;