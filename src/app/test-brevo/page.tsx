'use client';

import { useState } from 'react';

interface TestResult {
  success?: boolean;
  message?: string;
  error?: string;
  hint?: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export default function TestBrevoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testBrevoApi = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Invio richiesta di test a Brevo API...');
      const response = await fetch('/api/test-brevo');
      
      console.log('Risposta ricevuta:', {
        status: response.status,
        statusText: response.statusText
      });
      
      const data = await response.json() as TestResult;
      console.log('Dati risposta:', data);
      
      setResult(data);
      
      if (!response.ok) {
        setError(data.error || 'Errore durante il test');
      }
    } catch (err) {
      console.error('Errore durante il test:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Test Integrazione Brevo API</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <p className="mb-4">
          Questa pagina ti permette di testare l&apos;integrazione con Brevo API e verificare se l&apos;invio di email funziona correttamente.
        </p>
        <button
          onClick={testBrevoApi}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Test in corso...' : 'Esegui Test'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">Errore:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && !error && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">Test completato con successo!</h2>
          <p>Controlla la tua email per confermare la ricezione.</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Risultato del test:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Istruzioni:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Assicurati di aver configurato correttamente la tua API key di Brevo nel file <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">.env.local</code>
          </li>
          <li>
            L&apos;API key dovrebbe iniziare con &quot;xkeysib-&quot; e non essere un placeholder
          </li>
          <li>
            Se il test fallisce, verifica i log nella console del browser e del server
          </li>
          <li>
            Controlla che l&apos;indirizzo email di destinazione sia corretto
          </li>
          <li>
            Verifica che non ci siano restrizioni di rete che impediscono le connessioni a Brevo
          </li>
        </ol>
      </div>
    </div>
  );
} 