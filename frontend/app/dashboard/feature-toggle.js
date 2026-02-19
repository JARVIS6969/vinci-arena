'use client';

import { FEATURES, FEATURE_INFO, canEnableFeature } from '@/features/feature-config';
import { useState } from 'react';

export default function FeatureToggle() {
  const [showPanel, setShowPanel] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg z-50"
        title="Feature Control"
      >
        ⚙️
      </button>

      {/* Feature Panel */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-purple-500/50 max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-purple-500/50 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">Feature Control</h2>
                  <p className="text-sm text-gray-400 mt-1">Development Mode Only</p>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {Object.entries(FEATURES).map(([key, enabled]) => {
                const info = FEATURE_INFO[key];
                const canEnable = canEnableFeature(key);
                
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-xl border-2 ${
                      enabled
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-gray-800/50 border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-white">{info.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              enabled
                                ? 'bg-green-500/20 text-green-400 border border-green-500'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                          >
                            {enabled ? 'ON' : 'OFF'}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500">
                            {info.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{info.description}</p>
                        {info.requiredFeatures.length > 0 && (
                          <p className="text-xs text-gray-500">
                            Requires: {info.requiredFeatures.join(', ')}
                          </p>
                        )}
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          disabled={!canEnable && !enabled}
                          onChange={() => {
                            alert(
                              `To toggle ${key}, edit:\nfrontend/features/feature-config.js`
                            );
                          }}
                          className="w-12 h-6 rounded-full appearance-none bg-gray-700 checked:bg-green-500 relative transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-purple-500/50 p-6 bg-gray-800/50">
              <p className="text-xs text-gray-400 text-center">
                💡 To enable/disable features, edit{' '}
                <code className="bg-gray-700 px-2 py-1 rounded">
                  features/feature-config.js
                </code>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
