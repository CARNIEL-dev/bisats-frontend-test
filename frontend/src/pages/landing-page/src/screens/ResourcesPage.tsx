import { HeroSection } from "@/components/shared/HeroSection";
import MaxWidth from "@/components/shared/MaxWith";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";

const ResourcesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "Videos";

  const isArticles = searchParams.get("type") === "articles";
  return (
    <>
      <HeroSection
        title="Resources"
        desc="Deep dives, tutorials, and expert perspectives to sharpen your crypto understanding"
        image="/resources-icon.svg"
      />
      <MaxWidth>
        <Tabs
          className="my-10 md:my-16 w-full"
          defaultValue="Videos"
          //   onValueChange={(value) =>
          //     setSearchParams({ type: value }, { replace: true })
          //   }
        >
          <TabsList className="grid grid-cols-2 mb-10 max-w-[60rem] mx-auto border-b ">
            {["Videos", "Articles"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="w-full">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="Videos">
            <div>Videos</div>
          </TabsContent>
          <TabsContent value="Articles">
            <div>Articles</div>
          </TabsContent>
        </Tabs>
      </MaxWidth>
    </>
  );
};

export default ResourcesPage;
