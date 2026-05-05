import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">Snapbooth Project</h1>
      <nav className="flex gap-4">
        <Link 
          href="/login" 
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Login
        </Link>
        <Link 
          href="/dashboard" 
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Dashboard
        </Link>
        <Link 
          href="/booth" 
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          Booth
        </Link>
      </nav>
    </div>
  );
}
