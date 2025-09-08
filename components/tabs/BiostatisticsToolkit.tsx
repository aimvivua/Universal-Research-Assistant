import React, { useState } from 'react';
import { interpretTTest, interpretChiSquare } from '../../services/geminiService';
import Loader from '../Loader';

const UnpairedTTestCalculator: React.FC = () => {
    const [group1, setGroup1] = useState('2.9, 3.0, 3.1, 3.4, 3.6');
    const [group2, setGroup2] = useState('3.2, 3.5, 3.8, 4.0, 4.1');
    const [result, setResult] = useState<{ t: number; df: number; p: string } | null>(null);
    const [error, setError] = useState('');
    const [interpretation, setInterpretation] = useState('');
    const [loadingInterpretation, setLoadingInterpretation] = useState(false);

    const calculateStats = (data: number[]) => {
        const n = data.length;
        if (n === 0) return { mean: 0, variance: 0, n: 0 };
        const mean = data.reduce((a, b) => a + b) / n;
        const variance = data.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
        return { mean, variance, n };
    };

    const calculateTTest = () => {
        setError('');
        setResult(null);
        setInterpretation('');

        const data1 = group1.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        const data2 = group2.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

        if (data1.length < 2 || data2.length < 2) {
            setError('Both groups must have at least 2 valid numbers.');
            return;
        }

        const stats1 = calculateStats(data1);
        const stats2 = calculateStats(data2);
        
        const { mean: mean1, variance: var1, n: n1 } = stats1;
        const { mean: mean2, variance: var2, n: n2 } = stats2;

        const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
        const se = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
        const t = (mean1 - mean2) / se;
        const df = n1 + n2 - 2;

        setResult({ t, df, p: 'P-value calculation is complex. Use statistical software for a precise p-value. A larger absolute t-value suggests a more significant difference.' });
    };

    const handleInterpret = async () => {
        if (!result) return;
        setLoadingInterpretation(true);
        setInterpretation('');
        try {
            const res = await interpretTTest(group1, group2, result.t, result.df);
            setInterpretation(res);
        } catch (e) {
            setInterpretation("Error fetching interpretation.");
        } finally {
            setLoadingInterpretation(false);
        }
    }

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Unpaired T-Test Calculator</h3>
            <p className="text-sm text-slate-500 mb-4">Enter comma-separated numbers for each group.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Group 1 Data</label>
                    <textarea value={group1} onChange={e => setGroup1(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={3}/>
                </div>
                <div>
                    <label className="block text-sm font-medium">Group 2 Data</label>
                    <textarea value={group2} onChange={e => setGroup2(e.target.value)} className="w-full mt-1 p-2 border rounded" rows={3}/>
                </div>
            </div>
            <button onClick={calculateTTest} className="mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition">
                Calculate
            </button>
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {result && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg space-y-2">
                    <p><strong>T-statistic:</strong> {result.t.toFixed(4)}</p>
                    <p><strong>Degrees of Freedom (df):</strong> {result.df}</p>
                    <p className="text-xs italic">{result.p}</p>
                    <button onClick={handleInterpret} disabled={loadingInterpretation} className="text-sm text-indigo-600 font-medium hover:underline disabled:text-slate-400">
                        {loadingInterpretation ? 'Interpreting...' : 'Interpret Results with AI'}
                    </button>
                    {loadingInterpretation && <Loader rows={2} />}
                    {interpretation && <p className="text-sm pt-2 border-t mt-2 border-primary-200">{interpretation}</p>}
                </div>
            )}
        </div>
    );
};

