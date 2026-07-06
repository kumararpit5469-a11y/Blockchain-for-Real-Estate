import { useState } from "react";
import { Landmark, Coins, FileSignature, ShieldCheck, ArrowRight, Clock } from "lucide-react";

// -----------------------------------------------------------------------
// Mock on-chain data — replace with live contract reads (see the ethers.js
// interaction script) once wired to a real provider.
// -----------------------------------------------------------------------
const PROPERTIES = [
  {
    id: "PROP-1001",
    name: "Maple & 9th Residences",
    location: "Austin, TX",
    owner: "0x4fA2...19cD",
    valueUsd: 1850000,
    tokenSupply: 18500,
    tokenPrice: 100,
    yourTokens: 340,
    status: "verified",
    lease: {
      tenant: "0x8bC1...77aE",
      rentEth: 0.42,
      nextDue: "Aug 1, 2026",
      active: true,
    },
    history: [
      { date: "Jun 2, 2026", event: "Ownership recorded", who: "0x4fA2...19cD" },
      { date: "Apr 14, 2026", event: "Property registered", who: "Registrar" },
    ],
  },
  {
    id: "PROP-1002",
    name: "Harbor View Lofts, Unit 6B",
    location: "Portland, OR",
    owner: "0x2Ec9...4401",
    valueUsd: 640000,
    tokenSupply: 6400,
    tokenPrice: 100,
    yourTokens: 0,
    status: "pending",
    lease: {
      tenant: "0x9F31...2b0d",
      rentEth: 0.18,
      nextDue: "Jul 15, 2026",
      active: true,
    },
    history: [
      { date: "May 30, 2026", event: "Title transfer submitted", who: "0x2Ec9...4401" },
    ],
  },
  {
    id: "PROP-1003",
    name: "Cedar Grove Duplex",
    location: "Asheville, NC",
    owner: "0x77aE...8bC1",
    valueUsd: 410000,
    tokenSupply: 4100,
    tokenPrice: 100,
    yourTokens: 120,
    status: "verified",
    lease: {
      tenant: null,
      rentEth: 0,
      nextDue: "—",
      active: false,
    },
    history: [
      { date: "Mar 3, 2026", event: "Ownership recorded", who: "0x77aE...8bC1" },
      { date: "Feb 20, 2026", event: "Property registered", who: "Registrar" },
    ],
  },
];

const TABS = ["Title", "Ownership", "Lease"];

