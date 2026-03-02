import { slideUpSmallVariant } from "@/components/animation";
import NavBar from "@/components/NavBar";
import MaxWidth from "@/components/shared/MaxWith";
import { cn } from "@/utils";
import { faqData } from "@/utils/data";
import { parseText, renderParsedText } from "@/utils/textParser";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HeroSectionAbout } from "@/pages/landing-page/src/screens/Bisats/sections/HeroSectionByAnima";

const renderAnswer = (answer: string, isMobile: boolean = false) => {
  const parsedContent = parseText(answer, {
    detectHeadings: true,
    detectCodeBlocks: true,
    detectQuotes: true,
    detectCommaLists: true,
    minCommaListItems: 2,
  });

  return renderParsedText(parsedContent, "", isMobile);
};

const FAQs = (): React.ReactElement => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeQuestion, setActiveQuestion] = useState<number>(0);

  const handleQuestionClick = (index: number) => {
    setActiveQuestion(index);
  };

  useEffect(() => {
    const contentContainer = contentRef.current;
    if (contentContainer) {
      contentContainer.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeQuestion]);

  return (
    <div>
      <div className="bg-[#0A0E12]">
        <NavBar />
        <HeroSectionAbout
          title="FAQs"
          desc="Got Questions? We've Got Answers"
          image="/landingpage/FAQs-hero-image.png"
        />
      </div>
      <div
        ref={contentRef}
        className="w-full py-[64px] lg:py-[80px] px-[20px] bg-white lg:bg-[#F7F7F7]"
      >
        <MaxWidth className="max-w-[65rem] hidden lg:grid grid-cols-2 items-start gap-[38px] ">
          <div className="space-y-3 bg-white px-6 py-8 rounded-[12px] sticky top-[15vh]">
            {faqData.map((faq, index) => (
              <button
                key={faq.id}
                onClick={() => handleQuestionClick(index)}
                className={cn(
                  "w-full max-w-[446px] rounded-md px-4 py-4 text-left transition-all duration-300",
                  activeQuestion === index
                    ? "bg-primary text-[#0A0E12] font-semibold hover:bg-primary/80"
                    : "text-[#515B6E] font-normal bg-gray-100 hover:bg-gray-200"
                )}
              >
                {faq.question}
              </button>
            ))}
          </div>

          <motion.div
            variants={slideUpSmallVariant}
            initial="hidden"
            animate="show"
            className="p-[8px]"
            key={activeQuestion}
          >
            <h3 className="text-3xl font-semibold text-[#2B313B] mb-[8px]">
              {faqData[activeQuestion].question}
            </h3>
            <div className="text-[#606C82] font-normal  leading-relaxed">
              {renderAnswer(faqData[activeQuestion].answer, false)}
            </div>
          </motion.div>
        </MaxWidth>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-[24px]">
          {faqData.map((faq, index) => (
            <div key={faq.id} className="space-y-[24px] w-full">
              <button
                onClick={() =>
                  handleQuestionClick(activeQuestion === index ? -1 : index)
                }
                className={`w-full text-left rounded-[8px] p-[12px] transition-all duration-200 ${
                  activeQuestion === index
                    ? "bg-[#F5BB00] text-[#0A0E12] font-semibold text-[18px]"
                    : "bg-[#F9F9FB] text-[#515B6E] font-normal text-[16px]"
                }`}
              >
                {faq.question}
              </button>

              {activeQuestion === index && (
                <motion.div
                  variants={slideUpSmallVariant}
                  initial="hidden"
                  animate="show"
                  key={activeQuestion}
                  className="text-[#606C82] font-normal leading-relaxed text-[16px]"
                  //   ref={contentRef}
                >
                  {renderAnswer(faq.answer, true)}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
