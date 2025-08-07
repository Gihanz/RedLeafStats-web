import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const normalize = (str) => (typeof str === "string" ? str.toLowerCase().trim() : "");

export default function useOINPRounds({ filterByLatestYear = false, filterByNote = null, filterByStream = null } = {}) {
  const [rounds, setRounds] = useState([]);
  const [allRounds, setAllRounds] = useState([]);
  const [latestYear, setLatestYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRounds = async () => {
      setLoading(true);
      try {
        const roundsRef = collection(db, "oinp_rounds");
        const q = query(roundsRef, where("document_type", "==", "draw"));
        const snapshot = await getDocs(q);

        let all = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Convert date_issued to Date object for sorting
        all.forEach(d => {
          d._dateIssuedObj = new Date(d.date_issued);
        });

        // Sort by date issued descending
        all.sort((a, b) => b._dateIssuedObj - a._dateIssuedObj);

        setAllRounds(all);

        // Filter by latest year if needed
        const availableYears = all.map(d => d.year).filter(Boolean);
        const latest = Math.max(...availableYears);
        setLatestYear(latest);

        let filtered = [...all];

        if (filterByLatestYear) {
          filtered = filtered.filter(d => d.year === latest);
        }

        if (filterByNote) {
          const noteFilter = filterByNote.toLowerCase();
          filtered = filtered.filter(d => d.notes?.toLowerCase().includes(noteFilter));
        }

        if (filterByStream) {
          const streamFilter = normalize(filterByStream);
          // Exact inclusion check (case-insensitive)
          filtered = filtered.filter(d => normalize(d.stream).includes(streamFilter));
        }

        setRounds(filtered);
      } catch (err) {
        console.error("❌ Error fetching OINP rounds:", err);
        setRounds([]);
        setAllRounds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, [filterByLatestYear, filterByNote, filterByStream]);

  return { rounds, allRounds, latestYear, loading };
}