function formatUsd(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function Seal({ verified }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] tracking-wide uppercase font-medium
        ${verified
          ? "border-[#C9A227]/50 text-[#C9A227] bg-[#C9A227]/10"
          : "border-[#8B94A3]/40 text-[#8B94A3] bg-transparent"}`}
    >
      <ShieldCheck size={12} strokeWidth={2.5} />
      {verified ? "On-chain verified" : "Pending sign-off"}
    </span>
  );
}

export default function RealEstateLedgerDashboard() {
  const [selectedId, setSelectedId] = useState(PROPERTIES[0].id);
  const [activeTab, setActiveTab] = useState("Title");

  const selected = PROPERTIES.find((p) => p.id === selectedId);
  const ownedPct = ((selected.yourTokens / selected.tokenSupply) * 100).toFixed(2);

  return (
    <div className="min-h-screen w-full bg-[#101820] text-[#F1EDE4] font-[Inter,sans-serif]">
      {/* Header */}
      <header className="border-b border-[#F1EDE4]/10 px-6 md:px-10 py-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8B94A3]">Deed Ledger</p>
          <h1 className="font-['Fraunces',serif] text-2xl md:text-3xl mt-1">
            Property Registry &amp; Holdings
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-[#8B94A3]">
          <span className="w-2 h-2 rounded-full bg-[#4C9A6A] inline-block" />
          Connected · Polygon
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        {/* Left: index of properties, styled as stacked deed cards */}
        <aside className="border-r border-[#F1EDE4]/10 px-4 md:px-6 py-6 space-y-3">
          {PROPERTIES.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setActiveTab("Title");
              }}
              className={`w-full text-left rounded-lg border px-4 py-3.5 transition-colors
                ${selectedId === p.id
                  ? "border-[#C9A227]/60 bg-[#C9A227]/[0.07]"
                  : "border-[#F1EDE4]/10 hover:border-[#F1EDE4]/25"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] tracking-widest uppercase text-[#8B94A3]">{p.id}</p>
                  <p className="font-['Fraunces',serif] text-lg leading-snug mt-0.5">{p.name}</p>
                  <p className="text-sm text-[#8B94A3] mt-0.5">{p.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-[#F1EDE4]/80">{formatUsd(p.valueUsd)}</span>
                <Seal verified={p.status === "verified"} />
              </div>
            </button>
          ))}
        </aside>

        {/* Right: detail panel */}
        <main className="px-6 md:px-10 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="font-['Fraunces',serif] text-3xl">{selected.name}</h2>
              <p className="text-[#8B94A3] mt-1">{selected.location} · {formatUsd(selected.valueUsd)} appraised value</p>
            </div>
            <Seal verified={selected.status === "verified"} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#F1EDE4]/10 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm tracking-wide relative
                  ${activeTab === tab ? "text-[#F1EDE4]" : "text-[#8B94A3] hover:text-[#F1EDE4]/70"}`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#C9A227] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Title tab */}
          {activeTab === "Title" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-[#F1EDE4]/10 p-5 bg-[#F1EDE4]/[0.02]">
                <div className="flex items-center gap-2 text-[#8B94A3] text-[11px] tracking-widest uppercase mb-3">
                  <Landmark size={14} /> Current recorded owner
                </div>
                <p className="font-mono text-lg text-[#F1EDE4]">{selected.owner}</p>
              </div>

              <div>
                <p className="text-[11px] tracking-widest uppercase text-[#8B94A3] mb-3">Chain of custody</p>
                <ol className="relative border-l border-[#F1EDE4]/15 ml-1.5">
                  {selected.history.map((h, i) => (
                    <li key={i} className="pl-5 pb-5 last:pb-0 relative">
                      <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#C9A227]" />
                      <p className="text-sm text-[#8B94A3]">{h.date}</p>
                      <p className="text-[#F1EDE4] mt-0.5">{h.event}</p>
                      <p className="font-mono text-xs text-[#8B94A3] mt-0.5">{h.who}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Ownership tab */}
          {activeTab === "Ownership" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Token supply", value: selected.tokenSupply.toLocaleString() },
                  { label: "Price / token", value: `$${selected.tokenPrice}` },
                  { label: "Your tokens", value: selected.yourTokens.toLocaleString() },
                  { label: "Your stake", value: `${ownedPct}%` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-[#F1EDE4]/10 p-4">
                    <p className="text-[11px] tracking-widest uppercase text-[#8B94A3]">{stat.label}</p>
                    <p className="font-['Fraunces',serif] text-2xl mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-[#F1EDE4]/10 p-5">
                <div className="w-full h-2 rounded-full bg-[#F1EDE4]/10 overflow-hidden mb-3">
                  <div
                    className="h-full bg-[#C9A227] rounded-full transition-all"
                    style={{ width: `${Math.min(ownedPct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-[#8B94A3]">
                  <span className="flex items-center gap-1.5"><Coins size={14} /> Your ownership share</span>
                  <span>{ownedPct}% of {selected.tokenSupply.toLocaleString()} shares</span>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 text-sm text-[#C9A227] hover:gap-3 transition-all">
                Transfer or acquire shares <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* Lease tab */}
          {activeTab === "Lease" && (
            <div className="space-y-6">
              {selected.lease.active ? (
                <>
                  <div className="rounded-lg border border-[#F1EDE4]/10 p-5 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-[11px] tracking-widest uppercase text-[#8B94A3] mb-1">Current tenant</p>
                      <p className="font-mono">{selected.lease.tenant}</p>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-widest uppercase text-[#8B94A3] mb-1">Monthly rent</p>
                      <p className="font-['Fraunces',serif] text-xl">{selected.lease.rentEth} ETH</p>
                    </div>
                    <div className="flex items-center gap-2 text-[#8B94A3]">
                      <Clock size={14} />
                      <span className="text-sm">Next due {selected.lease.nextDue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#8B94A3]">
                    <FileSignature size={14} />
                    Deposit held in escrow · auto-released per contract terms
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-[#F1EDE4]/15 p-8 text-center text-[#8B94A3]">
                  No active lease on this property yet.
                  <br />
                  Draft a smart lease to start collecting on-chain rent.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
