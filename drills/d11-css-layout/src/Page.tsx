// d11: the markup that layout.css styles. Nothing to do in this file: read it,
// then write the CSS. (In a real Vite app you'd `import "./layout.css"` once in main.tsx.)

const events = ["Hackathon", "Careers fair", "Board games night", "Guest lecture"];

export default function Page() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>CampusEvents</h1>
      </header>

      <aside className="page-sidebar">
        <a href="#all">All events</a>
        <a href="#mine">My bookings</a>
      </aside>

      <main className="page-main">
        <section className="cards">
          {events.map((name) => (
            <article key={name} className="card">
              <h2>{name}</h2>
              <button type="button">Book</button>
            </article>
          ))}
        </section>
      </main>

      <footer className="page-footer">© CampusEvents</footer>
    </div>
  );
}
