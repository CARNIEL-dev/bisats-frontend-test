// Component for Merchant T&C content
const MerchantTerms = () => {
	const textStyle = "text-[#515B6E] font-[400] text-[16px]";
	const headerStyle = "text-[#2B313B] font-[600] text-[18px]";

	return (
		<div className="space-y-[24px]">
			<h2 className={headerStyle}>
				TERMS AND CONDITIONS FOR MERCHANT OR NAIRA DEPOSITOR
			</h2>

			<div className="space-y-[12px]">
				<p className={textStyle}>By using our Services, you agree that:</p>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						You will not use our platform to engage in or facilitate money
						laundering, terrorist financing, fraud, or any other unlawful
						activities.{" "}
					</li>
					<li className={textStyle}>
						You must provide accurate and verifiable identification information,
						including but not limited to full legal name, address, date of
						birth, government-issued identification, and any other documents we
						may require.{" "}
					</li>
					<li className={textStyle}>
						We may, at our sole discretion, request additional documentation at
						any time to satisfy AML/CTF compliance obligations.
					</li>
					<li className={textStyle}>
						Transactions may be delayed, suspended, or refused if they are
						deemed suspicious or potentially unlawful.
					</li>
				</ul>
			</div>

			<div className="space-y-[12px]">
				<h2 className={headerStyle}>Monitoring and Reporting</h2>
				<p className={textStyle}>We reserve the right to:</p>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						Monitor user activity, transactions, and account behavior for
						suspicious activity.
					</li>
					<li className={textStyle}>
						Report any suspicious transactions to relevant authorities or
						financial intelligence units as required by law.
					</li>
					<li className={textStyle}>
						Cooperate with law enforcement, regulatory authorities, and third
						parties in investigations related to financial crime.
					</li>
				</ul>{" "}
			</div>
			<div className="space-y-[12px]">
				<h2 className={headerStyle}>Prohibited Use</h2>
				<p className={textStyle}>You agree not to use the Services:</p>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						To send or receive proceeds of any criminal activity.
					</li>
					<li className={textStyle}>
						To attempt to conceal the origin or ownership of funds.
					</li>
					We may terminate or restrict access to your account without notice if
					we believe, in our sole discretion, that it is associated with
					fraudulent activity or a breach of this section.
					<li className={textStyle}>
						To engage in deceptive or manipulative schemes, including phishing,
						spoofing, Ponzi schemes, or pyramid schemes.
					</li>
				</ul>{" "}
			</div>
			<p className={textStyle}>
				We may terminate or restrict access to your account without notice if we
				believe, in our sole discretion, that it is associated with fraudulent
				activity or a breach of this section.
			</p>
		</div>
	);
};

export default MerchantTerms;
