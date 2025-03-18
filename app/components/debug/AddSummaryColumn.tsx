'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AddSummaryColumn() {
  const [isAdding, setIsAdding] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const addSummaryColumn = async () => {
    setIsAdding(true);
    setResult(null);
    
    try {
      // Step 1: Check current schema
      const { data: columns, error: checkError } = await supabase
        .from('interactions')
        .select('*')
        .limit(1);
      
      if (checkError) {
        setResult({
          success: false,
          message: 'Could not check interactions table columns',
          details: checkError
        });
        return;
      }
      
      // Check if summary column already exists
      if (columns && columns.length > 0 && 'summary' in columns[0]) {
        setResult({
          success: true,
          message: 'Summary column already exists!',
          details: { columns: Object.keys(columns[0]) }
        });
        return;
      }
      
      // Step 2: Create a direct API endpoint to add the column
      const response = await fetch('/api/debug/add-summary-column', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: 'Summary column added successfully!',
          details: data
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to add summary column',
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
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed top-32 right-8 z-50 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="space-y-4">
        <h3 className="font-medium text-sm">Add Summary Column Fix</h3>
        
        <Button 
          onClick={addSummaryColumn} 
          disabled={isAdding}
          variant="outline"
          className="w-full"
        >
          {isAdding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            'Add Summary Column'
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
          <p>This tool adds the missing 'summary' column to the interactions table.</p>
        </div>
      </div>
    </div>
  );
} 