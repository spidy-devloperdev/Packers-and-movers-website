import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/* ─── Constants ─── */
const PHONE = "+917742006894";
const PHONE_DISPLAY = "+91 77420 06894";
const EMAIL = "shivshaktiexparess5@gmail.com";
const WEBSITE = "www.shivshaktiexpress.in";
const GSTIN = "29LDFPS9110Q1ZH";
const ADDRESS =
  "Ward No. 24, Shanti Nagar, Poonia Colony, Rajgarh Road, Pilani, Rajasthan 333031";
const WHATSAPP_MSG = encodeURIComponent(
  "Hello Shiv Shakti Express! I need packers & movers service. Please share details and quote."
);
const WHATSAPP_URL = `https://wa.me/917742006894?text=${WHATSAPP_MSG}`;

type DistanceKey = "local" | "intercity" | "cross";

const fadeRise: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const services = [
  {
    icon: "🏠",
    title: "Home Relocation",
    body: "Room-by-room coded packing, careful loading, GPS-tracked transit and clean placement at your new address — anywhere in India.",
    points: ["Furniture dismantling & reassembly", "Fragile-grade armor packing", "Room-coded unpacking"],
  },
  {
    icon: "🏢",
    title: "Office Shifting",
    body: "Workstations, files, IT equipment and furniture moved on a weekend-ready execution plan with zero downtime.",
    points: ["Asset tagging", "Cable & network mapping", "Weekend execution"],
  },
  {
    icon: "🚗",
    title: "Vehicle Transport",
    body: "Bike and car transport with sealed pickup checks, covered carriers and verified delivery proof at your doorstep.",
    points: ["Pre-move inspection", "Covered carrier", "Doorstep delivery"],
  },
  {
    icon: "📦",
    title: "Warehousing & Storage",
    body: "Safe short-term and long-term storage with sealed inventory, photo logs and easy release scheduling.",
    points: ["Sealed cartons", "Photo inventory", "Flexible release"],
  },
  {
    icon: "🛡️",
    title: "Insurance Coverage",
    body: "Optional all-risk transit insurance for high-value shipments with documented inventory and full claim support.",
    points: ["All-risk cover", "Photo proof", "Quick claim process"],
  },
  {
    icon: "🌍",
    title: "All India Moving",
    body: "Pan-India network covering every state and major city. Local survey teams and destination handoff crews everywhere.",
    points: ["26+ cities", "Local crews", "Pan-India routes"],
  },
];

const moveSteps = [
  { label: "Survey", detail: "Free video or in-home survey to lock exact inventory, access and timeline." },
  { label: "Plan", detail: "Move blueprint with crew size, vehicle type, packing material and route map." },
  { label: "Pack", detail: "Three-layer packing with item codes, fragile armor and signed inventory list." },
  { label: "Move", detail: "GPS-tracked transit with checkpoint updates and a single move manager on call." },
  { label: "Settle", detail: "Room-wise unpacking, furniture reassembly and a final walkthrough sign-off." },
];

const cities = [
  "Pilani", "Jaipur", "Delhi NCR", "Mumbai", "Pune", "Bengaluru",
  "Hyderabad", "Ahmedabad", "Chandigarh", "Kolkata", "Chennai", "Lucknow",
];

const stats = [
  { value: "15,000+", label: "Successful moves" },
  { value: "4.9/5", label: "Customer rating" },
  { value: "26+", label: "Cities served" },
  { value: "24×7", label: "Customer helpline" },
];

const testimonials = [
  {
    quote: "Shiv Shakti Express ne humara 3BHK ek din mein pack kiya, transit updates diye aur har cheez room-wise lagayi. Best experience!",
    name: "Rajesh Sharma",
    detail: "Pilani → Jaipur",
  },
  {
    quote: "Office shift weekend mein kiya, Monday ko sab kuch live tha. Professional team, on-time delivery. Highly recommend!",
    name: "Priya Agarwal",
    detail: "Jaipur office relocation",
  },
  {
    quote: "Fragile items ki packing dekhkar dil khush ho gaya. Glassware aur art pieces — ek scratch nahi aaya. Superb service!",
    name: "Vikram Singh",
    detail: "Delhi → Bengaluru",
  },
];

