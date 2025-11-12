import { useEffect, useMemo, useState } from 'react'

const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ToolCard({ tool, onSelect }) {
  return (
    <button
      onClick={() => onSelect(tool)}
      className="group p-4 rounded-xl border bg-white hover:shadow-md transition flex items-start gap-4 text-left"
    >
      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
        {tool.name[0]}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
        <div className="mt-2 text-xs inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
          {tool.category}
        </div>
      </div>
    </button>
  )
}

function AdPlaceholder({ className = '' }) {
  return (
    <div className={`w-full rounded-lg border border-dashed bg-gray-50 text-gray-500 text-sm flex items-center justify-center ${className}`}>
      Ad space (Google AdSense ready)
    </div>
  )
}

function IpTool() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const run = async () => {
    setLoading(true)
    setData(null)
    try {
      const r = await fetch(`${backendBase}/api/ip`)
      const j = await r.json()
      setData(j)
    } catch (e) {
      setData({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { run() }, [])
  return (
    <div className="space-y-3">
      <button onClick={run} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Check My IP</button>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[120px]">{data ? JSON.stringify(data, null, 2) : 'Waiting...'}</pre>
    </div>
  )
}

function ShortenerTool() {
  const [url, setUrl] = useState('https://example.com/very/long/link')
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)
  const run = async (e) => {
    e?.preventDefault()
    if (!url) return
    setLoading(true)
    setRes(null)
    try {
      const r = await fetch(`${backendBase}/api/shorten?url=${encodeURIComponent(url)}`)
      const j = await r.json()
      setRes(j)
    } catch (e) { setRes({ error: String(e) }) } finally { setLoading(false) }
  }
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste URL" className="w-full border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={loading}>{loading? 'Shortening...' : 'Shorten'}</button>
      {res && (
        <div className="text-sm">
          {res.short ? (
            <p>Short URL: <a className="text-indigo-600 underline" href={res.short} target="_blank" rel="noreferrer">{res.short}</a></p>
          ) : (
            <p className="text-red-600">{res.error || res.detail || 'Failed'}</p>
          )}
        </div>
      )}
    </form>
  )
}

function QrTool() {
  const [text, setText] = useState('https://example.com')
  const url = useMemo(() => `${backendBase}/api/qr?text=${encodeURIComponent(text)}`, [text])
  return (
    <div className="space-y-3">
      <input value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded px-3 py-2" />
      <div className="flex items-center gap-4">
        <img src={url} alt="QR" className="h-44 w-44 rounded border bg-white" />
        <a className="px-3 py-2 bg-gray-800 text-white rounded" href={url} target="_blank" rel="noreferrer">Open</a>
      </div>
    </div>
  )
}

function ExchangeTool() {
  const [base, setBase] = useState('USD')
  const [data, setData] = useState(null)
  const run = async () => {
    setData(null)
    const r = await fetch(`${backendBase}/api/exchange?base=${encodeURIComponent(base)}`)
    setData(await r.json())
  }
  useEffect(() => { run() }, [])
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={base} onChange={e=>setBase(e.target.value)} className="border rounded px-3 py-2 w-28" />
        <button onClick={run} className="px-3 py-2 bg-indigo-600 text-white rounded">Get Rates</button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[160px]">{data ? JSON.stringify(data, null, 2) : '...'}</pre>
    </div>
  )
}

