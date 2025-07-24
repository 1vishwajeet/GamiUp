import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/gamer-place/Dashboard";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const GamerPlace = () => {
  const { loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check for payment success in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      toast({
        title: "Payment Successful! 🎉",
        description: "Thank you! You have successfully joined the contest. Good luck!",
      });
      // Clean up URL
      window.history.replaceState({}, '', '/gamer-place');
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Since this component is wrapped in ProtectedRoute, 
  // we only reach here if user is authenticated
  return <Dashboard />;
};

export default GamerPlace;