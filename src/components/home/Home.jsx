/**
 * Dashboard.jsx — EduCore School Management System
 * Direct React conversion of the single-file HTML prototype.
 * Every element, class, interaction and data point is preserved.
 *
 * Setup (Vite):
 *   npm create vite@latest sms -- --template react
 *   Place Dashboard.jsx + Dashboard.css in src/components/
 *   In src/App.jsx: import Dashboard from './components/Dashboard'
 */

import { useState, useEffect } from 'react';
import './Home.css';

// ── Static data ──────────────────────────────────────────────

const ATTENDANCE = [
  { day:'Mon', present:1720, absent:122 },
  { day:'Tue', present:1695, absent:147 },
  { day:'Wed', present:1748, absent:94  },
  { day:'Thu', present:1680, absent:162 },
  { day:'Fri', present:1730, absent:112 },
];

const FEE_ROWS = [
  { label:'Paid in Full',    sub:'Students cleared', val:'1,214', dot:'#1A7F8E'       },
  { label:'Partial Payment', sub:'Installment plan', val:'382',   dot:'var(--gold)'   },
  { label:'Overdue',         sub:'Action required',  val:'246',   dot:'var(--rose)'   },
  { label:'Scholarship',     sub:'Fee waived',        val:'89',   dot:'#9CA3AF'       },
];

const STUDENTS = [
  { init:'AK', name:'Arjun Kumar',  id:'#STU-2024-1842', grade:'Grade 9 – A',  status:'active',   bg:'#EBF5FF',          fg:'#1B5FA8'         },
  { init:'PS', name:'Priya Sharma', id:'#STU-2024-1841', grade:'Grade 11 – B', status:'active',   bg:'var(--green-lite)',fg:'var(--green)'    },
  { init:'MR', name:'Meera Reddy',  id:'#STU-2024-1840', grade:'Grade 6 – C',  status:'pending',  bg:'var(--gold-lite)', fg:'#7a4e00'         },
  { init:'RS', name:'Rahul Singh',  id:'#STU-2024-1839', grade:'Grade 8 – A',  status:'active',   bg:'var(--rose-lite)', fg:'var(--rose)'     },
  { init:'NP', name:'Nisha Patel',  id:'#STU-2024-1838', grade:'Grade 10 – A', status:'inactive', bg:'#F3E8FF',          fg:'#7C3AED'         },
];

const EVENTS = [
  { day:'24', month:'Apr', title:'Parent-Teacher Meeting',  meta:'2:00 PM – 5:00 PM • Main Hall',     color:'var(--teal)'      },
  { day:'28', month:'Apr', title:'Unit Test — All Classes', meta:'9:00 AM – 12:00 PM • Classrooms',   color:'var(--gold)'      },
  { day:'02', month:'May', title:'Annual Sports Day',       meta:'7:00 AM – 4:00 PM • Ground',        color:'var(--green)'     },
  { day:'10', month:'May', title:'Fee Due Date — Term 2',   meta:'All day • Finance Office',           color:'var(--rose)'      },
  { day:'15', month:'May', title:'Board Exam Briefing',     meta:'10:00 AM – 11:30 AM • Auditorium',  color:'var(--navy-lite)' },
];

const INIT_TASKS = [
  { id:1, text:'Update Grade 10 timetable',   done:true,  bg:'var(--green-lite)', fg:'var(--green)', label:'Done'      },
  { id:2, text:'Send fee reminders (Apr)',     done:true,  bg:'var(--green-lite)', fg:'var(--green)', label:'Done'      },
  { id:3, text:'Review staff leave requests', done:true,  bg:'var(--green-lite)', fg:'var(--green)', label:'Done'      },
  { id:4, text:'Approve 5 new admissions',    done:false, bg:'var(--gold-lite)',  fg:'#7a4e00',      label:'Urgent'    },
  { id:5, text:'Upload exam schedule PDF',     done:false, bg:'var(--gold-lite)',  fg:'#7a4e00',      label:'Today'     },
  { id:6, text:'Print PTM attendance sheets', done:false, bg:'var(--teal-lite)',  fg:'var(--teal)',  label:'This week' },
  { id:7, text:'Setup Term 2 fee structure',  done:false, bg:'var(--slate)',      fg:'var(--muted)', label:'Pending'   },
];

// ── Sidebar ──────────────────────────────────────────────────

