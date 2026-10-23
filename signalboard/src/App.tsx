
import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Bell, Check, ChevronDown, Clock3, Download,
  Filter, Gauge, LayoutDashboard, Menu, MoreHorizontal, Radio, Search,
  Server, Settings2, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight,
  CircleHelp, X, SlidersHorizontal, CheckCircle2, CircleUserRound
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

type Severity = 'Critical' | 'Warning' | 'Info';
type Status = 'Investigating' | 'Acknowledged' | 'Resolved';
type EventItem = {
  id: string;
  service: string;
  message: string;
  severity: Severity;
  status: Status;
  time: string;
  latency: number;
};
type NavPage = 'Overview' | 'Event Explorer' | 'Services' | 'Alerts' | 'Settings';

const seed: EventItem[] = [
  { id: 'EVT-2048', service: 'API Gateway', message: 'Elevated response latency detected', severity: 'Warning', status: 'Investigating', time: 'Just now', latency: 482 },
  { id: 'EVT-2047', service: 'Auth Service', message: 'Token refresh retries above baseline', severity: 'Warning', status: 'Acknowledged', time: '2 min ago', latency: 312 },
  { id: 'EVT-2046', service: 'Payments', message: 'Payment processor timeout recovered', severity: 'Critical', status: 'Resolved', time: '6 min ago', latency: 1250 },
  { id: 'EVT-2045', service: 'Search Index', message: 'Index synchronization completed', severity: 'Info', status: 'Resolved', time: '9 min ago', latency: 86 },
  { id: 'EVT-2044', service: 'Notification Worker', message: 'Queue depth approaching threshold', severity: 'Warning', status: 'Investigating', time: '12 min ago', latency: 266 },
  { id: 'EVT-2043', service: 'API Gateway', message: 'Health check passed in all regions', severity: 'Info', status: 'Resolved', time: '15 min ago', latency: 104 },
  { id: 'EVT-2042', service: 'Media Service', message: 'Transient upstream connection failure', severity: 'Critical', status: 'Acknowledged', time: '18 min ago', latency: 890 },
  { id: 'EVT-2041', service: 'Auth Service', message: 'Login success rate returned to normal', severity: 'Info', status: 'Resolved', time: '23 min ago', latency: 118 },
];

const seedMetrics = Array.from({ length: 36 }, (_, i) => {
  const timestamp = Date.now() - (35 - i) * 5 * 60 * 1000;
  const latencies = [180, 195, 172, 225, 210, 285, 245, 310, 270, 235, 205, 188];

  return {
    timestamp,
    time: new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    latency: latencies[i % latencies.length],
  };
});

const serviceData = [
  { name: 'API Gateway', uptime: '99.98% uptime', initials: 'AG', color: 'blue', status: 'Operational', description: 'Routes requests to the correct services.' },
  { name: 'Authentication', uptime: '99.95% uptime', initials: 'AU', color: 'purple', status: 'Operational', description: 'Handles sign-in and access tokens.' },
  { name: 'Payment Service', uptime: '99.72% uptime', initials: 'PS', color: 'amber', status: 'Degraded', description: 'Processes payment requests; some simulated latency.' },
  { name: 'Search Index', uptime: '100% uptime', initials: 'SI', color: 'green', status: 'Operational', description: 'Keeps search data synchronized.' },
  { name: 'Notifications', uptime: '99.91% uptime', initials: 'NT', color: 'blue', status: 'Operational', description: 'Processes outgoing notifications.' },
];

const navItems = [
  { label: 'Overview' as NavPage, Icon: LayoutDashboard },
  { label: 'Event Explorer' as NavPage, Icon: Activity },
  { label: 'Services' as NavPage, Icon: Server },
  { label: 'Alerts' as NavPage, Icon: Bell },
  { label: 'Settings' as NavPage, Icon: Settings2 },
];

