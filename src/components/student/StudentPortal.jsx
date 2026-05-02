/**
 * StudentPortal.jsx — EduCore Student Portal
 * 12 Sections: Overview · Timetable · Assignments · Library
 *              Events · Attendance · Fees · Announcements
 *              My Subjects · Gallery · Exam Reports
 *
 * Usage:
 *   import StudentPortal from './components/StudentPortal';
 *   import './components/StudentPortal.css';  // or adjust path
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./StudentPortal.css";

/* ── tiny icon helper ───────────────────────────────────────── */
const Ic = ({ size = 16, children, ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       style={{ width: size, height: size, flexShrink: 0 }} {...rest}>
    {children}
  </svg>
);

/* ================================================================
   STATIC DATA
   ================================================================ */

const TABS = [
  { id: 'overview',      label: 'Overview',      badge: null },
  { id: 'timetable',     label: 'Timetable',      badge: null },
  { id: 'assignments',   label: 'Assignments',    badge: '3'  },
  { id: 'library',       label: 'Library',        badge: null },
  { id: 'events',        label: 'Events',         badge: null },
  { id: 'attendance',    label: 'Attendance',     badge: null },
  { id: 'fees',          label: 'Fees',           badge: '1'  },
  { id: 'announcements', label: 'Announcements',  badge: '5'  },
  { id: 'subjects',      label: 'My Subjects',    badge: null },
  { id: 'gallery',       label: 'Gallery',        badge: null },
  { id: 'exams',         label: 'Exam Reports',   badge: null },
];

const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview'       },
  { id: 'timetable',     label: 'Timetable'      },
  { id: 'assignments',   label: 'Assignments', badge: '3' },
  { id: 'library',       label: 'Library'        },
  { id: 'events',        label: 'Events'         },
  { id: 'attendance',    label: 'Attendance'     },
  { id: 'fees',          label: 'Fees', badge: '1' },
  { id: 'announcements', label: 'Announcements', badge: '5' },
  { id: 'subjects',      label: 'My Subjects'    },
  { id: 'gallery',       label: 'Gallery'        },
  { id: 'exams',         label: 'Exam Reports'   },
];

// Assignments
const ASSIGNMENTS = [
  { id:1, subject:'Mathematics', title:'Quadratic Equations Problem Set', due:'Apr 25, 2025', status:'pending',   color:'var(--indigo-lite)', iconBg:'ic-indigo', score:null    },
  { id:2, subject:'English',     title:'Essay: Impact of Technology',     due:'Apr 28, 2025', status:'submitted', color:'var(--amber)',       iconBg:'ic-amber',  score:null    },
  { id:3, subject:'Science',     title:'Lab Report — Titration',          due:'Apr 22, 2025', status:'graded',    color:'var(--teal)',        iconBg:'ic-teal',   score:'18/20' },
  { id:4, subject:'Computer',    title:'Python OOP Assignment',           due:'Apr 20, 2025', status:'late',      color:'var(--rose)',        iconBg:'ic-rose',   score:null    },
  { id:5, subject:'Social Sci.', title:'History Map Activity',            due:'May 2, 2025',  status:'pending',   color:'var(--green)',       iconBg:'ic-green',  score:null    },
  { id:6, subject:'Physics',     title:'Newton Laws Worksheet',         due:'Apr 30, 2025', status:'submitted', color:'var(--sky)',         iconBg:'ic-sky',    score:null    },
];

// Library
const BOOKS = [
  { title:'Physics Fundamentals', author:'H.C. Verma',     color:'#818CF8', status:'issued',    cover:'📘' },
  { title:'Rich Dad Poor Dad',    author:'R. Kiyosaki',    color:'#34D399', status:'available', cover:'📗' },
  { title:'Wings of Fire',        author:'A.P.J. Abdul',   color:'#FCA5A5', status:'issued',    cover:'📕' },
  { title:'Clean Code',           author:'R. C. Martin',   color:'#FDBA74', status:'available', cover:'📙' },
  { title:'The Alchemist',        author:'Paulo Coelho',   color:'#A78BFA', status:'available', cover:'📓' },
  { title:'Organic Chemistry',    author:'R.K. Gupta',     color:'#6EE7B7', status:'due',       cover:'📒' },
  { title:'Brief History of Time',author:'S. Hawking',     color:'#93C5FD', status:'available', cover:'📔' },
  { title:'Data Structures',      author:'Cormen et al.',  color:'#FDE68A', status:'available', cover:'📃' },
];

// Events
const EVENTS = [
  { day:'24', month:'Apr', title:'Parent-Teacher Meeting',    meta:'2:00 PM – 5:00 PM • Main Hall',      color:'var(--indigo)', bg:'var(--indigo-pale)', tag:'Academic', tagBg:'var(--indigo-pale)', tagFg:'var(--indigo)' },
  { day:'28', month:'Apr', title:'Unit Test — All Classes',   meta:'9:00 AM – 12:00 PM • Classrooms',    color:'var(--amber)',  bg:'var(--amber-pale)',  tag:'Exam',     tagBg:'var(--amber-pale)',  tagFg:'var(--amber)'  },
  { day:'02', month:'May', title:'Annual Sports Day',         meta:'7:00 AM – 4:00 PM • Ground',         color:'var(--green)', bg:'var(--green-lite)',  tag:'Sports',   tagBg:'var(--green-lite)',  tagFg:'var(--green)'  },
  { day:'10', month:'May', title:'Science Exhibition',        meta:'10:00 AM – 3:00 PM • Auditorium',    color:'var(--teal)',  bg:'var(--teal-lite)',   tag:'Science',  tagBg:'var(--teal-lite)',   tagFg:'var(--teal)'   },
  { day:'15', month:'May', title:'Board Exam Briefing',       meta:'10:00 AM – 11:30 AM • Lecture Hall', color:'var(--rose)',  bg:'var(--rose-lite)',   tag:'Urgent',   tagBg:'var(--rose-lite)',   tagFg:'var(--rose)'   },
  { day:'20', month:'May', title:'Inter-school Debate',       meta:'1:00 PM – 4:00 PM • Auditorium',     color:'var(--violet)',bg:'var(--violet-lite)', tag:'Cultural', tagBg:'var(--violet-lite)', tagFg:'var(--violet)' },
];

// Attendance — April 2025 (30 days, 1-based)
const ATT_MONTH = 'April 2025';
const ATT_DATA  = [
  'weekend','present','present','present','present','weekend',
  'weekend','present','absent','present','present','present','weekend',
  'weekend','present','present','holiday','present','present','weekend',
  'weekend','present','present','present','absent','present','weekend',
  'weekend','present','today',
];

// Fees
const FEES = [
  { name:'Tuition Fee',    due:'May 10, 2025', amount:'₹8,500',  status:'paid',    icon:'ic-indigo', paid:8500, total:8500 },
  { name:'Transport Fee',  due:'May 10, 2025', amount:'₹2,200',  status:'paid',    icon:'ic-teal',   paid:2200, total:2200 },
  { name:'Lab Fee',        due:'May 15, 2025', amount:'₹1,500',  status:'pending', icon:'ic-amber',  paid:0,    total:1500 },
  { name:'Library Fee',    due:'May 30, 2025', amount:'₹500',    status:'pending', icon:'ic-violet', paid:0,    total:500  },
  { name:'Activity Fund',  due:'Jun 1, 2025',  amount:'₹800',    status:'pending', icon:'ic-orange', paid:0,    total:800  },
  { name:'Exam Fee',       due:'Jun 10, 2025', amount:'₹1,200',  status:'pending', icon:'ic-rose',   paid:0,    total:1200 },
];

