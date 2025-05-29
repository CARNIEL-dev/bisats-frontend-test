interface HeroSectionByIfeanyiProps {
	title: string;
	desc?: string;
	image: string;
}

export const HeroSectionByIfeanyi = ({
	title,
	desc,
	image,
}: HeroSectionByIfeanyiProps): JSX.Element => {
	const titleAlignment = desc ? "text-left" : "text-center lg:text-left";
	const descAlignment = desc ? "text-left" : "";

	return (
		<div
			className="h-[80vh] w-full bg-[#0A0E12] bg-cover bg-center bg-no-repeat relative overflow-hidden"
			style={{
				backgroundImage: "url('/landingpage/Background-pattern.png')",
			}}
		>
			<div className="relative z-10 h-full w-full flex flex-col lg:flex-row items-center justify-center gap-[20px] px-[20px] md:px-[40px] lg:px-[80px] my-[40px] lg:my-0">
				<div className="w-full max-w-[700px]">
					<h1
						className={`text-white lg:text-[#F7F7F7] font-[500] text-[34px] lg:text-[42px] w-full ${titleAlignment} mb-[8px]`}
					>
						{title}
					</h1>
					{desc && (
						<p
							className={`font-[400] text-[16px] lg:text-[18px] text-white lg:text-[#F7F7F7] w-full ${descAlignment}`}
						>
							{desc}
						</p>
					)}
				</div>
				<div className="lg:pr-[21px]">
					<img src={image} alt="about" />
				</div>
			</div>
		</div>
	);
};
