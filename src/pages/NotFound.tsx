import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // This is good for development debugging.
    console.error(`404 Not Found: User tried to access "${location.pathname}"`);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4 animate-pulse" />
        </div>
        <h1 className="mb-2 text-6xl sm:text-8xl font-bold bg-gradient-to-r from-destructive to-warning bg-clip-text text-transparent">
          404
        </h1>
        <p className="mb-6 text-xl sm:text-2xl font-semibold text-foreground">
          Oops! Page Not Found
        </p>
        <p className="mb-8 text-muted-foreground">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link 
            to="/" 
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-primary rounded-lg shadow-lg shadow-primary/30 transition-transform transform hover:scale-105"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;