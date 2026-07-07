import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEntry, ApiError } from "../api.js";
import { RATING_DESCRIPTIONS } from "../ratingDescriptions.js";
import LoopGlyph from "../components/LoopGlyph.jsx";
import { todayISODate, formatWeekday, formatDayMonth, formatYear } from "../dateUtils.js";

const RATING_OPTIONS = Object.entries(RATING_DESCRIPTIONS).map(([value, description]) => ({
  value: Number(value),
  description,
}));

export default function NewEntryPage() {
  const navigate = useNavigate();
  const today = todayISODate();
  const [rating, setRating] = useState(null);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [conflict, setConflict] = useState(false);

  function handleCancel() {
    navigate("/");
  }

  async function handleSave() {
    if (rating === null) return;
    setSaving(true);
    setError(null);
    setConflict(false);
    try {
      await createEntry({ ruminationRating: rating, practiceCompleted });
      navigate("/", { state: { success: true } });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong saving this entry.";
      setError(message);
      setConflict(err instanceof ApiError && err.status === 409);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <h1 className="new-entry-head">
        <span className="new-entry-head__day">{formatWeekday(today)}</span>
        <span className="new-entry-head__date">
          {formatDayMonth(today)} {formatYear(today)}
        </span>
      </h1>

      {error && (
        <div className="error-text error-text--prominent">
          {error}
          {conflict && (
            <p className="error-text__note">
              You've already logged today's entry, and entries can't be edited. Hit Cancel to go back.
            </p>
          )}
        </div>
      )}

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={practiceCompleted}
          onChange={(e) => setPracticeCompleted(e.target.checked)}
          disabled={saving}
        />
        Practice completed
      </label>

      <fieldset className="rating-scale" disabled={saving}>
        <legend>Rumination rating</legend>
        {RATING_OPTIONS.map((option) => (
          <label className="rating-option" key={option.value}>
            <input
              type="radio"
              name="rating"
              value={option.value}
              checked={rating === option.value}
              onChange={() => setRating(option.value)}
            />
            <span className="rating-option__value">{option.value}</span>
            <LoopGlyph rating={option.value} size={22} className="rating-option__loop" />
            <span className="rating-option__description">{option.description}</span>
          </label>
        ))}
      </fieldset>

      <div className="page__actions">
        <button type="button" className="button button--secondary" onClick={handleCancel} disabled={saving}>
          Cancel
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={handleSave}
          disabled={saving || rating === null}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