function ConverterTool() {
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [amount, setAmount] = useState(100)
  const [res, setRes] = useState(null)
  const convert = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`)
    setRes(await r.json())
  }
  return (
    <form onSubmit={convert} className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <input value={from} onChange={e=>setFrom(e.target.value)} className="border rounded px-3 py-2" placeholder="From" />
        <input value={to} onChange={e=>setTo(e.target.value)} className="border rounded px-3 py-2" placeholder="To" />
        <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="border rounded px-3 py-2" placeholder="Amount" />
      </div>
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Convert</button>
      {res && <p className="text-sm">{res.amount} {res.from} ≈ <span className="font-semibold">{res.result}</span> {res.to}</p>}
    </form>
  )
}

function WeatherTool() {
  const [city, setCity] = useState('London')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const run = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setData(null)
    const r = await fetch(`${backendBase}/api/weather?city=${encodeURIComponent(city)}`)
    setData(await r.json())
    setLoading(false)
  }
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={city} onChange={e=>setCity(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter city" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading? 'Loading...' : 'Get Weather'}</button>
      {data && (
        <div className="text-sm">
          <p className="font-semibold">{data?.location?.name}, {data?.location?.country}</p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[120px]">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </form>
  )
}

function TimezoneTool() {
  const [tz, setTz] = useState('Etc/UTC')
  const [data, setData] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/timezone?tz=${encodeURIComponent(tz)}`)
    setData(await r.json())
  }
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={tz} onChange={e=>setTz(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Timezone (e.g., Europe/London)" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Get Time</button>
      {data && <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[120px]">{JSON.stringify(data, null, 2)}</pre>}
    </form>
  )
}

function HolidaysTool() {
  const [country, setCountry] = useState('US')
  const [year, setYear] = useState(new Date().getFullYear())
  const [data, setData] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/holidays?country=${encodeURIComponent(country)}&year=${encodeURIComponent(year)}`)
    setData(await r.json())
  }
  return (
    <form onSubmit={run} className="space-y-3">
      <div className="flex gap-2">
        <input value={country} onChange={e=>setCountry(e.target.value)} className="border rounded px-3 py-2 w-28" />
        <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} className="border rounded px-3 py-2 w-28" />
        <button className="px-3 py-2 bg-indigo-600 text-white rounded">Get Holidays</button>
      </div>
      {data && <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[160px]">{JSON.stringify(data, null, 2)}</pre>}
    </form>
  )
}

function JokeTool() {
  const [text, setText] = useState('')
  useEffect(() => { (async () => {
    const r = await fetch(`${backendBase}/api/joke`)
    const j = await r.json()
    setText(j.text || '—')
  })() }, [])
  return (
    <div className="space-y-3">
      <button onClick={async ()=>{
        const r = await fetch(`${backendBase}/api/joke`)
        setText((await r.json()).text)
      }} className="px-3 py-2 bg-indigo-600 text-white rounded">New Joke</button>
      <p className="bg-gray-50 border rounded p-3">{text}</p>
    </div>
  )
}

function QuoteTool() {
  const [q, setQ] = useState(null)
  const run = async () => {
    const r = await fetch(`${backendBase}/api/quote`)
    setQ(await r.json())
  }
  useEffect(()=>{ run() }, [])
  return (
    <div className="space-y-3">
      <button onClick={run} className="px-3 py-2 bg-indigo-600 text-white rounded">New Quote</button>
      {q && (
        <blockquote className="bg-gray-50 border rounded p-3 italic">“{q.content}” — <span className="not-italic font-semibold">{q.author}</span></blockquote>
      )}
    </div>
  )
}

function CatTool() {
  const [src, setSrc] = useState(`${backendBase}/api/cat`)
  return (
    <div className="space-y-3">
      <button onClick={()=>setSrc(`${backendBase}/api/cat?ts=${Date.now()}`)} className="px-3 py-2 bg-indigo-600 text-white rounded">New Cat</button>
      <img src={src} alt="Cat" className="rounded border max-h-64" />
    </div>
  )
}

function DogTool() {
  const [src, setSrc] = useState('')
  const run = async () => {
    const r = await fetch(`${backendBase}/api/dog`)
    const j = await r.json()
    setSrc(j.message)
  }
  useEffect(()=>{ run() }, [])
  return (
    <div className="space-y-3">
      <button onClick={run} className="px-3 py-2 bg-indigo-600 text-white rounded">New Dog</button>
      {src && <img src={src} alt="Dog" className="rounded border max-h-64" />}
    </div>
  )
}

function UuidTool() {
  const [u, setU] = useState('')
  const run = async () => {
    const r = await fetch(`${backendBase}/api/uuid`)
    setU((await r.json()).uuid)
  }
  useEffect(()=>{ run() }, [])
  return (
    <div className="space-y-3">
      <button onClick={run} className="px-3 py-2 bg-indigo-600 text-white rounded">Generate</button>
      <code className="bg-gray-100 px-2 py-1 rounded inline-block">{u}</code>
    </div>
  )
}

function LoremTool() {
  const [n, setN] = useState(2)
  const [text, setText] = useState('')
  const run = async () => {
    const r = await fetch(`${backendBase}/api/lorem?paragraphs=${n}`)
    const j = await r.json()
    setText(j.text)
  }
  useEffect(()=>{ run() }, [])
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <label className="text-sm text-gray-700">Paragraphs</label>
        <input type="number" min={1} max={10} value={n} onChange={e=>setN(Number(e.target.value))} className="border rounded px-3 py-2 w-24" />
        <button onClick={run} className="px-3 py-2 bg-indigo-600 text-white rounded">Generate</button>
      </div>
      <textarea value={text} readOnly rows={8} className="w-full border rounded p-3 font-mono text-sm" />
    </div>
  )
}

function EmailValidatorTool() {
  const [email, setEmail] = useState('name@example.com')
  const [res, setRes] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/validate-email?email=${encodeURIComponent(email)}`)
    setRes(await r.json())
  }
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Validate</button>
      {res && (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[120px]">{JSON.stringify(res, null, 2)}</pre>
      )}
    </form>
  )
}

