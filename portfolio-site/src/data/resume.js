// ============================================================
// NEXUS — content source of truth (from résumé)
// ============================================================

export const profile = {
  name: 'Subhronil Mukhopadhyay',
  firstName: 'Subhronil',
  lastName: 'Mukhopadhyay',
  role: 'Sr. Technical Engineer',
  company: 'Hitachi',
  companyFull: 'Hitachi India Pvt. Ltd.',
  discipline: 'Agentic AI / ML',
  tagline: 'I build systems that reason, route, and act on their own.',
  location: 'Bengaluru, IN',
  home: 'Vadodara, Gujarat',
  status: 'currently orchestrating agents',
  since: 'Jul 2026 → Present',
  bio: `Graduated Computer Science engineer from VIT with an AI/ML focus, now shipping agentic systems at Hitachi. I design stateful multi-agent workflows — LangGraph orchestration over Model Context Protocol servers — and translate dense ML pipelines into things people can actually see and trust. Equal parts researcher and full-stack builder: from GNN + Transformer models to real-time MERN platforms.`,
  education: {
    school: 'Vellore Institute of Technology',
    place: 'Vellore',
    degree: 'B.Tech, Computer Science',
    detail: 'Graduated',
    cgpa: '8.88 / 10',
    dates: 'Sep 2022 — May 2026',
  },
}

export const contact = {
  email: 'subhronilmukhopadhyay@gmail.com',
  phone: '+91 74058 04086',
  linkedin: 'https://linkedin.com/in/subhronil-mukhopadhyay',
  github: 'https://github.com/Subhronilmukhopadhyay',
  leetcode: 'https://leetcode.com/u/subhronilmukhopadhyay/',
  resume: '/Subhronil_Mukhopadhyay_Resume.pdf',
}

