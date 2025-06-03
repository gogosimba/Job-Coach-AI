import { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import Chat from './components/Chat';

const portfolioInfo = {
  name: "Jonathan Johansson", 
  linkedInUrl: "https://www.linkedin.com/in/jonathan-johansson5/",
  githubUrl: "https://github.com/gogosimba", 
  year: new Date().getFullYear() 
};

export const languageData = {
  en: {
    title: "Job Interview Simulator",
    subtitle: "Practice realistic job interviews with AI-powered feedback",
    chooseArea: "Select Job Category",
    selectRole: "Choose a position to start your interview preparation",
    customJob: "Or enter a custom job title",
    customJobPlaceholder: "Enter job title...",
    startCustomJob: "Start Interview",
    poweredBy: "Powered by AI • Built with React & Tailwind",
    footerCreator: "Created by",
    footerRights: "All rights reserved",
    welcomeMessage: "Hello, I'm Emma from HR. Thank you for coming in today for the {role} position. Could you start by telling me a bit about yourself and your experience? Or type \"start\" for me to begin the interview with a common question.",
    interviewPractice: "Interview Practice",
    inputPlaceholder: "Type your message...",
    sendButton: "Send",
    errorMessage: "Sorry, I couldn't process your request. Please try again.",
    voiceButtonStart: "Start Voice",
    voiceButtonStop: "Stop Voice",
    listeningText: "Listening...",
    voiceUnavailable: "Voice recognition not available in your browser",
    voiceInteraction: "Voice mode",
    textInteraction: "Text mode"
  },
  sv: {
    title: "Jobbintervju Simulator",
    subtitle: "Öva på realistiska jobbintervjuer med AI-driven feedback",
    chooseArea: "Välj Jobbkategori",
    selectRole: "Välj en position för att börja din intervjuförberedelse",
    customJob: "Eller ange en egen jobbtitel",
    customJobPlaceholder: "Ange jobbtitel...",
    startCustomJob: "Starta Intervju",
    poweredBy: "Drivs av AI • Byggd med React & Tailwind",
    footerCreator: "Skapad av",
    footerRights: "Alla rättigheter förbehållna",
    welcomeMessage: "Hej, jag heter Emma från HR. Tack för att du kommer på intervju för {roleTranslated}-tjänsten idag. Skulle du kunna börja med att berätta lite om dig själv och din erfarenhet? Eller skriv \"start\" så börjar jag intervjun med en vanlig fråga.",
    interviewPractice: "Intervjuövning",
    inputPlaceholder: "Skriv ditt meddelande...",
    sendButton: "Skicka",
    errorMessage: "Jag kunde tyvärr inte bearbeta din förfrågan. Vänligen försök igen.",
    voiceButtonStart: "Starta röst",
    voiceButtonStop: "Stoppa röst",
    listeningText: "Lyssnar...",
    voiceUnavailable: "Röstgenkänning är inte tillgänglig i din webbläsare",
    voiceInteraction: "Röstläge",
    textInteraction: "Textläge"
  }
};

const roleTranslations = {
  'Software Developer': {
    en: 'Software Developer',
    sv: 'Mjukvaruutvecklare',
  },
  'Frontend Developer': {
    en: 'Frontend Developer',
    sv: 'Frontend-utvecklare',
  },
  'Backend Developer': {
    en: 'Backend Developer',
    sv: 'Backend-utvecklare',
  },
  'Fullstack Developer': {
    en: 'Fullstack Developer',
    sv: 'Fullstack-utvecklare',
  },
  'Data Scientist': {
    en: 'Data Scientist',
    sv: 'Datavetare',
  },
  'Marketing Manager': {
    en: 'Marketing Manager',
    sv: 'Marknadsföringschef',
  },
  'Sales Representative': {
    en: 'Sales Representative',
    sv: 'Säljrepresentant',
  },
  'Project Manager': {
    en: 'Project Manager',
    sv: 'Projektledare',
  },
  'Business Analyst': {
    en: 'Business Analyst',
    sv: 'Affärsanalytiker',
  },
  Nurse: {
    en: 'Nurse',
    sv: 'Sjuksköterska',
  },
  Doctor: {
    en: 'Doctor',
    sv: 'Läkare',
  },
  'Graphic Designer': {
    en: 'Graphic Designer',
    sv: 'Grafisk Designer',
  },
  'Content Writer': {
    en: 'Content Writer',
    sv: 'Innehållsskapare',
  },
  Teacher: {
    en: 'Teacher',
    sv: 'Lärare',
  },
  'Administrative Assistant': {
    en: 'Administrative Assistant',
    sv: 'Administrativ Assistent',
  },
  'Customer Service Representative': {
    en: 'Customer Service Representative',
    sv: 'Kundtjänstmedarbetare',
  },
  'Product Manager': {
    en: 'Product Manager',
    sv: 'Produktchef',
  },
  'UX Designer': {
    en: 'UX Designer',
    sv: 'UX-designer',
  },
};

export default function App() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [language, setLanguage] = useState('en'); // Default language is English

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Top navigation bar with branding and language toggle */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                {languageData[language].title}
              </span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <span className="text-sm">🌐</span>
                <span>{language === 'en' ? 'Svenska' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl"> 
          <header className="text-center py-8">
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
              {languageData[language].title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {languageData[language].subtitle}
            </p>
          </header>

          {!selectedRole ? (
            <RoleSelector 
              onSelect={handleRoleSelect} 
              language={language} 
              languageData={languageData} 
              roleTranslations={roleTranslations} 
            />
          ) : (
            <Chat 
              role={selectedRole} 
              onBack={() => setSelectedRole(null)} 
              language={language}
              languageData={languageData}
              roleTranslations={roleTranslations}
            />
          )}
        </div>
      </div>

      {/* Enhanced footer with your info */}
      <footer className="bg-white dark:bg-slate-800 shadow-inner py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {languageData[language].footerCreator} 
                <a 
                  href={portfolioInfo.linkedInUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 dark:text-indigo-400 font-medium ml-1 hover:underline"
                >
                  {portfolioInfo.name}
                </a>
              </p>
              <span className="hidden sm:block mx-2 text-slate-400">•</span>
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                © {portfolioInfo.year} {languageData[language].footerRights}
              </p>
            </div>
            <div className="flex space-x-4">
              <a 
                href={portfolioInfo.linkedInUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                </svg>
              </a>
              {portfolioInfo.githubUrl && (
                <a 
                  href={portfolioInfo.githubUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {languageData[language].poweredBy}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}