function NASAAPODTool() {
  const [date, setDate] = useState('')
  const [data, setData] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/nasa-apod${date ? `?date=${encodeURIComponent(date)}` : ''}`)
    setData(await r.json())
  }
  useEffect(()=>{ run({preventDefault: ()=>{}}) }, [])
  return (
    <form onSubmit={run} className="space-y-3">
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Fetch APOD</button>
      {data && (
        <div className="space-y-2">
          <h4 className="font-semibold">{data.title}</h4>
          {data.media_type === 'image' && <img src={data.url} alt={data.title} className="rounded border max-h-80" />}
          <p className="text-sm text-gray-700">{data.explanation}</p>
        </div>
      )}
    </form>
  )
}

function DictionaryTool() {
  const [word, setWord] = useState('example')
  const [data, setData] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/dictionary?word=${encodeURIComponent(word)}`)
    setData(await r.json())
  }
  useEffect(()=>{ run({preventDefault: ()=>{}}) }, [])
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={word} onChange={e=>setWord(e.target.value)} className="w-full border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Lookup</button>
      {data && <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[160px]">{JSON.stringify(data, null, 2)}</pre>}
    </form>
  )
}

function PokemonTool() {
  const [name, setName] = useState('ditto')
  const [data, setData] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/pokemon?name=${encodeURIComponent(name)}`)
    setData(await r.json())
  }
  useEffect(()=>{ run({preventDefault: ()=>{}}) }, [])
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Fetch</button>
      {data && (
        <div className="space-y-2">
          <p className="font-semibold capitalize">{data.name} (#{data.id})</p>
          {data.sprites?.front_default && <img src={data.sprites.front_default} alt={data.name} className="h-24" />}
          <p className="text-sm text-gray-700">Types: {data.types?.join(', ')}</p>
        </div>
      )}
    </form>
  )
}

function MealTool() {
  const [q, setQ] = useState('chicken')
  const [data, setData] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/meal?search=${encodeURIComponent(q)}`)
    setData(await r.json())
  }
  useEffect(()=>{ run({preventDefault: ()=>{}}) }, [])
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={q} onChange={e=>setQ(e.target.value)} className="w-full border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Search</button>
      {data && <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[160px]">{JSON.stringify(data, null, 2)}</pre>}
    </form>
  )
}

