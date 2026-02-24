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
    coverImage: '/images/portfolio/hello-kitty-ai.png',
    images: ['/images/portfolio/hello-kitty-ai.png'],
    techStack: ['Python', 'OpenAI API', 'Google Gemini', 'SpeechRecognition', 'pyttsx3', 'PyAudio'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/Personal-Assistant-Hello-Kitty-',
    liveUrl: 'https://personal-assistant-hello-kitty.vercel.app',
    featured: true,
    completedAt: '2024-08-15',
  },
  {
    id: 'orbit-web-platform',
    slug: 'orbit-web-platform',
    title: 'ORBIT Web Platform',
    category: 'web',
    shortDescription:
      'Full-stack company website with AI chatbot, dark/light theme, and glassmorphism design',
    fullDescription:
      'The website you are browsing right now. Built from scratch with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features an AI chatbot powered by Gemini, dark/light theme toggle, contact and freelancer application forms, animated sections, and a complete design system with glassmorphism effects.',
    coverImage: '/images/portfolio/orbit-web-platform.png',
    images: ['/images/portfolio/orbit-web-platform.png'],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Gemini AI'],
    liveUrl: 'https://orbit-wheat-tau.vercel.app',
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/ORBIT',
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
      'An AI-powered tool that analyzes your resume against a job description and gives a compatibility score from 0-100%. It uses sentence transformers for semantic matching, detects missing skills, and suggests specific improvements. Supports PDF and text uploads. All processing happens locally — no data is sent to external servers.',
    coverImage: '/images/portfolio/ai-resume-matcher.png',
    images: ['/images/portfolio/ai-resume-matcher.png'],
    techStack: ['Python', 'Streamlit', 'FastAPI', 'Sentence Transformers', 'NLTK', 'spaCy'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/ai-resume-job-matcher',
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
    coverImage: '/images/portfolio/movie-recommendation.png',
    images: ['/images/portfolio/movie-recommendation.png'],
    techStack: ['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'TF-IDF'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/Movie-Recommendation-Engine',
    liveUrl: 'https://movie-recommendation-engine-one.vercel.app',
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
    coverImage: '/images/portfolio/face-recognition.png',
    images: ['/images/portfolio/face-recognition.png'],
    techStack: ['Python', 'OpenCV', 'Dlib', 'Streamlit', 'SQLite', 'LBPH'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/Face-Recognition-Attendence-System',
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
    coverImage: '/images/portfolio/e-voting-console.png',
    images: ['/images/portfolio/e-voting-console.png'],
    techStack: ['React.js', 'Vite', 'Firebase', 'JavaScript', 'CSS3'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/E-Voting-Console-for-students',
    featured: false,
    completedAt: '2024-06-15',
  },
  {
    id: 'wearblend',
    slug: 'wearblend',
    title: 'WearBlend — AI Virtual Try-On',
    category: 'ai',
    shortDescription:
      'AI-powered virtual try-on app that generates realistic outfit photos using DALL-E and Gemini',
    fullDescription:
      'An AI virtual try-on application where users upload clothing images, compose outfits, and generate realistic fashion photos. Classic Mode offers professional flat-lay composition with automatic background removal and color extraction. AI Mode uses DALL-E 3 or Gemini to generate realistic outfit visualizations from custom prompts.',
    coverImage: '/images/portfolio/wearblend.png',
    images: ['/images/portfolio/wearblend.png'],
    techStack: ['Python', 'Streamlit', 'OpenAI DALL-E 3', 'Google Gemini', 'Pillow', 'rembg'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/WearBlend',
    featured: false,
    completedAt: '2025-02-01',
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
    coverImage: '/images/portfolio/personal-portfolio.png',
    images: ['/images/portfolio/personal-portfolio.png'],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Particles.js', 'ScrollReveal', 'EmailJS'],
    githubUrl: 'https://github.com/Shehriyar-Ali-Rustam/Updated-Personal-Portfolio',
    liveUrl: 'https://updated-personal-portfolio-pi.vercel.app',
    featured: false,
    completedAt: '2024-05-20',
  },
]
