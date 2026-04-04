import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoadingButton({ loading, children, className, ...props }) {
  return (
    <Button disabled={loading} className={className} {...props}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        children
      )}
    </Button>
  );
}
