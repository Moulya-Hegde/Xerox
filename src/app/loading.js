// app/[your-route]/loading.js

export default function Loading() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white space-y-6">
        {/* Spinner */}
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-white animate-spin shadow-[0_0_30px_rgba(0,255,255,0.3)]"></div>
  
        {/* Fancy Text */}
        <p className="text-lg tracking-wide text-white/80 animate-pulse">
          Preparing your experience...
        </p>
      </div>
    );
  }
  
  