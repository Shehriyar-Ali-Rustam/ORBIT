import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'hello-kitty-ai',
    slug: 'hello-kitty-ai-assistant',
    title: 'Hello Kitty AI Voice Assistant',
    category: 'ai',
    shortDescription:
      'Wake-word activated personal AI assistant powered by ChatGPT and Google Gemini',
    fullDescription:
      'A voice-activated AI assistant that responds to the wake word "Hello Kitty". It listens through the microphone, converts speech to text, sends it to ChatGPT or Gemini for a response, and speaks the answer back. Supports conversation memory, customizable wake word, adjustable voice speed, and switchable AI providers.',
    coverImage: '/images/portfolio/hello-kitty-ai.webp',
    images: ['/images/portfolio/hello-kitty-ai.webp'],
    techStack: ['Python', 'OpenAI API', 'Google Gemini', 'SpeechRecognition', 'pyttsx3', 'PyAudio'],
    liveUrl: 'https://personal-assistant-hello-kitty.vercel.app',
    featured: true,
    completedAt: '2024-08-15',
    caseStudy: {
      problem:
        'Most voice assistants are locked to one provider, one voice, and one wake word. We wanted to find out what it takes to build a genuinely personal one: your wake word, your choice of model, running on your own machine.',
      approach:
        'We built a full voice loop from scratch: always-listening wake word detection, speech to text, a swappable AI provider layer, then text back to speech. The provider abstraction meant switching between ChatGPT and Gemini became a config change rather than a rewrite.',
      highlights: [
        'Built a provider layer so the assistant can switch between OpenAI and Gemini without touching the voice pipeline',
        'Added conversation memory so it follows context across turns instead of treating every question as the first',
        'Made the wake word, voice speed, and model user-configurable rather than hardcoded',
        'Kept the whole loop running locally, so audio is not shipped to a third party unnecessarily',
      ],
      results: [
        { value: '2', label: 'AI providers, swappable' },
        { value: 'Custom', label: 'wake word and voice' },
        { value: 'Local', label: 'processing by default' },
      ],
      note: 'This project became the foundation for how we build client chatbots now: never hardcode the model provider, always leave room to switch when pricing or quality changes.',
    },
  },
  {
    id: 'orbit-web-platform',
    slug: 'orbit-web-platform',
    title: 'Orbit Innovations Web Platform',
    category: 'web',
    shortDescription:
      'Full-stack company website with AI chatbot, dark/light theme, and glassmorphism design',
    fullDescription:
      'The website you are browsing right now. Built from scratch with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features an AI chatbot powered by Gemini, dark/light theme toggle, contact and freelancer application forms, animated sections, and a complete design system with glassmorphism effects.',
    coverImage: '/images/portfolio/orbit-web-platform.webp',
    images: ['/images/portfolio/orbit-web-platform.webp'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Gemini AI'],
    liveUrl: 'https://orbitpk.com',
    featured: true,
    completedAt: '2025-02-24',
  },
  {
    id: 'ai-resume-job-matcher',
    slug: 'ai-resume-job-matcher',
    title: 'AI Resume-Job Matcher',
    category: 'ai',
    shortDescription:
      'AI tool that scores how well your resume matches a job posting with improvement tips',
    fullDescription:
      'An AI-powered tool that analyzes your resume against a job description and gives a compatibility score from 0-100%. It uses sentence transformers for semantic matching, detects missing skills, and suggests specific improvements. Supports PDF and text uploads. All processing happens locally - no data is sent to external servers.',
    coverImage: '/images/portfolio/ai-resume-matcher.webp',
    images: ['/images/portfolio/ai-resume-matcher.webp'],
    techStack: ['Python', 'Streamlit', 'FastAPI', 'Sentence Transformers', 'NLTK', 'spaCy'],
    liveUrl: 'https://resume-job-matcher-ai-shehriyar.streamlit.app/',
    featured: true,
    completedAt: '2025-01-10',
  },
  {
    id: 'movie-recommendation-engine',
    slug: 'movie-recommendation-engine',
    title: 'Movie Recommendation Engine',
    category: 'ai',
    shortDescription:
      'Content-based movie recommender using TF-IDF and cosine similarity across 290+ films',
    fullDescription:
      'A content-based movie recommendation system that suggests films based on genre, rating, and release year. Uses TF-IDF vectorization and cosine similarity to find matches. Features adjustable weighting so users can prioritize what matters most, title and director search, genre filtering across 20+ categories, and pre-computed similarity matrices for instant results.',
    coverImage: '/images/portfolio/movie-recommendation.webp',
    images: ['/images/portfolio/movie-recommendation.webp'],
    techStack: ['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'TF-IDF'],
    liveUrl: 'https://movie-recommendation-engine-shehriyar.streamlit.app/',
    featured: false,
    completedAt: '2024-12-01',
  },
  {
    id: 'face-recognition-attendance',
    slug: 'face-recognition-attendance',
    title: 'Face Recognition Attendance System',
    category: 'ai',
    shortDescription:
      'Automated attendance system using facial recognition with anti-spoofing and reporting',
    fullDescription:
      'A Python-based attendance system that uses facial recognition to automatically mark attendance. Supports student enrollment with multi-angle face capture, real-time multi-face detection, two recognition engines (Dlib deep learning and LBPH), anti-spoofing with blink and movement detection, and data export to Excel, CSV, and PDF.',
    coverImage: '/images/portfolio/face-recognition.webp',
    images: ['/images/portfolio/face-recognition.webp'],
    techStack: ['Python', 'OpenCV', 'Dlib', 'Streamlit', 'SQLite', 'LBPH'],
    liveUrl: '#',
    featured: false,
    completedAt: '2024-10-20',
  },
  {
    id: 'e-voting-console',
    slug: 'e-voting-console',
    title: 'E-Voting Console for Students',
    category: 'web',
    shortDescription:
      'Secure online voting app for student elections built with React and Firebase',
    fullDescription:
      'A React.js application for secure online voting in educational institutions. Students can cast votes through a clean interface, view live election results, and browse detailed candidate profiles. Built with Firebase Firestore for real-time database operations, responsive design for mobile and desktop, and modular component architecture.',
    coverImage: '/images/portfolio/e-voting-console.webp',
    images: ['/images/portfolio/e-voting-console.webp'],
    techStack: ['React.js', 'Vite', 'Firebase', 'JavaScript', 'CSS3'],
    liveUrl: 'https://e-voting-console-for-students.vercel.app/',
    featured: false,
    completedAt: '2024-06-15',
  },
  {
    id: 'wearblend',
    slug: 'wearblend',
    title: 'WearBlend - AI Virtual Try-On',
    category: 'ai',
    shortDescription:
      'AI-powered virtual try-on app that generates realistic outfit photos using DALL-E and Gemini',
    fullDescription:
      'An AI virtual try-on application where users upload clothing images, compose outfits, and generate realistic fashion photos. Classic Mode offers professional flat-lay composition with automatic background removal and color extraction. AI Mode uses DALL-E 3 or Gemini to generate realistic outfit visualizations from custom prompts.',
    coverImage: '/images/portfolio/wearblend.webp',
    images: ['/images/portfolio/wearblend.webp'],
    techStack: ['Python', 'Streamlit', 'OpenAI DALL-E 3', 'Google Gemini', 'Pillow', 'rembg'],
    liveUrl: 'https://wearblend.streamlit.app/',
    featured: false,
    completedAt: '2025-02-01',
  },
  {
    id: 'campalpha',
    slug: 'campalpha',
    title: 'CampAlpha - Adventure Sports Marketplace',
    category: 'web',
    shortDescription:
      'A marketplace connecting adventure sports enthusiasts with trips, gear, and experiences.',
    fullDescription:
      'CampAlpha is a community-focused marketplace built for the adventure sports world. Users can browse and book trips, discover gear, and connect with other enthusiasts. Designed for fast performance on mobile and a clean, photo-forward UI that puts the outdoors first.',
    coverImage: '/images/portfolio/campalpha.webp',
    images: ['/images/portfolio/campalpha.webp'],
    techStack: ['React', 'Firebase', 'JavaScript', 'CSS3'],
    liveUrl: 'https://campalpha.web.app',
    featured: true,
    completedAt: '2025-09-01',
    caseStudy: {
      problem:
        "Pakistan's adventure sports community was scattered across Facebook groups and WhatsApp threads. Gear sellers had no storefront, trip organisers posted into feeds that buried their listings within hours, and there was no single place for any of it to live.",
      approach:
        'We built a photo-first marketplace designed around the reality of the audience: mid-range Android phones on patchy connections. Firebase handled data, auth, and hosting so the client could launch fast and iterate rather than wait on backend infrastructure.',
      highlights: [
        'Designed the layout around large photography from the start, since adventure sells on imagery',
        'Chose Firebase over a custom backend to get to launch quickly with real-time data and no servers to maintain',
        'Built and tested mobile-first against slow connections, not as a desktop afterthought',
        'Cut the filter panel from six options to two after watching users ignore almost all of them',
      ],
      results: [
        { value: '2 wks', label: 'from design to launch' },
        { value: '1 place', label: 'for a scattered community' },
        { value: '100%', label: 'mobile-first traffic ready' },
      ],
      note: 'The lesson we keep relearning: the rich filtering we built first was ignored, and the stories section we scoped as a nice-to-have turned out to be what people came back for.',
    },
  },
  {
    id: 'cheezy-heaven',
    slug: 'cheezy-heaven',
    title: 'Cheezy Heaven - Pizza Delivery',
    category: 'web',
    shortDescription:
      'Premium pizza ordering and delivery experience for customers in Rawalpindi.',
    fullDescription:
      'Cheezy Heaven is an online ordering and home delivery platform for a premium pizza brand in Rawalpindi. Customers can browse the menu, customize their order, and place delivery requests with a smooth, mobile-friendly checkout flow.',
    coverImage: '/images/portfolio/cheezy-heaven.webp',
    images: ['/images/portfolio/cheezy-heaven.webp'],
    techStack: ['React', 'Firebase', 'JavaScript', 'CSS3'],
    liveUrl: 'https://cheezy-heaven.web.app',
    featured: true,
    completedAt: '2025-11-01',
    caseStudy: {
      problem:
        'Cheezy Heaven was taking every order by phone. Staff were writing tickets by hand during the dinner rush, mistakes were common, and there was no way for a customer to see the menu without calling and asking.',
      approach:
        'We built an ordering site around the actual rush-hour use case: a customer on a phone, hungry, who wants to see the menu and order in under a minute. Menu browsing had to work instantly, and checkout had to survive being tapped by someone in a hurry.',
      highlights: [
        'Put the full menu with prices online so customers stop calling to ask what is available',
        'Built the ordering flow mobile-first, because nobody orders pizza from a desktop',
        'Kept the brand loud and red rather than sanding it into another generic food template',
        'Structured the menu so items can be updated without a developer',
      ],
      results: [
        { value: '30+', label: 'menu items online' },
        { value: '24/7', label: 'ordering, no phone needed' },
        { value: '<1 min', label: 'menu to checkout' },
      ],
    },
  },
  {
    id: 'personal-portfolio',
    slug: 'personal-portfolio',
    title: 'Personal Portfolio Website',
    category: 'web',
    shortDescription:
      'Interactive portfolio website with particle backgrounds, scroll animations, and contact form',
    fullDescription:
      'A personal portfolio website built from scratch with HTML, CSS, and JavaScript. Features particle.js animated backgrounds, scroll reveal animations, tilt effects on cards, animated typing for skills display, a working contact form via EmailJS, and sections for projects, education, and work experience. Fully responsive across all devices.',
    coverImage: '/images/portfolio/personal-portfolio.webp',
    images: ['/images/portfolio/personal-portfolio.webp'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Particles.js', 'ScrollReveal', 'EmailJS'],
    liveUrl: 'https://updated-personal-portfolio-pi.vercel.app',
    featured: false,
    completedAt: '2024-05-20',
  },
]
