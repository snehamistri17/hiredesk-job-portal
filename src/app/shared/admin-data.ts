// admin-data.ts — All admin panel mock data. NO interfaces used.

export const adminProfile = {
  name: 'John Doe',
  avatar: 'JD',
  email: 'admin@hiredesk.com',
  role: 'Administrator',
};

export const adminStats = {
  totalStudents: 890,
  totalCompanies: 42,
  totalJobs: 128,
  totalApplications: 1560,
  placedStudents: 312,
  pendingApprovals: 3,
  activeDrives: 8,
  totalDrives: 24,
  placementRate: 35,
};

export const studentsList = [
  { id:1,  name:'Aarav Mehta',   avatar:'AM', email:'aarav@college.edu',  branch:'Computer Science',       year:'4th', cgpa:9.2, skills:['React','Node.js','Python'],     status:'Placed',       company:'TechNova',   phone:'+91-9876541001' },
  { id:2,  name:'Priya Sharma',  avatar:'PS', email:'priya@college.edu',  branch:'Information Technology', year:'4th', cgpa:8.7, skills:['Java','Spring','MySQL'],         status:'Eligible',     company:'',           phone:'+91-9876541002' },
  { id:3,  name:'Liam Johnson',  avatar:'LJ', email:'liam@college.edu',   branch:'Electronics',            year:'3rd', cgpa:7.9, skills:['Python','C++','MATLAB'],         status:'Eligible',     company:'',           phone:'+91-9876541003' },
  { id:4,  name:'Sofia Torres',  avatar:'ST', email:'sofia@college.edu',  branch:'Computer Science',       year:'4th', cgpa:9.5, skills:['Data Science','ML','SQL'],       status:'Placed',       company:'InnoTech',   phone:'+91-9876541004' },
  { id:5,  name:'Noah Williams', avatar:'NW', email:'noah@college.edu',   branch:'Mechanical',             year:'2nd', cgpa:6.8, skills:['AutoCAD','SolidWorks'],          status:'Not Eligible', company:'',           phone:'+91-9876541005' },
  { id:6,  name:'Aisha Khan',    avatar:'AK', email:'aisha@college.edu',  branch:'Information Technology', year:'4th', cgpa:8.9, skills:['React','TypeScript','Redux'],    status:'Applied',      company:'TechNova',   phone:'+91-9876541006' },
  { id:7,  name:'Carlos Rivera', avatar:'CR', email:'carlos@college.edu', branch:'Computer Science',       year:'4th', cgpa:8.1, skills:['Flutter','Dart','Firebase'],    status:'Applied',      company:'MobileSoft', phone:'+91-9876541007' },
  { id:8,  name:'Emma Wilson',   avatar:'EW', email:'emma@college.edu',   branch:'Electronics',            year:'3rd', cgpa:7.5, skills:['VLSI','Embedded C'],            status:'Eligible',     company:'',           phone:'+91-9876541008' },
  { id:9,  name:'Rahul Gupta',   avatar:'RG', email:'rahul@college.edu',  branch:'Computer Science',       year:'4th', cgpa:9.0, skills:['DevOps','Docker','AWS'],        status:'Placed',       company:'CloudGen',   phone:'+91-9876541009' },
  { id:10, name:'Zara Ahmed',    avatar:'ZA', email:'zara@college.edu',   branch:'Information Technology', year:'4th', cgpa:8.4, skills:['UI/UX','Figma','Sketch'],       status:'Applied',      company:'DesignCo',   phone:'+91-9876541010' },
];

export const companiesList = [
  { id:1, name:'TechNova Solutions', avatar:'TN', industry:'IT',         location:'San Francisco, CA', jobs:5, applications:180, status:'Approved', joined:'2024-01-15', package:'80k-150k', hr:'Ravi Patel'  },
  { id:2, name:'InnoTech Inc',       avatar:'IT', industry:'AI/ML',      location:'New York, NY',      jobs:3, applications:95,  status:'Approved', joined:'2024-02-10', package:'70k-120k', hr:'Dana Scott'  },
  { id:3, name:'CloudGen Systems',   avatar:'CG', industry:'Cloud',      location:'Seattle, WA',       jobs:4, applications:120, status:'Approved', joined:'2024-03-05', package:'90k-160k', hr:'James Cole'  },
  { id:4, name:'MobileSoft',         avatar:'MS', industry:'Mobile Dev', location:'Austin, TX',        jobs:2, applications:60,  status:'Pending',  joined:'2025-01-20', package:'60k-100k', hr:'Sara Lee'    },
  { id:5, name:'DesignCo Studio',    avatar:'DC', industry:'Design',     location:'Los Angeles, CA',   jobs:3, applications:75,  status:'Pending',  joined:'2025-01-28', package:'55k-90k',  hr:'Mia Patel'   },
  { id:6, name:'DataBridge Corp',    avatar:'DB', industry:'Analytics',  location:'Chicago, IL',       jobs:2, applications:48,  status:'Approved', joined:'2024-04-12', package:'75k-130k', hr:'Tom Brown'   },
  { id:7, name:'FinTech Labs',       avatar:'FL', industry:'Finance',    location:'Boston, MA',        jobs:1, applications:32,  status:'Rejected', joined:'2025-02-01', package:'85k-140k', hr:'Amy Chen'    },
  { id:8, name:'CyberSec Pro',       avatar:'CP', industry:'Security',   location:'Washington, DC',    jobs:2, applications:55,  status:'Pending',  joined:'2025-02-05', package:'95k-170k', hr:'Rick Walls'  },
];

