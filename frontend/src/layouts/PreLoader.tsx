import BisatLogo from "@/components/shared/Logo";
import { cn } from "@/utils";
import { PuffLoader } from "react-spinners";

type Props = {
  primary?: boolean;
};

const PreLoader = ({ primary = true }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center",
        primary && "animate-pulse mt-10"
      )}
    >
      {primary ? (
        <BisatLogo className="md:scale-110" />
      ) : (
        <PuffLoader
          color={"#F5BB00"}
          loading={true}
          aria-label="Loading Spinner"
          data-testid="loader"
          size={100}
        />
      )}
    </div>
  );
};

export default PreLoader;
