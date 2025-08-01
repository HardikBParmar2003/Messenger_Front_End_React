export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-800">404</h1>
        <p className="mt-4 text-xl text-red-700">Page Not Found ...</p>
        <a href="/auth/login" className="text-blue-500 underline mt-2 block">
          Go to Login
        </a>
      </div>
    </div>
  );
}
