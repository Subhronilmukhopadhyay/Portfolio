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
  bio: `Graduated Computer Science engineer from VIT with an AI/ML focus, now shipping agentic systems at Hitachi. I design stateful multi-agent workflows — LangGraph orchestration over Model Context Protocol servers — build zero-shot visual inspection for the factory floor, and reproduce recent research on LLM reasoning, LLM safety under production serving, and robot safety. Equal parts researcher and full-stack builder: from DINOv2 feature matching to cloud-deployed React + Node apps.`,
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
    items: ['Python', 'C++', 'C', 'Java', 'JavaScript', 'TypeScript', 'R', 'MATLAB', 'Motoko', 'HTML', 'CSS'],
  },
  {
    key: 'aiml',
    label: 'AI / ML',
    accent: 'agent',
    featured: true,
    items: [
      'PyTorch',
      'TensorFlow',
      'Keras',
      'scikit-learn',
      'LightGBM',
      'LLMs',
      'RAG',
      'LangGraph',
      'MCP',
      'vLLM',
      'DINOv2',
      'SAM 2',
      'Gemini API',
      'RL (PPO · Q-learning · GRPO)',
    ],
  },
  {
    key: 'cloud',
    label: 'Systems & Cloud',
    accent: 'mint',
    items: ['AWS (Trainium/Neuron)', 'GCP (Cloud Run)', 'Docker', 'FastAPI', 'Isaac Sim / Lab', 'PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'],
  },
  {
    key: 'web',
    label: 'Frameworks & Web',
    accent: 'live',
    items: ['ReactJS', 'NodeJS', 'Streamlit', 'OpenCV', 'Manim'],
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
        'A single natural-language prompt becomes a complete end-to-end rail itinerary — the system autonomously orchestrates train, hotel, and event lookups across MCP servers.',
      demo: 'runAgent', // renders the interactive "Run My Agent" pipeline
      metrics: [
        { value: 3, suffix: '', label: 'MCP servers' },
        { value: 9, suffix: '', label: 'tools exposed' },
        { value: 9, suffix: '-node', label: 'LangGraph flow' },
        { value: 9, suffix: '', label: 'use cases' },
      ],
      highlights: [
        'Turned a single natural-language prompt into a complete end-to-end itinerary across 3 MCP servers (transit, merchant, events) exposing 9 tools, shipped as a Dockerized FastAPI + Streamlit stack.',
        'Architected a stateful 9-node LangGraph workflow with input guardrails and deterministic + LLM-driven routing over 9 use cases, backed by a registry that spawns each MCP server as an isolated subprocess and reflects tool schemas at runtime.',
        'Phase 2: own the data and matching workstreams — designed the hub data model and a matching-engine prototype that balances traveler fit against operator goals via a Pareto skyline and friction scoring.',
      ],
    },
    {
      key: 'inspection',
      index: '02',
      name: 'Zero-shot Visual Inspection',
      tag: 'Flagship · Computer Vision',
      summary:
        'Catches missing or wrongly fitted parts on factory assemblies — unclamped cables, unlatched connectors — by comparing a test photo against a single golden photo, with no training data or labels.',
      stagesLabel: '// golden_vs_test_pipeline',
      stages: ['golden photo', 'EfficientLoFTR + MAGSAC++', 'DINOv2 / ResNet18 features', 'random-field threshold', 'defect box'],
      metrics: [
        { value: 17, suffix: '×', label: 'fewer false alarms' },
        { value: 0.89, suffix: '', label: 'defect-class F1' },
        { value: 15, suffix: '', label: 'versions shipped' },
        { value: 0, suffix: '', label: 'training images' },
      ],
      highlights: [
        'Over 15 versions, cut false alarms per good frame from 6.9 to 0.40 and nearly doubled defect-class F1 (0.49 → 0.89) using frozen DINOv2/ResNet18 features, EfficientLoFTR + MAGSAC++ registration, and random-field-theory thresholds that replaced a naive test over-detecting by 1,000×.',
        'Moved to a ResNet18 backbone that is 15× cheaper with a 3× finer grid on CPU, and benchmarked a 27B vision-language model to show it fails the task (81% false-positive rate).',
      ],
    },
    {
      key: 'debate',
      index: '03',
      name: 'Multi-agent LLM Reasoning',
      tag: 'Research · MAD / iMAD (AAAI 2026)',
      summary:
        'Reproduced Multi-Agent Debate and iMAD on open-source models — when is it worth making LLMs argue, and when should one model just answer?',
      metrics: [
        { value: 63, suffix: '%', label: 'max token savings' },
        { value: 90, prefix: '~', suffix: '%', label: 'of debate gain kept' },
        { value: 6, suffix: '', label: 'benchmarks' },
      ],
      highlights: [
        'Reproduced MAD and iMAD on Qwen3-8B across GSM8K, MATH-500, and MMLU-Pro, writing the full harness beyond the released classifier (41-feature extractor, sympy grading) plus a 63-item paper-fidelity audit.',
        'iMAD cut debate tokens by 18–63% vs. always-on MAD while capturing ~90% of its accuracy gain on GSM8K; then built a 117-test pipeline analysing the debating agents’ hidden states layer by layer.',
      ],
    },
    {
      key: 'serving',
      index: '04',
      name: 'LLM Safety under Production Serving',
      tag: 'Research · LLM Safety',
      summary:
        'Do activation-probe safety monitors stay calibrated when the model runs in vLLM — FP8 KV cache, co-batching, torch.compile — instead of offline?',
      metrics: [
        { value: 2, suffix: '', label: 'Qwen3 models' },
        { value: 13, suffix: '', label: 'compiled runs audited' },
        { value: 6, suffix: '', label: 'exact output classes' },
      ],
      highlights: [
        'Owned serving engineering and all GPU experiments: made the pipeline model-independent (Qwen3-1.7B / 4B) and wrote the pre-registered addenda on capture checks, compile replicates, and load repeatability.',
        'Diagnosed that changing almost any VLLM_* variable silently triggers a fresh compile, and built a compile guard to keep runs reproducible.',
      ],
    },
    {
      key: 'unisafe',
      index: '05',
      name: 'Robot Safety Filter Reproduction',
      tag: 'Research · UNISafe (CoRL 2025)',
      summary:
        'Reproduced an uncertainty-aware safety filter for camera-driven robots — a DreamerV3 world model plus a reachability value function — on the Isaac Lab block-plucking benchmark.',
      metrics: [
        { value: 1000, suffix: '', label: 'trials per run' },
        { value: 5, suffix: '', label: 'causes ruled out' },
        { value: 40, suffix: '', label: 'grasp runs traced' },
      ],
      highlights: [
        'Stood up Isaac Sim 4.2 + Isaac Lab on an RTX 4090, patched the upstream release, and ran 1,000-trial evaluations with and without the filter.',
        'Ruled out 5 candidate causes of the gap to the paper (time limit, rendering, noise, OOD threshold, action sampling) and traced failures to policy gripper-open commands in a 40-run grasp study.',
      ],
    },
    {
      key: 'xpu',
      index: '06',
      name: 'GPU-to-Accelerator Migration',
      tag: 'Strategy · AWS Trainium',
      summary:
        'Can LLM inference move off GPUs onto AI accelerators? Pressure-tested the plan against the AWS Neuron SDK before anyone spent the budget.',
      metrics: [
        { value: 4, suffix: '', label: 'blocking gaps found' },
        { value: 8, suffix: '+', label: 'platforms surveyed' },
        { value: 50, suffix: '%', label: 'less effort' },
      ],
      highlights: [
        'Uncovered 4 blocking gaps in the proposed plan — pipeline parallelism, prefill–decode disaggregation, KV-cache transfer, and hybrid Trainium–GPU serving.',
        'Surveyed 8+ accelerators (Trainium, TPU, MI300X, H100, Tenstorrent, Jetson Thor) and proposed a scoped path at half the effort (2–3 vs. 3–6 person-months).',
      ],
    },
  ],
}