const distanceRates: Record<DistanceKey, number> = {
  local: 5500,
  intercity: 16000,
  cross: 28000,
};

/* ─── Icons ─── */
function ArrowIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004a15.94 15.94 0 0 0 2.46 8.548L.848 31.998l7.7-1.59A15.93 15.93 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0Zm9.31 22.608c-.39 1.096-1.93 2.006-3.164 2.272-.844.178-1.944.32-5.65-1.216-4.744-1.964-7.8-6.78-8.036-7.094-.228-.314-1.87-2.494-1.87-4.756 0-2.264 1.184-3.376 1.604-3.838.39-.426 1.028-.618 1.638-.618.198 0 .376.01.536.018.462.02.694.046 1 .764.382.896 1.31 3.184 1.424 3.416.116.234.23.54.078.854-.142.32-.266.462-.498.73-.234.266-.456.47-.69.756-.212.252-.45.522-.19.976.26.448 1.156 1.908 2.484 3.09 1.706 1.52 3.108 2.006 3.594 2.218.382.166.838.134 1.108-.154.342-.368.764-.976 1.194-1.576.306-.428.692-.482 1.112-.318.424.156 2.694 1.272 3.156 1.502.462.234.77.346.884.54.114.194.114 1.118-.276 2.214Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Floating WhatsApp Button ─── */
function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[80] flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3.5 text-white shadow-[0_10px_40px_rgba(37,211,102,.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(37,211,102,.55)]"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="hidden text-sm font-black sm:inline">Chat with us</span>
    </a>
  );
}

/* ─── Header ─── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 py-3 sm:px-6 lg:px-10">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-2.5 text-white transition duration-500 sm:rounded-full sm:px-6 ${
          scrolled
            ? "border-white/15 bg-slate-950/80 shadow-[0_18px_60px_rgba(0,0,0,.4)] backdrop-blur-2xl"
            : "border-white/10 bg-slate-950/40 backdrop-blur-xl"
        }`}
      >
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-orange-500 via-white to-green-600 p-0.5">
            <span className="grid h-full w-full place-items-center rounded-[0.6rem] bg-slate-950 text-[10px] font-black leading-none text-amber-300">
              SS
            </span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base">Shiv Shakti</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">
              Express Packers &amp; Movers
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-200 lg:flex">
          <a className="transition hover:text-amber-300" href="#services">Services</a>
          <a className="transition hover:text-amber-300" href="#process">Process</a>
          <a className="transition hover:text-amber-300" href="#trust">Trust</a>
          <a className="transition hover:text-amber-300" href="#cities">Cities</a>
          <a className="transition hover:text-amber-300" href="#faq">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          {/* WhatsApp nav */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#1ebe57] sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          {/* CTA */}
          <a
            href="#quote"
            className="group inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-white"
          >
            Free Quote
            <span className="transition duration-300 group-hover:translate-x-1">
              <ArrowIcon className="h-4 w-4" />
            </span>
          </a>
          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 lg:hidden"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 p-6 text-white backdrop-blur-2xl lg:hidden"
          >
            {["services", "process", "trust", "cities", "faq", "quote"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-lg font-bold capitalize transition hover:text-amber-300"
              >
                {id === "quote" ? "Get Free Quote" : id}
              </a>
            ))}
            <a href={`tel:${PHONE}`} className="mt-4 flex items-center gap-3 text-amber-300 font-bold">
              <PhoneIcon /> {PHONE_DISPLAY}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─── Hero ─── */
