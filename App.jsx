import { useState, useEffect } from "react";

const INITIAL_TRUCKS = [
  { id:1, name:"Porchetta da Mimmo", owner:"Mimmo Ferrante", lat:42.351, lng:13.398, city:"L'Aquila", address:"Piazza Duomo", rating:4.9, reviews:124, tags:["Croccantissima","Porzione XL"], schedule:{Lun:"08–14",Mer:"08–14",Ven:"08–14",Sab:"07–15"}, open:true, phone:"+39 333 123 4567", specialty:"Porchetta all'aglione", avatar:"🐷" },
  { id:2, name:"Il Trancio d'Oro", owner:"Angela Rossi", lat:42.192, lng:13.956, city:"Pescara", address:"Lungomare Matteotti", rating:4.7, reviews:89, tags:["Vista mare","Rosetta croccante"], schedule:{Mar:"09–13",Gio:"09–13",Sab:"08–16",Dom:"08–14"}, open:true, phone:"+39 347 987 6543", specialty:"Porchetta al finocchietto", avatar:"🥖" },
  { id:3, name:"Norcia & Abruzzo", owner:"Paolo Conti", lat:42.062, lng:14.242, city:"Lanciano", address:"Mercato Settimanale", rating:4.8, reviews:67, tags:["Bio","Maiale locale"], schedule:{Mer:"07–13",Sab:"07–14"}, open:false, phone:"+39 366 555 7890", specialty:"Porchetta nera abruzzese", avatar:"🌿" },
  { id:4, name:"Camioncino di Rocco", owner:"Rocco Mancini", lat:42.448, lng:14.194, city:"Chieti", address:"Piazza G. B. Vico", rating:4.6, reviews:43, tags:["Storico","Dal 1978"], schedule:{Lun:"09–13",Gio:"09–13",Sab:"08–15"}, open:true, phone:"+39 320 111 2233", specialty:"Porchetta alla brace", avatar:"🔥" },
  { id:5, name:"La Porchettara", owner:"Giulia Sabatini", lat:42.565, lng:13.924, city:"Teramo", address:"Piazza Martiri della Libertà", rating:4.5, reviews:31, tags:["Piccante","Arrosticini bonus"], schedule:{Ven:"08–14",Sab:"07–15",Dom:"08–13"}, open:false, phone:"+39 388 444 5566", specialty:"Porchetta e peperoncino", avatar:"🌶️" },
  { id:6, name:"La Pecora Nera", owner:"Mario Di Paolo", lat:42.28, lng:14.01, city:"Pescara", address:"Corso Umberto I", rating:4.4, reviews:19, tags:["Novità","Speziata"], schedule:{Gio:"09–14",Sab:"08–15",Dom:"09–13"}, open:true, phone:"+39 340 222 3344", specialty:"Porchetta alle erbe", avatar:"🌾" },
];

const CITIES = ["Tutte","L'Aquila","Pescara","Lanciano","Chieti","Teramo"];
const DAYS = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
const ACC = "#ff5722";

