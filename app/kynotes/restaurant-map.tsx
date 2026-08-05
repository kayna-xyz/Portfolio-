"use client"

// Resy/Apple-Maps-style split view for the KyNotes food note: restaurant list
// on the left, a pinned map on the right, and an iOS-style detail card per
// restaurant (like the reading-list book modal). Part of the KyNotes page, so
// it uses the SF system stack, not the site design system. Leaflet is loaded
// dynamically (it touches `window` on import).
import { useEffect, useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import type { Map as LeafletMap, Marker } from "leaflet"

type Restaurant = {
  name: string
  slug: string // photo filename prefix in /public/kaynote/food/
  photos: [number, number][] // intrinsic [width, height] of <slug>-1..n.webp
  address: string
  lat: number
  lng: number
  group: string
  kind: string
  desc: string
  price?: string
  rating?: string
  closed?: boolean
  fav?: boolean // Kayna's favorites — starred on the card
  hours?: [string, string][]
  cid: string // Google Maps place id, for the "open in Google Maps" link
}

// 135 W 52nd St — rendered as a plain blue dot labeled "home", no address on the page
const HOME = { lat: 40.761653, lng: -73.980489 }

// Names, coordinates, categories, prices, ratings, and weekly hours come from
// Kayna's "nyc food" Google Maps list + each place's Google Maps record
// (snapshot: July 2026 — hours may drift). Descriptions are editorial.
const RESTAURANTS: Restaurant[] = [
  { name: "Genki Omakase", slug: "genki-omakase", photos: [[640, 480], [360, 480], [640, 480]], address: "552 LaGuardia Pl", lat: 40.729163, lng: -73.99829, group: "japanese", kind: "sushi", desc: "neighborhood omakase counter on LaGuardia Pl, some of the best-value sushi downtown.", price: "$100+", rating: "4.8", hours: [["Monday", "12–3 PM, 5–11 PM"], ["Tuesday", "12–3 PM, 5–11 PM"], ["Wednesday", "12–3 PM, 5–11 PM"], ["Thursday", "12–3 PM, 5–11 PM"], ["Friday", "12–3 PM, 5–11 PM"], ["Saturday", "12–3 PM, 5–11 PM"], ["Sunday", "12–3 PM, 5–11 PM"]], cid: "13666852317520710636" },
  { name: "Tsukimi", slug: "tsukimi", photos: [[602, 480], [640, 480], [360, 480]], address: "228 E 10th St", lat: 40.729091, lng: -73.985436, group: "japanese", kind: "japanese", desc: "seasonal kaiseki-style tasting menus in the East Village.", price: "$100+", rating: "4.6", hours: [["Monday", "Closed"], ["Tuesday", "Closed"], ["Wednesday", "5–8:30 PM"], ["Thursday", "5–8:30 PM"], ["Friday", "5–8:30 PM"], ["Saturday", "5–8 PM"], ["Sunday", "5–8 PM"]], cid: "16383114659820241904" },
  { name: "Sushi Ikumi", slug: "sushi-ikumi", photos: [[640, 427], [360, 480], [480, 480]], address: "135 Sullivan St", lat: 40.726676, lng: -74.001809, group: "japanese", kind: "sushi", desc: "quiet Sullivan St sushi counter doing classic Edomae work.", price: "$100+", rating: "4.6", hours: [["Monday", "Closed"], ["Tuesday", "6–10 PM"], ["Wednesday", "6–10 PM"], ["Thursday", "6–10 PM"], ["Friday", "6–10 PM"], ["Saturday", "11:45 AM–2 PM, 6–10 PM"], ["Sunday", "Closed"]], cid: "1983583634659802688" },
  { name: "Mori", slug: "mori", photos: [[360, 480], [371, 480]], address: "144 Sullivan St", lat: 40.727126, lng: -74.002033, group: "japanese", kind: "sushi", desc: "tiny Sullivan St omakase with a near-perfect rating, book ahead.", price: "$100+", rating: "4.9", hours: [["Monday", "5:30–10 PM"], ["Tuesday", "5:30–10 PM"], ["Wednesday", "5:30–10 PM"], ["Thursday", "5:30–10 PM"], ["Friday", "5:30–10 PM"], ["Saturday", "5:30–10 PM"], ["Sunday", "5:30–9 PM"]], cid: "12069969562798453163" },
  { name: "noda", slug: "noda", photos: [[384, 480], [360, 480], [360, 480]], address: "37 W 20th St", lat: 40.74075, lng: -73.99315, group: "japanese", kind: "sushi", desc: "Michelin-starred omakase counter in Flatiron.", price: "$100+", rating: "4.7", hours: [["Monday", "Closed"], ["Tuesday", "5:45–9 PM"], ["Wednesday", "5:45–9 PM"], ["Thursday", "5:45–9 PM"], ["Friday", "5:45–9 PM"], ["Saturday", "5:45–9 PM"], ["Sunday", "Closed"]], cid: "7392539412309278511" },
  { name: "Unique Omakase", slug: "unique-omakase", photos: [[354, 480], [360, 480], [360, 480]], address: "120 1st Ave", lat: 40.727024, lng: -73.985439, group: "japanese", kind: "japanese", desc: "East Village omakase, generous cuts without the midtown price tag.", rating: "4.2", hours: [["Monday", "11:40 AM–10 PM"], ["Tuesday", "11:30 AM–10 PM"], ["Wednesday", "Closed"], ["Thursday", "11:30 AM–10 PM"], ["Friday", "11:30 AM–10 PM"], ["Saturday", "11:30 AM–11:30 PM"], ["Sunday", "11:30 AM–11:30 PM"]], cid: "13923720182574969844" },
  { name: "Ume", slug: "ume", photos: [[640, 480], [640, 360], [640, 480]], address: "237 Kent Ave, Brooklyn", lat: 40.716562, lng: -73.965599, group: "japanese", kind: "japanese", desc: "izakaya-meets-omakase on the Williamsburg waterfront.", price: "$100+", rating: "4.3", hours: [["Monday", "Closed"], ["Tuesday", "1–4 PM, 5–10 PM"], ["Wednesday", "1–4 PM, 5–10 PM"], ["Thursday", "1–4 PM, 5–10 PM"], ["Friday", "1–4 PM, 5–10 PM"], ["Saturday", "1–4 PM, 5–10 PM"], ["Sunday", "1–4 PM, 5–10 PM"]], cid: "11767791223829093898" },
  { name: "odo", slug: "odo", photos: [[640, 480], [362, 480], [360, 480]], address: "17 W 20th St", lat: 40.740398, lng: -73.992162, group: "japanese", kind: "japanese", desc: "Michelin-starred kaiseki counter hidden behind a Flatiron café.", price: "$100+", rating: "4.5", hours: [["Monday", "Closed"], ["Tuesday", "12–1:45 PM, 6–8:30 PM"], ["Wednesday", "12–1:45 PM, 6–8:30 PM"], ["Thursday", "12–1:45 PM, 6–8:30 PM"], ["Friday", "12–1:45 PM, 6–8:30 PM"], ["Saturday", "12–1:45 PM, 6–8:30 PM"], ["Sunday", "12–1:45 PM, 6–8:30 PM"]], cid: "5089349792540086353" },
  { name: "ITO", slug: "ito", photos: [[640, 427], [481, 480], [360, 480]], address: "75 Barclay St", lat: 40.713085, lng: -74.01014, group: "japanese", kind: "sushi", desc: "long-form, high-end omakase in TriBeCa.", price: "$100+", rating: "4.5", hours: [["Monday", "Closed"], ["Tuesday", "6–11 PM"], ["Wednesday", "6–11 PM"], ["Thursday", "6–11 PM"], ["Friday", "6–11 PM"], ["Saturday", "6–11 PM"], ["Sunday", "Closed"]], cid: "13784613033486296054" },
  { name: "Nakaji", slug: "nakaji", photos: [[640, 360], [384, 480], [360, 480]], address: "48 Bowery", lat: 40.715782, lng: -73.996669, group: "japanese", kind: "japanese", desc: "Edomae omakase tucked inside a Chinatown arcade on Bowery.", price: "$100+", rating: "4.4", hours: [["Monday", "Closed"], ["Tuesday", "5:30 PM–12 AM"], ["Wednesday", "5:30 PM–12 AM"], ["Thursday", "5:30 PM–12 AM"], ["Friday", "5:30 PM–12 AM"], ["Saturday", "5:30 PM–12 AM"], ["Sunday", "5:30 PM–12 AM"]], cid: "17146924900618692915" },
  { name: "Tsubame", slug: "tsubame", photos: [[362, 480], [360, 480], [360, 480]], address: "11 Park Pl", lat: 40.713056, lng: -74.008316, group: "japanese", kind: "japanese", desc: "kaiseki-inspired omakase near City Hall.", price: "$100+", rating: "4.6", hours: [["Monday", "Closed"], ["Tuesday", "5:30–10:30 PM"], ["Wednesday", "5:30–10:30 PM"], ["Thursday", "5:30–10:30 PM"], ["Friday", "5:30–10:30 PM"], ["Saturday", "5:30–10:30 PM"], ["Sunday", "Closed"]], cid: "5353216102541981952" },
  { name: "CLASS on 38th", slug: "class-on-38th", photos: [[640, 427], [360, 480], [360, 480]], address: "55 W 38th St", lat: 40.75215, lng: -73.985012, group: "japanese", kind: "japanese", desc: "omakase and Japanese brunch in the Garment District.", price: "$50–100", rating: "4.8", closed: true, cid: "724278555532945549" },
  { name: "SenYa", slug: "senya", photos: [[360, 480], [375, 480], [640, 480]], address: "109 1st Ave", lat: 40.72688, lng: -73.986065, group: "japanese", kind: "japanese", desc: "cozy East Village spot, Japanese dishes and sushi with a twist.", price: "$50–100", rating: "4.4", closed: true, cid: "8198779770640124552" },
  { name: "Sushi Noz", slug: "sushi-noz", photos: [[640, 427], [360, 480], [360, 480]], address: "181 E 78th St", lat: 40.773863, lng: -73.958139, group: "japanese", kind: "sushi", desc: "temple-like Edomae sushi on the Upper East Side, hinoki counter and all.", price: "$100+", rating: "4.5", hours: [["Monday", "5:45–11 PM"], ["Tuesday", "5:45–11 PM"], ["Wednesday", "5:45–11 PM"], ["Thursday", "5:45–11 PM"], ["Friday", "5:45–11 PM"], ["Saturday", "5:45–11 PM"], ["Sunday", "Closed"]], cid: "1401533266024486600" },
  { name: "Bar Masa", slug: "bar-masa", photos: [[640, 409], [360, 480], [381, 480]], address: "10 Columbus Cir, Floor 4", lat: 40.768553, lng: -73.983187, group: "japanese", kind: "japanese", desc: "the (slightly) more accessible sibling of Masa at Columbus Circle.", price: "$100+", rating: "4.2", hours: [["Monday", "Closed"], ["Tuesday", "12–2 PM, 5–9:30 PM"], ["Wednesday", "12–2 PM, 5–9:30 PM"], ["Thursday", "12–2 PM, 5–9:30 PM"], ["Friday", "12–2 PM, 5–9:30 PM"], ["Saturday", "12–2 PM, 5–9:30 PM"], ["Sunday", "Closed"]], cid: "2357775413399750624" },
  { name: "Hirohisa", slug: "hirohisa", photos: [[637, 480], [360, 480], [637, 480]], address: "73 Thompson St", lat: 40.724553, lng: -74.003028, group: "japanese", kind: "japanese", desc: "understated Michelin-starred kappo in SoHo.", price: "$100+", rating: "4.4", hours: [["Monday", "Closed"], ["Tuesday", "12–2:30 PM"], ["Wednesday", "12–2:30 PM"], ["Thursday", "12–2:30 PM"], ["Friday", "12–2:30 PM"], ["Saturday", "Closed"], ["Sunday", "Closed"]], cid: "1594428497821708282" },
  { name: "Kotobuki", slug: "kotobuki", photos: [[424, 480], [640, 343], [640, 311]], address: "30 Vandam St", lat: 40.726272, lng: -74.00492, group: "japanese", kind: "japanese", desc: "neighborhood sushi standby on Vandam St.", price: "$30–50", rating: "4.2", hours: [["Monday", "11:30 AM–2:30 PM, 4–9 PM"], ["Tuesday", "11:30 AM–2:30 PM, 4–9 PM"], ["Wednesday", "11:30 AM–2:30 PM, 4–9 PM"], ["Thursday", "11:30 AM–2:30 PM, 4–9 PM"], ["Friday", "11:30 AM–2:30 PM, 4–9 PM"], ["Saturday", "4–9 PM"], ["Sunday", "4–9 PM"]], cid: "962005769814612647" },
  { name: "Kimura", slug: "kimura", photos: [[640, 427], [360, 480], [360, 480]], address: "31 St Marks Pl", lat: 40.729032, lng: -73.988217, group: "japanese", kind: "japanese", desc: "East Village spot doing Japanese hot pot, sushi, ramen, and cocktails.", price: "$30–60", rating: "4.6", hours: [["Monday", "12–11:30 PM"], ["Tuesday", "12–11:30 PM"], ["Wednesday", "12–11:30 PM"], ["Thursday", "12–11:30 PM"], ["Friday", "12 PM–1 AM"], ["Saturday", "12 PM–1 AM"], ["Sunday", "12–11:30 PM"]], cid: "12673954287228273912" },
  { name: "Yakitori Taisho", slug: "yakitori-taisho", photos: [[360, 480], [415, 480], [360, 480]], address: "9 St Marks Pl", lat: 40.729428, lng: -73.989132, group: "japanese", kind: "japanese", desc: "rowdy St Marks yakitori institution, open late.", price: "$20–60", rating: "4.1", hours: [["Monday", "5 PM–12 AM"], ["Tuesday", "5 PM–12 AM"], ["Wednesday", "5 PM–12 AM"], ["Thursday", "5 PM–12 AM"], ["Friday", "5 PM–1 AM"], ["Saturday", "5 PM–1 AM"], ["Sunday", "5–11 PM"]], cid: "9908824241088808531" },
  { name: "Davelle", slug: "davelle", photos: [[640, 480], [323, 480], [337, 480]], address: "102 Suffolk St", lat: 40.718539, lng: -73.986068, group: "japanese", kind: "japanese", desc: "tiny Lower East Side Japanese cafe, famous for uni toast.", price: "$10–40", rating: "4.3", hours: [["Monday", "9:30 AM–4:30 PM"], ["Tuesday", "9:30 AM–4:30 PM"], ["Wednesday", "9:30 AM–4:30 PM"], ["Thursday", "9:30 AM–4:30 PM, 7 PM–12 AM"], ["Friday", "9:30 AM–4:30 PM, 7 PM–12 AM"], ["Saturday", "9:30 AM–4:30 PM"], ["Sunday", "9:30 AM–4:30 PM"]], cid: "5861517072687391690" },
  { name: "Tosokchon", slug: "tosokchon", photos: [[360, 480], [371, 480], [360, 480]], address: "14 E 33rd St", lat: 40.747233, lng: -73.984306, group: "korean", kind: "korean", desc: "samgyetang (ginseng chicken soup) specialist near K-town, open basically all night.", price: "$20–30", rating: "4.6", hours: [["Monday", "11:30 AM–12 AM"], ["Tuesday", "12–4 AM, 11:30 AM–12 AM"], ["Wednesday", "12–4 AM, 11:30 AM–12 AM"], ["Thursday", "12–4 AM, 11:30 AM–12 AM"], ["Friday", "12–6 AM, 11:30 AM–12 AM"], ["Saturday", "12–6 AM, 11:30 AM–12 AM"], ["Sunday", "12–6 AM, 11:30 AM–10 PM"]], cid: "16940138784556072858" },
  { name: "Samwoojung", slug: "samwoojung", photos: [[640, 427], [640, 480], [360, 480]], address: "138 W 32nd St", lat: 40.749024, lng: -73.990314, group: "korean", kind: "korean", desc: "K-town Korean BBQ, the LA galbi is the move.", price: "$20–60", rating: "4.5", fav: true, hours: [["Monday", "11:45 AM–3 PM, 5–10 PM"], ["Tuesday", "11:45 AM–3 PM, 5–10 PM"], ["Wednesday", "11:45 AM–3 PM, 5–10 PM"], ["Thursday", "11:45 AM–3 PM, 5–10 PM"], ["Friday", "11:45 AM–3 PM, 5–10:30 PM"], ["Saturday", "12–3:30 PM, 5–10:30 PM"], ["Sunday", "12–3:30 PM, 5–10 PM"]], cid: "3251180556436005192" },
  { name: "Anto Korean Steak House", slug: "anto", photos: [[640, 480], [640, 426], [640, 480]], address: "37 W 32nd St", lat: 40.7481097, lng: -73.9872039, group: "korean", kind: "korean", desc: "Korean fine-dining steakhouse.", price: "$100+", rating: "4.2", closed: true, cid: "883224496520455166" },
  { name: "Oiji Mi", slug: "oiji-mi", photos: [[640, 438], [360, 480], [360, 480]], address: "17 W 19th St", lat: 40.739663, lng: -73.992474, group: "korean", kind: "korean", desc: "Michelin-starred modern Korean in Flatiron.", price: "$100+", rating: "4.6", hours: [["Monday", "5–10 PM"], ["Tuesday", "5–10 PM"], ["Wednesday", "5–10 PM"], ["Thursday", "5–10 PM"], ["Friday", "5–10 PM"], ["Saturday", "5–10 PM"], ["Sunday", "5–10 PM"]], cid: "6673956965559402765" },
  { name: "Murray's Cheese", slug: "murrays-cheese", photos: [[640, 424], [640, 480], [360, 480]], address: "254 Bleecker St", lat: 40.730977, lng: -74.003071, group: "everything else", kind: "cheese shop", desc: "Bleecker St cheese institution since 1940, the melts are lunch.", rating: "4.6", hours: [["Monday", "9 AM–8 PM"], ["Tuesday", "9 AM–8 PM"], ["Wednesday", "9 AM–8 PM"], ["Thursday", "9 AM–8 PM"], ["Friday", "9 AM–8 PM"], ["Saturday", "9 AM–8 PM"], ["Sunday", "9 AM–8 PM"]], cid: "16516863484208182237" },
  { name: "A Pasta Bar", slug: "a-pasta-bar", photos: [[640, 426], [360, 480], [640, 360]], address: "330 W Broadway", lat: 40.722373, lng: -74.003991, group: "everything else", kind: "italian", desc: "counter-side fresh pasta tasting in SoHo.", price: "$50–100", rating: "4.4", hours: [["Monday", "5–11 PM"], ["Tuesday", "5–11 PM"], ["Wednesday", "5–11 PM"], ["Thursday", "12–11 PM"], ["Friday", "12–11:30 PM"], ["Saturday", "12–11:30 PM"], ["Sunday", "12–11 PM"]], cid: "2296321089685406682" },
  { name: "SEA by Jungsik", slug: "sea-by-jungsik", photos: [[640, 426], [524, 480], [320, 480]], address: "151 W 30th St", lat: 40.748435, lng: -73.991776, group: "everything else", kind: "seafood", desc: "seafood tasting from the Jungsik team.", price: "$100+", rating: "4.3", closed: true, cid: "16483700828865346750" },
  { name: "Le Jardin Bistro", slug: "le-jardin-bistro", photos: [[640, 480], [517, 480], [360, 480]], address: "95 Delancey St", lat: 40.718628, lng: -73.989231, group: "everything else", kind: "french", desc: "French bistro on Delancey St with a proper garden room.", price: "$50–100", rating: "4.7", hours: [["Monday", "Closed"], ["Tuesday", "Closed"], ["Wednesday", "5–11 PM"], ["Thursday", "5–11 PM"], ["Friday", "5–11 PM"], ["Saturday", "11 AM–3 PM, 5–11 PM"], ["Sunday", "11 AM–3 PM, 5–11 PM"]], cid: "16794796001842017844" },
  { name: "Zou Zou's", slug: "zou-zous", photos: [[362, 480], [640, 480], [360, 480]], address: "385 9th Ave", lat: 40.752905, lng: -73.998536, group: "everything else", kind: "mediterranean", desc: "eastern-Mediterranean spreads and manoushe near Hudson Yards.", price: "$100+", rating: "4.4", hours: [["Monday", "11:30 AM–3 PM, 5–10 PM"], ["Tuesday", "11:30 AM–3 PM, 5–11 PM"], ["Wednesday", "11:30 AM–3 PM, 5–11 PM"], ["Thursday", "11:30 AM–3 PM, 5–11 PM"], ["Friday", "11:30 AM–3 PM, 5–11 PM"], ["Saturday", "11 AM–3 PM, 5–11 PM"], ["Sunday", "11 AM–3 PM, 5–10 PM"]], cid: "15379348448960698669" },
  { name: "Ping's", slug: "pings", photos: [[640, 425], [360, 480], [640, 480]], address: "22 Mott St", lat: 40.714422, lng: -73.998584, group: "everything else", kind: "dim sum", desc: "old-school Cantonese seafood and dim sum on Mott St.", price: "$20–60", rating: "4.3", hours: [["Monday", "11 AM–12 AM"], ["Tuesday", "11 AM–12 AM"], ["Wednesday", "11 AM–12 AM"], ["Thursday", "11 AM–12 AM"], ["Friday", "11 AM–12 AM"], ["Saturday", "10 AM–12 AM"], ["Sunday", "10 AM–12 AM"]], cid: "7081479285377313414" },
  { name: "Dudleys", slug: "dudleys", photos: [[640, 454], [480, 480], [360, 480]], address: "85 Orchard St", lat: 40.718058, lng: -73.990389, group: "everything else", kind: "cafe", desc: "all-day Aussie cafe and bar on Orchard St.", price: "$20–30", rating: "4.4", hours: [["Monday", "9 AM–12 AM"], ["Tuesday", "9 AM–12 AM"], ["Wednesday", "9 AM–12 AM"], ["Thursday", "9 AM–12 AM"], ["Friday", "9 AM–12 AM"], ["Saturday", "9 AM–12 AM"], ["Sunday", "9 AM–12 AM"]], cid: "3361990629129100951" },
  { name: "Our/New York Bar & Vodka Distillery", slug: "our-new-york", photos: [[640, 360], [360, 480], [360, 480]], address: "151 W 26th St", lat: 40.74575, lng: -73.993352, group: "everything else", kind: "bar", desc: "bar atop a working vodka distillery in Chelsea.", price: "$10–20", rating: "4.5", closed: true, cid: "15056157277377279651" },
  { name: "Le Café Louis Vuitton", slug: "le-cafe-louis-vuitton", photos: [[640, 360], [360, 480], [360, 480]], address: "6 E 57th St", lat: 40.762568, lng: -73.9734, group: "everything else", kind: "cafe", desc: "Louis Vuitton's café atop the 57th St flagship.", price: "$100+", rating: "4.4", hours: [["Monday", "10 AM–7:15 PM"], ["Tuesday", "10 AM–7:15 PM"], ["Wednesday", "10 AM–7:15 PM"], ["Thursday", "10 AM–7:15 PM"], ["Friday", "10 AM–7:15 PM"], ["Saturday", "10 AM–7:15 PM"], ["Sunday", "11 AM–5:45 PM"]], cid: "16493469629310098483" },
  { name: "Antoya Korean BBQ", slug: "antoya", photos: [[640, 427], [360, 480], [360, 480]], address: "37 W 32nd St", lat: 40.7481097, lng: -73.9872039, group: "korean", kind: "korean bbq", desc: "charcoal Korean BBQ in the heart of K-town.", rating: "4.4", hours: [["Monday", "11 AM–11 PM"], ["Tuesday", "11 AM–11 PM"], ["Wednesday", "11 AM–11 PM"], ["Thursday", "11 AM–11 PM"], ["Friday", "11 AM–1 AM"], ["Saturday", "11 AM–1 AM"], ["Sunday", "11 AM–11 PM"]], cid: "9631307537278659460" },
  { name: "Moono", slug: "moono", photos: [[640, 426], [379, 480], [360, 480]], address: "29 E 32nd St", lat: 40.7464411, lng: -73.9833073, group: "korean", kind: "korean", desc: "modern Korean tasting room on E 32nd St.", price: "$50–100", rating: "4.4", fav: true, hours: [["Monday", "5–10:30 PM"], ["Tuesday", "5–10:30 PM"], ["Wednesday", "5–10:30 PM"], ["Thursday", "5–10:30 PM"], ["Friday", "5–10:30 PM"], ["Saturday", "12–2:30 PM, 5–10:30 PM"], ["Sunday", "12–2:30 PM, 5–10:30 PM"]], cid: "121591186117386335" },
  { name: "53", slug: "53", photos: [[640, 427], [360, 480], [360, 480]], address: "53 W 53rd St", lat: 40.7617694, lng: -73.9780863, group: "everything else", kind: "asian", desc: "modern Asian fine dining in the MoMA tower.", price: "$100+", rating: "4.3", fav: true, hours: [["Monday", "11:45 AM–2:30 PM, 5–10 PM"], ["Tuesday", "11:45 AM–2:30 PM, 5–10 PM"], ["Wednesday", "11:45 AM–2:30 PM, 5–10 PM"], ["Thursday", "11:45 AM–2:30 PM, 5–10 PM"], ["Friday", "11:45 AM–2:30 PM, 5–10 PM"], ["Saturday", "5–10 PM"], ["Sunday", "12–3 PM, 5–10 PM"]], cid: "16242187502021557545" },
  { name: "Yong Chuan", slug: "yong-chuan", photos: [[640, 457], [308, 480], [320, 480]], address: "90 Clinton St", lat: 40.7182555, lng: -73.9852297, group: "everything else", kind: "chinese", desc: "Chinese spot on Clinton St, Lower East Side.", price: "$40–90", rating: "4.6", fav: true, hours: [["Monday", "5–11 PM"], ["Tuesday", "5–11 PM"], ["Wednesday", "5–11 PM"], ["Thursday", "5–11 PM"], ["Friday", "5 PM–12 AM"], ["Saturday", "11 AM–3 PM, 5 PM–12 AM"], ["Sunday", "11 AM–3 PM, 5–11 PM"]], cid: "15422291113039188773" },
  { name: "Happy Hot Hunan", slug: "happy-hot-hunan", photos: [[360, 480], [640, 438], [360, 480]], address: "969 Amsterdam Ave", lat: 40.8013559, lng: -73.9647057, group: "everything else", kind: "hunan", desc: "my Columbia dining hall, Hunan classics on Amsterdam Ave.", price: "$20–30", rating: "4.0", hours: [["Monday", "11 AM–10 PM"], ["Tuesday", "11 AM–10 PM"], ["Wednesday", "11 AM–10 PM"], ["Thursday", "11 AM–10 PM"], ["Friday", "11 AM–10 PM"], ["Saturday", "11 AM–10 PM"], ["Sunday", "11 AM–10 PM"]], cid: "15690843892670988939" },
]

const GROUPS = ["japanese", "korean", "everything else"]

// Home gets a card too — rendered through the same modal as the restaurants.
const HOME_CARD: Restaurant = {
  name: "Home",
  slug: "home",
  photos: [[628, 640], [690, 656]],
  address: "135 W 52nd St",
  lat: HOME.lat,
  lng: HOME.lng,
  group: "",
  kind: "",
  desc: "home base, the columbia chapter.",
  cid: "",
}

// One general time for the card: the most common daily range across the week
// (per-day detail lives on Google Maps, a tap away).
function generalHours(hours: [string, string][]) {
  const counts = new Map<string, number>()
  for (const [, times] of hours) {
    if (times.toLowerCase() === "closed") continue
    counts.set(times, (counts.get(times) ?? 0) + 1)
  }
  let best = ""
  let n = 0
  for (const [times, c] of counts) {
    if (c > n) {
      best = times
      n = c
    }
  }
  return best
}

export default function RestaurantMap() {
  const mapEl = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<Record<string, Marker>>({})
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [active, setActive] = useState<string | null>(null)
  const [openR, setOpenR] = useState<Restaurant | null>(null)
  const [photoIdx, setPhotoIdx] = useState(0)
  const photoStrip = useRef<HTMLDivElement>(null)

  // new card → carousel back to the first photo
  useEffect(() => {
    setPhotoIdx(0)
    photoStrip.current?.scrollTo({ left: 0 })
  }, [openR])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const L = (await import("leaflet")).default
      if (cancelled || !mapEl.current || mapRef.current) return

      const map = L.map(mapEl.current)
      mapRef.current = map
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map)

      const bounds = L.latLngBounds([])
      for (const r of RESTAURANTS) {
        const icon = L.divIcon({
          className: "kn-pin-wrap",
          html: `<span class="kn-pin${r.closed ? " is-closed" : ""}"></span>`,
          iconSize: [26, 30],
          iconAnchor: [13, 29],
        })
        const marker = L.marker([r.lat, r.lng], { icon, title: r.name }).addTo(map)
        marker.on("click", () => {
          setActive(r.name)
          setOpenR(r)
          rowRefs.current[r.name]?.scrollIntoView({ block: "nearest", behavior: "smooth" })
        })
        markersRef.current[r.name] = marker
        bounds.extend([r.lat, r.lng])
      }

      const homeIcon = L.divIcon({
        className: "kn-pin-wrap",
        html: '<span class="kn-pin kn-pin--home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l8 7h-2.4v8h-3.8v-5.4H10.2V19H6.4v-8H4z"/></svg></span>',
        iconSize: [26, 30],
        iconAnchor: [13, 29],
      })
      const homeMarker = L.marker([HOME.lat, HOME.lng], {
        icon: homeIcon,
        title: "Home",
        zIndexOffset: 500,
      })
        .addTo(map)
        .on("click", () => {
          setActive(HOME_CARD.name)
          setOpenR(HOME_CARD)
          rowRefs.current[HOME_CARD.name]?.scrollIntoView({ block: "nearest", behavior: "smooth" })
        })
      markersRef.current[HOME_CARD.name] = homeMarker
      bounds.extend([HOME.lat, HOME.lng])

      map.fitBounds(bounds, { padding: [30, 30] })
    })()

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  useEffect(() => {
    for (const [name, marker] of Object.entries(markersRef.current)) {
      marker.getElement()?.querySelector(".kn-pin")?.classList.toggle("is-active", name === active)
      marker.setZIndexOffset(name === active ? 1000 : 0)
    }
  }, [active])

  const selectRestaurant = (r: Restaurant) => {
    setActive(r.name)
    setOpenR(r)
    const map = mapRef.current
    if (map) map.flyTo([r.lat, r.lng], Math.max(map.getZoom(), 15), { duration: 0.6 })
  }

  return (
    <div className="kn-food">
      <div className="kn-food-list">
        <div>
          <p className="kn-food-group">Home</p>
          <button
            ref={(el) => {
              rowRefs.current[HOME_CARD.name] = el
            }}
            className={`kn-food-row${active === HOME_CARD.name ? " is-active" : ""}`}
            onClick={() => selectRestaurant(HOME_CARD)}
          >
            <span className="kn-food-name">{HOME_CARD.name}</span>
            <span className="kn-food-addr">{HOME_CARD.address}</span>
          </button>
        </div>
        <div>
          <p className="kn-food-group">Starred</p>
          {RESTAURANTS.filter((r) => r.fav).map((r) => (
            <button
              key={`fav-${r.name}`}
              className={`kn-food-row${active === r.name ? " is-active" : ""}`}
              onClick={() => selectRestaurant(r)}
            >
              <span className="kn-food-name">
                {r.name}
                <span className="kn-food-row-fav">★</span>
              </span>
              <span className="kn-food-addr">{r.address}</span>
            </button>
          ))}
        </div>
        {GROUPS.map((group) => (
          <div key={group}>
            <p className="kn-food-group">{group}</p>
            {RESTAURANTS.filter((r) => r.group === group).map((r) => (
              <button
                key={r.name}
                ref={(el) => {
                  rowRefs.current[r.name] = el
                }}
                className={`kn-food-row${active === r.name ? " is-active" : ""}${r.closed ? " is-closed" : ""}`}
                onClick={() => selectRestaurant(r)}
              >
                <span className="kn-food-name">{r.name}</span>
                <span className="kn-food-addr">{r.address}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="kn-food-map" ref={mapEl} aria-label="Map of restaurants in New York" />

      {openR && (
        <div
          className="kn-food-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={openR.name}
          onClick={() => setOpenR(null)}
        >
          <div className="kn-food-modal" onClick={(e) => e.stopPropagation()}>
            <button className="kn-food-close" aria-label="Close" onClick={() => setOpenR(null)}>
              ✕
            </button>
            {openR.photos.length > 0 && (
              <div className="kn-food-carousel">
                <div
                  className="kn-food-photos"
                  ref={photoStrip}
                  onScroll={(e) => {
                    const el = e.currentTarget
                    setPhotoIdx(Math.round(el.scrollLeft / el.clientWidth))
                  }}
                >
                  {openR.photos.map(([w, h], i) => {
                    const src = `/kaynote/food/${openR.slug}-${i + 1}.webp`
                    return (
                      <div
                        key={i}
                        className="kn-food-slide"
                        onClick={() => {
                          const el = photoStrip.current
                          if (!el || openR.photos.length < 2) return
                          const next = (i + 1) % openR.photos.length
                          el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" })
                        }}
                      >
                        {/* blurred cover copy fills the frame so contain never shows bare bars */}
                        <img className="kn-food-slide-bg" src={src} alt="" aria-hidden="true" loading="lazy" />
                        <img
                          src={src}
                          alt={`${openR.name}, photo ${i + 1}`}
                          width={w}
                          height={h}
                          loading="lazy"
                        />
                      </div>
                    )
                  })}
                </div>
                {openR.photos.length > 1 && (
                  <div className="kn-food-dots">
                    {openR.photos.map((_, i) => (
                      <button
                        key={i}
                        className={`kn-food-dot${i === photoIdx ? " is-active" : ""}`}
                        aria-label={`Photo ${i + 1} of ${openR.photos.length}`}
                        onClick={() =>
                          photoStrip.current?.scrollTo({
                            left: i * photoStrip.current.clientWidth,
                            behavior: "smooth",
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <p className="kn-food-modal-title">
              {openR.name}
              {openR.fav && (
                <span className="kn-food-fav" title="a Kayna favorite">
                  ★
                </span>
              )}
            </p>
            {openR.kind && (
              <p className="kn-food-modal-meta">
                {openR.kind}
                {openR.price ? ` · ${openR.price}` : ""}
                {openR.rating ? ` · ★ ${openR.rating}` : ""}
              </p>
            )}
            <p className="kn-food-modal-desc">{openR.desc}</p>
            {openR.closed ? (
              <p className="kn-food-modal-closed">permanently closed</p>
            ) : (
              openR.hours && <p className="kn-food-modal-hours">{generalHours(openR.hours)}</p>
            )}
            <p className="kn-food-modal-addr">
              {openR.address}
              {openR.cid ? (
                <>
                  {" · "}
                  <a
                    href={`https://maps.google.com/?cid=${openR.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    open in Google Maps
                  </a>
                </>
              ) : null}
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .kn-food {
          /* fill the remaining viewport: the map stays fixed, only the list scrolls */
          display: flex;
          align-items: stretch;
          gap: 24px;
          margin-top: 16px;
          height: calc(100dvh - 240px);
          min-height: 420px;
        }
        .kn-food-list {
          flex: 0 0 300px;
          min-width: 0;
          height: 100%;
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
        }
        .kn-food-list::-webkit-scrollbar {
          display: none; /* Chrome / Safari */
        }
        .kn-food .kn-food-list .kn-food-group {
          font-size: 13px;
          font-weight: 600;
          color: #8e8e93;
          text-transform: capitalize;
          margin: 20px 8px 2px;
        }
        .kn-food-list > div:first-child .kn-food-group {
          margin-top: 4px;
        }
        .kn-food-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: 8px;
          padding: 10px 8px;
          cursor: pointer;
          font-family: inherit;
          position: relative;
        }
        .kn-food-row + .kn-food-row::before {
          content: "";
          position: absolute;
          top: 0;
          left: 8px;
          right: 8px;
          height: 1px;
          background: #ececec;
        }
        .kn-food-row.is-active {
          background: #fce49b;
        }
        .kn-food-row.is-active::before,
        .kn-food-row.is-active + .kn-food-row::before {
          background: transparent;
        }
        .kn-food-row.is-closed .kn-food-name {
          color: #8e8e93;
          text-decoration: line-through;
          text-decoration-thickness: 1px;
        }
        .kn-food-name {
          font-size: 14px;
          font-weight: 600;
          color: #1d1d1f;
          line-height: 1.3;
        }
        .kn-food .kn-food-list .kn-food-row-fav {
          color: #f7b500;
          font-size: 12px;
          margin-left: 5px;
        }
        .kn-food-addr {
          font-size: 12px;
          color: #8e8e93;
          line-height: 1.35;
        }
        .kn-food-map {
          flex: 1;
          height: 100%;
          min-height: 0;
          border-radius: 12px;
          overflow: hidden;
          background: #f2f2f2;
          border: 1px solid #ececec;
          z-index: 0;
        }
        .kn-food-map.leaflet-container:focus,
        .kn-food-map.leaflet-container:focus-visible,
        .kn-food-map .leaflet-interactive:focus {
          outline: none;
        }
        .kn-food-map.leaflet-container {
          font-family:
            -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial,
            sans-serif;
        }
        .kn-pin-wrap {
          background: none;
          border: none;
        }
        .kn-pin {
          position: absolute;
          left: 2px;
          top: 2px;
          width: 22px;
          height: 22px;
          background: #ff453a;
          border: 2px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .kn-pin::after {
          content: "";
          position: absolute;
          inset: 6px;
          background: #ffffff;
          border-radius: 50%;
        }
        .kn-pin.is-closed {
          background: #b8b8bd;
        }
        .kn-pin.is-active {
          background: #1d1d1f;
          transform: rotate(-45deg) scale(1.25);
        }
        .kn-pin--home {
          background: #007aff;
        }
        .kn-pin--home::after {
          content: none;
        }
        .kn-pin--home svg {
          position: absolute;
          inset: 3px;
          transform: rotate(45deg);
          fill: #ffffff;
        }

        /* restaurant detail card, iOS style (mirrors the book modal) */
        .kn-food-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: kn-food-fade-in 0.18s ease-out;
        }
        .kn-food-modal {
          position: relative;
          width: 100%;
          max-width: 560px;
          max-height: calc(100dvh - 48px);
          overflow-y: auto;
          background: #ffffff;
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
          animation: kn-food-pop-in 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }
        .kn-food-carousel {
          position: relative;
          margin: -28px -28px 0;
          border-radius: 14px 14px 0 0;
          overflow: hidden;
        }
        .kn-food-photos {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none; /* Firefox */
        }
        .kn-food-photos::-webkit-scrollbar {
          display: none; /* Chrome / Safari */
        }
        .kn-food-slide {
          position: relative;
          flex: none;
          width: 100%;
          height: 340px;
          scroll-snap-align: start;
          overflow: hidden;
          cursor: pointer;
        }
        .kn-food-slide:only-child {
          cursor: default;
        }
        .kn-food-photos .kn-food-slide-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(28px) brightness(0.92) saturate(1.15);
          transform: scale(1.2);
        }
        .kn-food-slide img + img {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .kn-food-dots {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 6px;
          pointer-events: none;
        }
        .kn-food-dot {
          width: 7px;
          height: 7px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.55);
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          pointer-events: auto;
        }
        .kn-food-dot.is-active {
          background: #ffffff;
        }
        .kn-food-close {
          position: absolute;
          z-index: 1;
          top: 12px;
          right: 12px;
          width: 26px;
          height: 26px;
          border: none;
          border-radius: 50%;
          background: #efeff0;
          color: #7c7c80;
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kn-food-close:hover {
          color: #1d1d1f;
        }
        .kn-food .kn-food-modal .kn-food-modal-title {
          font-size: 17px;
          font-weight: 700;
          line-height: 1.25;
          color: #1d1d1f;
          margin: 36px 0 0;
        }
        .kn-food .kn-food-modal .kn-food-modal-title .kn-food-fav {
          color: #f7b500;
          font-size: 15px;
          margin-left: 6px;
          vertical-align: 1px;
        }
        .kn-food .kn-food-modal .kn-food-modal-meta {
          font-size: 13px;
          color: #8e8e93;
          margin: 4px 0 0;
        }
        .kn-food .kn-food-modal .kn-food-modal-desc {
          font-size: 14px;
          line-height: 20px;
          color: #1d1d1f;
          margin: 16px 0 0;
        }
        .kn-food .kn-food-modal .kn-food-modal-closed {
          font-size: 13px;
          font-weight: 600;
          color: #ff453a;
          margin: 14px 0 0;
        }
        .kn-food .kn-food-modal .kn-food-modal-hours {
          font-size: 13px;
          line-height: 19px;
          color: #1d1d1f;
          margin: 14px 0 0;
        }
        .kn-food .kn-food-modal .kn-food-modal-addr {
          font-size: 12px;
          color: #8e8e93;
          margin: 14px 0 0;
        }
        .kn-food-modal-addr a {
          color: #b8860b;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        @keyframes kn-food-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes kn-food-pop-in {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 767px) {
          .kn-food {
            flex-direction: column-reverse;
            gap: 16px;
            height: auto;
            min-height: 0;
          }
          .kn-food-list {
            flex: none;
            width: 100%;
            height: auto;
            overflow-y: visible;
            padding-right: 0;
          }
          .kn-food-map {
            flex: none;
            width: 100%;
            height: 300px;
          }
          .kn-food-slide {
            height: 260px;
          }
        }
      `}</style>
    </div>
  )
}
