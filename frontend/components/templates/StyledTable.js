'use client';

export default function StyledTable({ tournament, standings, template }) {
  if (!template) return null;

  const getTemplateStyles = () => {
    const templateId = template.id;

    const styles = {
      // GRADIENT TEMPLATES (1-7)
      'soccer-blue': {
        headerBg: '#0EA5E9',
        headerText: '#FFFFFF',
        rowEven: 'rgba(255,255,255,0.1)',
        rowOdd: 'rgba(0,0,0,0.3)',
        textColor: '#FFFFFF',
        accentColor: '#38BDF8',
        border: 'none'
      },
      'esports-purple': {
        headerBg: '#A855F7',
        headerText: '#FFFFFF',
        rowEven: 'rgba(255,255,255,0.1)',
        rowOdd: 'rgba(0,0,0,0.3)',
        textColor: '#FFFFFF',
        accentColor: '#C084FC',
        border: 'none'
      },
      'gaming-dark': {
        headerBg: '#EF4444',
        headerText: '#FFFFFF',
        rowEven: 'rgba(255,255,255,0.1)',
        rowOdd: 'rgba(0,0,0,0.3)',
        textColor: '#FFFFFF',
        accentColor: '#F87171',
        border: 'none'
      },
      'pro-orange': {
        headerBg: '#F59E0B',
        headerText: '#1F2937',
        rowEven: 'rgba(255,255,255,0.15)',
        rowOdd: 'rgba(0,0,0,0.3)',
        textColor: '#FFFFFF',
        accentColor: '#FCD34D',
        border: 'none'
      },
      'finals-blue': {
        headerBg: '#3B82F6',
        headerText: '#FFFFFF',
        rowEven: 'rgba(255,255,255,0.1)',
        rowOdd: 'rgba(0,0,0,0.3)',
        textColor: '#FFFFFF',
        accentColor: '#60A5FA',
        border: 'none'
      },
      'warriors-cyan': {
        headerBg: '#06B6D4',
        headerText: '#FFFFFF',
        rowEven: 'rgba(255,255,255,0.1)',
        rowOdd: 'rgba(0,0,0,0.3)',
        textColor: '#FFFFFF',
        accentColor: '#22D3EE',
        border: 'none'
      },
      'volcano-purple': {
        headerBg: '#9333EA',
        headerText: '#FFFFFF',
        rowEven: 'rgba(255,255,255,0.1)',
        rowOdd: 'rgba(0,0,0,0.3)',
        textColor: '#FFFFFF',
        accentColor: '#A855F7',
        border: 'none'
      },

      // CUSTOM BACKGROUND TEMPLATES (8-23)
      'template-1': {
        headerBg: 'rgba(6,182,212,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(20,184,166,0.25)',
        rowOdd: 'rgba(15,118,110,0.35)',
        textColor: '#FFFFFF',
        accentColor: '#5EEAD4',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#22D3EE'
      },
      'template-2': {
        headerBg: 'rgba(14,165,233,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(56,189,248,0.2)',
        rowOdd: 'rgba(30,58,138,0.4)',
        textColor: '#FFFFFF',
        accentColor: '#38BDF8',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#60A5FA'
      },
      'template-3': {
        headerBg: 'rgba(245,158,11,0.95)',
        headerText: '#1F2937',
        rowEven: 'rgba(217,119,6,0.3)',
        rowOdd: 'rgba(120,53,15,0.5)',
        textColor: '#FFFFFF',
        accentColor: '#FCD34D',
        border: '4px solid #F59E0B',
        titleColor: '#FCD34D',
        subtitleColor: '#F59E0B'
      },
      'template-4': {
        headerBg: 'rgba(147,51,234,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(168,85,247,0.25)',
        rowOdd: 'rgba(88,28,135,0.4)',
        textColor: '#FFFFFF',
        accentColor: '#C084FC',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#E9D5FF'
      },
      'template-5': {
        headerBg: 'rgba(6,182,212,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(34,211,238,0.2)',
        rowOdd: 'rgba(8,145,178,0.35)',
        textColor: '#FFFFFF',
        accentColor: '#22D3EE',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#5EEAD4'
      },
      'template-6': {
        headerBg: 'rgba(124,58,237,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(168,85,247,0.2)',
        rowOdd: 'rgba(88,28,135,0.4)',
        textColor: '#FFFFFF',
        accentColor: '#FBBF24',
        border: '4px solid #FBBF24',
        titleColor: '#FBBF24',
        subtitleColor: '#C084FC'
      },
      'template-7': {
        headerBg: 'rgba(249,115,22,0.9)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(234,88,12,0.25)',
        rowOdd: 'rgba(67,56,202,0.35)',
        textColor: '#FFFFFF',
        accentColor: '#FB923C',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#FDBA74'
      },
      'template-8': {
        headerBg: 'rgba(168,85,247,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(192,132,252,0.25)',
        rowOdd: 'rgba(107,33,168,0.4)',
        textColor: '#FFFFFF',
        accentColor: '#E9D5FF',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#F0ABFC'
      },
      'template-9': {
        headerBg: 'rgba(236,72,153,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(0,0,0,0.5)',
        rowOdd: 'rgba(0,0,0,0.7)',
        textColor: '#FFFFFF',
        accentColor: '#F472B6',
        border: '6px solid #EC4899',
        titleColor: '#FFFFFF',
        subtitleColor: '#F9A8D4'
      },
      'template-10': {
        headerBg: 'rgba(220,38,38,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(239,68,68,0.25)',
        rowOdd: 'rgba(127,29,29,0.4)',
        textColor: '#FFFFFF',
        accentColor: '#FCA5A5',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#FEE2E2'
      },
      'template-11': {
        headerBg: 'rgba(156,163,175,0.95)',
        headerText: '#111827',
        rowEven: 'rgba(243,244,246,0.8)',
        rowOdd: 'rgba(229,231,235,0.8)',
        textColor: '#1F2937',
        accentColor: '#6B7280',
        border: 'none',
        titleColor: '#1F2937',
        subtitleColor: '#6B7280'
      },
      'template-12': {
        headerBg: 'rgba(220,38,38,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(248,113,113,0.3)',
        rowOdd: 'rgba(127,29,29,0.5)',
        textColor: '#FFFFFF',
        accentColor: '#FCA5A5',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#FEE2E2'
      },
      'template-13': {
        headerBg: 'rgba(37,99,235,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(59,130,246,0.25)',
        rowOdd: 'rgba(30,58,138,0.4)',
        textColor: '#FFFFFF',
        accentColor: '#93C5FD',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#DBEAFE'
      },
      'template-14': {
        headerBg: 'rgba(51,65,85,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(71,85,105,0.7)',
        rowOdd: 'rgba(51,65,85,0.8)',
        textColor: '#FFFFFF',
        accentColor: '#CBD5E1',
        border: 'none',
        titleColor: '#1E293B',
        subtitleColor: '#475569'
      },
      'template-15': {
        headerBg: 'rgba(59,130,246,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(147,197,253,0.4)',
        rowOdd: 'rgba(191,219,254,0.6)',
        textColor: '#1E3A8A',
        accentColor: '#2563EB',
        border: 'none',
        titleColor: '#1E40AF',
        subtitleColor: '#3B82F6'
      },
      'template-16': {
        headerBg: 'rgba(168,85,247,0.95)',
        headerText: '#FFFFFF',
        rowEven: 'rgba(216,180,254,0.25)',
        rowOdd: 'rgba(126,34,206,0.35)',
        textColor: '#FFFFFF',
        accentColor: '#F0ABFC',
        border: 'none',
        titleColor: '#FFFFFF',
        subtitleColor: '#E9D5FF'
      }
    };

    return styles[templateId] || styles['soccer-blue'];
  };

  const styles = getTemplateStyles();

  return (
    <div 
      id="styled-standings-table"
      className="relative"
      style={{ 
        backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : template.colors?.background,
        backgroundColor: template.colors?.secondary || '#1F2937',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minWidth: '1400px',
        minHeight: '900px',
        padding: '60px'
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      {styles.border && styles.border !== 'none' && (
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{ 
            border: styles.border,
            margin: '50px',
            borderRadius: '8px'
          }}
        />
      )}

      <div className="relative z-10">
        <div className="text-center mb-10">
          <h1 
            className="text-6xl font-black mb-4 uppercase tracking-wider"
            style={{ 
              color: styles.titleColor || styles.textColor,
              textShadow: '0 6px 12px rgba(0,0,0,0.8)',
              letterSpacing: '0.1em'
            }}
          >
            {tournament.name}
          </h1>
          <div 
            className="text-2xl font-bold uppercase tracking-widest"
            style={{ 
              color: styles.subtitleColor || styles.accentColor,
              textShadow: '0 4px 8px rgba(0,0,0,0.6)'
            }}
          >
            {tournament.game.toUpperCase()} - OVERALL STANDINGS
          </div>
        </div>

        <div className="mt-12">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ 
                backgroundColor: styles.headerBg,
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}>
                <th 
                  className="px-6 py-4 text-center font-black text-lg uppercase tracking-wide"
                  style={{ color: styles.headerText }}
                >
                  RANK
                </th>
                <th 
                  className="px-6 py-4 text-left font-black text-lg uppercase tracking-wide"
                  style={{ color: styles.headerText }}
                >
                  TEAM NAME
                </th>
                <th 
                  className="px-6 py-4 text-center font-black text-lg uppercase tracking-wide"
                  style={{ color: styles.headerText }}
                >
                  M
                </th>
                <th 
                  className="px-6 py-4 text-center font-black text-lg uppercase tracking-wide"
                  style={{ color: styles.headerText }}
                >
                  BOOYAH
                </th>
                <th 
                  className="px-6 py-4 text-center font-black text-lg uppercase tracking-wide"
                  style={{ color: styles.headerText }}
                >
                  P.P.
                </th>
                <th 
                  className="px-6 py-4 text-center font-black text-lg uppercase tracking-wide"
                  style={{ color: styles.headerText }}
                >
                  K.P.
                </th>
                <th 
                  className="px-6 py-4 text-center font-black text-lg uppercase tracking-wide"
                  style={{ color: styles.headerText }}
                >
                  TOTAL P.
                </th>
              </tr>
            </thead>

            <tbody>
              {standings.map((team, index) => {
                const isEven = index % 2 === 0;
                const rowBg = isEven ? styles.rowEven : styles.rowOdd;
                
                let rowTextColor = styles.textColor;
                const bgLightPatterns = ['#BFDBFE', '#FFFFFF', '#FFF7ED', '#E5E7EB', '#F3F4F6', 'rgba(243,244,246', 'rgba(229,231,235', 'rgba(147,197,253', 'rgba(191,219,254'];
                if (bgLightPatterns.some(pattern => rowBg.includes(pattern))) {
                  rowTextColor = '#1F2937';
                }

                return (
                  <tr 
                    key={team.teamName}
                    style={{ 
                      backgroundColor: rowBg,
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span 
                          className="text-4xl font-black"
                          style={{ 
                            color: team.rank <= 3 ? styles.accentColor : rowTextColor,
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}
                        >
                          {team.rank}
                        </span>
                        {team.rank === 1 && <span className="text-4xl">🥇</span>}
                        {team.rank === 2 && <span className="text-4xl">🥈</span>}
                        {team.rank === 3 && <span className="text-4xl">🥉</span>}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span 
                        className="font-bold text-xl"
                        style={{ 
                          color: rowTextColor,
                          textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                        }}
                      >
                        {team.teamName}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span 
                        className="text-lg font-semibold"
                        style={{ 
                          color: rowTextColor,
                          textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                        }}
                      >
                        {team.matchesPlayed}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span 
                        className="text-2xl font-black"
                        style={{ 
                          color: '#FCD34D',
                          textShadow: '0 3px 6px rgba(0,0,0,0.6)'
                        }}
                      >
                        {team.positions?.[1] || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span 
                        className="text-2xl font-black"
                        style={{ 
                          color: '#C084FC',
                          textShadow: '0 3px 6px rgba(0,0,0,0.6)'
                        }}
                      >
                        {team.placementPoints || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span 
                        className="text-2xl font-black"
                        style={{ 
                          color: '#4ADE80',
                          textShadow: '0 3px 6px rgba(0,0,0,0.6)'
                        }}
                      >
                        {team.killPoints || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span 
                        className="text-3xl font-black"
                        style={{ 
                          color: styles.accentColor,
                          textShadow: '0 3px 6px rgba(0,0,0,0.6)'
                        }}
                      >
                        {team.totalPoints}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-10">
          <div 
            className="text-sm font-medium opacity-70"
            style={{ 
              color: styles.textColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Generated by Tournament Calculator • {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
