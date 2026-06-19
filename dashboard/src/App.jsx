import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import SeverityBarChart from "./components/SeverityBarChart.jsx";
import ComparisonTable from "./components/ComparisonTable.jsx";
import ScannerDiffTable from "./components/ScannerDiffTable.jsx";
import Glossary from "./components/Glossary.jsx";
import Footer from "./components/Footer.jsx";
import styles from "./App.module.css";

const DATA_URL = import.meta.env.BASE_URL + "data.json";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className={styles.center}><p style={{color:"var(--critical)"}}>데이터 로드 실패: {error}</p></div>;
  if (!data)  return <div className={styles.center}><span className={styles.spinner} />Loading…</div>;

  return (
    <div className={styles.layout}>
      <Header generatedAt={data.generatedAt} isPlaceholder={data.placeholder} />
      <main className={styles.main}>
        <SummaryCards images={data.images} />
        <SeverityBarChart images={data.images} />
        <ComparisonTable images={data.images} />
        <ScannerDiffTable images={data.images} />
        <Glossary />
      </main>
      <Footer />
    </div>
  );
}
