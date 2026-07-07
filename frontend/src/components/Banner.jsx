export default function Banner({ kind = "success", children }) {
  return <div className={`banner banner--${kind}`}>{children}</div>;
}
