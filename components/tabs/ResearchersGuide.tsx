
import React from 'react';
import { RESEARCH_GUIDE_STEPS } from '../../constants';

const ResearchersGuide: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Researcher's Guide</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="mb-8 text-slate-600">This guide outlines the typical 9-step journey of a research project, from a nascent idea to a published manuscript. Following these steps systematically will help ensure a robust and successful study.</p>
        <div className="space-y-6">
          {RESEARCH_GUIDE_STEPS.map((step, index) => (
            <div key={index} className="p-5 border border-slate-200 rounded-lg bg-slate-50">
              <h2 className="text-xl font-semibold text-primary-700 mb-2">{step.title}</h2>
              <p className="text-slate-700 mb-3">{step.content}</p>
              {step.indiaTip && (
                <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                  <p className="text-sm text-amber-800"><span className="font-bold">India Focus:</span> {step.indiaTip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchersGuide;
