import { useState } from "react";

export default function DateRangePicker({ startDate, endDate, onApply }) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  function handleSubmit(e) {
    e.preventDefault();
    onApply(start, end);
  }

  return (
    <form className="date-range" onSubmit={handleSubmit}>
      <label className="date-range__field">
        <span>Start date</span>
        <input
          type="date"
          value={start}
          max={end}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </label>
      <label className="date-range__field">
        <span>End date</span>
        <input
          type="date"
          value={end}
          min={start}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="button button--secondary">
        Apply
      </button>
    </form>
  );
}