// Announcements
const ANNOUNCEMENTS = [
  { id:1, title:'Holiday on 14th April — Ambedkar Jayanti', body:'School will remain closed on Monday, 14th April 2025 on account of Dr. B.R. Ambedkar Jayanti.', time:'2 hours ago',   priority:'info',   dot:'#6366F1' },
  { id:2, title:'Exam Schedule Released — May 2025',         body:'Unit tests commence from May 1st. Download the timetable from the portal under Exam Reports.', time:'1 day ago',    priority:'high',   dot:'#E11D48' },
  { id:3, title:'Sports Day Registration Open',              body:'Students interested in participating in Annual Sports Day must register by April 30, 2025.',   time:'2 days ago',   priority:'medium', dot:'#D97706' },
  { id:4, title:'Library Hours Extended',                    body:'The school library will now be open till 6:00 PM on weekdays to support exam preparation.',      time:'3 days ago',   priority:'low',    dot:'#059669' },
  { id:5, title:'Parent-Teacher Meeting Reminder',           body:'PTM is scheduled for April 24th from 2 PM–5 PM. Please confirm attendance via the school app.',  time:'4 days ago',   priority:'medium', dot:'#D97706' },
];

// Subjects
const SUBJECTS = [
  { name:'Mathematics',    teacher:'Mr. R. Sharma',   grade:'A+', percent:96, color:'var(--indigo-mid)',  iconBg:'ic-indigo', barColor:'#4338CA', accent:'#4338CA' },
  { name:'Science',        teacher:'Mrs. P. Verma',   grade:'A',  percent:88, color:'var(--teal)',        iconBg:'ic-teal',   barColor:'#0D9488', accent:'#0D9488' },
  { name:'English',        teacher:'Ms. N. Kaur',     grade:'A+', percent:92, color:'var(--amber)',       iconBg:'ic-amber',  barColor:'#D97706', accent:'#D97706' },
  { name:'Social Science', teacher:'Mr. K. Pillai',   grade:'B+', percent:78, color:'var(--green)',       iconBg:'ic-green',  barColor:'#059669', accent:'#059669' },
  { name:'Computer Sci.',  teacher:'Ms. D. Joshi',    grade:'A',  percent:90, color:'var(--violet)',      iconBg:'ic-violet', barColor:'#7C3AED', accent:'#7C3AED' },
  { name:'Physics',        teacher:'Mr. A. Singh',    grade:'B+', percent:80, color:'var(--sky)',         iconBg:'ic-sky',    barColor:'#0284C7', accent:'#0284C7' },
];

// Gallery categories
const GAL_CATS = ['All', 'Sports', 'Science', 'Cultural', 'Trips', 'Classroom'];
const GALLERY  = [
  { cat:'Sports',    emoji:'🏃', bg:'#DBEAFE', caption:'Sports Day 2024'         },
  { cat:'Science',   emoji:'🔬', bg:'#D1FAE5', caption:'Science Exhibition'      },
  { cat:'Cultural',  emoji:'🎭', bg:'#EDE9FE', caption:'Annual Day Performance'  },
  { cat:'Trips',     emoji:'🏔️', bg:'#FEF3C7', caption:'Nature Trip — Coorg'    },
  { cat:'Classroom', emoji:'📚', bg:'#FFEDD5', caption:'Study Group Session'     },
  { cat:'Sports',    emoji:'⚽', bg:'#FCE7F3', caption:'Inter-school Football'   },
  { cat:'Cultural',  emoji:'🎵', bg:'#E0F2FE', caption:'Music & Dance Festival'  },
  { cat:'Science',   emoji:'🚀', bg:'#F5F3FF', caption:'Robotics Workshop'       },
  { cat:'Trips',     emoji:'🌊', bg:'#CCFBF1', caption:'Beach Trip — Goa'        },
];

// Exam Reports
const EXAMS = [
  { subject:'Mathematics',   marks:95, total:100, grade:'A+', rank:1,  cls:'rank-1' },
  { subject:'Science',       marks:88, total:100, grade:'A',  rank:2,  cls:'rank-2' },
  { subject:'English',       marks:91, total:100, grade:'A+', rank:1,  cls:'rank-1' },
  { subject:'Social Science',marks:78, total:100, grade:'B+', rank:4,  cls:'rank-n' },
  { subject:'Computer Sci.', marks:93, total:100, grade:'A+', rank:2,  cls:'rank-2' },
  { subject:'Physics',       marks:82, total:100, grade:'A',  rank:3,  cls:'rank-3' },
];
const EXAM_AVG   = Math.round(EXAMS.reduce((s,e) => s + e.marks, 0) / EXAMS.length);
const EXAM_TOTAL = EXAMS.reduce((s,e) => s + e.total, 0);
const EXAM_SCORE = EXAMS.reduce((s,e) => s + e.marks, 0);

/* ================================================================
   NOTIFICATIONS DATA
   ================================================================ */
const NOTIFICATIONS = [
  { id:1, type:'absent',     title:'Absent Marked – Apr 9',      body:'You were marked absent on Wednesday, April 9. Please submit a leave application if not done.',          time:'2 days ago',   read:false, icon:'absent',  color:'#E11D48', bg:'#FFE4E6' },
  { id:2, type:'fee',        title:'Lab Fee Due – ₹1,500',       body:'Your Lab Fee of ₹1,500 is pending. Due date: May 15, 2025. Please clear it at the fee counter.',         time:'3 days ago',   read:false, icon:'fee',     color:'#D97706', bg:'#FEF3C7' },
  { id:3, type:'complaint',  title:'Complaint Filed – Misconduct',body:'A complaint has been filed by Mr. R. Sharma regarding classroom misconduct on April 8. Meeting scheduled.', time:'4 days ago', read:false, icon:'complaint',color:'#7C3AED', bg:'#EDE9FE' },
  { id:4, type:'fee',        title:'Library Fee Due – ₹500',     body:'Library Fee of ₹500 is due by May 30, 2025. Avoid late fees by paying before the due date.',             time:'5 days ago',   read:true,  icon:'fee',     color:'#D97706', bg:'#FEF3C7' },
  { id:5, type:'absent',     title:'Absent Marked – Apr 25',     body:'You have been marked absent for April 25. Please submit your leave application to the class teacher.',    time:'1 week ago',   read:true,  icon:'absent',  color:'#E11D48', bg:'#FFE4E6' },
  { id:6, type:'assignment', title:'Late Submission – Python OOP',body:'Your Python OOP assignment was submitted 2 days late. Marks may be deducted as per school policy.',       time:'1 week ago',   read:true,  icon:'assign',  color:'#0284C7', bg:'#E0F2FE' },
  { id:7, type:'exam',       title:'Exam Schedule Released',      body:'Unit tests commence from May 1st. Your schedule is now available under Exam Reports.',                   time:'1 week ago',   read:true,  icon:'exam',    color:'#059669', bg:'#D1FAE5' },
  { id:8, type:'fee',        title:'Activity Fund Due – ₹800',   body:'Activity Fund of ₹800 is due by June 1, 2025. Pay at the accounts office during school hours.',           time:'2 weeks ago',  read:true,  icon:'fee',     color:'#EA580C', bg:'#FFEDD5' },
];

