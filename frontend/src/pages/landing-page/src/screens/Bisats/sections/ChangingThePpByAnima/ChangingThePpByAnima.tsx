import { Card, CardContent } from "@/components/ui/card";
import Customer from "../../../../../../../assets/customer.png";
import Merchant from "../../../../../../../assets/merchant.png";

export const ChangingThePpByAnima = (): JSX.Element => {
  const cards = [
    {
      title: "Bisats for Merchants",
      description:
        "Grow your business with our secure P2P crypto platform, offering low fees, instant settlements, and fraud protection. Accept crypto payments seamlessly, convert to fiat easily, and reach more customers without intermediaries.",
      bgClass: "bg-[#fffef76b]",
      textClass: "text-accent-black",
      descriptionClass: "text-greysgrey-10",
      position: "left-0",
      img: Merchant,
    },
    {
      title: "Bisats for Customers",
      description:
        "Trade crypto safely and easily with low fees, flexible payments, and secure escrow protection. Enjoy fast transactions, verified users, and 24/7 support for a seamless trading experience.",
      bgClass: "bg-[#ffffff33]",
      textClass: "text-accent-white",
      descriptionClass: "text-accent-white",
      position: "left-[591px]",
      img: Customer,
    },
  ];

  return (
    <section className="relative w-full bg-white pb-10 px-5 lg:py-28">
      <div className="relative max-w-[90%] mx-auto">
        <h2 className="mb-16 font-['Geist',Helvetica] text-[28px] lg:text-[42px] leading-[56px] font-semibold">
          Elevating Peer-to-peer <br /> transactions for everyone
        </h2>

        <div className="flex flex-col md:flex-row gap-6 justify-between">
          {cards.map((card, index) => (
            <Card
              key={index}
              className={`w-full md:w-[535px] h-auto md:h-[505px] rounded-md bg-cover bg-[50%_50%] border-none shadow-none`}
            >
              <CardContent className="flex flex-col justify-end h-full p-0">
                <img src={card.img} alt={card.title} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