// The LangGraph pipeline visualized in the "Run My Agent" signature interaction.
export const pipeline = [
  { id: 'prompt', label: 'NL Prompt', kind: 'input', note: '"Plan a 3-day trip with trains, a hotel, and events."' },
  { id: 'guardrail', label: 'guardrail', kind: 'node', note: 'Rejects injection & out-of-scope requests before any planning.' },
  { id: 'planner', label: 'planner', kind: 'node', note: 'Detects the use case (1 of 9) and builds an ordered task list.' },
  { id: 'dispatcher', label: 'dispatcher', kind: 'node', note: 'Picks the next runnable task and routes it to an agent.' },
  { id: 'agent', label: 'agent', kind: 'node', note: 'Deterministic or LLM agent prepares the tool call.' },
  { id: 'exec', label: 'mcp_exec', kind: 'mcp', note: 'Calls the MCP tool · 3 servers · 9 tools.' },
  { id: 'recorder', label: 'recorder', kind: 'node', note: 'Records results and loops until every task is done.' },
  { id: 'composer', label: 'composer', kind: 'node', note: 'Weaves the results into one reply · output guardrail.' },
  { id: 'itinerary', label: 'Itinerary', kind: 'output', note: 'Trains · Hotel · Events — one end-to-end plan.' },
]

export const internships = [
  {
    company: 'Hitachi India Pvt. Ltd.',
    place: 'Bengaluru',
    title: 'Research & Development Intern',
    dates: 'Jan 2026 — Jul 2026',
    metric: { value: 227, suffix: 'K+', label: 'ATM journals parsed' },
    highlights: [
      'Built an ETL pipeline over 227K+ ATM electronic-journal files from 27 machines (decryption, merging, error-code extraction) and trained 8 failure-prediction models, with LightGBM reaching 0.83 ROC-AUC.',
      'Built a video-to-SOP pipeline for GSK equipment maintenance: Gemini 2.5 extracts atomic actions from task videos, Q-learning process discovery with Petri-net conformance beats the heuristic baseline, and rule-based checks flag missed or out-of-sequence steps.',
      'Produced a 1,000+ line Manim explainer animating the 5-stage process-discovery pipeline, with 3D embeddings and an FSM resolving 10 canonical steps into 4 validated task orderings.',
      'Learned procedural task graphs from egocentric videos (CaptainCook4D) with RL, reaching loop-F1 of 1.00 and accepting 12% of invalid traces vs. 94% for a DAG baseline (NeurIPS 2024 DTGL).',
      'Programmed real-time acoustic source localization (4-mic array, GCC-PHAT + CNN-BiGRU) for touchless task validation, and a dashboard consolidating 10+ data-center KPIs.',
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
    name: 'Almanac — Life Dashboard',
    stack: ['Node 22', 'React', 'TypeScript', 'SQLite / Turso', 'Cloud Run'],
    date: 'Nov 2026',
    github: 'https://github.com/Subhronilmukhopadhyay/Life-dashboard',
    metric: { value: 0, suffix: '', label: 'server npm dependencies' },
    blurb:
      'Multi-user dashboard for spending, trends, commitments, and routines, deployed on Google Cloud Run with Turso-hosted SQLite, a local replica, and daily snapshots. Zero-dependency Node 22 server with scrypt auth, signed sessions, and lockout; trend lines are least-squares fits gated on r² ≥ 0.25 so noise is never reported as a trend.',
    tags: ['Full-stack', 'Cloud'],
  },
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