/* ================================================================
   MESSAGES DATA
   ================================================================ */
const MESSAGES = [
  {
    id:1, from:'parent', name:'Mr. Ajay Kumar (Father)', avatar:'AK', role:'Parent',
    preview:'Please ensure Rahul submits the assignment before Friday.',
    time:'10:30 AM', unread:2, online:false,
    thread: [
      { sender:'parent', text:'Hello! I wanted to check if Rahul has submitted the Mathematics assignment.',          time:'10:15 AM' },
      { sender:'self',   text:'Yes, I have submitted it. Got 18/20 on the last one!',                                 time:'10:20 AM' },
      { sender:'parent', text:'Great! Please ensure Rahul submits the next assignment before Friday. Good work!',     time:'10:30 AM' },
    ]
  },
  {
    id:2, from:'parent', name:'Mrs. Priya Kumar (Mother)', avatar:'PK', role:'Parent',
    preview:'Don\'t forget to carry your lab coat tomorrow.',
    time:'Yesterday', unread:0, online:true,
    thread: [
      { sender:'parent', text:'Rahul, don\'t forget to carry your lab coat tomorrow. The practical exam starts at 9 AM.', time:'Yesterday 6:00 PM' },
      { sender:'self',   text:'Sure Mom, I\'ll keep it ready tonight.',                                                    time:'Yesterday 6:05 PM' },
    ]
  },
  {
    id:3, from:'teacher', name:'Mr. R. Sharma (Math Teacher)', avatar:'RS', role:'Class Teacher',
    preview:'Your performance in the unit test was excellent.',
    time:'Apr 21', unread:1, online:false,
    thread: [
      { sender:'teacher', text:'Rahul, your performance in the unit test was excellent — 95/100. Keep it up!',         time:'Apr 21 2:00 PM' },
      { sender:'self',    text:'Thank you Sir! I will work even harder for the finals.',                                time:'Apr 21 3:00 PM' },
      { sender:'teacher', text:'Also, please ensure the quadratic equations problem set is submitted by April 25.',     time:'Apr 21 3:05 PM' },
    ]
  },
  {
    id:4, from:'teacher', name:'Ms. D. Joshi (Computer Teacher)', avatar:'DJ', role:'Computer Science Teacher',
    preview:'Your Python OOP assignment was submitted late.',
    time:'Apr 20', unread:0, online:true,
    thread: [
      { sender:'teacher', text:'Rahul, I noticed your Python OOP assignment was submitted 2 days late. Please ensure timely submissions going forward.', time:'Apr 20 11:00 AM' },
    ]
  },
];

/* ================================================================
   PROFILE DATA
   ================================================================ */
const STUDENT_PROFILE_DEFAULT = {
  name: 'Loading...',
  avatar: '?',
  rollNo: '—',
  class: '—',
  dob: '—',
  gender: '—',
  bloodGroup: '—',
  admissionNo: '—',
  email: '—',
  phone: '—',
  address: '—',
  house: '—',
  sports: '—',
  joinDate: '—',
  father: { name: '—', occupation: '—', phone: '—' },
  mother: { name: '—', occupation: '—', phone: '—' },
  guardian: '—',
  attendance: '—',
  avgScore: '—',
  rank: '—',
  certificates: [],
};

/* ================================================================
   ICON MAP — nav icons
   ================================================================ */
const NAV_ICONS = {
  overview:      <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  timetable:     <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  assignments:   <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  library:       <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
  events:        <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></>,
  attendance:    <><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></>,
  fees:          <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
  announcements: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
  subjects:      <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>,
  gallery:       <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
  exams:         <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
};

/* ================================================================
   SIDEBAR
   ================================================================ */
