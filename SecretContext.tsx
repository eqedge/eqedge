import React, { createContext, useContext, useEffect, useState } from 'react';

interface SecretContextType {
  isSecretPanelOpen: boolean;
  openSecretPanel: () => void;
  closeSecretPanel: () => void;
  secretSessionToken: string | null;
  setSecretSessionToken: (token: string | null) => void;
}

const SecretContext = createContext<SecretContextType | undefined>(undefined);

export function SecretProvider({ children }: { children: React.ReactNode }) {
  const [isSecretPanelOpen, setIsSecretPanelOpen] = useState(false);
  const [secretSessionToken, setSecretSessionToken] = useState<string | null>(null);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);

  // Konami code: ↑↑↓↓←→←→BA
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  useEffect(() => {
    // Load session token from localStorage
    const savedToken = localStorage.getItem('secretSessionToken');
    if (savedToken) {
      setSecretSessionToken(savedToken);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' 
        ? e.key 
        : e.key.toLowerCase();

      setKonamiSequence(prev => {
        const newSequence = [...prev, key];
        
        // Keep only the last 10 keys
        if (newSequence.length > 10) {
          newSequence.shift();
        }

        // Check if the sequence matches the Konami code
        if (newSequence.length === konamiCode.length) {
          const isMatch = newSequence.every((k, i) => k === konamiCode[i]);
          if (isMatch) {
            setIsSecretPanelOpen(true);
            return [];
          }
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSecretPanel = () => setIsSecretPanelOpen(true);
  const closeSecretPanel = () => setIsSecretPanelOpen(false);

  const handleSetSecretSessionToken = (token: string | null) => {
    setSecretSessionToken(token);
    if (token) {
      localStorage.setItem('secretSessionToken', token);
    } else {
      localStorage.removeItem('secretSessionToken');
    }
  };

  return (
    <SecretContext.Provider
      value={{
        isSecretPanelOpen,
        openSecretPanel,
        closeSecretPanel,
        secretSessionToken,
        setSecretSessionToken: handleSetSecretSessionToken,
      }}
    >
      {children}
    </SecretContext.Provider>
  );
}

export function useSecret() {
  const context = useContext(SecretContext);
  if (context === undefined) {
    throw new Error('useSecret must be used within a SecretProvider');
  }
  return context;
}