export const pendingApprovalsList = [
  { id:4, name:'MobileSoft',      avatar:'MS', industry:'Mobile Dev', location:'Austin, TX',      email:'hr@mobilesoft.com',  phone:'+1-512-300-1001', website:'mobilesoft.io',   size:'11-50',   joined:'2025-01-20', reason:'New company registration' },
  { id:5, name:'DesignCo Studio', avatar:'DC', industry:'Design',     location:'Los Angeles, CA', email:'hr@designco.com',    phone:'+1-213-400-2002', website:'designco.studio', size:'51-200',  joined:'2025-01-28', reason:'Expansion to new campus'   },
  { id:8, name:'CyberSec Pro',    avatar:'CP', industry:'Security',   location:'Washington, DC',  email:'hr@cybersecpro.com', phone:'+1-202-500-3003', website:'cybersecpro.com', size:'201-500', joined:'2025-02-05', reason:'First-time registration'   },
];

export const placementDrivesList = [
  { id:1, title:'TechNova Spring Drive',     company:'TechNova Solutions', date:'2025-03-10', location:'Campus Hall A', eligibility:'7.5 CGPA', branches:['CS','IT'],       registered:45, status:'Upcoming',  type:'On-Campus',  package:'80k-120k'  },
  { id:2, title:'InnoTech AI Recruitment',   company:'InnoTech Inc',       date:'2025-03-15', location:'Virtual',       eligibility:'8.0 CGPA', branches:['CS'],            registered:32, status:'Upcoming',  type:'Off-Campus', package:'90k-140k'  },
  { id:3, title:'CloudGen SDE Drive',        company:'CloudGen Systems',   date:'2025-02-20', location:'Campus Hall B', eligibility:'7.0 CGPA', branches:['CS','IT','EC'],  registered:60, status:'Completed', type:'On-Campus',  package:'100k-160k' },
  { id:4, title:'DataBridge Analytics Hunt', company:'DataBridge Corp',    date:'2025-03-22', location:'Virtual',       eligibility:'7.5 CGPA', branches:['CS','IT'],       registered:28, status:'Upcoming',  type:'Off-Campus', package:'75k-120k'  },
  { id:5, title:'DesignCo UI/UX Drive',      company:'DesignCo Studio',    date:'2025-02-10', location:'Virtual',       eligibility:'6.5 CGPA', branches:['ALL'],           registered:55, status:'Completed', type:'Off-Campus', package:'55k-90k'   },
  { id:6, title:'MobileSoft App Drive',      company:'MobileSoft',         date:'2025-04-01', location:'Campus Hall C', eligibility:'7.0 CGPA', branches:['CS','IT'],       registered:0,  status:'Scheduled', type:'On-Campus',  package:'60k-100k'  },
];

