import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DateRangePicker from "../components/DateRangePicker.jsx";
import SkeletonList from "../components/SkeletonList.jsx";
import Banner from "../components/Banner.jsx";
import LoopGlyph from "../components/LoopGlyph.jsx";
import { getEntryRange, ApiError } from "../api.js";
import { defaultRange, formatDayMonth, formatYear } from "../dateUtils.js";
import { RATING_DESCRIPTIONS } from "../ratingDescriptions.js";

export default function EntriesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [range] = useState(defaultRange);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(Boolean(location.state?.success));

  useEffect(() => {
    if (location.state?.success) {
      navigate(location.pathname, { replace: true, state: {} });
      const timer = setTimeout(() => setShowBanner(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  async function fetchEntries(start, end) {
    setLoading(true);
    setError(null);
    try {
      const data = await getEntryRange(start, end);
      setEntries(data);
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
      {showBanner && <Banner kind="success">Entry added.</Banner>}

      <div className="page__header">
        <h1>Entries</h1>
        <Link to="/new" className="button button--primary">
          + New Entry
        </Link>
      </div>

      <DateRangePicker startDate={range.start} endDate={range.end} onApply={fetchEntries} />

      {loading && <SkeletonList />}

      {!loading && error && <div className="error-text">{error}</div>}

      {!loading && !error && entries.length === 0 && <p className="empty-state">No entries</p>}

      {!loading && !error && entries.length > 0 && (
        <ul className="entry-list">
          {entries
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((entry) => (
              <li className="entry-row" key={entry.id}>
                <span className="entry-row__date">
                  <span className="entry-row__date-main">{formatDayMonth(entry.date)}</span>
                  <span className="entry-row__date-year">{formatYear(entry.date)}</span>
                </span>
                <LoopGlyph rating={entry.ruminationRating} size={26} className="entry-row__loop" />
                <span className="entry-row__rating">
                  <span className="entry-row__rating-value">{entry.ruminationRating}</span>
                  <span className="entry-row__rating-desc">
                    {RATING_DESCRIPTIONS[entry.ruminationRating]}
                  </span>
                </span>
                <span
                  className={`entry-row__practice entry-row__practice--${
                    entry.practiceCompleted ? "yes" : "no"
                  }`}
                  title={entry.practiceCompleted ? "Practice completed" : "No practice"}
                />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