/* ─── MAP ─────────────────────────────────────────────────────── */
function AbruzzoMap({ trucks, selected, onSelect }) {
  const W=480, H=250;
  const LAT_MIN=41.7, LAT_MAX=42.9, LNG_MIN=13.0, LNG_MAX=14.8;
  const proj = (lat, lng) => ({
    x: ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W,
    y: H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H
  });
  return (
    <div style={{borderRadius:16,overflow:"hidden",width:"100%",height:250,background:"#e8f5e9"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"100%"}}>
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8f5e9"/>
            <stop offset="100%" stopColor="#c8e6c9"/>
          </linearGradient>
          <filter id="ds">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>
        <rect width={W} height={H} fill="#dbeafe"/>
        <ellipse cx={240} cy={125} rx={200} ry={100} fill="url(#mg)" stroke="#a5d6a7" strokeWidth="1.5"/>
        {[[120,160],[190,130],[260,120],[330,135],[200,100]].map(([x,y],i) => (
          <polygon key={i} points={`${x},${y} ${x-14},${y+24} ${x+14},${y+24}`} fill="#a5d6a7" opacity=".5"/>
        ))}
        {trucks.map(t => {
          const p = proj(t.lat, t.lng);
          const sel = selected?.id === t.id;
          const col = t.open ? ACC : "#9e9e9e";
          return (
            <g key={t.id} onClick={() => onSelect(t)} style={{cursor:"pointer"}}>
              {sel && <circle cx={p.x} cy={p.y} r={28} fill={ACC} opacity={.15}/>}
              <circle cx={p.x} cy={p.y-10} r={sel?16:13} fill={col} stroke="white" strokeWidth={2.5} filter="url(#ds)"/>
              <polygon points={`${p.x-5},${p.y+2} ${p.x+5},${p.y+2} ${p.x},${p.y+14}`} fill={col}/>
              <text x={p.x} y={p.y-5} textAnchor="middle" fontSize={sel?13:11}>{t.avatar}</text>
              {t.open && <circle cx={p.x+10} cy={p.y-22} r={4} fill="#4caf50" stroke="white" strokeWidth={1.5}/>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── ATOMS ───────────────────────────────────────────────────── */
const Stars = ({r, sz=13}) => (
  <span style={{fontSize:sz, color:"#ff9800"}}>
    {"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}
    <span style={{color:"#9e9e9e", fontSize:sz-1, marginLeft:3}}>{r}</span>
  </span>
);

const Label = ({children}) => (
  <div style={{fontSize:11,fontWeight:700,color:"#424242",textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>
    {children}
  </div>
);

const inputCss = {
  width:"100%", padding:"12px 14px", border:"1.5px solid #e0e0e0", borderRadius:12,
  fontSize:14, fontFamily:"inherit", outline:"none", boxSizing:"border-box", color:"#212121", background:"white"
};

const PriBtn = ({label, onClick}) => (
  <button onClick={onClick} style={{
    width:"100%", padding:"14px", borderRadius:14, border:"none",
    background:`linear-gradient(135deg,${ACC},#ff8a65)`, color:"white", fontWeight:800, fontSize:15,
    cursor:"pointer", fontFamily:"inherit", boxShadow:`0 4px 16px ${ACC}40`, marginTop:12
  }}>
    {label}
  </button>
);

const Tag = ({label}) => (
  <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:"#fff3e0",color:"#e64a19",fontWeight:700,border:"1px solid #ffccbc"}}>
    {label}
  </span>
);

const Badge = ({open}) => (
  <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,background:open?"#e8f5e9":"#f5f5f5",color:open?"#2e7d32":"#757575"}}>
    {open ? "● Aperto" : "○ Chiuso"}
  </span>
);

/* ─── SCHEDULE ────────────────────────────────────────────────── */
const Schedule = ({schedule}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>
    {DAYS.map(d => (
      <div key={d} style={{
        padding:"4px 9px", borderRadius:20, fontSize:11, fontWeight:700,
        background:schedule[d]?"#fff3e0":"#f5f5f5", color:schedule[d]?ACC:"#bdbdbd",
        border:`1px solid ${schedule[d]?"#ffccbc":"#eeeeee"}`
      }}>
        {d}{schedule[d] && <span style={{fontWeight:400}}> {schedule[d]}</span>}
      </div>
    ))}
  </div>
);

/* ─── MODAL ───────────────────────────────────────────────────── */
function Modal({onClose, children}) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,.6)",
      zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"white", borderRadius:"22px 22px 0 0",
        width:"100%", maxWidth:480, maxHeight:"92vh", overflowY:"auto",
        animation:"slideUp .25s ease"
      }}>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"14px 16px 0"}}>
          <button onClick={onClose} style={{
            background:"#f5f5f5", border:"none", borderRadius:"50%",
            width:32, height:32, cursor:"pointer", fontSize:16, fontWeight:700, color:"#424242",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── TRUCK CARD ──────────────────────────────────────────────── */
function TruckCard({t, isFav, onFav, onOpen}) {
  return (
    <div
      onClick={() => onOpen(t)}
      style={{
        background:"white", borderRadius:16, marginBottom:12,
        overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,.06)",
        cursor:"pointer", border:"1px solid #f0f0f0", transition:"box-shadow .2s"
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,.12)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.06)"}
    >
      <div style={{
        height:88,
        background:`linear-gradient(135deg,${t.open?ACC:"#9e9e9e"},${t.open?"#ff8a65":"#bdbdbd"})`,
        display:"flex", alignItems:"center", justifyContent:"center", position:"relative"
      }}>
        <span style={{fontSize:44}}>{t.avatar}</span>
        <div style={{position:"absolute",top:8,right:8}}><Badge open={t.open}/></div>
        <button
          onClick={e => { e.stopPropagation(); onFav(t.id); }}
          style={{
            position:"absolute", top:6, left:8,
            background:"rgba(255,255,255,.9)", border:"none", borderRadius:"50%",
            width:30, height:30, cursor:"pointer", fontSize:15,
            display:"flex", alignItems:"center", justifyContent:"center"
          }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={{padding:"12px 14px"}}>
        <div style={{fontWeight:800,fontSize:15,color:"#212121"}}>{t.name}</div>
        <div style={{fontSize:12,color:"#757575",marginTop:2}}>📍 {t.city} · {t.address}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
          <Stars r={t.rating}/>
          <span style={{fontSize:11,color:"#bdbdbd"}}>({t.reviews})</span>
          <span style={{marginLeft:"auto",fontSize:11,color:"#757575"}}>🥩 {t.specialty}</span>
        </div>
        <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
          {t.tags.map(tag => <Tag key={tag} label={tag}/>)}
        </div>
      </div>
    </div>
  );
}

/* ─── DETAIL MODAL ────────────────────────────────────────────── */
function DetailModal({truck, isFav, onFav, onReview, onClose}) {
  return (
    <Modal onClose={onClose}>
      <div style={{padding:"0 20px 32px"}}>
        <div style={{
          height:110,
          background:`linear-gradient(135deg,${truck.open?ACC:"#9e9e9e"},${truck.open?"#ff8a65":"#bdbdbd"})`,
          borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16
        }}>
          <span style={{fontSize:64}}>{truck.avatar}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div>
            <div style={{fontWeight:900,fontSize:21,color:"#212121"}}>{truck.name}</div>
            <div style={{fontSize:13,color:"#9e9e9e"}}>{truck.owner}</div>
          </div>
          <button onClick={() => onFav(truck.id)} style={{
            background:isFav?"#ffebee":"#f5f5f5", border:"none", borderRadius:12,
            padding:"8px 14px", fontSize:20, cursor:"pointer"
          }}>
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <Stars r={truck.rating} sz={15}/>
          <span style={{fontSize:12,color:"#9e9e9e"}}>({truck.reviews} recensioni)</span>
          <span style={{marginLeft:"auto"}}><Badge open={truck.open}/></span>
        </div>
        <div style={{background:"#fafafa",borderRadius:14,padding:"14px 16px",marginBottom:14,display:"flex",flexDirection:"column",gap:10}}>
          {[
            ["📍","Dove",`${truck.address}, ${truck.city}`],
            ["📞","Telefono",truck.phone],
            ["🥩","Specialità",truck.specialty]
          ].map(([icon,lbl,val]) => (
            <div key={lbl} style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:20,width:28,textAlign:"center"}}>{icon}</span>
              <div>
                <div style={{fontSize:10,color:"#9e9e9e",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{lbl}</div>
                <div style={{fontSize:13,color:"#212121",fontWeight:600,marginTop:1}}>{val}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"wrap"}}>
          {truck.tags.map(t => <Tag key={t} label={t}/>)}
        </div>
        <div style={{fontWeight:800,fontSize:13,color:"#212121",marginBottom:4}}>📅 Orari</div>
        <Schedule schedule={truck.schedule}/>
        <PriBtn label="✍️ Scrivi una recensione" onClick={onReview}/>
      </div>
    </Modal>
  );
}

/* ─── REVIEW MODAL ────────────────────────────────────────────── */
function ReviewModal({truck, onClose}) {
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  if (done) return (
    <Modal onClose={onClose}>
      <div style={{textAlign:"center",padding:"32px 20px 40px"}}>
        <div style={{fontSize:60}}>🎉</div>
        <div style={{fontWeight:900,fontSize:20,marginTop:10}}>Grazie!</div>
        <div style={{color:"#757575",fontSize:13,marginTop:6}}>La tua recensione è stata inviata.</div>
        <PriBtn label="Chiudi" onClick={onClose}/>
      </div>
    </Modal>
  );

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"0 20px 32px"}}>
        <div style={{fontWeight:900,fontSize:18,marginBottom:2}}>Recensisci {truck.name}</div>
        <div style={{color:"#9e9e9e",fontSize:13,marginBottom:16}}>Aiuta altri amanti della porchetta 🐷</div>
        <Label>La tua valutazione</Label>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {[1,2,3,4,5].map(s => (
            <span key={s} onClick={() => setStars(s)}
              style={{fontSize:34,cursor:"pointer",color:s<=stars?"#ff9800":"#e0e0e0",transition:"color .1s"}}>★</span>
          ))}
        </div>
        <Label>Commento</Label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Era croccante? Saporita? Porzione abbondante? 🤤"
          style={{...inputCss, minHeight:100, resize:"none", marginBottom:0}}
        />
        <PriBtn label="Invia recensione 🚀" onClick={() => setDone(true)}/>
      </div>
    </Modal>
  );
}

/* ─── VENDOR POSITION MODAL ───────────────────────────────────── */
function VendorPositionModal({truck, onUpdate, onClose}) {
  const [address, setAddress] = useState(truck.address);
  const [city, setCity] = useState(truck.city);
  const [openNow, setOpenNow] = useState(truck.open);
  const [done, setDone] = useState(false);

  if (done) return (
    <Modal onClose={onClose}>
      <div style={{textAlign:"center",padding:"32px 20px 40px"}}>
        <div style={{fontSize:60}}>📍</div>
        <div style={{fontWeight:900,fontSize:20,marginTop:10}}>Posizione aggiornata!</div>
        <div style={{color:"#757575",fontSize:13,marginTop:6}}>{city} · {address}</div>
        <PriBtn label="Perfetto!" onClick={onClose}/>
      </div>
    </Modal>
  );

  const save = () => { onUpdate(truck.id, {address, city, open:openNow}); setDone(true); };

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"0 20px 32px"}}>
        <div style={{fontWeight:900,fontSize:18,marginBottom:2}}>📍 Aggiorna posizione</div>
        <div style={{color:"#9e9e9e",fontSize:13,marginBottom:16}}>{truck.name}</div>
        <div style={{
          background:"#fafafa", borderRadius:14, padding:"14px 16px", marginBottom:16,
          display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>
          <div>
            <div style={{fontWeight:700,fontSize:14}}>Sei aperto adesso?</div>
            <div style={{fontSize:12,color:"#9e9e9e",marginTop:2}}>Aggiorna il tuo stato in tempo reale</div>
          </div>
          <div
            onClick={() => setOpenNow(o => !o)}
            style={{
              width:50, height:28, borderRadius:14, cursor:"pointer", position:"relative",
              background:openNow?"#4caf50":"#bdbdbd", transition:"background .2s"
            }}
          >
            <div style={{
              position:"absolute", top:3, left:openNow?25:3, width:22, height:22,
              borderRadius:"50%", background:"white", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)"
            }}/>
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <Label>Città</Label>
          <select value={city} onChange={e => setCity(e.target.value)} style={inputCss}>
            {CITIES.filter(c => c !== "Tutte").map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{marginBottom:14}}>
          <Label>Indirizzo / zona</Label>
          <input value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Es. Piazza Duomo, angolo via Roma" style={inputCss}/>
        </div>
        <div style={{
          background:"#e8f5e9", borderRadius:12, height:90, display:"flex",
          alignItems:"center", justifyContent:"center", border:"2px dashed #a5d6a7", marginBottom:4
        }}>
          <div style={{textAlign:"center",color:"#4caf50"}}>
            <div style={{fontSize:26}}>🗺️</div>
            <div style={{fontSize:12,fontWeight:700,marginTop:4}}>GPS automatico — prossimamente</div>
          </div>
        </div>
        <PriBtn label="Aggiorna posizione 📍" onClick={save}/>
      </div>
    </Modal>
  );
}