export default function App() {
  const [events, setEvents] = useState<EventItem[]>(seed);
  const [metrics, setMetrics] = useState(seedMetrics);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [streaming, setStreaming] = useState(true);
  const [notice, setNotice] = useState('');
  const [mobile, setMobile] = useState(false);
  const [nav, setNav] = useState<NavPage>('Overview');
  const [openMenu, setOpenMenu] = useState<'workspace' | 'profile' | 'time' | 'system' | null>(null);
  const [timeRange, setTimeRange] = useState('Last 60 min');
  const [compactMode, setCompactMode] = useState(false);
  const [showResolved, setShowResolved] = useState(true);

  useEffect(() => {
    if (!streaming) return;

    const timer = window.setInterval(() => {
      const choices = [
        ['API Gateway', 'Request latency sample received', 'Info', 120],
        ['Auth Service', 'Authentication health check completed', 'Info', 95],
        ['Payments', 'Retry rate crossed warning threshold', 'Warning', 640],
        ['Notification Worker', 'Queue processing delay detected', 'Warning', 410],
        ['Search Index', 'Index worker heartbeat received', 'Info', 80],
      ] as const;

      const sample = choices[Math.floor(Math.random() * choices.length)];
      const event: EventItem = {
        id: `EVT-${Math.floor(3000 + Math.random() * 6999)}`,
        service: sample[0],
        message: sample[1],
        severity: sample[2] as Severity,
        status: 'Investigating',
        time: 'Just now',
        latency: sample[3] + Math.floor(Math.random() * 120),
      };

      setEvents(old => [event, ...old].slice(0, 20));
      setMetrics(old => {
  const timestamp = Date.now();

  return [
    ...old.slice(1),
    {
      timestamp,
      time: new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      latency: event.latency,
    },
  ];
});
    }, 8000);

    return () => window.clearInterval(timer);
  }, [streaming]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filtered = useMemo(
    () => events.filter(event =>
      (!query || [event.id, event.service, event.message, event.status, event.severity]
        .some(value => value.toLowerCase().includes(query.toLowerCase()))) &&
      (severity === 'All' || event.severity === severity) &&
      (statusFilter === 'All' || event.status === statusFilter) &&
      (showResolved || event.status !== 'Resolved')
    ),
    [events, query, severity, statusFilter, showResolved]
  );

  const rangeMinutes =
  timeRange === 'Last 15 min' ? 15 :
  timeRange === 'Last 30 min' ? 30 :
  timeRange === 'Last 60 min' ? 60 : 180;

const chartMetrics = useMemo(() => {
  const cutoff = Date.now() - rangeMinutes * 60 * 1000;
  return metrics.filter(metric => metric.timestamp >= cutoff);
}, [metrics, rangeMinutes]);

const avg = chartMetrics.length
  ? Math.round(
      chartMetrics.reduce((sum, metric) => sum + metric.latency, 0) /
      chartMetrics.length
    )
  : 0;
  const warnings = events.filter(event => event.severity === 'Warning' && event.status !== 'Resolved').length;
  const critical = events.filter(event => event.severity === 'Critical' && event.status !== 'Resolved').length;

  

function updateEvent(event: EventItem, next: Status) {
  setEvents(old =>
    old.map(item =>
      item.id === event.id ? { ...item, status: next } : item
    )
  );

  setNotice(`${event.id} marked ${next.toLowerCase()}.`);
}



  function exportCSV() {
    const rows = [
      ['id', 'service', 'message', 'severity', 'status', 'time', 'latency'],
      ...filtered.map(event => [
        event.id, event.service, event.message, event.severity,
        event.status, event.time, String(event.latency),
      ]),
    ];

    const blob = new Blob(
      [rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')],
      { type: 'text/csv;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signalboard-events.csv';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Filtered event list exported as CSV.');
  }

  function goTo(page: NavPage) {
    setNav(page);
    setMobile(false);
    setOpenMenu(null);
  }

  function resetFilters() {
    setQuery('');
    setSeverity('All');
    setStatusFilter('All');
    setShowResolved(true);
  }

  return (
    <div className={`shell ${compactMode ? 'compact-mode' : ''}`}>
      <aside className={`sidebar ${mobile ? 'open' : ''}`}>
        <a className="brand" href="#overview" onClick={event => { event.preventDefault(); goTo('Overview'); }}>
          <span className="brand-icon"><Activity size={19} /></span>
          <span>signal<span className="muted-brand">board</span><small>OPERATIONS CLOUD</small></span>
        </a>

        <div className="eyebrow side-label">WORKSPACE</div>

        <div className="menu-anchor">
          <button
            className="workspace"
            aria-expanded={openMenu === 'workspace'}
            onClick={() => setOpenMenu(openMenu === 'workspace' ? null : 'workspace')}
          >
            <span className="workspace-icon">A</span>
            <span><b>Acme Systems</b><small>Starter workspace</small></span>
            <ChevronDown size={15} />
          </button>

          {openMenu === 'workspace' && (
            <div className="popup-menu">
              <b className="popup-title">Your workspaces</b>
              <button className="popup-option selected" onClick={() => { setNotice('Acme Systems workspace selected.'); setOpenMenu(null); }}>
                <span className="workspace-icon small-icon">A</span>
                <span>Acme Systems<small>Current workspace</small></span>
                <Check size={14} />
              </button>
              <button className="popup-option" onClick={() => { setNotice('This demo includes one workspace.'); setOpenMenu(null); }}>
                ＋ <span>Create workspace<small>Not available in this demo</small></span>
              </button>
            </div>
          )}
        </div>

        <nav>
          {navItems.map(({ label, Icon }) => (
            <button key={label} className={`nav-item ${nav === label ? 'active' : ''}`} onClick={() => goTo(label)}>
              <Icon size={17} />
              {label}
              {label === 'Alerts' && critical > 0 && <span className="count">{critical}</span>}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="stream-card">
            <Zap size={17} />
            <b>Monitoring status</b>
            <p>Demo stream is {streaming ? 'running' : 'paused'}.</p>
            <button onClick={() => setStreaming(value => !value)}>{streaming ? 'Pause stream' : 'Resume stream'}</button>
          </div>

          <div className="profile">
            <span className="avatar">RK</span>
            <span><b>Ratan Kalke</b><small>Frontend Engineer · Demo</small></span>
            <button className="icon-btn" aria-label="Open profile menu" onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}>
              <MoreHorizontal size={17} />
            </button>
          </div>

          {openMenu === 'profile' && (
            <div className="popup-menu profile-menu">
              <b className="popup-title">Demo profile</b>
              <div className="profile-summary">
                <span className="avatar">RK</span>
                <span><b>Ratan Kalke</b><small>Frontend Engineer · Demo</small></span>
              </div>
              <button className="popup-option" onClick={() => { goTo('Settings'); setNotice('Opened demo settings.'); }}>
                <Settings2 size={15} /> Settings
              </button>
              <button className="popup-option" onClick={() => { setNotice('This portfolio demo does not have sign-out.'); setOpenMenu(null); }}>
                <CircleUserRound size={15} /> Account information
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="main" id="overview">
        <header className="topbar">
          <button className="icon-btn mobile-menu" aria-label="Open navigation" onClick={() => setMobile(value => !value)}>
            <Menu size={19} />
          </button>

          <div className="crumb">Workspace <span>/</span> <b>{nav}</b></div>

          <div className="top-actions">
            <div className="menu-anchor">
              <button className="system" aria-expanded={openMenu === 'system'} onClick={() => setOpenMenu(openMenu === 'system' ? null : 'system')}>
                <i /> All systems operational <ChevronDown size={13} />
              </button>
              {openMenu === 'system' && (
                <div className="popup-menu top-popup">
                  <b className="popup-title">System status</b>
                  {serviceData.map(service => (
                    <div className="popup-status" key={service.name}>
                      <span>{service.name}</span>
                      <b className={service.status === 'Degraded' ? 'degraded-text' : ''}>{service.status}</b>
                    </div>
                  ))}
                  <small className="menu-footnote">Example status data only.</small>
                </div>
              )}
            </div>

            <button className="icon-btn" aria-label="Help" onClick={() => setNotice('SignalBoard uses simulated local events. No production services are connected.')}>
              <CircleHelp size={18} />
            </button>
            <button className="icon-btn" aria-label="Notifications" onClick={() => goTo('Alerts')}>
              <Bell size={18} />
            </button>
            <span className="avatar">RK</span>
          </div>
        </header>

        <div className="content">
          <div className="heading">
            <div>
              <div className="eyebrow"><span className="eyeline" /> LIVE OPERATIONS OVERVIEW</div>
              <h1>{nav === 'Overview' ? 'Good evening, Ratan' : nav}</h1>
              <p>{pageDescription(nav)}</p>
            </div>

            <div className="heading-actions">
              <span className={`live ${streaming ? '' : 'paused'}`}><i />{streaming ? 'LIVE DEMO' : 'STREAM PAUSED'}</span>
              <button className="primary" onClick={exportCSV}><Download size={15} /> Export events</button>
            </div>
          </div>

          {nav === 'Overview' && (
            <>
              <div className="demo-note">
                <Radio size={16} />
                <span><b>Interactive demo environment</b> · Metrics and events are simulated locally; no production services are connected.</span>
                <button aria-label="About demo" onClick={() => setNotice('No external services or personal data are connected in this demo.')}><CircleHelp size={15} /></button>
              </div>

              <section className="metrics" aria-label="Service metrics">
                <Metric title="Avg. response time" value={`${avg} ms`} change="12.8%" foot="vs. previous window" tone="blue" icon={<Gauge size={18} />} />
                <Metric title="Error rate" value="0.42%" change="0.08%" foot="vs. previous window" tone="purple" icon={<Activity size={18} />} />
                <Metric title="Active warnings" value={String(warnings).padStart(2, '0')} change="Live feed" foot="in the current feed" tone="amber" icon={<AlertTriangle size={18} />} />
                <Metric title="Unresolved critical" value={String(critical).padStart(2, '0')} change={critical ? 'Needs review' : 'All clear'} foot="across monitored services" tone="green" icon={<ShieldCheck size={18} />} />
              </section>

              <section className="two-col">
                <article className="panel chart-panel">
                  <div className="panel-head">
                    <div><h2>Response time</h2><p>Average service latency over recent samples</p></div>
                    <div className="menu-anchor">
                      <button className="select" aria-expanded={openMenu === 'time'} onClick={() => setOpenMenu(openMenu === 'time' ? null : 'time')}>
                        {timeRange} <ChevronDown size={13} />
                      </button>
                      {openMenu === 'time' && (
                        <div className="popup-menu time-popup">
                          <b className="popup-title">Chart time range</b>
                          {['Last 15 min', 'Last 30 min', 'Last 60 min', 'Last 3 hours'].map(range => (
                            <button key={range} className={`popup-option ${timeRange === range ? 'selected' : ''}`} onClick={() => { setTimeRange(range); setOpenMenu(null); setNotice(`Chart range set to ${range}.`); }}>
                              {range}{timeRange === range && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="legend"><i /> Latency <span>Milliseconds (ms)</span></div>
                  <div className="chart" role="img" aria-label="Area chart of recent simulated response time in milliseconds">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartMetrics} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                        <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b80ff" stopOpacity={0.25} /><stop offset="95%" stopColor="#8b80ff" stopOpacity={0.01} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#283142" />
                        <XAxis dataKey="time" tick={{ fill: '#8792a6', fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={25} />
                        <YAxis tick={{ fill: '#8792a6', fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#171e2b', border: '1px solid #30394c', borderRadius: 9, color: '#f4f6fc', fontSize: 12 }} />
                        <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#8b80ff" strokeWidth={2.5} fill="url(#fill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-foot"><span><i /> Within target range</span><span>Target: &lt; 350 ms</span></div>
                </article>

                <article className="panel service-panel">
                  <div className="panel-head"><div><h2>Service health</h2><p>Current status by service</p></div><button className="text-button" onClick={() => goTo('Services')}>View all <ArrowUpRight size={14} /></button></div>
                  <ServiceList onSelect={() => goTo('Services')} />
                  <div className="service-foot"><span><i /> 4 operational</span><span><i className="amber-dot" /> 1 degraded</span></div>
                </article>
              </section>

              <EventTable
                events={filtered.slice(0, 8)}
                total={filtered.length}
                query={query}
                setQuery={setQuery}
                severity={severity}
                setSeverity={setSeverity}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onUpdate={updateEvent}
                onExport={exportCSV}
                onViewAll={() => goTo('Event Explorer')}
                onClear={resetFilters}
              />
            </>
          )}

          {nav === 'Event Explorer' && (
            <EventTable
              events={filtered}
              total={filtered.length}
              query={query}
              setQuery={setQuery}
              severity={severity}
              setSeverity={setSeverity}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onUpdate={updateEvent}
              onExport={exportCSV}
              onClear={resetFilters}
              showStatusFilter
            />
          )}

          {nav === 'Services' && (
            <section className="panel full-page-panel">
              <div className="section-intro">
                <div><h2>Monitored services</h2><p>Demo health and uptime summaries for each example service.</p></div>
                <span className="severity info">{serviceData.length} services</span>
              </div>
              <div className="service-grid">
                {serviceData.map(service => (
                  <article className="service-card" key={service.name}>
                    <div className="service-card-top">
                      <span className={`service-icon ${service.color}`}>{service.initials}</span>
                      <span className={`service-status ${service.status === 'Degraded' ? 'degraded' : ''}`}><i />{service.status}</span>
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-card-foot"><span>Reported uptime</span><b>{service.uptime}</b></div>
                    <button className="text-button" onClick={() => {
                      setQuery(service.name === 'Authentication' ? 'Auth Service' : service.name === 'Payment Service' ? 'Payments' : service.name === 'Notifications' ? 'Notification' : service.name);
                      goTo('Event Explorer');
                    }}>View related events <ArrowUpRight size={13} /></button>
                  </article>
                ))}
              </div>
              <p className="section-note"><CircleHelp size={14} /> Service names, uptime figures and statuses are illustrative demo data, not live monitoring.</p>
            </section>
          )}

          {nav === 'Alerts' && (
            <>
              <section className="metrics" aria-label="Alert summary">
                <Metric title="Unresolved critical" value={String(critical)} change="Priority" foot="review these first" tone="purple" icon={<AlertTriangle size={18} />} />
                <Metric title="Unresolved warnings" value={String(warnings)} change="Attention" foot="currently active" tone="amber" icon={<Bell size={18} />} />
                <Metric title="Resolved events" value={String(events.filter(event => event.status === 'Resolved').length)} change="Complete" foot="in current feed" tone="green" icon={<CheckCircle2 size={18} />} />
                <Metric title="Stream" value={streaming ? 'Running' : 'Paused'} change="Demo" foot="local simulated activity" tone="blue" icon={<Radio size={18} />} />
              </section>
              <div className="alert-banner">
                <AlertTriangle size={20} />
                <div><b>Demo alerts are not sent externally</b><p>Use the event actions below to cycle an event through Investigating, Acknowledged and Resolved.</p></div>
                <button className="primary" onClick={() => setStreaming(value => !value)}>{streaming ? 'Pause stream' : 'Resume stream'}</button>
              </div>
              <EventTable
                events={filtered.filter(event => event.status !== 'Resolved')}
                total={filtered.filter(event => event.status !== 'Resolved').length}
                query={query}
                setQuery={setQuery}
                severity={severity}
                setSeverity={setSeverity}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onUpdate={updateEvent}
                onExport={exportCSV}
                onClear={resetFilters}
                showStatusFilter
              />
            </>
          )}

          {nav === 'Settings' && (
            <section className="panel full-page-panel settings-panel">
              <div className="section-intro"><div><h2>Workspace settings</h2><p>Change how this demo dashboard behaves in your browser.</p></div><SlidersHorizontal size={20} /></div>

              <div className="settings-row">
                <div><b>Simulated event stream</b><p>Generate a new example event approximately every eight seconds.</p></div>
                <button className={`toggle ${streaming ? 'on' : ''}`} role="switch" aria-checked={streaming} onClick={() => setStreaming(value => !value)}><span /></button>
              </div>

              <div className="settings-row">
                <div><b>Show resolved events</b><p>Include resolved items in Event Explorer and the Overview list.</p></div>
                <button className={`toggle ${showResolved ? 'on' : ''}`} role="switch" aria-checked={showResolved} onClick={() => setShowResolved(value => !value)}><span /></button>
              </div>

              <div className="settings-row">
                <div><b>Compact dashboard spacing</b><p>Reduce some spacing to fit more information on screen.</p></div>
                <button className={`toggle ${compactMode ? 'on' : ''}`} role="switch" aria-checked={compactMode} onClick={() => setCompactMode(value => !value)}><span /></button>
              </div>

              <div className="settings-row">
                <div><b>Reset filters</b><p>Clear search, severity and status filters.</p></div>
                <button className="secondary-button" onClick={() => { resetFilters(); setNotice('Filters have been reset.'); }}>Reset filters</button>
              </div>

              <div className="settings-row">
                <div><b>Export event data</b><p>Download the currently filtered events as a CSV file.</p></div>
                <button className="secondary-button" onClick={exportCSV}><Download size={14} /> Export CSV</button>
              </div>

              <div className="demo-note settings-note"><CircleHelp size={16} /><span>These preferences are temporary and reset when the page is reloaded. This demo has no user accounts or production connection.</span></div>
            </section>
          )}

          <footer className="footer">
            <span>© 2026 SignalBoard · Independent portfolio project</span>
            <span><i /> Demo systems · Built with React + TypeScript</span>
          </footer>
        </div>
      </main>

      {mobile && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobile(false)} />}

      {notice && <div className="toast" role="status"><Check size={16} />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={15} /></button></div>}
    </div>
  );
}

function pageDescription(page: NavPage) {
  const descriptions: Record<NavPage, string> = {
    Overview: 'Here’s what’s happening across your services today.',
    'Event Explorer': 'Search, filter and review the events in your demo feed.',
    Services: 'Review the status and example uptime of each service.',
    Alerts: 'Review unresolved events that may need attention.',
    Settings: 'Adjust the dashboard’s local demo preferences.',
  };
  return descriptions[page];
}

function Metric({ title, value, change, foot, tone, icon }: {
  title: string;
  value: string;
  change: string;
  foot: string;
  tone: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="metric">
      <div className="metric-top"><span>{title}</span><span className={`metric-icon ${tone}`}>{icon}</span></div>
      <strong>{value}</strong>
      <div className="metric-bottom">
        <b className={tone === 'amber' ? 'caution' : 'positive'}>
          {tone === 'amber' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {change}
        </b>
        <span>{foot}</span>
      </div>
    </article>
  );
}

function ServiceList({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="service-list">
      {serviceData.map(service => (
        <button className="service-row service-row-button" key={service.name} onClick={onSelect}>
          <span className={`service-icon ${service.color}`}>{service.initials}</span>
          <span className="service-info"><b>{service.name}</b><small>{service.uptime}</small></span>
          <span className={`service-status ${service.status === 'Degraded' ? 'degraded' : ''}`}><i />{service.status}</span>
        </button>
      ))}
    </div>
  );
}


function EventTable({
  events,
  total,
  query,
  setQuery,
  severity,
  setSeverity,
  statusFilter = 'All',
  setStatusFilter,
  onUpdate,
  onExport,
  onViewAll,
  onClear,
  showStatusFilter = false,
}: {
  events: EventItem[];
  total: number;
  query: string;
  setQuery: (value: string) => void;
  severity: string;
  setSeverity: (value: string) => void;
  statusFilter?: string;
  setStatusFilter?: (value: string) => void;
  onUpdate: (event: EventItem, next: Status) => void;
  onExport: () => void;
  onViewAll?: () => void;
  onClear: () => void;
  showStatusFilter?: boolean;
}) {
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  return (
    <section className="panel events-panel">
      <div className="events-head">
        <div>
          <h2>
            {showStatusFilter ? 'Alert event queue' : 'Recent events'}{' '}
            <span className="pill-count">{total}</span>
          </h2>
          <p>
            {showStatusFilter
              ? 'Update event status as issues are reviewed.'
              : 'Review and triage activity across your environment.'}
          </p>
        </div>

        <div className="event-controls">
          <label className="search">
            <Search size={15} />
            <input
              aria-label="Search events"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search events..."
            />
          </label>

          <label className="filter">
            <Filter size={14} />
            <select
              aria-label="Filter by severity"
              value={severity}
              onChange={event => setSeverity(event.target.value)}
            >
              <option>All</option>
              <option>Critical</option>
              <option>Warning</option>
              <option>Info</option>
            </select>
          </label>

          {showStatusFilter && setStatusFilter && (
            <label className="filter">
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={event => setStatusFilter(event.target.value)}
              >
                <option>All</option>
                <option>Investigating</option>
                <option>Acknowledged</option>
                <option>Resolved</option>
              </select>
            </label>
          )}

          <button
            className="icon-btn"
            aria-label="Export event log"
            onClick={onExport}
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>EVENT</th>
              <th>SERVICE</th>
              <th>SEVERITY</th>
              <th>TIME</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>
                  <div className="event-title">
                    <i className={event.severity.toLowerCase()} />
                    <span>
                      <b>{event.message}</b>
                      <small>{event.id}</small>
                    </span>
                  </div>
                </td>

                <td>{event.service}</td>

                <td>
                  <span className={`severity ${event.severity.toLowerCase()}`}>
                    {event.severity}
                  </span>
                </td>

                <td className="time">
                  <Clock3 size={12} />
                  {event.time}
                </td>

                <td>
                  <span className={`status ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </td>

                <td>
                  <div className="menu-anchor event-action-anchor">
                    <button
                      className="row-action"
                      aria-label={`Actions for ${event.id}`}
                      aria-expanded={openActionId === event.id}
                      title="Event actions"
                      onClick={() =>
                        setOpenActionId(current =>
                          current === event.id ? null : event.id
                        )
                      }
                    >
                      <MoreHorizontal size={17} />
                    </button>

                    {openActionId === event.id && (
                      <div className="popup-menu event-action-menu">
                        <b className="popup-title">Update event</b>

                        {(
                          [
                            'Investigating',
                            'Acknowledged',
                            'Resolved',
                          ] as Status[]
                        ).map(status => (
                          <button
                            key={status}
                            className={`popup-option ${
                              event.status === status ? 'selected' : ''
                            }`}
                            disabled={event.status === status}
                            onClick={() => {
                              onUpdate(event, status);
                              setOpenActionId(null);
                            }}
                          >
                            <span>{status}</span>
                            {event.status === status && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && (
          <div className="empty">
            <Search size={23} />
            <b>No matching events</b>
            <p>Try another search term or filter.</p>
            <button className="text-button" onClick={onClear}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="table-foot">
        <span>
          Showing {events.length} of {total} matching events
        </span>

        <div className="table-foot-actions">
          {onViewAll && (
            <button className="text-button" onClick={onViewAll}>
              View all events <ArrowUpRight size={14} />
            </button>
          )}

          <button className="text-button" onClick={onExport}>
            Export CSV <ArrowDownRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
