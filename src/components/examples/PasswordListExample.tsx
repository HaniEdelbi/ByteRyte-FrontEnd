/**
 * Example Password List Component
 * Demonstrates how to fetch and display passwords
 */

import React from 'react';
import { usePasswords, useDeletePassword } from '@/hooks/usePasswords';
import { Loader2, Trash2 } from 'lucide-react';

const PasswordListExample = () => {
  const { data: passwords, isLoading, error } = usePasswords();
  const { mutate: deletePassword } = useDeletePassword();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading passwords...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
        Error loading passwords: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Passwords</h2>
      
      {passwords?.length === 0 ? (
        <p className="text-muted-foreground">No passwords saved yet.</p>
      ) : (
        <div className="grid gap-4">
          {passwords?.map((password) => (
            <div
              key={password.id}
              className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{password.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {password.username}
                  </p>
                  {password.url && (
                    <a
                      href={password.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {password.url}
                    </a>
                  )}
                </div>
                
                <button
                  onClick={() => deletePassword(password.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  aria-label="Delete password"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordListExample;
