import { Button } from "@/components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-[90dvh]">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-4xl md:text-6xl font-black">404</h3>
        <p className="text-gray-600 text-lg">Page Not Found</p>

        <Button className="mt-10" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
