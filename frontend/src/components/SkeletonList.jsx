export default function SkeletonList({ rows = 5 }) {
  return (
    <div className="skeleton-list" aria-busy="true" aria-label="Loading entries">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <span className="skeleton-block skeleton-block--date" />
          <span className="skeleton-block skeleton-block--rating" />
          <span className="skeleton-block skeleton-block--practice" />
        </div>
      ))}
    </div>
  );
}
