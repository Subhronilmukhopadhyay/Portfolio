export default function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative px-6 md:px-12 lg:px-20 py-24 md:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}