function Sidebar({ active, setActive }) {
  return (
    <aside className="sp-sidebar">
      <a href="#" className="sp-logo">
        <div className="sp-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span className="sp-logo-text">Edu<em>Core</em></span>
      </a>

      <div className="sp-student-strip">
        <div className="sp-stu-av">RK</div>
        <div>
          <div className="sp-stu-name">Rahul Kumar</div>
          <div className="sp-stu-class">Grade 10 – A &nbsp;·&nbsp; Roll #14</div>
        </div>
      </div>

      <nav className="sp-nav">
        <span className="sp-nav-label">Student Menu</span>
        {NAV_ITEMS.map(item => (
          <button key={item.id}
            className={'sp-nav-btn' + (active === item.id ? ' active' : '')}
            onClick={() => setActive(item.id)}>
            <Ic className="sp-nav-icon" size={17}>{NAV_ICONS[item.id]}</Ic>
            {item.label}
            {item.badge && <span className="sp-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sp-sidebar-footer">
        <button className="sp-logout-btn">
          <Ic size={16}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Ic>
          Logout
        </button>
      </div>
    </aside>
  );
}

/* ================================================================
   NOTIFICATION PANEL
   ================================================================ */
function NotificationPanel({ onClose }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unreadCount = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(notifs.map(n => ({...n, read: true})));
  const markRead = (id) => setNotifs(notifs.map(n => n.id===id ? {...n, read:true} : n));

  const iconMap = {
    absent:   <><line x1="12" y1="1" x2="12" y2="23"/><path d="M5 7H3a2 2 0 00-2 2v9a2 2 0 002 2h3"/><path d="M19 7h2a2 2 0 012 2v9a2 2 0 01-2 2h-3"/><path d="M9 7v1a3 3 0 006 0V7"/></>,
    fee:      <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    complaint:<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    assign:   <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></>,
    exam:     <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
  };

  return (
    <div className="sp-panel sp-notif-panel animate">
      <div className="sp-panel-hd">
        <div>
          <div className="sp-panel-title">Notifications</div>
          {unreadCount > 0 && <div className="sp-panel-sub">{unreadCount} unread alerts</div>}
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {unreadCount > 0 && <button className="sp-panel-action" onClick={markAllRead}>Mark all read</button>}
          <button className="sp-panel-close" onClick={onClose}>
            <Ic size={16}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>
          </button>
        </div>
      </div>
      <div className="sp-panel-body">
        {notifs.map(n => (
          <div key={n.id} className={`sp-notif-item${n.read ? '' : ' unread'}`} onClick={() => markRead(n.id)}>
            <div className="sp-notif-icon-wrap" style={{background: n.bg}}>
              <Ic size={16} style={{color: n.color}}>{iconMap[n.icon]}</Ic>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="sp-notif-title">{n.title}</div>
              <div className="sp-notif-body">{n.body}</div>
              <div className="sp-notif-time">{n.time}</div>
            </div>
            {!n.read && <div className="sp-notif-unread-dot"/>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   MESSAGES PANEL
   ================================================================ */
function MessagesPanel({ onClose }) {
  const [activeMsg, setActiveMsg] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [threads, setThreads] = useState(MESSAGES.map(m => ({...m, thread: [...m.thread]})));
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [activeMsg, threads]);

  const totalUnread = threads.reduce((s, m) => s + m.unread, 0);
  const activeThread = activeMsg ? threads.find(m => m.id === activeMsg) : null;

  const sendMsg = () => {
    if (!inputVal.trim() || !activeMsg) return;
    setThreads(prev => prev.map(m => m.id === activeMsg ? {
      ...m, unread: 0,
      thread: [...m.thread, { sender:'self', text: inputVal.trim(), time: 'Just now' }],
      preview: inputVal.trim(),
    } : m));
    setInputVal('');
  };

  return (
    <div className="sp-panel sp-msg-panel animate">
      <div className="sp-panel-hd">
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {activeThread && (
            <button className="sp-panel-back" onClick={() => setActiveMsg(null)}>
              <Ic size={16}><polyline points="15 18 9 12 15 6"/></Ic>
            </button>
          )}
          <div>
            <div className="sp-panel-title">{activeThread ? activeThread.name : 'Messages'}</div>
            {!activeThread && totalUnread > 0 && <div className="sp-panel-sub">{totalUnread} unread</div>}
            {activeThread && <div className="sp-panel-sub">{activeThread.role} {activeThread.online ? '· Online' : ''}</div>}
          </div>
        </div>
        <button className="sp-panel-close" onClick={onClose}>
          <Ic size={16}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>
        </button>
      </div>

      {!activeThread ? (
        <div className="sp-panel-body">
          {threads.map(m => (
            <div key={m.id} className={`sp-msg-row${m.unread > 0 ? ' unread' : ''}`} onClick={() => { setActiveMsg(m.id); setThreads(prev => prev.map(t => t.id === m.id ? {...t, unread:0} : t)); }}>
              <div className="sp-msg-av" style={{background: m.from==='parent' ? 'linear-gradient(135deg,#FCD34D,#D97706)' : 'linear-gradient(135deg,#A5B4FC,#4338CA)'}}>
                {m.avatar}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
                  <div className="sp-msg-name">{m.name}</div>
                  <div className="sp-msg-time">{m.time}</div>
                </div>
                <div className="sp-msg-preview">{m.preview}</div>
                <div className="sp-msg-role-tag" style={{background: m.from==='parent' ? '#FEF3C7' : '#EEF2FF', color: m.from==='parent' ? '#D97706' : '#4338CA'}}>{m.role}</div>
              </div>
              {m.unread > 0 && <div className="sp-msg-badge">{m.unread}</div>}
              {m.online && <div className="sp-online-dot"/>}
            </div>
          ))}
        </div>
      ) : (
        <div className="sp-thread-wrap">
          <div className="sp-thread-body">
            {activeThread.thread.map((msg, i) => (
              <div key={i} className={`sp-bubble-row ${msg.sender === 'self' ? 'self' : 'other'}`}>
                {msg.sender !== 'self' && (
                  <div className="sp-bubble-av" style={{background: activeThread.from==='parent' ? 'linear-gradient(135deg,#FCD34D,#D97706)' : 'linear-gradient(135deg,#A5B4FC,#4338CA)'}}>
                    {activeThread.avatar}
                  </div>
                )}
                <div>
                  <div className={`sp-bubble ${msg.sender === 'self' ? 'sp-bubble-self' : 'sp-bubble-other'}`}>
                    {msg.text}
                  </div>
                  <div className="sp-bubble-time">{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef}/>
          </div>
          <div className="sp-thread-input">
            <input
              type="text"
              className="sp-thread-field"
              placeholder="Type a message…"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key==='Enter' && sendMsg()}
            />
            <button className="sp-thread-send" onClick={sendMsg}>
              <Ic size={16}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Ic>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   PROFILE PANEL
   ================================================================ */


function mappedData(data) {
  return {
    name: data.name || "N/A",
    avatar: data.name
      ? data.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
      : "??",

    rollNo: data.rollNo || "N/A",
    class: data.className || "N/A",

    dob: data.dob || "N/A",
    gender: data.gender || "N/A",
    bloodGroup: data.bloodGroup || "N/A",

    admissionNo: data.admissionNo || "N/A",
    joinDate: data.joiningDate || "N/A",

    email: data.email || "N/A",
    phone: data.phone || "N/A",
    address: data.address || "N/A",

    house: data.house || "N/A",
    sports: data.sportsActivities || "N/A",

    father: {
      name: data.fatherName || "N/A",
      occupation: data.fatherOccupation || "N/A",
      phone: data.emergencyContact || "N/A",
    },

    mother: {
      name: data.motherName || "N/A",
      occupation: data.motherOccupation || "N/A",
      phone: "N/A",
    },

    attendance: data.attendancePercentage || "0%",
    avgScore: data.avgScore || "0",
    rank: data.classRank || "-",

    certificates: data.achievements || [],
  };
}

function ProfilePanel({ onClose, setActive }) {
  const [profile, setProfile] = useState(STUDENT_PROFILE_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  /* Fetch on mount */
useEffect(() => {
  let cancelled = false;

  const token = localStorage.getItem("token");

fetch("http://localhost:8080/api/student/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
    .then(res => {
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      return res.json();
    })
    .then(data => {
  if (!cancelled) {
    const mapped = mappedData(data);   // 👈 convert
    setProfile(mapped);                // 👈 set state
    setLoading(false);
  }
})
    .catch(err => {
      if (!cancelled) {
        setError(err.message);
        setLoading(false);
      }
    });

  return () => { cancelled = true; };
}, []);

  const p = profile;

  /* ── Loading skeleton ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="sp-panel sp-profile-panel animate">
        <div className="sp-panel-hd">
          <div className="sp-panel-title">My Profile</div>
          <button className="sp-panel-close" onClick={onClose}>
            <Ic size={16}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>
          </button>
        </div>
        <div className="sp-panel-body sp-profile-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '8px 0' }}>
            {/* Avatar + name skeleton */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--border)', animation: 'sp-skeleton-pulse 1.4s ease-in-out infinite'
              }}/>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={skeletonStyle(140, 16)}/>
                <div style={skeletonStyle(100, 12)}/>
              </div>
            </div>
            {/* Stats skeleton */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[1,2,3].map(i => <div key={i} style={{ ...skeletonStyle('100%', 56), borderRadius: 12 }}/>)}
            </div>
            {/* Rows skeleton */}
            {[1,2,3,4,5].map(i => <div key={i} style={skeletonStyle('100%', 32)}/>)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────────────── */
  if (error) {
    return (
      <div className="sp-panel sp-profile-panel animate">
        <div className="sp-panel-hd">
          <div className="sp-panel-title">My Profile</div>
          <button className="sp-panel-close" onClick={onClose}>
            <Ic size={16}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>
          </button>
        </div>
        <div className="sp-panel-body sp-profile-body">
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 12, padding: '32px 16px', textAlign: 'center'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Ic size={24} style={{ color: '#E11D48' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </Ic>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
              Failed to load profile
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              Could not reach <code style={{ background: 'var(--border)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                /api/student/profile
              </code>
              <br/>{error}
            </div>
            <button
              className="sp-btn sp-btn-primary"
              style={{ marginTop: 8 }}
              onClick={() => { setLoading(true); setError(null); /* re-mount trick */ onClose(); }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Normal profile view ──────────────────────────────────── */
  return (
    <div className="sp-panel sp-profile-panel animate">
      <div className="sp-panel-hd">
        <div className="sp-panel-title">My Profile</div>
        <button className="sp-panel-close" onClick={onClose}>
          <Ic size={16}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>
        </button>
      </div>
      <div className="sp-panel-body sp-profile-body">
        {/* Profile hero */}
        <div className="sp-profile-hero">
          <div className="sp-profile-av">{p.avatar}</div>
          <div>
            <div className="sp-profile-name">{p.name}</div>
            <div className="sp-profile-meta">{p.class} &nbsp;·&nbsp; Roll #{p.rollNo}</div>
            <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
              <span className="sp-profile-chip" style={{background:'var(--indigo-pale)',color:'var(--indigo)'}}>Admission: {p.admissionNo}</span>
              <span className="sp-profile-chip" style={{background:'var(--amber-pale)',color:'var(--amber)'}}>Joined: {p.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="sp-profile-stats">
          {[
            { val: p.attendance, lbl:'Attendance', bg:'var(--teal-lite)', fg:'var(--teal)' },
            { val: p.avgScore,   lbl:'Avg Score',  bg:'var(--indigo-pale)', fg:'var(--indigo-mid)' },
            { val: p.rank,       lbl:'Class Rank', bg:'var(--amber-pale)', fg:'var(--amber)' },
          ].map(s => (
            <div key={s.lbl} className="sp-profile-stat" style={{background:s.bg}}>
              <div className="sp-profile-stat-val" style={{color:s.fg}}>{s.val}</div>
              <div className="sp-profile-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Personal Information */}
        <div className="sp-profile-section-label">Personal Information</div>
        <div className="sp-profile-rows">
          {[
            ['Date of Birth', p.dob],
            ['Gender', p.gender],
            ['Blood Group', p.bloodGroup],
            ['House', p.house],
            ['Sports / Activities', p.sports],
          ].map(([k,v]) => (
            <div key={k} className="sp-profile-row">
              <span className="sp-profile-key">{k}</span>
              <span className="sp-profile-val">{v}</span>
            </div>
          ))}
        </div>

        {/* Contact Details */}
        <div className="sp-profile-section-label">Contact Details</div>
        <div className="sp-profile-rows">
          {[
            ['Email', p.email],
            ['Phone', p.phone],
            ['Address', p.address],
          ].map(([k,v]) => (
            <div key={k} className="sp-profile-row">
              <span className="sp-profile-key">{k}</span>
              <span className="sp-profile-val">{v}</span>
            </div>
          ))}
        </div>

        {/* Parent / Guardian */}
        <div className="sp-profile-section-label">Parent / Guardian</div>
        <div className="sp-profile-rows">
          {[
            ['Father', `${p.father.name} · ${p.father.occupation}`],
            ['Mother', `${p.mother.name} · ${p.mother.occupation}`],
            ['Emergency Contact', p.father.phone],
          ].map(([k,v]) => (
            <div key={k} className="sp-profile-row">
              <span className="sp-profile-key">{k}</span>
              <span className="sp-profile-val">{v}</span>
            </div>
          ))}
        </div>

        {/* Achievements */}
        {p.certificates.length > 0 && (
          <>
            <div className="sp-profile-section-label">Achievements & Certificates</div>
            <div style={{padding:'0 0 8px'}}>
              {p.certificates.map((c,i) => (
                <div key={i} className="sp-cert-row">
                  <div className="sp-cert-icon"><Ic size={14}><polyline points="9 11 12 14 22 4"/></Ic></div>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="sp-profile-edit-btn" onClick={onClose}>
          <Ic size={15}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></Ic>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

/* ── Skeleton helper (used above) ────────────────────────────── */
function skeletonStyle(width, height) {
  return {
    width, height,
    borderRadius: 8,
    background: 'var(--border)',
    animation: 'sp-skeleton-pulse 1.4s ease-in-out infinite',
  };
}

/* ── Add this keyframe to your StudentPortal.css ─────────────── */
/*
@keyframes sp-skeleton-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}
*/


/* ================================================================
   TOPBAR
   ================================================================ */
function Topbar({ active, setActive }) {
  const tab = TABS.find(t => t.id === active) || TABS[0];
  const [showNotif, setShowNotif]     = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile]  = useState(false);
  const unreadNotifs   = NOTIFICATIONS.filter(n => !n.read).length;
  const unreadMessages = MESSAGES.reduce((s,m) => s + m.unread, 0);

  const closeAll = () => { setShowNotif(false); setShowMessages(false); setShowProfile(false); };
  const toggleNotif   = () => { setShowNotif(v=>!v); setShowMessages(false); setShowProfile(false); };
  const toggleMessages= () => { setShowMessages(v=>!v); setShowNotif(false); setShowProfile(false); };
  const toggleProfile = () => { setShowProfile(v=>!v); setShowNotif(false); setShowMessages(false); };

  return (
    <>
      <header className="sp-topbar">
        <div>
          <div className="sp-topbar-title">{tab.label}</div>
          <div className="sp-topbar-sub">Academic Year 2024–25 &nbsp;·&nbsp; Grade 10 – A</div>
        </div>
        <div className="sp-topbar-right">
          <div className="sp-search">
            <Ic size={14}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Ic>
            <input type="text" placeholder="Search…"/>
          </div>
          {/* Messages */}
          <button className={`sp-icon-btn${showMessages?' active':''}`} onClick={toggleMessages} title="Messages">
            <Ic size={16}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></Ic>
            {unreadMessages > 0 && <span className="sp-notif-dot sp-msg-dot">{unreadMessages}</span>}
          </button>
          {/* Notifications */}
          <button className={`sp-icon-btn${showNotif?' active':''}`} onClick={toggleNotif} title="Notifications">
            <Ic size={16}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></Ic>
            {unreadNotifs > 0 && <span className="sp-notif-dot">{unreadNotifs}</span>}
          </button>
          {/* Profile avatar */}
          <div className={`sp-topbar-av${showProfile?' active':''}`} onClick={toggleProfile} title="Profile">RK</div>
        </div>
      </header>
      {/* Backdrop */}
      {(showNotif || showMessages || showProfile) && <div className="sp-panel-backdrop" onClick={closeAll}/>}
      {showNotif    && <NotificationPanel onClose={closeAll}/>}
      {showMessages && <MessagesPanel onClose={closeAll}/>}
      {showProfile  && <ProfilePanel onClose={closeAll} setActive={setActive}/>}
    </>
  );
}

/* ================================================================
   TAB BAR
   ================================================================ */
function TabBar({ active, setActive }) {
  return (
    <div className="sp-tabs">
      {TABS.map(t => (
        <button key={t.id}
          className={'sp-tab' + (active === t.id ? ' active' : '')}
          onClick={() => setActive(t.id)}>
          <Ic size={15}>{NAV_ICONS[t.id]}</Ic>
          {t.label}
          {t.badge && <span className="sp-tab-badge">{t.badge}</span>}
        </button>
      ))}
    </div>
  );
}

/* ================================================================
   SECTION: OVERVIEW
   ================================================================ */
function Overview({ setActive }) {
  return (
    <div className="sp-page">
      {/* Hero */}
      <div className="sp-hero animate">
        <div className="sp-hero-text">
          <h1>Welcome back, Rahul 👋</h1>
          <p>You have 3 pending assignments and 1 upcoming fee due. Check your schedule for today's classes.</p>
        </div>
        <div className="sp-hero-actions">
          <button className="sp-btn sp-btn-ghost" onClick={() => setActive('timetable')}>
            <Ic size={15}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Ic>
            Today's Classes
          </button>
          <button className="sp-btn sp-btn-primary" onClick={() => setActive('assignments')}>
            <Ic size={15}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></Ic>
            My Assignments
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="sp-qstats">
        {[
          { val:'94%',  lbl:'Attendance',    pill:'This month', pillCls:'pill-good', icon:'ic-teal',   ico:<><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></> },
          { val:'88.2', lbl:'Avg. Score',    pill:'↑ +2.3',     pillCls:'pill-up',   icon:'ic-indigo', ico:<><polyline points="22 4 12 14 7 9 2 14"/></> },
          { val:'3',    lbl:'Assignments Due',pill:'This week',  pillCls:'pill-down', icon:'ic-amber',  ico:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></> },
          { val:'#2',   lbl:'Class Rank',    pill:'Top 5%',     pillCls:'pill-good', icon:'ic-violet', ico:<><polyline points="15 3 21 3 21 9"/><path d="M21 3l-7 7-4-4-6 6"/></> },
        ].map((s,i) => (
          <div key={s.lbl} className={`sp-qs-card animate d${i+1}`}>
            <div className={`sp-qs-icon ${s.icon}`}><Ic size={20}>{s.ico}</Ic></div>
            <div>
              <div className="sp-qs-val">{s.val}</div>
              <div className="sp-qs-lbl">{s.lbl}</div>
              <span className={`sp-qs-pill ${s.pillCls}`}>{s.pill}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="sp-2col">
        {/* Recent assignments */}
        <div className="sp-card animate d3">
          <div className="sp-card-hd">
            <div><div className="sp-card-title">Recent Assignments</div><div className="sp-card-sub">3 pending</div></div>
            <button className="sp-card-link" onClick={() => setActive('assignments')}>View All</button>
          </div>
          <div className="sp-asgn-list">
            {ASSIGNMENTS.slice(0,4).map(a => (
              <div key={a.id} className="sp-asgn-item">
                <div className="sp-asgn-color" style={{background: a.color}}/>
                <div className={`sp-asgn-icon ${a.iconBg}`}><Ic size={18}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></Ic></div>
                <div className="sp-asgn-info">
                  <div className="sp-asgn-title">{a.title}</div>
                  <div className="sp-asgn-meta">{a.subject} &nbsp;·&nbsp; Due {a.due}</div>
                </div>
                <span className={`sp-badge badge-${a.status}`}>{a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="sp-card animate d4">
          <div className="sp-card-hd">
            <div><div className="sp-card-title">Upcoming Events</div><div className="sp-card-sub">Next 30 days</div></div>
            <button className="sp-card-link" onClick={() => setActive('events')}>View All</button>
          </div>
          <div className="sp-events-list">
            {EVENTS.slice(0,4).map(ev => (
              <div key={ev.title} className="sp-event-item">
                <div className="sp-event-date-box" style={{background:ev.bg}}>
                  <span className="sp-event-day"   style={{color:ev.color}}>{ev.day}</span>
                  <span className="sp-event-month" style={{color:ev.color}}>{ev.month}</span>
                </div>
                <div className="sp-event-bar" style={{background:ev.color}}/>
                <div style={{flex:1}}>
                  <div className="sp-event-title">{ev.title}</div>
                  <div className="sp-event-meta">{ev.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent announcements */}
      <div className="sp-card animate d5 sp-mt18">
        <div className="sp-card-hd">
          <div><div className="sp-card-title">Announcements</div><div className="sp-card-sub">5 new</div></div>
          <button className="sp-card-link" onClick={() => setActive('announcements')}>View All</button>
        </div>
        <div className="sp-ann-list">
          {ANNOUNCEMENTS.slice(0,3).map(a => (
            <div key={a.id} className="sp-ann-item">
              <div className="sp-ann-dot-wrap"><div className="sp-ann-dot" style={{background:a.dot}}/></div>
              <div style={{flex:1}}>
                <div className="sp-ann-title">{a.title}</div>
                <div className="sp-ann-body">{a.body}</div>
                <div className="sp-ann-meta">{a.time}</div>
              </div>
              <span className={`sp-ann-priority pri-${a.priority}`}>{a.priority.charAt(0).toUpperCase()+a.priority.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: TIMETABLE
   ================================================================ */
function Timetable() {
  const [daysState, setDaysState] = useState([]);
  const [periodsState, setPeriodsState] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        // ✅ Use your custom API instance (points to http://localhost:8080)
        const res = await API.get("/api/student/timetable");

        // Axios stores the JSON response in 'res.data'
        const data = res.data;
        console.log("Raw timetable data:", data);

        setDaysState(data.days || []);
        setPeriodsState(data.periods || []);
        setLoaded(true);
      } catch (err) {
        console.error("Timetable Error:", err);
        setError(err.response?.data?.message || "Failed to load timetable.");
        setLoaded(true);
      }
    };

    fetchTimetable();
  }, []);

  if (!loaded) return <div>Loading timetable...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="sp-page">
      <div className="sp-section-title">Weekly Timetable</div>
      <div className="sp-section-sub">Academic Year 2024–25</div>

      <div className="sp-tt-grid animate">
        {/* HEADER */}
        <div className="sp-tt-header sp-tt-cell">Time</div>
        {/* ✅ Map directly from daysState */}
        {daysState.map((d, i) => (
          <div key={i} className="sp-tt-header sp-tt-cell">{d}</div>
        ))}

        {/* ROWS */}
        {/* ✅ Map directly from periodsState */}
        {periodsState.map((p, pi) => (
          <div key={pi} style={{ display: "contents" }}>
            <div className="sp-tt-cell sp-tt-time">
              {p.time?.split('\n').map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>

            {p.slots?.map((s, si) => (
              <div key={`${pi}-${si}`} className="sp-tt-cell" style={{ padding: 6 }}>
                {s.label ? (
                  <div className={`sp-tt-subject ${s.cls}`}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{s.label}</div>
                    <div className="sp-tt-room">{s.room}</div>
                  </div>
                ) : (
                  <div className="sp-tt-subject tt-empty">—</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: ASSIGNMENTS
   ================================================================ */
function Assignments() {
  const counts = {
    pending:   ASSIGNMENTS.filter(a=>a.status==='pending').length,
    submitted: ASSIGNMENTS.filter(a=>a.status==='submitted').length,
    graded:    ASSIGNMENTS.filter(a=>a.status==='graded').length,
    late:      ASSIGNMENTS.filter(a=>a.status==='late').length,
  };
  return (
    <div className="sp-page">
      <div className="sp-section-title">Assignments</div>
      <div className="sp-section-sub">All submitted and pending work</div>
      {/* summary */}
      <div className="sp-qstats sp-mb18">
        {[
          {val:counts.pending,   lbl:'Pending',   icon:'ic-amber',  pillCls:'pill-down'},
          {val:counts.submitted, lbl:'Submitted',  icon:'ic-indigo', pillCls:'pill-good'},
          {val:counts.graded,    lbl:'Graded',     icon:'ic-green',  pillCls:'pill-up'},
          {val:counts.late,      lbl:'Late',       icon:'ic-rose',   pillCls:'pill-down'},
        ].map((s,i)=>(
          <div key={s.lbl} className={`sp-qs-card animate d${i+1}`}>
            <div className={`sp-qs-icon ${s.icon}`}><Ic size={20}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></Ic></div>
            <div><div className="sp-qs-val">{s.val}</div><div className="sp-qs-lbl">{s.lbl}</div></div>
          </div>
        ))}
      </div>
      <div className="sp-card animate d3">
        <div className="sp-card-hd"><div className="sp-card-title">All Assignments</div></div>
        <div className="sp-asgn-list">
          {ASSIGNMENTS.map(a => (
            <div key={a.id} className="sp-asgn-item">
              <div className="sp-asgn-color" style={{background:a.color}}/>
              <div className={`sp-asgn-icon ${a.iconBg}`}><Ic size={18}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></Ic></div>
              <div className="sp-asgn-info">
                <div className="sp-asgn-title">{a.title}</div>
                <div className="sp-asgn-meta">{a.subject}</div>
              </div>
              <div className="sp-asgn-right">
                <div className="sp-asgn-due">Due: {a.due}</div>
                {a.score && <span style={{fontSize:12,fontWeight:700,color:'var(--green)'}}>Score: {a.score}</span>}
                <span className={`sp-badge badge-${a.status}`}>{a.status.charAt(0).toUpperCase()+a.status.slice(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: LIBRARY
   ================================================================ */
function Library() {
  return (
    <div className="sp-page">
      <div className="sp-section-title">Library</div>
      <div className="sp-section-sub">Browse and manage your books</div>
      <div className="sp-lib-grid animate">
        {BOOKS.map(b => (
          <div key={b.title} className="sp-book-card">
            <div className="sp-book-cover" style={{background:b.color+'33'}}>
              <span style={{fontSize:48}}>{b.cover}</span>
            </div>
            <div className="sp-book-body">
              <div className="sp-book-title">{b.title}</div>
              <div className="sp-book-author">{b.author}</div>
              <span className={`sp-book-status bk-${b.status}`}>
                {b.status.charAt(0).toUpperCase()+b.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: EVENTS
   ================================================================ */
function Events() {
  return (
    <div className="sp-page">
      <div className="sp-section-title">Events</div>
      <div className="sp-section-sub">School calendar — upcoming events</div>
      <div className="sp-card animate">
        <div className="sp-card-hd"><div className="sp-card-title">All Upcoming Events</div></div>
        <div className="sp-events-list">
          {EVENTS.map(ev => (
            <div key={ev.title} className="sp-event-item">
              <div className="sp-event-date-box" style={{background:ev.bg}}>
                <span className="sp-event-day"   style={{color:ev.color}}>{ev.day}</span>
                <span className="sp-event-month" style={{color:ev.color}}>{ev.month}</span>
              </div>
              <div className="sp-event-bar" style={{background:ev.color}}/>
              <div style={{flex:1}}>
                <div className="sp-event-title">{ev.title}</div>
                <div className="sp-event-meta">{ev.meta}</div>
              </div>
              <span className="sp-event-tag"
                    style={{background:ev.tagBg, color:ev.tagFg}}>
                {ev.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: ATTENDANCE
   ================================================================ */
function Attendance() {
  const pCount = ATT_DATA.filter(d=>d==='present'||d==='today').length;
  const aCount = ATT_DATA.filter(d=>d==='absent').length;
  const hCount = ATT_DATA.filter(d=>d==='holiday').length;
  const pct    = Math.round((pCount/(pCount+aCount))*100);
  return (
    <div className="sp-page">
      <div className="sp-section-title">Attendance</div>
      <div className="sp-section-sub">{ATT_MONTH} · Overview</div>

      <div className="sp-att-summary animate">
        {[
          {val:pCount, lbl:'Present', bg:'var(--green)'},
          {val:aCount, lbl:'Absent',  bg:'var(--rose)'},
          {val:hCount, lbl:'Holidays',bg:'var(--amber)'},
          {val:`${pct}%`,lbl:'Attendance %',bg:'var(--indigo-mid)'},
        ].map(s=>(
          <div key={s.lbl} className="sp-att-stat">
            <div className="sp-att-dot" style={{background:s.bg}}/>
            <div>
              <div className="sp-att-num">{s.val}</div>
              <div className="sp-att-txt">{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sp-card animate d2">
        <div className="sp-card-hd">
          <div><div className="sp-card-title">{ATT_MONTH}</div><div className="sp-card-sub">Day-wise attendance</div></div>
        </div>
        <div className="sp-card-body">
          {/* Day headers */}
          <div className="sp-att-grid sp-mb8">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
              <div key={d} style={{textAlign:'center',fontSize:11,fontWeight:700,color:'var(--muted)',padding:'6px 0'}}>{d}</div>
            ))}
          </div>
          {/* Spacer for Apr 1 = Tuesday → index 2 */}
          <div className="sp-att-grid">
            {[0,1].map(i=><div key={'sp'+i}/>)}
            {ATT_DATA.map((type,i)=>(
              <div key={i} className={`sp-att-day att-${type}`}>
                <span className="sp-att-date">{i+1}</span>
                <span className="sp-att-lbl">{type==='present'?'P':type==='absent'?'A':type==='holiday'?'H':type==='today'?'●':''}</span>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div style={{display:'flex',gap:14,marginTop:16,flexWrap:'wrap'}}>
            {[
              {cls:'att-present',lbl:'Present'},
              {cls:'att-absent', lbl:'Absent'},
              {cls:'att-holiday',lbl:'Holiday'},
              {cls:'att-weekend',lbl:'Weekend'},
              {cls:'att-today',  lbl:'Today'},
            ].map(l=>(
              <div key={l.lbl} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--muted)'}}>
                <div className={`sp-att-day ${l.cls}`} style={{width:20,height:20,borderRadius:5,fontSize:9}}/>
                {l.lbl}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: FEES
   ================================================================ */
function Fees() {
  const paid  = FEES.filter(f=>f.status==='paid').reduce((s,f)=>s+f.paid,0);
  const total = FEES.reduce((s,f)=>s+f.total,0);
  const pct   = Math.round((paid/total)*100);
  return (
    <div className="sp-page">
      <div className="sp-section-title">Fee Details</div>
      <div className="sp-section-sub">Academic Year 2024–25 · Term 1</div>

      {/* Ring summary */}
      <div className="sp-score-ring-wrap animate" style={{background:'var(--indigo-pale)'}}>
        <svg className="sp-ring-svg" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#C7D2FE" strokeWidth="8"/>
          <circle cx="40" cy="40" r="32" fill="none" stroke="var(--indigo-mid)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray="201.06"
                  strokeDashoffset={201.06*(1-pct/100)}
                  style={{transform:'rotate(-90deg)',transformOrigin:'50% 50%'}}/>
        </svg>
        <div className="sp-ring-info">
          <h3>{pct}%</h3>
          <div className="sp-ring-sub">₹{paid.toLocaleString()} paid of ₹{total.toLocaleString()} total</div>
          <div className="sp-ring-rank">₹{(total-paid).toLocaleString()} outstanding</div>
        </div>
        <div style={{marginLeft:'auto'}}>
          <button className="sp-btn sp-btn-outline">Pay Now</button>
        </div>
      </div>

      <div className="sp-card animate d2">
        <div className="sp-card-hd"><div className="sp-card-title">Fee Breakdown</div></div>
        {FEES.map(f=>(
          <div key={f.name} className="sp-fee-item">
            <div className="sp-fee-left">
              <div className={`sp-fee-icon ${f.icon}`}>
                <Ic size={18}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Ic>
              </div>
              <div>
                <div className="sp-fee-name">{f.name}</div>
                <div className="sp-fee-due">Due: {f.due}</div>
              </div>
            </div>
            <div style={{flex:1,padding:'0 16px'}}>
              <div className="sp-progress-bar">
                <div className="sp-progress-fill"
                     style={{width:`${(f.paid/f.total)*100}%`,
                             background: f.status==='paid' ? 'var(--green)' : 'var(--amber)'}}/>
              </div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div className="sp-fee-amt">{f.amount}</div>
              <span className={`sp-badge ${f.status==='paid' ? 'badge-submitted' : 'badge-pending'}`}>
                {f.status.charAt(0).toUpperCase()+f.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: ANNOUNCEMENTS
   ================================================================ */
function Announcements() {
  return (
    <div className="sp-page">
      <div className="sp-section-title">Announcements</div>
      <div className="sp-section-sub">School notices and updates</div>
      <div className="sp-card animate">
        <div className="sp-card-hd"><div className="sp-card-title">All Announcements</div><div className="sp-card-sub">{ANNOUNCEMENTS.length} notices</div></div>
        <div className="sp-ann-list">
          {ANNOUNCEMENTS.map(a=>(
            <div key={a.id} className="sp-ann-item">
              <div className="sp-ann-dot-wrap"><div className="sp-ann-dot" style={{background:a.dot}}/></div>
              <div style={{flex:1}}>
                <div className="sp-ann-title">{a.title}</div>
                <div className="sp-ann-body">{a.body}</div>
                <div className="sp-ann-meta">{a.time}</div>
              </div>
              <span className={`sp-ann-priority pri-${a.priority}`}>{a.priority.charAt(0).toUpperCase()+a.priority.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: MY SUBJECTS
   ================================================================ */
function MySubjects() {
  return (
    <div className="sp-page">
      <div className="sp-section-title">My Subjects</div>
      <div className="sp-section-sub">Current performance overview</div>
      <div className="sp-subj-grid animate">
        {SUBJECTS.map(s=>(
          <div key={s.name} className="sp-subj-card">
            <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:s.accent,borderRadius:'18px 18px 0 0'}}/>
            <div className="sp-subj-top">
              <div className={`sp-subj-icon ${s.iconBg}`}><Ic size={22}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></Ic></div>
              <div style={{textAlign:'right'}}>
                <div className="sp-subj-grade">{s.grade}</div>
                <div className="sp-subj-grade-lbl">Current Grade</div>
              </div>
            </div>
            <div className="sp-subj-name">{s.name}</div>
            <div className="sp-subj-teacher">{s.teacher}</div>
            <div className="sp-subj-bar-bg">
              <div className="sp-subj-bar-fill" style={{width:`${s.percent}%`,background:s.accent}}/>
            </div>
            <div className="sp-subj-bar-lbl">
              <span className="sp-subj-bar-txt">Progress</span>
              <span className="sp-subj-bar-txt" style={{color:s.accent,fontWeight:700}}>{s.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: GALLERY
   ================================================================ */
function Gallery() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? GALLERY : GALLERY.filter(g=>g.cat===cat);
  return (
    <div className="sp-page">
      <div className="sp-section-title">Gallery</div>
      <div className="sp-section-sub">School memories and events</div>
      <div className="sp-gallery-tabs">
        {GAL_CATS.map(c=>(
          <button key={c} className={`sp-gal-tab${cat===c?' active':''}`} onClick={()=>setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="sp-gallery-grid animate">
        {filtered.map((g,i)=>(
          <div key={i} className="sp-gal-item">
            <div className="sp-gal-img" style={{background:g.bg}}>
              <span>{g.emoji}</span>
            </div>
            <div className="sp-gal-overlay">
              <div className="sp-gal-caption">{g.caption}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SECTION: EXAM REPORTS
   ================================================================ */
function ExamReports() {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference * (1 - EXAM_AVG / 100);
  return (
    <div className="sp-page">
      <div className="sp-section-title">Exam Reports</div>
      <div className="sp-section-sub">Unit Test 1 · April 2025</div>

      {/* Score ring */}
      <div className="sp-score-ring-wrap animate">
        <svg className="sp-ring-svg" width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#C7D2FE" strokeWidth="9"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--indigo-mid)" strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{transform:'rotate(-90deg)',transformOrigin:'50% 50%'}}/>
        </svg>
        <div className="sp-ring-info">
          <h3>{EXAM_AVG}%</h3>
          <div className="sp-ring-sub">Overall Average · {EXAM_SCORE}/{EXAM_TOTAL} marks</div>
          <div className="sp-ring-rank">Class Rank: <strong>#2</strong> out of 42 students</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',flexDirection:'column',gap:8,alignSelf:'center'}}>
          <button className="sp-btn sp-btn-outline">Download Report</button>
        </div>
      </div>

      <div className="sp-card animate d2">
        <div className="sp-card-hd">
          <div><div className="sp-card-title">Subject-wise Results</div><div className="sp-card-sub">Unit Test 1 · April 2025</div></div>
        </div>
        <table className="sp-exam-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Score</th>
              <th style={{width:200}}>Performance</th>
              <th>Grade</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {EXAMS.map(e=>{
              const pct = (e.marks/e.total)*100;
              const barColor = pct>=90?'var(--green)':pct>=75?'var(--indigo-mid)':pct>=60?'var(--amber)':'var(--rose)';
              const grCls    = e.grade.startsWith('A')?'gr-a':e.grade.startsWith('B')?'gr-b':e.grade.startsWith('C')?'gr-c':'gr-d';
              return (
                <tr key={e.subject}>
                  <td style={{fontWeight:600}}>{e.subject}</td>
                  <td style={{fontWeight:700,fontSize:14}}>{e.marks}<span style={{fontSize:11,color:'var(--muted)',fontWeight:400}}>/{e.total}</span></td>
                  <td>
                    <div className="sp-score-bar">
                      <div className="sp-score-track"><div className="sp-score-fill" style={{width:`${pct}%`,background:barColor}}/></div>
                      <div className="sp-score-val" style={{color:barColor}}>{Math.round(pct)}%</div>
                    </div>
                  </td>
                  <td><span className={`sp-grade-pill ${grCls}`}>{e.grade}</span></td>
                  <td><span className={`sp-rank ${e.cls}`}>{e.rank}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================
   ROOT COMPONENT
   ================================================================ */
const SECTIONS = {
  overview:      Overview,
  timetable:     Timetable,
  assignments:   Assignments,
  library:       Library,
  events:        Events,
  attendance:    Attendance,
  fees:          Fees,
  announcements: Announcements,
  subjects:      MySubjects,
  gallery:       Gallery,
  exams:         ExamReports,
};

export default function StudentPortal() {
  const [active, setActive] = useState('overview');
  const Section = SECTIONS[active] || Overview;

  return (
    <div className="sp-layout">
      <Sidebar active={active} setActive={setActive}/>
      <div className="sp-main">
        <Topbar active={active} setActive={setActive}/>
        <TabBar active={active} setActive={setActive}/>
        <div className="sp-content">
          <Section setActive={setActive}/>
        </div>
      </div>
    </div>
  );
}