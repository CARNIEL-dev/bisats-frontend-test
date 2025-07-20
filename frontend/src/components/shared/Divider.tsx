import { Separator } from "@/components/ui/separator";
const Divider = ({ text }: { text: string }) => {
  return (
    <div className="relative my-6">
      <Separator />
      <p className="text-[#515B6E] font-normal text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
        {text}
      </p>
    </div>
  );
};

export default Divider;
