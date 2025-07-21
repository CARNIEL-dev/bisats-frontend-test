const Empty = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center my-10 ">
      <img className="size-8" src="/no_record.png" alt="Empty" />
      <p className="text-slate-600 text-sm">{text || "No Record Available"}</p>
    </div>
  );
};

export default Empty;