export const skillGroups = [
  {
    key: 'lang',
    label: 'Languages',
    accent: 'accent',
    items: ['Python', 'C++', 'C', 'Java', 'JavaScript', 'Motoko', 'R', 'MATLAB', 'HTML', 'CSS'],
  },
  {
    key: 'aiml',
    label: 'AI / ML',
    accent: 'agent',
    featured: true,
    items: [
      'TensorFlow',
      'Keras',
      'PyTorch',
      'scikit-learn',
      'LLMs',
      'RAG',
      'LangGraph',
      'MCP',
      'Pandas',
      'NumPy',
    ],
  },
  {
    key: 'cloud',
    label: 'Databases & Cloud',
    accent: 'mint',
    items: ['AWS', 'NLP', 'PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    key: 'web',
    label: 'Frameworks & Web',
    accent: 'live',
    items: ['ReactJS', 'NodeJS', 'OpenCV', 'jQuery', 'Bootstrap'],
  },
  {
    key: 'tools',
    label: 'Developer Tools',
    accent: 'gold',
    items: ['Git', 'Figma', 'OrCAD', 'Verilog HDL', 'DSA'],
  },
  {
    key: 'soft',
    label: 'Soft Skills',
    accent: 'dust',
    items: ['Networking', 'Leadership', 'Creativity', 'Research', 'Strategic Thinking', 'Resilience'],
  },
]

export const work = {
  company: 'Hitachi India Pvt. Ltd.',
  place: 'Bengaluru',
  title: 'Sr. Technical Engineer',
  sub: 'Contract via Hitachi Systems',
  dates: 'Jul 2026 — Present',
  // The role, broken into the distinct projects delivered under it.
  projects: [
    {
      key: 'middleware',
      index: '01',
      name: 'Agentic Travel Middleware',
      tag: 'Flagship · Agentic Systems',
      summary:
        'A single natural-language prompt becomes a complete end-to-end itinerary — the system autonomously orchestrates train, hotel, and event bookings across MCP servers.',
      demo: 'runAgent', // renders the interactive "Run My Agent" pipeline
      metrics: [
        { value: 3, suffix: '', label: 'MCP servers' },
        { value: 6, suffix: '', label: 'tools exposed' },
        { value: 6, suffix: '-node', label: 'LangGraph flow' },
        { value: 7, suffix: '', label: 'use cases' },
      ],
      highlights: [
        'Turned a single natural-language prompt into a complete end-to-end itinerary — autonomously orchestrating train, hotel, and event bookings across 3 MCP servers exposing 6 tools.',
        'Architected a stateful 6-node LangGraph workflow with deterministic + LLM-driven routing across 7 use cases, backed by a dynamic registry that spawns each MCP server as an isolated subprocess and reflects tool schemas at runtime.',
      ],
    },
    {
      key: 'manim',
      index: '02',
      name: 'Manim SOP Explainer',
      tag: 'Technical Visualization · GSK',
      summary:
        'A 1,000+ line animated explainer that translates a complex ML process-discovery pipeline into a stakeholder-ready visual for GSK equipment-maintenance SOPs.',
      stages: ['raw capture', '3D embedding', 'normalization', 'FSM parse'],
      metrics: [
        { value: 1000, suffix: '+', label: 'lines of Manim' },
        { value: 5, suffix: '-stage', label: 'discovery pipeline' },
        { value: 10, suffix: ' → 4', label: 'steps → orderings' },
      ],
      highlights: [
        'Produced a 1,000+ line Manim explainer animating a 5-stage process-discovery pipeline — from raw demonstration capture through 3D embedding, normalization, and finite-state-machine (FSM) parsing.',
        'Engineered 3D scene rendering (ThreeDAxes, Dot3D, animated camera orbits) and an FSM resolving 10 canonical steps into 4 validated task orderings.',
      ],
    },
  ],
}

// The LangGraph pipeline visualized in the "Run My Agent" signature interaction.
export const pipeline = [
  { id: 'prompt', label: 'NL Prompt', kind: 'input', note: '"Plan a 3-day trip with trains, a hotel, and events."' },
  { id: 'planner', label: 'planner', kind: 'node', note: 'Decomposes intent into an ordered task plan.' },
  { id: 'router', label: 'router', kind: 'node', note: 'Deterministic + LLM-driven routing across 7 use cases.' },
  { id: 'registry', label: 'mcp_registry', kind: 'node', note: 'Discovers & spawns each MCP server as an isolated subprocess.' },
  { id: 'exec', label: 'mcp_exec', kind: 'mcp', note: 'Reflects tool schemas at runtime · 3 servers · 6 tools.' },
  { id: 'recorder', label: 'recorder', kind: 'node', note: 'Assembles the end-to-end itinerary.' },
  { id: 'itinerary', label: 'Itinerary', kind: 'output', note: 'Trains booked · Hotel reserved · Events scheduled.' },
]

export const internships = [
  {
    company: 'Hitachi India Pvt. Ltd.',
    place: 'Bengaluru',
    title: 'Research & Development Intern',
    dates: 'Jan 2026 — Jun 2026',
    metric: { value: 30, prefix: '~', suffix: '%', label: 'downtime cut' },
    highlights: [
      'Analyzed 50K+ ATM error logs to surface recurring failure patterns; built a predictive-maintenance model estimated to cut unplanned downtime by ~30%.',
      'Designed a rule-based verification system flagging missed or out-of-sequence steps in GSK equipment-maintenance workflows, improving compliance-tracking accuracy.',
      'Programmed a signal-processing module for real-time task validation via acoustic signatures — enabling touchless quality control on the factory floor.',
      'Architected a monitoring dashboard consolidating 10+ data-center KPIs into a single operational view.',
    ],
  },
  {
    company: 'BeyonData Solutions Pvt. Ltd.',
    place: 'Ahmedabad',
    title: 'Machine Learning Intern',
    dates: 'Jun 2024 — Jul 2024',
    link: 'https://drive.google.com/file/d/1rQO-Fs9KFXLt9pom74eG1ied6ylTrGkD/view?usp=drive_link',
    metric: { value: 93.8, suffix: '%', label: 'accuracy · MobileNetV2' },
    highlights: [
      'Evaluated 5 CNN architectures (VGG16, ResNet50, InceptionV3, MobileNetV2, EfficientNetB0) on a 27-class logo dataset across 7 metrics including F1, precision, and inference time.',
      'Engineered augmentation pipelines reaching 93.8% classification accuracy via MobileNetV2; synthesized results into a comparative framework to inform production model selection.',
      'Compared accuracy vs. inference-time trade-offs to identify the optimal architecture for deployment.',
    ],
  },
]

export const projects = [
  {
    name: 'TimeCapsule Connect',
    stack: ['MERN', 'PostgreSQL', 'SlateJS', 'Yjs'],
    date: 'Jul 2025',
    live: 'https://timecapsule-connect-1.onrender.com',
    metric: { value: 100, suffix: 'K+', label: 'unlock combos' },
    blurb:
      'Full-stack platform supporting 100K+ time/location-based unlock combinations over 20+ years via KSUIDs & Google Maps API. Real-time collaborative editor (SlateJS + Yjs) with <100 ms sync for 10+ concurrent users; chunked 1 GB+ media uploads cut failure rates 60%.',
    tags: ['Full-stack', 'Realtime'],
  },
  {
    name: 'Dynamic Crowd Simulation',
    stack: ['GNN', 'Transformer', 'PyTorch', 'PPO', 'OpenCV'],
    date: 'Mar 2025',
    github:
      'https://github.com/Subhronilmukhopadhyay/Dynamic-Crowd-Simulation-with-Realistic-Behavior-Modeling',
    metric: { value: 99, suffix: '%+', label: 'trajectory accuracy' },
    blurb:
      'Hybrid GNN + Transformer model for pedestrian trajectory prediction hitting 99%+ test accuracy. Integrated a PPO reinforcement-learning agent for collision-free navigation — custom reward tuned to a mean +6.31 over 20K+ training timesteps.',
    tags: ['Research', 'RL'],
  },
  {
    name: 'Advanced Voting System',
    stack: ['NodeJS', 'OpenCV', 'TensorFlow', 'Keras', 'JS'],
    date: 'May 2024',
    live: 'https://advance-digilocker.onrender.com',
    metric: { value: 10, suffix: 'K+', label: 'daily-visitor stress test' },
    blurb:
      'Secure voting platform with Digilocker + Voter-ID authentication, targeting 1,000+ remote users and a projected 20% turnout lift. Stress-tested for 10K+ daily visitors, validating stable performance under peak load.',
    tags: ['Security', 'CV'],
  },
  {
    name: 'Player Injury Prediction',
    stack: ['ANN', 'TensorFlow', 'Keras', 'Python'],
    date: 'Aug 2023',
    github:
      'https://github.com/Subhronilmukhopadhyay/Player-injury-prediction-and-perforamance-analysis',
    metric: { value: 89, suffix: '%', label: 'forecast accuracy' },
    blurb:
      'ANN trained on NBA performance data reaching 89% accuracy and 90% precision for injury-type forecasting. Identified injury-trend patterns projected to improve prevention protocols 25% and reduce at-risk downtime 40%.',
    tags: ['Deep Learning', 'Analytics'],
  },
]

export const certifications = [
  {
    name: 'GATE Qualified',
    issuer: 'GATE',
    date: 'Mar 2026',
    link: 'https://drive.google.com/file/d/1rdAsCMI72mAHT7p3uxmYyhaJ3Ay7M6PS/view?usp=sharing',
  },
  {
    name: 'Amazon ML Summer School',
    issuer: 'Amazon',
    date: 'Sep 2025',
    link: 'https://drive.google.com/file/d/1Kf243vsauPNtK6LypOj2DxtP6L0LJwem/view?usp=sharing',
  },
  {
    name: 'Microsoft Azure AI-900',
    issuer: 'Microsoft',
    date: 'Aug 2024',
    link: 'https://www.certiport.com/portal/Pages/PrintTranscriptInfo.aspx?action=Cert&id=455&cvid=e/DjBvrCw80fhcKK1WkhBQ==',
  },
]

export const navSections = [
  { id: 'hero', label: 'Home', index: '00' },
  { id: 'about', label: 'About', index: '01' },
  { id: 'skills', label: 'Skills', index: '02' },
  { id: 'work', label: 'Work', index: '03' },
  { id: 'internships', label: 'Internships', index: '04' },
  { id: 'projects', label: 'Projects', index: '05' },
  { id: 'certs', label: 'Certs', index: '06' },
  { id: 'contact', label: 'Contact', index: '07' },
]