/* ─── VENDOR REGISTER MODAL ───────────────────────────────────── */
function VendorRegisterModal({onClose}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({name:"",city:CITIES[1],address:"",phone:"",specialty:""});
  const [selDays, setSelDays] = useState({});
  const [done, setDone] = useState(false);
  const upd = (k, v) => setForm(f => ({...f, [k]:v}));

  if (done) return (
    <Modal onClose={onClose}>
      <div style={{textAlign:"center",padding:"32px 20px 40px"}}>
        <div style={{fontSize:60}}>🎊</div>
        <div style={{fontWeight:900,fontSize:20,color:ACC,marginTop:10}}>Benvenuto su PorkettApp!</div>
        <div style={{color:"#757575",fontSize:13,marginTop:6}}>Il tuo camioncino sarà visibile dopo verifica entro 24h.</div>
        <PriBtn label="Inizia! 🐷" onClick={onClose}/>
      </div>
    </Modal>
  );

  return (
    <Modal onClose={onClose}>
      <div style={{padding:"0 20px 32px"}}>
        <div style={{fontWeight:900,fontSize:18,marginBottom:4}}>🚐 Registra il tuo camioncino</div>
        <div style={{display:"flex",gap:4,marginBottom:20}}>
          {[1,2].map(s => (
            <div key={s} style={{flex:1,height:4,borderRadius:4,background:step>=s?ACC:"#f0f0f0",transition:"background .3s"}}/>
          ))}
        </div>

        {step === 1 && <>
          {[
            ["name","Nome camioncino","Es. Porchetta da Mimmo"],
            ["address","Zona tipica","Es. Piazza Duomo"],
            ["phone","Telefono","Es. +39 333 ..."],
            ["specialty","Specialità","Es. Porchetta al finocchietto"]
          ].map(([k,lbl,ph]) => (
            <div key={k} style={{marginBottom:12}}>
              <Label>{lbl}</Label>
              <input value={form[k]} onChange={e => upd(k, e.target.value)} placeholder={ph} style={inputCss}/>
            </div>
          ))}
          <div style={{marginBottom:14}}>
            <Label>Città</Label>
            <select value={form.city} onChange={e => upd("city", e.target.value)} style={inputCss}>
              {CITIES.filter(c => c !== "Tutte").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <PriBtn label="Avanti →" onClick={() => setStep(2)}/>
        </>}

        {step === 2 && <>
          <div style={{fontWeight:800,fontSize:14,marginBottom:10,color:"#212121"}}>Giorni di presenza</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {DAYS.map(d => (
              <button key={d}
                onClick={() => setSelDays(p => ({...p, [d]:p[d]?null:"08:00–14:00"}))}
                style={{
                  padding:"7px 13px", borderRadius:20, border:"none", cursor:"pointer",
                  fontWeight:700, fontSize:12, fontFamily:"inherit",
                  background:selDays[d]?ACC:"#f5f5f5", color:selDays[d]?"white":"#757575"
                }}
              >
                {d}
              </button>
            ))}
          </div>
          {DAYS.filter(d => selDays[d]).map(d => (
            <div key={d} style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <span style={{width:36,fontWeight:700,color:ACC,fontSize:12}}>{d}</span>
              <input
                defaultValue="08:00–14:00"
                onChange={e => setSelDays(p => ({...p, [d]:e.target.value}))}
                style={{...inputCss, flex:1}}
              />
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={() => setStep(1)} style={{
              flex:1, padding:"13px", borderRadius:12, border:"none",
              background:"#f5f5f5", color:"#424242", fontWeight:800, cursor:"pointer", fontFamily:"inherit"
            }}>
              ← Indietro
            </button>
            <button onClick={() => setDone(true)} style={{
              flex:2, padding:"13px", borderRadius:12, border:"none",
              background:`linear-gradient(135deg,${ACC},#ff8a65)`, color:"white",
              fontWeight:800, cursor:"pointer", fontFamily:"inherit"
            }}>
              Registrati 🎉
            </button>
          </div>
        </>}
      </div>
    </Modal>
  );
}

/* ─── TOAST ───────────────────────────────────────────────────── */
function Toast({msg, onClose}) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position:"fixed", bottom:84, left:"50%", transform:"translateX(-50%)",
      background:"#212121", color:"white", padding:"11px 22px", borderRadius:50,
      fontWeight:700, fontSize:13, boxShadow:"0 4px 20px rgba(0,0,0,.2)",
      zIndex:9999, whiteSpace:"nowrap", animation:"slideUp .25s ease"
    }}>
      {msg}
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────────── */
export default function PorkettApp() {
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Tutte");
  const [statusF, setStatusF] = useState("tutti");
  const [favs, setFavs] = useState([]);
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [mapSel, setMapSel] = useState(null);

  const showToast = m => setToast(m);
  const toggleFav = id => {
    const has = favs.includes(id);
    setFavs(f => has ? f.filter(x => x !== id) : [...f, id]);
    showToast(has ? "Rimosso dai preferiti" : "❤️ Salvato nei preferiti!");
  };
  const updateTruck = (id, patch) => {
    setTrucks(ts => ts.map(t => t.id === id ? {...t, ...patch} : t));
  };
  const openDetail = t => setModal({type:"detail", truck:t});

  const filtered = trucks.filter(t => {
    const q = search.toLowerCase();
    const mQ = !q || (t.name + t.city + t.specialty).toLowerCase().includes(q);
    const mC = city === "Tutte" || t.city === city;
    const mS = statusF === "tutti" || (statusF === "aperti" ? t.open : !t.open);
    const mF = tab !== "favoriti" || favs.includes(t.id);
    return mQ && mC && mS && mF;
  });

  /* ── HOME ── */
  const HomeTab = (
    <div style={{flex:1, overflowY:"auto", paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${ACC},#ff8a65)`, padding:"20px 16px 22px"}}>
        <div style={{fontWeight:900,fontSize:24,color:"white",letterSpacing:-.5,marginBottom:2}}>🐷 PorkettApp</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.8)",marginBottom:14}}>Trova la porchetta più buona in Abruzzo</div>
        <div style={{background:"white",borderRadius:14,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(0,0,0,.15)"}}>
          <span style={{color:"#bdbdbd",fontSize:18}}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca camioncino, città, specialità…"
            style={{border:"none",outline:"none",flex:1,fontSize:14,fontFamily:"inherit",color:"#212121"}}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{border:"none",background:"none",cursor:"pointer",color:"#bdbdbd",fontSize:18,padding:0}}>✕</button>
          )}
        </div>
      </div>

      <div style={{padding:"14px 16px 0", display:"flex", gap:8, overflowX:"auto", paddingBottom:4}}>
        {CITIES.map(c => (
          <button key={c} onClick={() => setCity(c)} style={{
            padding:"7px 15px", borderRadius:20, border:"none", cursor:"pointer",
            fontWeight:700, fontSize:12, fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0,
            background:city===c?ACC:"#f0f0f0", color:city===c?"white":"#424242", transition:"all .15s"
          }}>
            {c === "Tutte" ? "🗺️ Tutte" : c}
          </button>
        ))}
      </div>

      <div style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px"}}>
        {[["tutti","Tutti"],["aperti","🟢 Aperti"],["chiusi","○ Chiusi"]].map(([k,l]) => (
          <button key={k} onClick={() => setStatusF(k)} style={{
            padding:"6px 13px", borderRadius:20,
            border:`1.5px solid ${statusF===k?ACC:"#e0e0e0"}`,
            cursor:"pointer", fontWeight:700, fontSize:11, fontFamily:"inherit",
            background:statusF===k?"#fff3e0":"white", color:statusF===k?ACC:"#9e9e9e"
          }}>
            {l}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:11,color:"#bdbdbd",fontWeight:600}}>
          {filtered.length} trovati
        </span>
      </div>

      <div style={{padding:"0 16px"}}>
        {filtered.length === 0 && (
          <div style={{textAlign:"center",padding:"48px 0",color:"#bdbdbd"}}>
            <div style={{fontSize:48}}>🐷</div>
            <div style={{fontWeight:700,marginTop:8,color:"#9e9e9e"}}>Nessun camioncino trovato</div>
            <div style={{fontSize:13,marginTop:4}}>Prova altri filtri</div>
          </div>
        )}
        {filtered.map(t => (
          <TruckCard key={t.id} t={t} isFav={favs.includes(t.id)} onFav={toggleFav} onOpen={openDetail}/>
        ))}
      </div>
    </div>
  );

  /* ── MAP ── */
  const MapTab = (
    <div style={{flex:1, overflowY:"auto", padding:"16px 16px 80px"}}>
      <div style={{fontWeight:800,fontSize:16,marginBottom:12,color:"#212121"}}>🗺️ Mappa Abruzzo</div>
      <AbruzzoMap trucks={filtered} selected={mapSel} onSelect={t => { setMapSel(t); openDetail(t); }}/>
      <div style={{marginTop:8,marginBottom:14}}>
        <span style={{fontSize:12,color:"#9e9e9e"}}>🔴 Tocca un pin per i dettagli</span>
      </div>
      {filtered.map(t => (
        <TruckCard key={t.id} t={t} isFav={favs.includes(t.id)} onFav={toggleFav} onOpen={openDetail}/>
      ))}
    </div>
  );

  /* ── FAVORITI ── */
  const FavTab = (
    <div style={{flex:1, overflowY:"auto", padding:"16px 16px 80px"}}>
      <div style={{fontWeight:800,fontSize:16,marginBottom:12,color:"#212121"}}>❤️ I tuoi preferiti</div>
      {filtered.length === 0 && (
        <div style={{textAlign:"center",padding:"48px 0",color:"#bdbdbd"}}>
          <div style={{fontSize:48}}>🤍</div>
          <div style={{fontWeight:700,marginTop:8,color:"#9e9e9e"}}>Nessun preferito ancora</div>
          <div style={{fontSize:13,marginTop:4}}>Salva i camioncini che ami di più</div>
        </div>
      )}
      {filtered.map(t => (
        <TruckCard key={t.id} t={t} isFav={favs.includes(t.id)} onFav={toggleFav} onOpen={openDetail}/>
      ))}
    </div>
  );

  /* ── VENDITORI ── */
  const VendorTab = (
    <div style={{flex:1, overflowY:"auto", padding:"16px 16px 80px"}}>
      <div style={{fontWeight:800,fontSize:16,marginBottom:14,color:"#212121"}}>🚐 Area Venditori</div>
      <div style={{fontWeight:700,fontSize:11,color:"#bdbdbd",textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>
        I tuoi camioncini
      </div>
      {trucks.slice(0,2).map(t => (
        <div key={t.id} style={{background:"white",borderRadius:16,padding:"14px 16px",marginBottom:10,border:"1px solid #f0f0f0",boxShadow:"0 1px 8px rgba(0,0,0,.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:30}}>{t.avatar}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:14,color:"#212121"}}>{t.name}</div>
              <div style={{fontSize:12,color:"#757575",marginTop:1}}>📍 {t.city} · {t.address}</div>
              <div style={{marginTop:5}}><Badge open={t.open}/></div>
            </div>
            <button
              onClick={() => setModal({type:"vendorPos", truck:t})}
              style={{
                background:`linear-gradient(135deg,${ACC},#ff8a65)`, border:"none",
                borderRadius:10, padding:"8px 12px", color:"white",
                fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"
              }}
            >
              📍 Aggiorna
            </button>
          </div>
        </div>
      ))}
      <div style={{background:"#fff8f6",borderRadius:16,padding:"20px 18px",marginTop:8,border:"1.5px dashed #ffccbc",textAlign:"center"}}>
        <div style={{fontSize:36}}>🚐</div>
        <div style={{fontWeight:800,fontSize:16,color:"#212121",marginTop:8}}>Hai un camioncino?</div>
        <div style={{fontSize:13,color:"#757575",marginTop:5,lineHeight:1.5}}>
          Registrati gratis e raggiungi migliaia di amanti della porchetta abruzzese
        </div>
        <PriBtn label="Registra il tuo camioncino" onClick={() => setModal({type:"register"})}/>
      </div>
    </div>
  );

  const screens = {home:HomeTab, mappa:MapTab, favoriti:FavTab, venditori:VendorTab};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f5f5f5; }
        @keyframes slideUp {
          from { opacity:0; transform: translateX(-50%) translateY(20px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,87,34,.3); border-radius: 4px; }
        select, input, textarea { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div style={{
        maxWidth:480, margin:"0 auto", minHeight:"100vh", background:"#fafafa",
        display:"flex", flexDirection:"column", position:"relative",
        fontFamily:"'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{flex:1, display:"flex", flexDirection:"column", overflowY:"hidden"}}>
          {screens[tab]}
        </div>

        {/* BOTTOM NAV */}
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480, background:"white", borderTop:"1px solid #f0f0f0",
          display:"flex", zIndex:50, boxShadow:"0 -2px 16px rgba(0,0,0,.06)"
        }}>
          {[
            {id:"home", icon:"🏠", label:"Home"},
            {id:"mappa", icon:"🗺️", label:"Mappa"},
            {id:"favoriti", icon:"❤️", label: favs.length ? `Preferiti (${favs.length})` : "Preferiti"},
            {id:"venditori", icon:"🚐", label:"Venditori"},
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              flex:1, background:"none", border:"none", padding:"10px 4px 12px",
              cursor:"pointer", fontFamily:"inherit",
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              color:tab===item.id?ACC:"#9e9e9e",
              borderTop:`2.5px solid ${tab===item.id?ACC:"transparent"}`,
              transition:"all .15s"
            }}>
              <span style={{fontSize:20}}>{item.icon}</span>
              <span style={{fontSize:9,fontWeight:700,textAlign:"center"}}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {modal?.type === "detail" && (
        <DetailModal
          truck={modal.truck}
          isFav={favs.includes(modal.truck.id)}
          onFav={toggleFav}
          onReview={() => setModal({type:"review", truck:modal.truck})}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "review" && (
        <ReviewModal truck={modal.truck} onClose={() => setModal(null)}/>
      )}
      {modal?.type === "vendorPos" && (
        <VendorPositionModal truck={modal.truck} onUpdate={updateTruck} onClose={() => setModal(null)}/>
      )}
      {modal?.type === "register" && (
        <VendorRegisterModal onClose={() => setModal(null)}/>
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)}/>}
    </>
  );
}
