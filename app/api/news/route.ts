import { NextResponse } from "next/server";

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Fallback news when API key is missing or API fails
const FALLBACK_NEWS = [
  {
    title: "PM Kisan Samman Nidhi: 18th Installment Released for Farmers",
    description:
      "The Government of India has released the 18th installment of PM Kisan Samman Nidhi, benefiting over 9.5 crore farmers across the country with direct bank transfers.",
    url: "https://pmkisan.gov.in",
    image: null,
    publishedAt: new Date().toISOString(),
    source: { name: "Government of India", url: "https://india.gov.in" },
  },
  {
    title: "Union Budget 2026: Increased Allocation for Rural Development",
    description:
      "The Finance Ministry has announced a 15% increase in rural development allocation, with focus on Gram Panchayat infrastructure, MGNREGA, and drinking water supply projects.",
    url: "https://www.indiabudget.gov.in",
    image: null,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: { name: "Ministry of Finance", url: "https://finmin.nic.in" },
  },
  {
    title: "MGNREGA Wages Revised: New Rates Effective April 2026",
    description:
      "The Ministry of Rural Development has revised MGNREGA wage rates across all states, with average increase of 5-7%. The new rates aim to benefit over 6 crore rural households.",
    url: "https://nrega.nic.in",
    image: null,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: { name: "Ministry of Rural Development", url: "https://rural.nic.in" },
  },
  {
    title: "Swachh Bharat Mission Gramin Phase-II: New Targets Announced",
    description:
      "Under the Swachh Bharat Mission Gramin Phase-II, the government has set new targets for ODF Plus villages including solid and liquid waste management facilities.",
    url: "https://swachhbharatmission.gov.in",
    image: null,
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    source: { name: "Ministry of Jal Shakti", url: "https://jalshakti-ddws.gov.in" },
  },
  {
    title: "Jal Jeevan Mission: 80% Rural Households Now Have Tap Water",
    description:
      "The Jal Jeevan Mission has achieved a major milestone with 80% of rural households now having functional tap water connections, up from 17% in 2019.",
    url: "https://jaljeevanmission.gov.in",
    image: null,
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    source: { name: "Ministry of Jal Shakti", url: "https://jalshakti-ddws.gov.in" },
  },
  {
    title: "Digital India: UPI Transactions Cross 20 Billion Monthly",
    description:
      "UPI digital payment transactions have crossed the 20 billion mark per month, with rural areas contributing significantly to the growth in digital financial inclusion.",
    url: "https://www.npci.org.in",
    image: null,
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    source: { name: "NPCI", url: "https://www.npci.org.in" },
  },
  {
    title: "Pradhan Mantri Gram Sadak Yojana: 98% Target Roads Completed",
    description:
      "Under PMGSY, 98% of targeted rural roads have been constructed connecting 1.78 lakh habitations. The scheme continues to focus on upgrading existing rural road networks.",
    url: "https://pmgsy.nic.in",
    image: null,
    publishedAt: new Date(Date.now() - 518400000).toISOString(),
    source: { name: "Ministry of Rural Development", url: "https://rural.nic.in" },
  },
  {
    title: "15th Finance Commission: Increased Grants for Local Bodies",
    description:
      "The 15th Finance Commission has recommended increased grants for Panchayati Raj institutions, with special focus on health, water, and sanitation at the village level.",
    url: "https://fincomindia.nic.in",
    image: null,
    publishedAt: new Date(Date.now() - 604800000).toISOString(),
    source: { name: "Finance Commission", url: "https://fincomindia.nic.in" },
  },
];

export async function GET() {
  // If no GNews API key, return curated fallback news
  if (!GNEWS_API_KEY) {
    return NextResponse.json({ articles: FALLBACK_NEWS });
  }

  try {
    const query = encodeURIComponent(
      "India government finance scheme rural budget panchayat"
    );
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`,
      { next: { revalidate: 600 } } // cache for 10 minutes
    );

    if (!res.ok) {
      return NextResponse.json({ articles: FALLBACK_NEWS });
    }

    const data = await res.json();
    return NextResponse.json({ articles: data.articles || FALLBACK_NEWS });
  } catch {
    return NextResponse.json({ articles: FALLBACK_NEWS });
  }
}
