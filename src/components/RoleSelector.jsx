import { useState } from 'react';

const roleIcons = {
  'Software Developer': '💻',
  'Frontend Developer': '🎨',
  'Backend Developer': '⚙️',
  'Fullstack Developer': '🔧',
  'Data Scientist': '📊',

  'Marketing Manager': '📢',
  'Sales Representative': '🤝',
  'Project Manager': '📋',
  'Business Analyst': '📈',

  Nurse: '🏥',
  Doctor: '⚕️',

  'Graphic Designer': '🖌️',
  'Content Writer': '✍️',

  Teacher: '🎓',

  'Administrative Assistant': '📎',

  'Customer Service Representative': '🗣️',

  'Product Manager': '📱',

  'UX Designer': '🖌️',
};

const roleCategories = {
  tech: [
    'Software Developer',
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Data Scientist',
  ],
  business: [
    'Marketing Manager',
    'Sales Representative',
    'Project Manager',
    'Business Analyst',
  ],
  healthcare: ['Nurse', 'Doctor'],
  creative: ['Graphic Designer', 'Content Writer'],
  other: [
    'Teacher',
    'Administrative Assistant',
    'Customer Service Representative',
    'Product Manager',
    'UX Designer',
  ],
};

const categoryTranslations = {
  tech: {
    en: 'Technology',
    sv: 'Teknologi',
  },
  business: {
    en: 'Business',
    sv: 'Affärsverksamhet',
  },
  healthcare: {
    en: 'Healthcare',
    sv: 'Sjukvård',
  },
  creative: {
    en: 'Creative',
    sv: 'Kreativa yrken',
  },
  other: {
    en: 'Other Roles',
    sv: 'Andra roller',
  },
};

export default function RoleSelector({
  onSelect,
  language,
  languageData,
  roleTranslations,
}) {
  const [customJob, setCustomJob] = useState('');

  const handleCustomJobSubmit = (e) => {
    e.preventDefault();
    if (customJob.trim()) {
      onSelect(customJob.trim());
    }
  };

  return (
    <div className='bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl transition-shadow hover:shadow-indigo-500/30'>
      {/* Custom Job Input Form */}
      <div className='mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800'>
        <h3 className='text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-4'>
          {languageData[language].customJob}
        </h3>

        <form
          onSubmit={handleCustomJobSubmit}
          className='flex flex-col sm:flex-row gap-3'
        >
          <input
            type='text'
            value={customJob}
            onChange={(e) => setCustomJob(e.target.value)}
            placeholder={languageData[language].customJobPlaceholder}
            className='flex-grow rounded-lg border border-indigo-200 dark:border-indigo-700 px-4 py-2
                      bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
                      focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
          <button
            type='submit'
            disabled={!customJob.trim()}
            className='px-6 py-2 bg-indigo-600 text-white rounded-lg
                    hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed
                    transition-colors duration-200'
          >
            {languageData[language].startCustomJob}
          </button>
        </form>
      </div>

      <h2 className='text-2xl font-semibold text-center text-slate-700 dark:text-slate-200 mb-6'>
        {languageData[language].chooseArea}
      </h2>
      <p className='text-slate-600 dark:text-slate-400 text-center mb-8'>
        {languageData[language].selectRole}
      </p>

      {/* Display roles by category */}
      {Object.entries(roleCategories).map(([category, roles]) => (
        <div key={category} className='mb-8'>
          <h3 className='text-lg font-medium text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2'>
            {categoryTranslations[category][language]}
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => onSelect(role)}
                className='flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-700 rounded-lg
                        border border-slate-200 dark:border-slate-600
                        hover:bg-indigo-50 dark:hover:bg-indigo-900/50
                        hover:border-indigo-500 dark:hover:border-indigo-500
                        hover:shadow-md transition-all duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50'
              >
                <span className='text-3xl mb-2'>{roleIcons[role] || '🧑‍💼'}</span>
                <span className='font-medium text-slate-700 dark:text-slate-200 text-center'>
                  {roleTranslations[role] && roleTranslations[role][language]
                    ? roleTranslations[role][language]
                    : role}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
