/* SearchBar.jsx - formularul de cautare; textul este tinut in App (componenta controlata)
   M v2.1.0 */
import { IoSearchOutline } from 'react-icons/io5';

export default function SearchBar({ value, onChange, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault(); // fara reincarcarea paginii
    onSubmit();
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <IoSearchOutline className="search-icon" aria-hidden="true" />
      <label htmlFor="search-input" className="sr-only">Adresa IP sau domeniu</label>
      <input
        id="search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cauta o adresa IP sau un domeniu, de exemplu 8.8.8.8 sau github.com"
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit">Cauta</button>
    </form>
  );
}
