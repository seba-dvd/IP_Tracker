/* DetailsPanel.jsx - VERSIUNE TEMPORARA din schelet (M v2.0.0); R o inlocuieste in v2.2.0 */
export default function DetailsPanel({ result }) {
  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
