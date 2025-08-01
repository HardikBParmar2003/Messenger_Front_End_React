// components/AuthWrapper.tsx
export function AuthWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {children}
        </div>
      </div>
    );
  }
  