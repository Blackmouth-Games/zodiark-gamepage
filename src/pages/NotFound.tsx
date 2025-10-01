import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center px-4">
        <h1 className="mb-4 text-6xl font-bold text-gradient-cosmic">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Page not found in the cosmos</p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Return to Journey
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