function Sidebar({ active, setActive }) {
  const NavBtn = ({ id, badge, children }) => (
    <button
      className={'nav-item' + (active === id ? ' active' : '')}
      onClick={() => setActive(id)}
    >
      {children}
      {badge && <span className="nav-badge">{badge}</span>}
    </button>
  );

  return (
    <aside className="sidebar">
      <a href="#" className="sidebar-logo">
        <div className="logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="logo-text">Edu<span>Core</span></span>
      </a>

      <div className="sidebar-section">
        <span className="sidebar-label">Main Menu</span>
        <NavBtn id="dashboard">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          Dashboard
        </NavBtn>
        <NavBtn id="students" badge="1,842">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          Students
        </NavBtn>
        <NavBtn id="teachers">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>
          </svg>
          Teachers
        </NavBtn>
        <NavBtn id="academics">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
          Academics
        </NavBtn>
        <NavBtn id="timetable">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Timetable
        </NavBtn>
        <NavBtn id="finance">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          Finance
        </NavBtn>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">Reports</span>
        <NavBtn id="exams" badge="3">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
          </svg>
          Exam Results
        </NavBtn>
        <NavBtn id="attendance-report">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          Attendance
        </NavBtn>
        <NavBtn id="analytics">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14M12 2v2M12 20v2M2 12h2M20 12h2"/>
          </svg>
          Analytics
        </NavBtn>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">System</span>
        <NavBtn id="settings">
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M4.93 4.93a10 10 0 000 14.14"/>
          </svg>
          Settings
        </NavBtn>
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">AS</div>
          <div>
            <div className="user-name">Admin Staff</div>
            <div className="user-role">School Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Topbar ───────────────────────────────────────────────────

function Topbar() {
  const [date, setDate] = useState('');
  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-IN', {
      weekday:'short', day:'numeric', month:'short', year:'numeric'
    }));
  }, []);

  return (
    <header className="topbar">
      <div>
        <div className="page-title">Dashboard</div>
        <div className="breadcrumb">Academic Year 2026–27</div>
      </div>
      <div className="topbar-right">
        <div className="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search students, classes..."/>
        </div>
        {date && <span className="date-chip">{date}</span>}
        <div className="icon-btn" data-tip="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="notif-dot"/>
        </div>
        <div className="icon-btn" data-tip="Messages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>
        <div className="avatar topbar-avatar">AS</div>
      </div>
    </header>
  );
}

// ── Welcome banner ───────────────────────────────────────────

function WelcomeBanner() {
  return (
    <div className="welcome-banner animate">
      <div className="welcome-text">
        <h2>Good morning, Administrator 👋</h2>
        <p>Here's an overview of your school's performance today. 3 pending tasks need your attention.</p>
      </div>
      <div className="welcome-actions">
        <button className="btn btn-ghost">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          </svg>
          View Reports
        </button>
        <button className="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Student
        </button>
      </div>
    </div>
  );
}

// ── KPI stat cards ───────────────────────────────────────────