function ColorTool() {
  const [hex, setHex] = useState('#ff5733')
  const [data, setData] = useState(null)
  const run = async (e) => {
    e?.preventDefault()
    const r = await fetch(`${backendBase}/api/color?hex=${encodeURIComponent(hex)}`)
    setData(await r.json())
  }
  useEffect(()=>{ run({preventDefault: ()=>{}}) }, [])
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={hex} onChange={e=>setHex(e.target.value)} className="w-full border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Get Color</button>
      {data && (
        <div className="space-y-2">
          <div className="w-16 h-16 rounded border" style={{ background: data.hex?.value || hex }} />
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[120px]">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </form>
  )
}

function UserAgentTool() {
  const [data, setData] = useState(null)
  useEffect(()=>{ (async ()=>{
    const r = await fetch(`${backendBase}/api/user-agent`)
    setData(await r.json())
  })() }, [])
  return (
    <div className="space-y-3">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto min-h-[140px]">{data ? JSON.stringify(data, null, 2) : '...'}
      </pre>
    </div>
  )
}

function FaviconTool() {
  const [url, setUrl] = useState('https://example.com')
  const [src, setSrc] = useState('')
  const run = async (e) => {
    e?.preventDefault()
    setSrc(`${backendBase}/api/favicon?url=${encodeURIComponent(url)}&size=64`)
  }
  return (
    <form onSubmit={run} className="space-y-3">
      <input value={url} onChange={e=>setUrl(e.target.value)} className="w-full border rounded px-3 py-2" />
      <button className="px-3 py-2 bg-indigo-600 text-white rounded">Get Favicon</button>
      {src && <img src={src} alt="favicon" className="h-16 w-16 rounded" />}
    </form>
  )
}

const toolComponents = {
  'ip-lookup': IpTool,
  'url-shortener': ShortenerTool,
  'qr-generator': QrTool,
  'exchange-rates': ExchangeTool,
  'currency-converter': ConverterTool,
  'weather': WeatherTool,
  'timezone': TimezoneTool,
  'holidays': HolidaysTool,
  'random-joke': JokeTool,
  'random-quote': QuoteTool,
  'cat-image': CatTool,
  'dog-image': DogTool,
  'uuid': UuidTool,
  'lorem-ipsum': LoremTool,
  'email-validator': EmailValidatorTool,
  'nasa-apod': NASAAPODTool,
  'dictionary': DictionaryTool,
  'pokemon': PokemonTool,
  'meals': MealTool,
  'color-info': ColorTool,
  'user-agent': UserAgentTool,
  'favicon-fetcher': FaviconTool,
}

export default function App() {
  const [tools, setTools] = useState([])
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${backendBase}/api/tools`)
        const j = await r.json()
        setTools(j.tools || [])
      } catch (e) {
        setTools([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => tools.filter(t => (
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase()) ||
    t.category.toLowerCase().includes(query.toLowerCase())
  )), [tools, query])

  const Active = current ? (toolComponents[current.slug] || (()=> <p className="text-sm text-gray-600">This tool opens externally: <a className="text-indigo-600 underline" href={current.endpoint} target="_blank" rel="noreferrer">{current.endpoint}</a></p>)) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">T</div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Micro Tools Hub</h1>
              <p className="text-xs text-gray-600">100+ free public APIs powered utilities</p>
            </div>
          </div>
          <div className="w-80 max-w-[50vw]">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tools (IP, QR, Weather, Rates...)" className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {current ? (
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{current.name}</h2>
                  <p className="text-sm text-gray-600">{current.description}</p>
                </div>
                <button onClick={()=>setCurrent(null)} className="text-sm text-gray-600 hover:text-gray-900">Back</button>
              </div>
              <div className="my-4"><AdPlaceholder className="h-20" /></div>
              <div className="mt-4">
                <Active />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AdPlaceholder className="h-24" />
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Popular Tools</h2>
                {loading ? (
                  <p className="text-sm text-gray-600">Loading tools...</p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filtered.map((t) => (
                      <ToolCard key={t.slug} tool={t} onSelect={setCurrent} />
                    ))}
                  </div>
                )}
              </section>
              <AdPlaceholder className="h-24" />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <AdPlaceholder className="h-40" />
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900">About</h3>
            <p className="text-sm text-gray-600 mt-2">A collection of simple, fast utilities powered by open public APIs. Bookmark and share to support organic growth.</p>
          </div>
          <AdPlaceholder className="h-80" />
        </aside>
      </main>

      <footer className="border-t bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Micro Tools Hub</p>
          <a href="/test" className="text-indigo-600 hover:underline">System Status</a>
        </div>
      </footer>
    </div>
  )
}
