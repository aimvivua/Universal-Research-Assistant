
import React from 'react';

interface PrintableFormProps {
    children: React.ReactNode;
}

const PrintableForm: React.FC<PrintableFormProps> = ({ children }) => {
    return (
        <div className="p-8 border border-slate-300 bg-white font-serif text-slate-900">
           {children}
        </div>
    );
};

export default PrintableForm;
