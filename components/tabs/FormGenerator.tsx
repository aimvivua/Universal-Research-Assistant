import React, { useState, useRef } from 'react';
import { ProjectOverviewData, DataManagementData } from '../../types';
import { PrintIcon } from '../icons/Icons';
import PrintableForm from './PrintableForm';

interface FormGeneratorProps {
  projectData: ProjectOverviewData;
  dataManagement: DataManagementData;
}

type FormType = 'crf' | 'ethics' | null;

const FormGenerator: React.FC<FormGeneratorProps> = ({ projectData, dataManagement }) => {
  const [formType, setFormType] = useState<FormType>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = printableRef.current?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // to re-attach react listeners
    }
  };

  const generateCRF = () => (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">Case Report Form (CRF)</h2>
      <h3 className="text-lg font-semibold mb-6 text-center">{projectData.title || '[Project Title]'}</h3>
      
      <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
              <div className="border p-2"><strong>Date of Admission:</strong> ____________</div>
              <div className="border p-2"><strong>Date of Discharge:</strong> ____________</div>
          </div>
          <div className="border p-2"><strong>Inclusion Criteria Met:</strong> [ ] Yes [ ] No</div>
          <div className="border p-2"><strong>Exclusion Criteria Met:</strong> [ ] Yes [ ] No</div>
          
          <h4 className="font-semibold pt-4">Study Variables</h4>
          {dataManagement.columns && dataManagement.columns.length > 0 ? (
            dataManagement.columns.map(col => (
              <div key={col.id} className="border p-2 grid grid-cols-2">
                <strong>{col.name}:</strong> <span>_________________</span>
              </div>
            ))
          ) : (
             <div className="border p-2 text-slate-500">No variables defined in Data Management tab.</div>
          )}
          
          <h4 className="font-semibold pt-4">Outcome</h4>
          <div className="border p-2"><strong>Final Diagnosis:</strong> ________________________________</div>
      </div>
    </>
  );

  const generateEthicsForm = () => (
      <>
        <h2 className="text-2xl font-bold mb-4 text-center">Ethics Committee Application</h2>
        <div className="space-y-6 text-base">
            <section><strong className="block">1. Project Title:</strong><p className="p-2 border">{projectData.title || 'Not specified'}</p></section>
            <section><strong className="block">2. Primary Investigator:</strong><p className="p-2 border">____________________</p></section>
            <section><strong className="block">3. Introduction & Rationale:</strong><p className="p-2 border h-24">Briefly describe the background of the study and its justification.</p></section>
            <section><strong className="block">4. Research Questions:</strong>
                <div className="p-2 border">
                    <p><strong>Primary:</strong> {projectData.primaryQuestions || 'Not specified'}</p>
                    <p><strong>Secondary:</strong> {projectData.secondaryQuestions || 'Not specified'}</p>
                </div>
            </section>
            <section><strong className="block">5. Hypothesis:</strong>
                <div className="p-2 border">
                    <p><strong>Primary:</strong> {projectData.primaryHypothesis || 'Not specified'}</p>
                    <p><strong>Secondary:</strong> {projectData.secondaryHypothesis || 'Not specified'}</p>
                </div>
            </section>
            <section><strong className="block">6. Methodology:</strong><p className="p-2 border h-24">Describe study design, patient population, sampling method, and statistical plan.</p></section>
            <section><strong className="block">7. Ethical Considerations:</strong><p className="p-2 border h-24">Informed consent will be obtained from participants. Patient data will be anonymized to ensure confidentiality.</p></section>
        </div>
      </>
  );

  return (
    <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Form Generator</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex space-x-4 mb-8">
                <button onClick={() => setFormType('crf')} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700">Generate Case Report Form (CRF)</button>
                <button onClick={() => setFormType('ethics')} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700">Generate Ethics Committee Application</button>
            </div>

            {formType && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-slate-700">
                            {formType === 'crf' ? 'CRF Preview' : 'Ethics Application Preview'}
                        </h2>
                        <button onClick={handlePrint} className="flex items-center space-x-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                            <PrintIcon className="w-5 h-5"/>
                            <span>Print</span>
                        </button>
                    </div>
                    <div ref={printableRef}>
                         <PrintableForm>
                            {formType === 'crf' ? generateCRF() : generateEthicsForm()}
                         </PrintableForm>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default FormGenerator;