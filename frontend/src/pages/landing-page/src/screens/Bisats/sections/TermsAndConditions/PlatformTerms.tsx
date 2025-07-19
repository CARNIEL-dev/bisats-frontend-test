const PlatformTerms = () => {
	const textStyle = "text-[#515B6E] font-normal text-[16px]";
	const headerStyle = "text-[#2B313B] font-semibold text-[18px]";

	return (
		<div className="space-y-[24px]">
			<p className={textStyle}>
				These Terms and Conditions ("Terms") govern your use of our platform and
				services, including but not limited to crypto wallets, fiat and crypto
				payments, exchange services, APIs, and associated mobile/web
				applications (collectively, the "Services"). By accessing or using our
				Services, you agree to be bound by these Terms. If you do not agree, you
				must discontinue use immediately.
			</p>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>Definitions</h3>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						"User" refers to any individual or entity accessing or using the
						Services.
					</li>
					<li className={textStyle}>
						"Digital Assets" mean cryptocurrencies, tokens, or other
						blockchain-based assets.
					</li>
					<li className={textStyle}>
						"Fiat Currency" means government-issued currency such as USD, EUR,
						etc.
					</li>
				</ul>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>1. Eligibility</h3>
				<p className={textStyle}>
					You must be at least 18 years old or the legal age in your
					jurisdiction and have full legal capacity to enter into a binding
					agreement.
				</p>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>2. Services Overview</h3>
				<div>
					<p className={textStyle}>
						BISATS provides access to a suite of fintech and blockchain-based
						services, including but not limited to:
					</p>
					<ul className="list-disc list-inside space-y-2">
						<li className={textStyle}>
							Crypto Wallets for storage and transactions
						</li>
						<li className={textStyle}>Fiat-Crypto Conversion</li>
						<li className={textStyle}>Peer-to-Peer (P2P) Payment</li>
						<li className={textStyle}>Trading and Asset Management</li>
						<li className={textStyle}>
							API Services for third-party developers
						</li>
					</ul>
					<p className={textStyle}>
						We are not a bank or a registered broker-dealer unless explicitly
						stated. Use of our services does not create a fiduciary
						relationship.
					</p>
				</div>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>3. Account Registration</h3>

				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						You must create an account to access most features.
					</li>
					<li className={textStyle}>
						You agree to provide accurate and complete information.
					</li>
					<li className={textStyle}>
						You are responsible for securing your credentials, wallet keys, and
						devices.
					</li>
					<li className={textStyle}>
						You must not use another person’s identity or provide false
						information during registration.
					</li>
					<li className={textStyle}>
						You are not allowed to have more than one profile account with us
					</li>
				</ul>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>4. Compliance and KYC/AML</h3>
				<p className={textStyle}>You agree to:</p>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						Provide identification documents as required.{" "}
					</li>
					<li className={textStyle}>
						Cooperate with anti-money laundering (AML), counter-terrorism
						financing (CTF), and know-your-customer (KYC) procedures.{" "}
					</li>
					<li className={textStyle}>
						We may suspend or terminate your account for failure to comply.
					</li>
				</ul>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>5. User Obligations</h3>
				<p className={textStyle}>You agree not to:</p>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						Use the Services for illegal purposes, including money laundering,
						terrorism financing, tax evasion, or fraud.{" "}
					</li>
					<li className={textStyle}>
						Violate any applicable laws or regulations.{" "}
					</li>
					<li className={textStyle}>
						Exploit bugs or use bots/scripts to manipulate our platform.{" "}
					</li>
				</ul>
			</div>
			
			<div className="space-y-[12px]">
				<h3 className={headerStyle}>6. Risk Disclosure</h3>
				<p className={textStyle}>By using our Services, you acknowledge:</p>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>The value of crypto assets is volatile.</li>
					<li className={textStyle}>
						Digital asset transactions are irreversible and may be final.{" "}
					</li>
					<li className={textStyle}>
						Regulatory frameworks for digital assets may change. <br></br> You
						assume full responsibility for your use of the platform.{" "}
					</li>
				</ul>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>7. Fees</h3>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						You agree to pay all fees associated with the Services.
					</li>
					<li className={textStyle}>
						Fee structures will be disclosed prior to transactions and are
						subject to change.{" "}
					</li>
				</ul>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>8. Intellectual Property</h3>
				<p className={textStyle}>
					All logos, designs, trademarks, and software are the intellectual
					property of Bisats or its licensors. You may not reproduce or
					redistribute content without permission.
				</p>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>9. Privacy Policy</h3>
				<p className={textStyle}>
					Your use of the Services is also governed by our Privacy Policy, which
					explains how we collect, store, and protect your personal and
					financial data.
				</p>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>10. Limitation of Liability</h3>
				<p className={textStyle}>
					To the maximum extent permitted by law, Bisats shall not be liable
					for:
				</p>
				<ul className="list-disc list-inside space-y-2">
					<li className={textStyle}>
						Loss of funds due to user error or third-party services
					</li>
					<li className={textStyle}>
						Downtime, bugs, or security breaches outside of our control.{" "}
					</li>
					<li className={textStyle}>
						Indirect, incidental, or consequential damages.
					</li>
				</ul>
			</div>
			<div className="space-y-[12px]">
				<h3 className={headerStyle}>11. Indemnification</h3>
				<p className={textStyle}>
					You agree to indemnify and hold harmless Bisats and its affiliates
					from any claim, demand, or damages arising out of your use of the
					Services or your violation of these Terms.
				</p>
			</div>
			<div className="space-y-[12px]">
				<h3 className={headerStyle}>12. Suspension and Termination</h3>
				<p className={textStyle}>
					We may suspend, restrict, or terminate your access to the Services at
					any time for reasons including regulatory compliance or suspected
					unlawful behavior.
				</p>
			</div>
			<div className="space-y-[12px]">
				<h3 className={headerStyle}>13. Governing Law and Jurisdiction</h3>
				<p className={textStyle}>
					These Terms shall be governed by the laws of your jurisdiction. Any
					disputes arising shall be resolved in the courts of your jurisdiction.
				</p>
			</div>

			<div className="space-y-[12px]">
				<h3 className={headerStyle}>14. Amendments</h3>
				<p className={textStyle}>
					We may update these Terms from time to time. Changes will be
					communicated via our website or email. Continued use after changes
					implies acceptance.
				</p>
			</div>
			<div className="space-y-[12px]">
				<h3 className={headerStyle}>15. Contact Information</h3>
				<p className={textStyle}>
					If you have questions or concerns, contact us:
				</p>
				<p className={textStyle}>BISATS GLOBAL</p>
				<p className={textStyle}>
					Email: <span className="text-[#C49600]">support@bisats.com</span>
				</p>
			</div>
		</div>
	);
};

export default PlatformTerms;