function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="top" ref={heroRef} className="relative isolate flex min-h-[112svh] items-end overflow-hidden bg-slate-950 px-5 pb-14 pt-32 text-white sm:px-8 lg:px-12">
      <motion.div className="absolute inset-0 -z-30 bg-cover bg-center" style={{ y: imageY, scale: imageScale, backgroundImage: "url('/images/hero-truck.jpg')" }} />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,rgba(2,6,23,.94)_0%,rgba(2,6,23,.78)_36%,rgba(2,6,23,.32)_72%,rgba(2,6,23,.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
        <motion.div style={{ y: titleY }} initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeRise} className="mb-5 flex items-center gap-4">
            <span className="h-px w-12 bg-amber-400" />
            <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-300">
              All India Moving Services • GSTIN: {GSTIN}
            </p>
          </motion.div>
          <motion.h1 variants={fadeRise} className="text-[13vw] font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-[10vw] lg:text-[7rem]">
            Shiv Shakti
            <span className="block text-amber-400">Express</span>
          </motion.h1>
          <motion.p variants={fadeRise} className="mt-6 max-w-xl text-lg leading-8 text-slate-200 sm:text-xl">
            Trusted packers &amp; movers from Pilani, Rajasthan — serving all India. Professional packing, GPS-tracked transit, insured shipments and 24×7 support.
          </motion.p>
          <motion.div variants={fadeRise} className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="#quote" className="group inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-7 py-4 text-base font-black text-slate-950 shadow-[0_24px_80px_rgba(251,191,36,.35)] transition duration-300 hover:-translate-y-1 hover:bg-white">
              Get Free Quote <span className="transition duration-300 group-hover:translate-x-1"><ArrowIcon /></span>
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 text-base font-black text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-300/10">
              <PhoneIcon /> {PHONE_DISPLAY}
            </a>
          </motion.div>
          <motion.div variants={fadeRise} className="mt-6 flex items-center gap-4 text-sm text-slate-300">
            <MapPinIcon />
            <span>{ADDRESS}</span>
          </motion.div>
        </motion.div>

        {/* Quick estimate card */}
        <motion.aside style={{ y: cardY }} initial={{ opacity: 0, y: 60, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/[0.06] p-6 shadow-[0_30px_90px_rgba(0,0,0,.5)] backdrop-blur-2xl sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">Quick Estimate</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[["1 BHK", "₹6K – ₹12K"], ["2 BHK", "₹12K – ₹24K"], ["3 BHK", "₹20K – ₹38K"], ["Office", "On survey"]].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">{label}</p>
                <p className="mt-2 text-lg font-black tracking-tight text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-950"><CheckIcon /></span>
            <p className="text-sm font-bold text-amber-100">Free survey • No advance • 24×7 helpline</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-3.5 text-sm font-black text-white transition hover:bg-[#1ebe57]">
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp pe enquiry karein
          </a>
        </motion.aside>
      </div>
    </section>
  );
}

/* ─── Stats ─── */
function StatStrip() {
  return (
    <section className="border-y border-white/10 bg-slate-950 px-5 py-10 text-white sm:px-8 lg:px-12">
      <motion.div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeRise} className="flex flex-col">
            <span className="text-4xl font-black tracking-[-0.05em] text-amber-400 sm:text-5xl">{stat.value}</span>
            <span className="mt-2 text-sm font-bold uppercase tracking-[0.24em] text-slate-300">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── 3D Blueprint ─── */
function CargoCube({ rotateY, lift }: { rotateY: MotionValue<number>; lift: MotionValue<number> }) {
  return (
    <motion.div className="relative h-44 w-44 preserve-3d sm:h-56 sm:w-56" style={{ rotateX: -18, rotateY, y: lift }}
      animate={{ rotateZ: [0, 1.5, 0, -1.5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
      <div className="absolute inset-0 grid place-items-center border border-amber-100/45 bg-amber-400/95 text-center text-xs font-black uppercase tracking-[0.22em] text-slate-950 shadow-[0_40px_90px_rgba(0,0,0,.45)]" style={{ transform: "translateZ(88px)" }}>Sealed</div>
      <div className="absolute inset-0 border border-amber-100/25 bg-amber-500/85" style={{ transform: "rotateY(180deg) translateZ(88px)" }} />
      <div className="absolute inset-0 border border-amber-100/25 bg-orange-500/85" style={{ transform: "rotateY(90deg) translateZ(88px)" }} />
      <div className="absolute inset-0 border border-amber-100/25 bg-yellow-500/80" style={{ transform: "rotateY(-90deg) translateZ(88px)" }} />
      <div className="absolute inset-0 border border-amber-100/25 bg-amber-200/90" style={{ transform: "rotateX(90deg) translateZ(88px)" }} />
      <div className="absolute inset-0 border border-amber-100/25 bg-amber-700/75" style={{ transform: "rotateX(-90deg) translateZ(88px)" }} />
    </motion.div>
  );
}

function MiniTruck({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  return (
    <motion.div className="absolute left-1/2 top-1/2 h-16 w-36" style={{ x, y }}>
      <div className="absolute bottom-2 left-0 h-10 w-24 rounded-sm bg-white shadow-[22px_24px_55px_rgba(0,0,0,.34)]" />
      <div className="absolute bottom-2 left-20 h-12 w-16 rounded-sm bg-amber-400" />
      <div className="absolute bottom-6 left-[6.5rem] h-4 w-6 bg-sky-300" />
      <div className="absolute bottom-0 left-5 h-5 w-5 rounded-full border-4 border-slate-950 bg-slate-200" />
      <div className="absolute bottom-0 left-28 h-5 w-5 rounded-full border-4 border-slate-950 bg-slate-200" />
    </motion.div>
  );
}

function MoveBlueprint() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-40, 8, 52]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [70, -15, 40]);
  const dash = useTransform(scrollYProgress, [0.05, 0.85], [820, 0]);
  const truckX = useTransform(scrollYProgress, [0.05, 0.35, 0.65, 0.95], [-210, -70, 100, 230]);
  const truckY = useTransform(scrollYProgress, [0.05, 0.35, 0.65, 0.95], [150, -75, 35, -95]);

  return (
    <section ref={sectionRef} className="relative min-h-[200svh] bg-slate-950 text-white">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden px-5 py-24 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(251,191,36,.16),transparent_31%),radial-gradient(circle_at_78%_66%,rgba(14,165,233,.16),transparent_32%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.p variants={fadeRise} className="text-xs font-black uppercase tracking-[0.4em] text-amber-300">
              Move Blueprint — 3D Planning
            </motion.p>
            <motion.h2 variants={fadeRise} className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
              Aapka move, pehle se plan hota hai.
            </motion.h2>
            <motion.p variants={fadeRise} className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Hum inventory, lift access, packing priority aur route pehle map karte hain. Result — faster loading, safer transit aur zero surprises.
            </motion.p>
            <motion.div variants={fadeRise} className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Volume & access mapping", "Crew & vehicle sizing", "Material checklist", "Delivery window lock"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-950"><CheckIcon /></span>
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>
          <div className="relative min-h-[520px] perspective-3d">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 520" fill="none" aria-hidden="true">
              <path d="M82 390 C168 126 302 100 366 252 C438 421 572 426 642 112" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
              <motion.path d="M82 390 C168 126 302 100 366 252 C438 421 572 426 642 112" stroke="url(#bpLine)" strokeWidth="5" strokeLinecap="round" strokeDasharray="820" style={{ strokeDashoffset: dash }} />
              <defs><linearGradient id="bpLine" x1="82" x2="642" y1="390" y2="112"><stop stopColor="#fbbf24" /><stop offset="1" stopColor="#38bdf8" /></linearGradient></defs>
            </svg>
            <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
              <div className="absolute h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute h-96 w-96 rounded-full border border-amber-300/10" />
              <CargoCube rotateY={rotateY} lift={lift} />
            </div>
            <MiniTruck x={truckX} y={truckY} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */
function ServicesSection() {
  return (
    <section id="services" className="bg-[#f7f3ec] px-5 py-24 text-slate-950 sm:px-8 lg:px-12">
      <motion.div className="mx-auto max-w-7xl" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeRise} className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-700">Our Services</p>
            <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">All India Moving Services.</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-slate-700">
            Ghar ho ya office, bike ho ya car — Shiv Shakti Express har cheez ko professionally pack, move aur deliver karta hai. Pan-India coverage with local teams.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.article key={service.title} variants={fadeRise}
              className="group relative overflow-hidden rounded-3xl border border-slate-950/10 bg-white p-7 shadow-[0_22px_70px_rgba(15,23,42,.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,.12)]">
              <div className="flex items-start justify-between">
                <span className="text-3xl">{service.icon}</span>
                <span className="rounded-full border border-slate-950/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-slate-700">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-2xl font-black tracking-[-0.04em]">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.body}</p>
              <ul className="mt-5 space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-400 text-slate-950"><CheckIcon /></span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-amber-300/0 transition duration-500 group-hover:bg-amber-300/30" />
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Process ─── */
function Process() {
  return (
    <section id="process" className="bg-white px-5 py-24 text-slate-950 sm:px-8 lg:px-12">
      <motion.div className="mx-auto max-w-7xl" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <motion.div variants={fadeRise} className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-700">How It Works</p>
            <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">5-step clean process.</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-slate-600">
            Pehle call se lekar final walkthrough tak — ek move manager aur ek transparent timeline. No subcontracting, no surprises.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-slate-950/10 lg:grid-cols-5">
          {moveSteps.map((step, index) => (
            <motion.div key={step.label} variants={fadeRise} className="group relative bg-white p-7 transition duration-500 hover:bg-[#f7f3ec]">
              <span className="font-mono text-xs font-black uppercase tracking-[0.28em] text-amber-700">Step {String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl font-black tracking-[-0.04em]">{step.label}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">{step.detail}</p>
              <div className="absolute bottom-6 right-6 text-amber-700 opacity-0 transition duration-500 group-hover:opacity-100"><ArrowIcon /></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Trust ─── */
function Trust() {
  return (
    <section id="trust" className="overflow-hidden bg-slate-950 px-5 py-24 text-white sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,.5)]">
            <img src="/images/packing-detail.jpg" alt="Professional packing by Shiv Shakti Express" className="aspect-[5/6] w-full object-cover" />
          </div>
          <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-6 -right-4 hidden w-72 rounded-2xl border border-white/15 bg-white/[0.05] p-5 backdrop-blur-2xl sm:block lg:-right-10">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">Packing Material</p>
            <p className="mt-3 text-lg font-bold leading-7 text-white">Bubble wrap, foam sheets, stretch film aur corrugated cartons — har item ke size ke according.</p>
          </motion.div>
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.p variants={fadeRise} className="text-xs font-black uppercase tracking-[0.4em] text-amber-300">Why Trust Us</motion.p>
          <motion.h2 variants={fadeRise} className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
            GST registered. Insured. Verified crew.
          </motion.h2>
          <motion.p variants={fadeRise} className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            GSTIN: {GSTIN}. Trained in-house crew, clear inventory, transit insurance aur signed handoffs — dono ends pe. Aap hamesha jaante hain ki aapka samaan kahan hai.
          </motion.p>
          <motion.div variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              ["In-house trained crew", "No subcontracting. Same uniformed team from pickup to drop."],
              ["GPS-tracked transit", "Live route updates, checkpoint status aur ETA shared with you."],
              ["All-risk insurance", "Optional transit cover for high-value and fragile shipments."],
              ["24×7 helpline", "Call or WhatsApp anytime — we are always available for you."],
            ].map(([title, body]) => (
              <motion.div key={title} variants={fadeRise} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-base font-black tracking-tight text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Poster / About ─── */
function PosterSection() {
  return (
    <section className="bg-[#f7f3ec] px-5 py-24 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-slate-950/10 bg-white p-3 shadow-[0_30px_90px_rgba(15,23,42,.1)]">
          <img src="/images/moveverse-hero.jpg" alt="Shiv Shakti Express — All India Moving Services" className="w-full rounded-2xl object-cover" />
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.p variants={fadeRise} className="text-xs font-black uppercase tracking-[0.4em] text-amber-700">About Us</motion.p>
          <motion.h2 variants={fadeRise} className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
            Pilani se poore India tak.
          </motion.h2>
          <motion.p variants={fadeRise} className="mt-7 max-w-xl text-lg leading-8 text-slate-700">
            Shiv Shakti Express ek GST-registered, trusted packers and movers company hai jo Pilani, Rajasthan se operate karti hai. Humari team har din logon ko safely aur professionally shift karti hai — ghar ho, office ho ya vehicle.
          </motion.p>
          <motion.div variants={fadeRise} className="mt-8 space-y-4">
            <div className="flex items-start gap-3 text-sm text-slate-700">
              <MapPinIcon />
              <span className="font-bold">{ADDRESS}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <MailIcon />
              <a href={`mailto:${EMAIL}`} className="font-bold hover:text-amber-700">{EMAIL}</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <PhoneIcon />
              <a href={`tel:${PHONE}`} className="font-bold hover:text-amber-700">{PHONE_DISPLAY} (24×7)</a>
            </div>
          </motion.div>
          <motion.div variants={fadeRise} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-base font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-[#1ebe57]">
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp pe baat karein
            </a>
            <a href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-950 px-7 py-4 text-base font-black text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-slate-950 hover:text-white">
              <PhoneIcon /> Call Now
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((v) => (v + 1) % testimonials.length), 6000);
    return () => window.clearInterval(id);
  }, []);
  const current = testimonials[index];

  return (
    <section className="bg-amber-400 px-5 py-24 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.4fr_1.6fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-900/70">Client Reviews</p>
          <p className="mt-5 text-2xl font-black tracking-[-0.04em]">Real moves. Real words.</p>
        </div>
        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.blockquote key={current.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
              "{current.quote}"
              <footer className="mt-8 text-base font-bold text-slate-900/80">{current.name} &nbsp;•&nbsp; {current.detail}</footer>
            </motion.blockquote>
          </AnimatePresence>
          <div className="mt-10 flex items-center gap-3">
            {testimonials.map((item, pos) => (
              <button key={item.name} onClick={() => setIndex(pos)} aria-label={`Show review from ${item.name}`}
                className={`h-2 rounded-full transition-all duration-300 ${pos === index ? "w-10 bg-slate-950" : "w-4 bg-slate-950/30 hover:bg-slate-950/60"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Cities ─── */
function Cities() {
  return (
    <section id="cities" className="bg-slate-950 px-5 py-24 text-white sm:px-8 lg:px-12">
      <motion.div className="mx-auto max-w-7xl" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <motion.div variants={fadeRise} className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-300">City Coverage</p>
            <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">Pilani se poore Bharat tak.</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Har city mein local survey team aur destination handoff crew — aapka move kabhi outsourced feel nahi karega.
          </p>
        </motion.div>
        <motion.div variants={stagger} className="mt-14 grid border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <motion.div key={city} variants={fadeRise}
              className="group flex items-center justify-between border-b border-white/15 py-7 text-2xl font-black tracking-[-0.04em] text-white/90 transition duration-300 hover:text-amber-300 sm:border-r sm:px-6">
              {city}
              <ArrowIcon className="h-5 w-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Quote Cockpit ─── */
function QuoteCockpit() {
  const [rooms, setRooms] = useState(2);
  const [distance, setDistance] = useState<DistanceKey>("intercity");
  const [fragile, setFragile] = useState(true);
  const [vehicle, setVehicle] = useState(false);
  const [done, setDone] = useState(false);

  const estimate = useMemo(() => {
    const base = distanceRates[distance] + rooms * 6500 + (fragile ? 3500 : 0) + (vehicle ? 8000 : 0);
    const low = Math.round((base * 0.88) / 500) * 500;
    const high = Math.round((base * 1.18) / 500) * 500;
    return { low, high };
  }, [distance, fragile, rooms, vehicle]);

  function formatPrice(v: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDone(true);
  }

  return (
    <section id="quote" className="bg-[#f7f3ec] px-5 py-24 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={stagger}>
          <motion.p variants={fadeRise} className="text-xs font-black uppercase tracking-[0.4em] text-amber-700">Free Quote</motion.p>
          <motion.h2 variants={fadeRise} className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
            Apna move profile banayein.
          </motion.h2>
          <motion.p variants={fadeRise} className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Rooms, route aur extras adjust karein — instant estimate milega. Submit karein aur humara move manager call karke exact plan confirm karega.
          </motion.p>
          <motion.div variants={fadeRise} className="mt-10 overflow-hidden rounded-3xl border border-slate-950/10 bg-white shadow-[0_22px_70px_rgba(15,23,42,.08)]">
            <img src="/images/move-manager.jpg" alt="Shiv Shakti Express move manager" className="aspect-[5/4] w-full object-cover" />
            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-700">Your Move Manager</p>
              <p className="mt-3 text-lg font-bold leading-7 text-slate-800">
                Ek dedicated point-of-contact — pehli call se final walkthrough tak.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.form onSubmit={handleSubmit}
          className="rounded-[2rem] border border-slate-950/10 bg-white p-5 shadow-[0_35px_100px_rgba(15,23,42,.12)] sm:p-8"
          initial={{ opacity: 0, y: 40, rotateX: 8 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">Live Estimate</p>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-slate-200">Indicative</span>
            </div>
            <div className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">{formatPrice(estimate.low)} – {formatPrice(estimate.high)}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Final quote depends on exact inventory, floor access, distance aur packing material.</p>
          </div>
          <div className="mt-7 grid gap-6">
            <label className="space-y-3 text-sm font-black text-slate-700">
              <div className="flex items-center justify-between"><span>Rooms</span><span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-amber-300">{rooms} {rooms === 1 ? "room" : "rooms"}</span></div>
              <input type="range" min="1" max="6" value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="w-full accent-amber-500" />
            </label>
            <div className="space-y-3 text-sm font-black text-slate-700">
              <span>Route Type</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {([["local", "Local"], ["intercity", "Intercity"], ["cross", "Cross-country"]] as const).map(([id, label]) => (
                  <button type="button" key={id} onClick={() => setDistance(id)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${distance === id ? "border-slate-950 bg-slate-950 text-amber-300" : "border-slate-200 bg-white text-slate-700 hover:border-amber-400"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-amber-400">
                Fragile Packing <input type="checkbox" checked={fragile} onChange={(e) => setFragile(e.target.checked)} className="h-5 w-5 accent-amber-500" />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-amber-400">
                Vehicle Move <input type="checkbox" checked={vehicle} onChange={(e) => setVehicle(e.target.checked)} className="h-5 w-5 accent-amber-500" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100" placeholder="Full name" />
              <input required type="tel" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100" placeholder="Phone number" />
              <input required className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100" placeholder="Pickup city" />
              <input required className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100" placeholder="Drop city" />
            </div>
            <button className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 text-base font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-amber-400 hover:text-slate-950 sm:w-auto">
              Send Move Profile <span className="transition duration-300 group-hover:translate-x-1"><ArrowIcon /></span>
            </button>
            {done && <p className="font-black text-emerald-600">Move profile sent! Humara move manager jaldi call karega.</p>}
          </div>
        </motion.form>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const items = [
    { q: "Moving cost kaise calculate hota hai?", a: "Cost inventory volume, distance, floor access, packing material grade aur add-ons (vehicle transport / storage) pe depend karta hai. Survey ke baad fixed all-inclusive quote milta hai." },
    { q: "Kya insurance milta hai valuable items ke liye?", a: "Haan. Hum optional all-risk transit insurance offer karte hain high-value shipments ke liye, with documented inventory aur photo proof." },
    { q: "Kya same crew pickup aur delivery dono handle karega?", a: "Hum subcontract nahi karte. Same uniformed Shiv Shakti Express crew pack, load aur accompany karti hai aapke shipment ko." },
    { q: "Kitne din pehle book karna chahiye?", a: "Local moves ke liye 3–5 din. Intercity aur cross-country ke liye 7–10 din advance mein best route aur crew lock karne ke liye." },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-5 py-24 text-slate-950 sm:px-8 lg:px-12">
      <motion.div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <motion.div variants={fadeRise}>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-700">FAQ</p>
          <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">Sawaal? Yahan jawaab hain.</h2>
          <p className="mt-7 max-w-md text-lg leading-8 text-slate-600">Kuch aur poochna hai? Call ya WhatsApp karein — 2 minute mein guide karenge.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#1ebe57]">
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp pe poochein
          </a>
        </motion.div>
        <motion.div variants={stagger} className="divide-y divide-slate-950/10 border-y border-slate-950/10">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <motion.div key={item.q} variants={fadeRise}>
                <button type="button" onClick={() => setOpen(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{item.q}</span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-950/15 text-slate-950 transition duration-300 ${isOpen ? "rotate-45 bg-amber-400" : ""}`}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <p className="pb-7 pr-12 text-base leading-7 text-slate-600">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="bg-slate-950 px-5 py-24 text-white sm:px-8 lg:px-12">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-300">Ready When You Are</p>
          <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">
            Chaliye, aapka next move plan karte hain — calmly, professionally, on time.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="#quote" className="group inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-7 py-4 text-base font-black text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-white">
            Free Quote <span className="transition duration-300 group-hover:translate-x-1"><ArrowIcon /></span>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-base font-black text-white transition duration-300 hover:-translate-y-1">
            <WhatsAppIcon className="h-5 w-5" /> WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-slate-950 px-5 pb-12 pt-4 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-orange-500 via-white to-green-600 p-0.5">
                <span className="grid h-full w-full place-items-center rounded-[0.6rem] bg-slate-950 text-[10px] font-black leading-none text-amber-300">SS</span>
              </span>
              <span className="text-xl font-black tracking-tight">Shiv Shakti Express</span>
            </a>
            <p className="mt-4 text-sm leading-6 text-slate-400">Packers &amp; Movers — All India Moving Services. GST registered, insured, trusted since day one.</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-400">Services</p>
            <ul className="mt-4 space-y-2 text-sm font-bold text-slate-300">
              <li>Home Relocation</li>
              <li>Office Shifting</li>
              <li>Vehicle Transport</li>
              <li>Warehousing & Storage</li>
              <li>Insurance Coverage</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-400">Address</p>
            <p className="mt-4 text-sm font-bold leading-6 text-slate-300">{ADDRESS}</p>
            <p className="mt-3 text-xs text-slate-400">GSTIN: {GSTIN}</p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-400">Contact (24×7)</p>
            <ul className="mt-4 space-y-3 text-sm font-bold text-slate-300">
              <li><a className="flex items-center gap-2 hover:text-amber-300" href={`tel:${PHONE}`}><PhoneIcon /> {PHONE_DISPLAY}</a></li>
              <li><a className="flex items-center gap-2 hover:text-[#25D366]" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="h-5 w-5" /> WhatsApp</a></li>
              <li><a className="flex items-center gap-2 hover:text-amber-300" href={`mailto:${EMAIL}`}><MailIcon /> {EMAIL}</a></li>
              <li><a className="hover:text-amber-300" href={`https://${WEBSITE}`} target="_blank" rel="noopener noreferrer">{WEBSITE}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.28em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shiv Shakti Express Packers &amp; Movers</p>
          <p>All India Moving Services</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.24 });

  return (
    <div className="min-h-screen bg-slate-950">
      <motion.div className="fixed left-0 top-0 z-[70] h-1 w-full origin-left bg-amber-400" style={{ scaleX: progress }} />
      <Header />
      <main>
        <Hero />
        <StatStrip />
        <MoveBlueprint />
        <ServicesSection />
        <Process />
        <Trust />
        <PosterSection />
        <Testimonials />
        <Cities />
        <QuoteCockpit />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
