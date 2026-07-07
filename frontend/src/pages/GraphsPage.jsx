import { useEffect, useState } from "react";
import DateRangePicker from "../components/DateRangePicker.jsx";
import SkeletonList from "../components/SkeletonList.jsx";
import RatingScatterChart from "../components/RatingScatterChart.jsx";
import { getEntryRange, ApiError } from "../api.js";
import { defaultRange } from "../dateUtils.js";

export default function GraphsPage() {
  const [range, setRange] = useState(defaultRange);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchEntries(start, end) {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntryRange(start, end);
      setEntries(data);
      setRange({ start, end });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong loading entries.";
      setError(message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries(range.start, range.end);
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h1>Graphs</h1>
      </div>

      <DateRangePicker startDate={range.start} endDate={range.end} onApply={fetchEntries} />

      {loading && <SkeletonList />}

      {!loading && error && <div className="error-text">{error}</div>}

      {!loading && !error && entries.length === 0 && <p className="empty-state">No entries</p>}

      {!loading && !error && entries.length > 0 && (
        <RatingScatterChart entries={entries} startDate={range.start} endDate={range.end} />
      )}
    </div>
  );
}