const STAT_DEFS = [
  {
    id:'students', value:'1,842', label:'Total Students', cls:'blue', dir:'up', trend:'+4.6% this term',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    trendIcon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  {
    id:'teachers', value:'124', label:'Teaching Staff', cls:'green', dir:'up', trend:'+2 this month',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>,
    trendIcon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  {
    id:'attendance', value:'94.2%', label:'Attendance Rate', cls:'gold', dir:'neu', trend:'Stable this week',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
    trendIcon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  },
  {
    id:'fees', value:'₹4.8L', label:'Fees Collected', cls:'rose', dir:'down', trend:'₹1.2L pending',
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
    trendIcon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  },
];

function StatsGrid() {
  return (
    <div className="stats-grid">
      {STAT_DEFS.map((s, i) => (
        <div key={s.id} className={`stat-card animate delay-${i + 1}`}>
          <div className={`stat-icon ${s.cls}`}>{s.icon}</div>
          <div className="stat-info">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <span className={`stat-trend ${s.dir}`}>{s.trendIcon}{s.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Attendance chart ─────────────────────────────────────────

function AttendanceChart() {
  const max = Math.max(...ATTENDANCE.map(d => d.present + d.absent));
  return (
    <div className="card animate delay-3">
      <div className="card-header">
        <div>
          <div className="card-title">Weekly Attendance</div>
          <div className="card-subtitle">Present vs Absent — Current Week</div>
        </div>
        <a href="#" className="card-action">View Full Report</a>
      </div>
      <div className="card-body">
        <div className="chart-bars">
          {ATTENDANCE.map(d => (
            <div key={d.day} className="bar-group"
                 data-tip={`${d.day}: ${d.present} present, ${d.absent} absent`}>
              <div className="bar-wrap">
                <div className="bar present" style={{height:`${(d.present/max)*100}%`}}/>
                <div className="bar absent"  style={{height:`${(d.absent/max)*100}%`}}/>
              </div>
              <span className="bar-label">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{background:'var(--teal)'}}/>Present
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:'var(--rose-lite)'}}/>Absent
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Fee collection card ──────────────────────────────────────

function FeeCard() {
  return (
    <div className="card animate delay-4">
      <div className="card-header">
        <div>
          <div className="card-title">Fee Collection</div>
          <div className="card-subtitle">Term 1, 2024–25</div>
        </div>
      </div>
      <div className="progress-ring">
        <div className="ring-wrap">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#E2E8F2" strokeWidth="7"/>
            <circle cx="32" cy="32" r="26" fill="none" stroke="var(--teal)"
                    strokeWidth="7" strokeLinecap="round"
                    strokeDasharray="163.36" strokeDashoffset="40.84"/>
          </svg>
          <div className="ring-text">75%</div>
        </div>
        <div>
          <div style={{fontSize:15,fontWeight:600}}>₹4,80,000</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Collected of ₹6,40,000 target</div>
          <div style={{fontSize:11.5,color:'var(--rose)',marginTop:4,fontWeight:500}}>
            ₹1,20,000 outstanding
          </div>
        </div>
      </div>
      <div className="quick-stats">
        {FEE_ROWS.map(r => (
          <div key={r.label} className="quick-stat-item">
            <div className="qs-left">
              <div className="qs-dot" style={{background:r.dot}}/>
              <div><div className="qs-name">{r.label}</div><div className="qs-sub">{r.sub}</div></div>
            </div>
            <div className="qs-val">{r.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Students table ───────────────────────────────────────────

function StudentsTable() {
  const pill = {active:'pill-active',pending:'pill-pending',inactive:'pill-inactive'};
  const lbl  = {active:'Active',pending:'Pending',inactive:'Hold'};
  return (
    <div className="card animate delay-5">
      <div className="card-header">
        <div>
          <div className="card-title">Recent Admissions</div>
          <div className="card-subtitle">Last 30 days</div>
        </div>
        <a href="#" className="card-action">All Students</a>
      </div>
      <table className="table">
        <thead><tr><th>Student</th><th>Class</th><th>Status</th></tr></thead>
        <tbody>
          {STUDENTS.map(s => (
            <tr key={s.id}>
              <td>
                <div className="student-cell">
                  <div className="student-av" style={{background:s.bg,color:s.fg}}>{s.init}</div>
                  <div>
                    <div className="student-name">{s.name}</div>
                    <div className="student-id">{s.id}</div>
                  </div>
                </div>
              </td>
              <td>{s.grade}</td>
              <td><span className={`status-pill ${pill[s.status]}`}>{lbl[s.status]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Upcoming events ──────────────────────────────────────────

function EventsCard() {
  return (
    <div className="card animate delay-5">
      <div className="card-header">
        <div>
          <div className="card-title">Upcoming Events</div>
          <div className="card-subtitle">Next 30 days</div>
        </div>
        <a href="#" className="card-action">Full Calendar</a>
      </div>
      {EVENTS.map(ev => (
        <div key={ev.title} className="event-item">
          <div className="event-date">
            <div className="event-day">{ev.day}</div>
            <div className="event-month">{ev.month}</div>
          </div>
          <div className="event-divider" style={{background:ev.color}}/>
          <div>
            <div className="event-title">{ev.title}</div>
            <div className="event-meta">{ev.meta}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Pending tasks ────────────────────────────────────────────

function TasksCard() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const remaining = tasks.filter(t => !t.done).length;

  const toggle = id => setTasks(prev => prev.map(t =>
    t.id === id
      ? {...t, done:true, bg:'var(--green-lite)', fg:'var(--green)', label:'Done'}
      : t
  ));

  return (
    <div className="card animate delay-6">
      <div className="card-header">
        <div>
          <div className="card-title">Pending Tasks</div>
          <div className="card-subtitle">{remaining} of {tasks.length} remaining</div>
        </div>
        <a href="#" className="card-action">Manage</a>
      </div>
      {tasks.map(t => (
        <div key={t.id} className="task-item" onClick={() => toggle(t.id)}>
          <div className={'task-check' + (t.done ? ' done' : '')}>
            {t.done && (
              <svg className="task-check-icon" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
          <span className={'task-text' + (t.done ? ' done' : '')}>{t.text}</span>
          <span className="task-tag" style={{background:t.bg,color:t.fg}}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Root component ───────────────────────────────────────────

export default function Dashboard() {
  const [active, setActive] = useState('dashboard');
  return (
    <>
      <Sidebar active={active} setActive={setActive}/>
      <main className="main">
        <Topbar/>
        <div className="content">
          <WelcomeBanner/>
          <StatsGrid/>
          <div className="middle-row">
            <AttendanceChart/>
            <FeeCard/>
          </div>
          <div className="bottom-row">
            <StudentsTable/>
            <EventsCard/>
            <TasksCard/>
          </div>
        </div>
      </main>
    </>
  );
}