const ChiSquareCalculator: React.FC = () => {
    const [data, setData] = useState({ a: 10, b: 20, c: 15, d: 5 });
    const [result, setResult] = useState<{ chi2: number; p: string } | null>(null);
    const [interpretation, setInterpretation] = useState('');
    const [loadingInterpretation, setLoadingInterpretation] = useState(false);

    const calculateChiSquare = () => {
        setResult(null);
        setInterpretation('');
        const { a, b, c, d } = data;
        const total = a + b + c + d;
        if (total === 0) return;

        const expected_a = (a + b) * (a + c) / total;
        const expected_b = (a + b) * (b + d) / total;
        const expected_c = (c + d) * (a + c) / total;
        const expected_d = (c + d) * (b + d) / total;
        
        if ([expected_a, expected_b, expected_c, expected_d].some(e => e === 0)) {
            setResult(null);
            return;
        }

        const chi2 = ((a - expected_a) ** 2 / expected_a) +
                     ((b - expected_b) ** 2 / expected_b) +
                     ((c - expected_c) ** 2 / expected_c) +
                     ((d - expected_d) ** 2 / expected_d);
        
        const p_interpretation = chi2 > 3.84 
            ? 'Result is statistically significant at p < 0.05 (since Chi-Square > 3.84 for 1 df).'
            : 'Result is not statistically significant at p < 0.05 (since Chi-Square <= 3.84 for 1 df).';

        setResult({ chi2, p: p_interpretation });
    };

    const handleDataChange = (cell: keyof typeof data, value: string) => {
        const numValue = parseInt(value, 10);
        setData(prev => ({ ...prev, [cell]: isNaN(numValue) || numValue < 0 ? 0 : numValue }));
    };

     const handleInterpret = async () => {
        if (!result) return;
        setLoadingInterpretation(true);
        setInterpretation('');
        try {
            const res = await interpretChiSquare(data, result.chi2);
            setInterpretation(res);
        } catch (e) {
            setInterpretation("Error fetching interpretation.");
        } finally {
            setLoadingInterpretation(false);
        }
    }

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Chi-Square Test for 2x2 Table</h3>
             <div className="inline-grid grid-cols-[auto_100px_100px_auto] gap-x-4 gap-y-2 items-center">
                <div></div><div className="font-medium text-center">Outcome 1</div><div className="font-medium text-center">Outcome 2</div><div></div>
                <div className="font-medium">Group 1</div>
                <input type="number" value={data.a} onChange={e => handleDataChange('a', e.target.value)} className="p-2 border rounded text-center" />
                <input type="number" value={data.b} onChange={e => handleDataChange('b', e.target.value)} className="p-2 border rounded text-center" />
                <div className="font-medium">Row Total: {data.a + data.b}</div>

                <div className="font-medium">Group 2</div>
                <input type="number" value={data.c} onChange={e => handleDataChange('c', e.target.value)} className="p-2 border rounded text-center" />
                <input type="number" value={data.d} onChange={e => handleDataChange('d', e.target.value)} className="p-2 border rounded text-center" />
                <div className="font-medium">Row Total: {data.c + data.d}</div>
                
                <div></div>
                <div className="font-medium text-center">Col Total: {data.a + data.c}</div>
                <div className="font-medium text-center">Col Total: {data.b + data.d}</div>
                <div></div>
            </div>
            <button onClick={calculateChiSquare} className="mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition">
                Calculate
            </button>
            {result && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg space-y-2">
                    <p><strong>Chi-Square Value (χ²):</strong> {result.chi2.toFixed(4)}</p>
                    <p className="text-xs italic">{result.p}</p>
                     <button onClick={handleInterpret} disabled={loadingInterpretation} className="text-sm text-indigo-600 font-medium hover:underline disabled:text-slate-400">
                        {loadingInterpretation ? 'Interpreting...' : 'Interpret Results with AI'}
                    </button>
                    {loadingInterpretation && <Loader rows={2} />}
                    {interpretation && <p className="text-sm pt-2 border-t mt-2 border-primary-200">{interpretation}</p>}
                </div>
            )}
        </div>
    );
};

const SampleSizeCalculator: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(90);
  const [margin, setMargin] = useState(5);
  const [prevalence, setPrevalence] = useState(50);
  const [sampleSize, setSampleSize] = useState<number | null>(null);

  const calculateSampleSize = () => {
    const Z = 1.96; // For 95% confidence
    const sens = sensitivity / 100;
    const d = margin / 100;
    const prev = prevalence / 100;

    if (prev <= 0 || prev >= 1) {
        alert("Prevalence must be between 0 and 100.");
        return;
    }
    
    const size = (Z*Z * sens * (1-sens)) / (d*d * prev);
    setSampleSize(Math.ceil(size));
  };
  
  return (
    <div className="p-4 border rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Sample Size for Diagnostic Accuracy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">Expected Sensitivity (%)</label>
                <input type="number" value={sensitivity} onChange={e => setSensitivity(parseFloat(e.target.value))} className="w-full mt-1 p-2 border rounded"/>
            </div>
            <div>
                <label className="block text-sm font-medium">Margin of Error (d, %)</label>
                <input type="number" value={margin} onChange={e => setMargin(parseFloat(e.target.value))} className="w-full mt-1 p-2 border rounded"/>
            </div>
            <div>
                <label className="block text-sm font-medium">Disease Prevalence (%)</label>
                <input type="number" value={prevalence} onChange={e => setPrevalence(parseFloat(e.target.value))} className="w-full mt-1 p-2 border rounded"/>
            </div>
        </div>
        <button onClick={calculateSampleSize} className="mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 transition">
            Calculate
        </button>
        {sampleSize !== null && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <p className="font-semibold">Required Sample Size: <span className="text-primary-700 text-xl">{sampleSize}</span></p>
                <p className="text-xs italic mt-2">This is an estimate. Consult a biostatistician for complex study designs.</p>
            </div>
        )}
    </div>
  );
};

const BiostatisticsToolkit: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Biostatistics Toolkit</h1>
      <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <SampleSizeCalculator />
        <UnpairedTTestCalculator />
        <ChiSquareCalculator />
      </div>
    </div>
  );
};

export default BiostatisticsToolkit;