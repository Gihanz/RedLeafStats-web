import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function useRounds(programFilter = "", yearRange = "All-time") {
  const [rounds, setRounds] = useState([]);
  const [programs, setPrograms] = useState(["All"]);
  const [yKeys, setYKeys] = useState(["drawCRS"]);

  useEffect(() => {
    const fetchRounds = async () => {
      const snapshot = await getDocs(collection(db, "ee_rounds"));
      let data = snapshot.docs.map((doc) => doc.data());

      // Extract numeric keys from first doc
      const first = data[0] || {};
      const numberKeys = Object.keys(first).filter(
        (k) => typeof first[k] === "string" && !isNaN(first[k].replace(/,/g, ""))
      );
      setYKeys(["drawCRS", ...numberKeys.filter((k) => k !== "drawCRS")]);

      // Extract draw names (programs)
      const uniquePrograms = Array.from(new Set(data.map((d) => d.drawName))).filter(Boolean);
      setPrograms(["All", ...uniquePrograms]);

      // Filter by program
      if (programFilter && programFilter !== "All") {
        data = data.filter((d) => d.drawName === programFilter);
      }

      // Filter by year
      const now = new Date();
      let cutoff = null;
      if (yearRange === "1 Year") {
        cutoff = new Date();
        cutoff.setFullYear(now.getFullYear() - 1);
      } else if (yearRange === "2 Year") {
        cutoff = new Date();
        cutoff.setFullYear(now.getFullYear() - 2);
      }

      if (cutoff) {
        data = data.filter((d) => {
          const parts = d.drawDate?.split("-");
          if (!parts || parts.length !== 3) return false;
          const date = new Date(parts[0], parts[1] - 1, parts[2]);
          return !isNaN(date) && date >= cutoff;
        });
      }

      setRounds(data);
    };

    fetchRounds();
  }, [programFilter, yearRange]);

  return { rounds, programs, yKeys };
}