export const applicationsList = [
  { id:1,  student:'Aarav Mehta',   avatar:'AM', company:'TechNova Solutions', job:'Senior React Developer', date:'2025-02-01', status:'Hired',               round:'Offer',     score:92 },
  { id:2,  student:'Priya Sharma',  avatar:'PS', company:'InnoTech Inc',       job:'Java Developer',         date:'2025-02-03', status:'Under Review',        round:'Technical', score:78 },
  { id:3,  student:'Liam Johnson',  avatar:'LJ', company:'CloudGen Systems',   job:'DevOps Engineer',        date:'2025-02-04', status:'Interview Scheduled', round:'HR',        score:88 },
  { id:4,  student:'Sofia Torres',  avatar:'ST', company:'DataBridge Corp',    job:'Data Analyst',           date:'2025-02-05', status:'Hired',               round:'Offer',     score:95 },
  { id:5,  student:'Noah Williams', avatar:'NW', company:'MobileSoft',         job:'Flutter Developer',      date:'2025-02-06', status:'Rejected',            round:'Technical', score:55 },
  { id:6,  student:'Aisha Khan',    avatar:'AK', company:'TechNova Solutions', job:'Frontend Developer',     date:'2025-02-07', status:'Shortlisted',         round:'Technical', score:91 },
  { id:7,  student:'Carlos Rivera', avatar:'CR', company:'MobileSoft',         job:'Android Developer',      date:'2025-02-08', status:'Under Review',        round:'Aptitude',  score:83 },
  { id:8,  student:'Emma Wilson',   avatar:'EW', company:'DesignCo Studio',    job:'UI/UX Designer',         date:'2025-02-09', status:'Interview Scheduled', round:'Portfolio', score:76 },
  { id:9,  student:'Rahul Gupta',   avatar:'RG', company:'CloudGen Systems',   job:'Cloud Architect',        date:'2025-02-10', status:'Hired',               round:'Offer',     score:94 },
  { id:10, student:'Zara Ahmed',    avatar:'ZA', company:'DesignCo Studio',    job:'Product Designer',       date:'2025-02-11', status:'Shortlisted',         round:'Technical', score:87 },
];

export const resultsList = [
  { id:1, student:'Aarav Mehta',   avatar:'AM', branch:'CS', company:'TechNova Solutions', package:'120000', role:'Senior React Developer', offerDate:'2025-02-15', published:true  },
  { id:2, student:'Sofia Torres',  avatar:'ST', branch:'CS', company:'DataBridge Corp',    package:'95000',  role:'Data Analyst',           offerDate:'2025-02-16', published:true  },
  { id:3, student:'Rahul Gupta',   avatar:'RG', branch:'CS', company:'CloudGen Systems',   package:'130000', role:'Cloud Architect',         offerDate:'2025-02-17', published:true  },
  { id:4, student:'Priya Sharma',  avatar:'PS', branch:'IT', company:'InnoTech Inc',       package:'85000',  role:'Java Developer',          offerDate:'',          published:false },
  { id:5, student:'Aisha Khan',    avatar:'AK', branch:'IT', company:'TechNova Solutions', package:'110000', role:'Frontend Developer',      offerDate:'',          published:false },
  { id:6, student:'Carlos Rivera', avatar:'CR', branch:'CS', company:'MobileSoft',         package:'75000',  role:'Android Developer',       offerDate:'',          published:false },
];

export const reportsData = {
  branchWise: [
    { branch:'Computer Science',       students:220, placed:148, pct:67 },
    { branch:'Information Technology', students:180, placed:110, pct:61 },
    { branch:'Electronics',            students:160, placed:72,  pct:45 },
    { branch:'Mechanical',             students:140, placed:42,  pct:30 },
    { branch:'Civil',                  students:100, placed:28,  pct:28 },
  ],
  monthly: [
    { month:'Sep', placed:18 },
    { month:'Oct', placed:34 },
    { month:'Nov', placed:52 },
    { month:'Dec', placed:44 },
    { month:'Jan', placed:78 },
    { month:'Feb', placed:86 },
  ],
  topCompanies: [
    { name:'TechNova Solutions', hired:48, avg:'115k' },
    { name:'CloudGen Systems',   hired:36, avg:'128k' },
    { name:'InnoTech Inc',       hired:30, avg:'92k'  },
    { name:'DataBridge Corp',    hired:24, avg:'88k'  },
    { name:'DesignCo Studio',    hired:18, avg:'70k'  },
  ],
};

export const settingsData = {
  institute:    'Global Tech Institute',
  coordinator:  'Dr. Anjali Verma',
  email:        'placement@gti.edu',
  phone:        '+91-9000012345',
  year:         '2024-2025',
  season:       'Active',
  minCgpa:      7.0,
  maxBacklogs:  0,
  attendance:   75,
  emailApply:   true,
  emailHire:    true,
  sms:          false,
  regOpen:      true,
  resumeOpen:   true,
  maintenance:  false,
  timeout:      30,
};

export const notificationsList = [
  { id:1, msg:'MobileSoft requested company approval',      time:'10 min ago', read:false, type:'approval' },
  { id:2, msg:'DesignCo Studio requested company approval', time:'30 min ago', read:false, type:'approval' },
  { id:3, msg:'New student registered: Zara Ahmed',         time:'1 hr ago',   read:false, type:'student'  },
  { id:4, msg:'TechNova Spring Drive has 45 registrations', time:'3 hrs ago',  read:true,  type:'drive'    },
  { id:5, msg:'Result published for Aarav Mehta',           time:'1 day ago',  read:true,  type:'result'   },
  { id:6, msg:'System backup completed successfully',        time:'2 days ago', read:true,  type:'system'   },
];
