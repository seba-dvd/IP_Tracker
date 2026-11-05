/* SearchBar.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); M o termina in v2.1.0 */
export default function SearchBar({ value, onChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={(e) => onChange(e.target.value)} aria-label="Adresa IP sau domeniu" />
      <button type="submit">Cauta</button>
    </form>
  );
}
