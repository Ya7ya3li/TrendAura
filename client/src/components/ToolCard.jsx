export default function ToolCard({
  title,
  children
}) {

  return (
    <div className="tool-card">

      <div className="tool-header">
        <h3>{title}</h3>
      </div>

      <div className="tool-body">
        {children}
      </div>

    </div>
  )
}