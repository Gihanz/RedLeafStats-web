import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function RecentNews() {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
  const fetchNews = async () => {
    const snapshot = await getDocs(collection(db, "notices"));
    const docs = snapshot.docs.map((doc) => doc.data());
    if (docs.length > 0 && docs[0].content) {
      let htmlString = docs[0].content;

      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      // Remove the heading that contains "Notices: Immigration, Refugees and Citizenship Canada"
      const h1 = doc.querySelector("h1");
      if (h1 && h1.textContent.includes("Notices:") && h1.textContent.includes("Immigration")) {
        h1.remove();
      }

      // Fix <a> tags: prepend domain and add target/rel
      const anchors = doc.querySelectorAll("a[href^='/']");
      anchors.forEach((a) => {
        a.href = `https://www.canada.ca${a.getAttribute("href")}`;
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      });

      // Serialize back to string
      const cleanedHTML = doc.body.innerHTML;
      setHtmlContent(cleanedHTML);
    }
  };

  fetchNews();
}, []);



  return (
    <div className="bg-white dark:bg-gray-800 p-4 w-full">
      <h2 className="text-xl font-heading font-bold mb-4">📰 Recent IRCC News</h2>

      {/* Custom styles for date labels */}
      <style>
        {`
          .label.label-default {
            background-color: #f0f8ff;
            border-left: 4px solid #26374a;
            color: #000;
            font-size: 15px;
            font-weight: 400;
            padding: 1px 10px;
            border-radius: 4px;
            margin-left: 10px;
          }
          .dark .label.label-default {
            background-color: #374151;
            color: #fff;
            border-left-color: #9ca3af;
          }
        `}
      </style>
      <div
        className="prose dark:prose-invert max-h-[500px] overflow-y-auto w-full max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
