'use client';

export default function TemplateGallery({ onSelectTemplate, selectedTemplate }) {
  const templates = [
    // GRADIENT TEMPLATES (1-7)
    {
      id: 'soccer-blue',
      name: 'Soccer Blue',
      colors: { primary: '#0EA5E9', secondary: '#1E293B', background: 'linear-gradient(135deg, #0EA5E9 0%, #1E40AF 100%)' }
    },
    {
      id: 'esports-purple',
      name: 'Esports Purple',
      colors: { primary: '#A855F7', secondary: '#1E293B', background: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)' }
    },
    {
      id: 'gaming-dark',
      name: 'Gaming Dark',
      colors: { primary: '#EF4444', secondary: '#1F2937', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }
    },
    {
      id: 'pro-orange',
      name: 'Pro Orange',
      colors: { primary: '#F59E0B', secondary: '#1F2937', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }
    },
    {
      id: 'finals-blue',
      name: 'Finals Blue',
      colors: { primary: '#3B82F6', secondary: '#1E293B', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }
    },
    {
      id: 'warriors-cyan',
      name: 'Warriors Cyan',
      colors: { primary: '#06B6D4', secondary: '#1E293B', background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }
    },
    {
      id: 'volcano-purple',
      name: 'Volcano Purple',
      colors: { primary: '#9333EA', secondary: '#1F2937', background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)' }
    },

    // CUSTOM BACKGROUND TEMPLATES (8-23)
    {
      id: 'template-1',
      name: 'Teal Underwater',
      backgroundImage: '/templates/backgrounds/bg-1.jpg'
    },
    {
      id: 'template-2',
      name: 'Ice Storm Arena',
      backgroundImage: '/templates/backgrounds/bg-2.jpg'
    },
    {
      id: 'template-3',
      name: 'Gold Jungle Frame',
      backgroundImage: '/templates/backgrounds/bg-3.jpg'
    },
    {
      id: 'template-4',
      name: 'Purple Elite Warriors',
      backgroundImage: '/templates/backgrounds/bg-4.jpg'
    },
    {
      id: 'template-5',
      name: 'Cyan Dragon Sky',
      backgroundImage: '/templates/backgrounds/bg-5.jpg'
    },
    {
      id: 'template-6',
      name: 'Purple Tech Border',
      backgroundImage: '/templates/backgrounds/bg-6.jpg'
    },
    {
      id: 'template-7',
      name: 'Dark Embers',
      backgroundImage: '/templates/backgrounds/bg-7.jpg'
    },
    {
      id: 'template-8',
      name: 'Purple Mountain',
      backgroundImage: '/templates/backgrounds/bg-8.jpg'
    },
    {
      id: 'template-9',
      name: 'Pink Leaderboard',
      backgroundImage: '/templates/backgrounds/bg-9.jpg'
    },
    {
      id: 'template-10',
      name: 'Red Gaming Frame',
      backgroundImage: '/templates/backgrounds/bg-10.jpg'
    },
    {
      id: 'template-11',
      name: 'Minimal Light',
      backgroundImage: '/templates/backgrounds/bg-11.jpg'
    },
    {
      id: 'template-12',
      name: 'Red Black Diagonal',
      backgroundImage: '/templates/backgrounds/bg-12.jpg'
    },
    {
      id: 'template-13',
      name: 'Action Blue Squad',
      backgroundImage: '/templates/backgrounds/bg-13.jpg'
    },
    {
      id: 'template-14',
      name: 'Winter Panda',
      backgroundImage: '/templates/backgrounds/bg-14.jpg'
    },
    {
      id: 'template-15',
      name: 'Blue Slash Modern',
      backgroundImage: '/templates/backgrounds/bg-15.jpg'
    },
    {
      id: 'template-16',
      name: 'Neon Purple Cityscape',
      backgroundImage: '/templates/backgrounds/bg-16.jpg'
    }
  ];

  return (
    <div>
      <h2 className="text-4xl font-black text-white mb-8 text-center">
        Choose Your Template (23 Designs)
      </h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`cursor-pointer rounded-lg overflow-hidden transition ${
              selectedTemplate?.id === template.id
                ? 'ring-4 ring-blue-500 scale-105'
                : 'hover:scale-105'
            }`}
          >
            <div
              className="h-48 flex items-center justify-center relative"
              style={{
                background: template.backgroundImage 
                  ? `url(${template.backgroundImage})` 
                  : template.colors.background,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 text-white text-center p-4">
                <div className="text-2xl font-black mb-2">{template.name}</div>
                {selectedTemplate?.id === template.id && (
                  <div className="text-green-400 text-3xl">✓</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-lg">
            Selected: <span className="text-white font-bold">{selectedTemplate.name}</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Click "Preview & Download" to see it with your tournament data
          </p>
        </div>
      )}
    </div>
  );
}
