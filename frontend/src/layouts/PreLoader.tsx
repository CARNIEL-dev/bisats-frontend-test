import BisatLogo from "@/components/shared/Logo";

const PreLoader = () => {
  return (
    <div className="flex flex-col items-center animate-pulse mt-10">
      <BisatLogo className="md:scale-110" />
    </div>
  );
};

export default PreLoader;
