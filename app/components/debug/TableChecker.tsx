'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function TableChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const checkTable = async () => {
    setIsChecking(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/debug/check-interactions-table');
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: data.message || 'Table check passed!',
          details: data
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Table check failed',
          details: data
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="space-y-4">
        <h3 className="font-medium text-sm">Interactions Table Checker</h3>
        
        <Button 
          onClick={checkTable} 
          disabled={isChecking}
          variant="outline"
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Interactions Table'
          )}
        </Button>
        
        {result && (
          <div className={`text-sm p-3 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-start">
              {result.success ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </p>
                {result.details && (
                  <pre className="mt-2 text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>This tool helps diagnose issues with the interactions table.</p>
        </div>
      </div>
    </div>
  );
} 