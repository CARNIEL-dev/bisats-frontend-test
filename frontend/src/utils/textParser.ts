import React from "react";

export interface ParsedTextItem {
	type:
		| "paragraph"
		| "bullet"
		| "numbered"
		| "comma-list"
		| "heading"
		| "code"
		| "quote";
	content: string;
	index: number;
	level?: number; // For nested lists or heading levels
	listItems?: string[]; // For comma-separated lists
}

export interface ParserOptions {
	detectHeadings?: boolean;
	detectCodeBlocks?: boolean;
	detectQuotes?: boolean;
	detectCommaLists?: boolean;
	minCommaListItems?: number;
	preserveWhitespace?: boolean;
}

const defaultOptions: ParserOptions = {
	detectHeadings: true,
	detectCodeBlocks: true,
	detectQuotes: true,
	detectCommaLists: true,
	minCommaListItems: 3,
	preserveWhitespace: false,
};

/**
 * Enhanced text parser that detects various text formats
 * @param text - The text to parse
 * @param options - Parser configuration options
 * @returns Array of parsed text items
 */
export const parseText = (
	text: string,
	options: ParserOptions = {}
): ParsedTextItem[] => {
	const config = { ...defaultOptions, ...options };

	// Split text into chunks while preserving structure
	const chunks = text?.split(
		/(?=\s*[•*-]\s)|(?=\s*\d+\.\s)|(?:\n\s*\n)|(?=\s*#{1,6}\s)|(?=\s*```)|(?=\s*>\s)/
	);

	return chunks
		.map((chunk, index) => {
			const trimmedChunk = config.preserveWhitespace ? chunk : chunk.trim();
			if (!trimmedChunk) return null;

			// Detect headings (# ## ### etc.)
			if (config.detectHeadings) {
				const headingMatch = trimmedChunk.match(/^(#{1,6})\s+(.+)/);
				if (headingMatch) {
					return {
						type: "heading" as const,
						content: headingMatch[2],
						index,
						level: headingMatch[1].length,
					};
				}
			}

			// Detect code blocks
			if (config.detectCodeBlocks) {
				const codeBlockMatch = trimmedChunk.match(/^```[\s\S]*?```$/);
				if (codeBlockMatch) {
					return {
						type: "code" as const,
						content: trimmedChunk.replace(/^```|```$/g, "").trim(),
						index,
					};
				}
			}

			// Detect quotes
			if (config.detectQuotes) {
				const quoteMatch = trimmedChunk.match(/^>\s+(.+)/);
				if (quoteMatch) {
					return {
						type: "quote" as const,
						content: quoteMatch[1],
						index,
					};
				}
			}

			// Detect numbered lists (1. 2. 3. etc.)
			const numberedMatch = trimmedChunk.match(/^(\d+)\.\s+(.+)/);
			if (numberedMatch) {
				return {
					type: "numbered" as const,
					content: numberedMatch[2],
					index,
					level: parseInt(numberedMatch[1]),
				};
			}

			// Detect bullet points (• * - etc.)
			const bulletMatch = trimmedChunk.match(/^([•*-])\s+(.+)/);
			if (bulletMatch) {
				return {
					type: "bullet" as const,
					content: bulletMatch[2],
					index,
				};
			}

			// Detect comma-separated lists in paragraphs
			if (config.detectCommaLists) {
				const commaListMatch = detectCommaList(
					trimmedChunk,
					config.minCommaListItems || 3
				);
				if (commaListMatch) {
					return {
						type: "comma-list" as const,
						content: trimmedChunk,
						index,
						listItems: commaListMatch,
					};
				}
			}

			// Default to paragraph
			return {
				type: "paragraph" as const,
				content: trimmedChunk,
				index,
			};
		})
		.filter(Boolean) as ParsedTextItem[];
};

/**
 * Detects comma-separated lists within text
 * @param text - Text to analyze
 * @param minItems - Minimum number of items to consider it a list
 * @returns Array of list items or null if not a comma list
 */
const detectCommaList = (text: string, minItems: number): string[] | null => {
	// Look for patterns like "item1, item2, item3" or "item1, item2, and item3"
	const commaPattern = /^[^,]+(?:,\s*[^,]+){2,}(?:\s*(?:and|or)\s*[^,]+)?$/;

	if (!commaPattern.test(text)) return null;

	// Split by commas and clean up
	const items = text
		?.split(",")
		.map((item) => item.replace(/^\s*(?:and|or)\s*/, "").trim())
		.filter((item) => item.length > 0);

	return items.length >= minItems ? items : null;
};

/**
 * Renders parsed text items to React elements
 * @param parsedItems - Array of parsed text items
 * @param className - Base CSS classes
 * @param isMobile - Whether to apply mobile-specific styling
 * @returns React elements
 */
export const renderParsedText = (
	parsedItems: ParsedTextItem[],
	className: string = "",
	isMobile: boolean = false
): React.ReactElement[] => {
	const baseTextSize = isMobile ? "text-[14px]" : "text-[16px]";
	const baseMargin = isMobile ? "mb-2" : "mb-3";

	return parsedItems
		.map((item) => {
			if (!item) return null;

			const key = `${item.type}-${item.index}`;

			switch (item.type) {
				case "heading":
					const headingSize = getHeadingSize(item.level || 1, isMobile);
					return React.createElement(
						"h1",
						{
							key,
							className: `${className} ${headingSize} font-semibold text-[#2B313B] ${baseMargin}`,
						},
						item.content
					);

				case "bullet":
					return React.createElement(
						"li",
						{
							key,
							className: `
              ${className}
              ${isMobile ? "ml-3" : "ml-4"} ${baseMargin} ${baseTextSize}
              text-[#606C82] font-[400] leading-relaxed
              list-disc list-inside
            `,
						},
						item.content
					);

				case "numbered":
					return React.createElement(
						"li",
						{
							key,
							className: `
              ${className}
              ${isMobile ? "ml-3" : "ml-4"} ${baseMargin} ${baseTextSize}
              text-[#606C82] font-[400] leading-relaxed
              list-decimal list-inside
            `,
						},
						item.content
					);

				case "comma-list":
					return React.createElement(
						"div",
						{ key, className: `${className} ${baseMargin}` },
						React.createElement(
							"ul",
							{ className: `${isMobile ? "ml-3" : "ml-4"} space-y-1` },
							...(item.listItems?.map((listItem, idx) =>
								React.createElement(
									"li",
									{
										key: `${key}-item-${idx}`,
										className: `
                    ${baseTextSize} text-[#606C82] font-[400] leading-relaxed
                    list-disc list-inside
                  `,
									},
									listItem
								)
							) || [])
						)
					);

				case "code":
					return React.createElement(
						"pre",
						{
							key,
							className: `
              ${className} ${baseMargin} ${baseTextSize}
              bg-gray-100 rounded-md p-3 overflow-x-auto
              text-gray-800 font-mono
            `,
						},
						React.createElement("code", {}, item.content)
					);

				case "quote":
					return React.createElement(
						"blockquote",
						{
							key,
							className: `
              ${className} ${baseMargin} ${baseTextSize}
              border-l-4 border-[#F5BB00] pl-4 italic
              text-[#606C82] font-[400] leading-relaxed
            `,
						},
						item.content
					);

				case "paragraph":
				default:
					return React.createElement(
						"p",
						{
							key,
							className: `
              ${className} ${baseMargin} ${baseTextSize}
              text-[#606C82] font-[400] leading-relaxed
            `,
						},
						item.content
					);
			}
		})
		.filter(Boolean) as React.ReactElement[];
};

/**
 * Gets appropriate heading size based on level and device
 */
const getHeadingSize = (level: number, isMobile: boolean): string => {
	const sizes = isMobile
		? [
				"text-[24px]",
				"text-[20px]",
				"text-[18px]",
				"text-[16px]",
				"text-[14px]",
				"text-[12px]",
		  ]
		: [
				"text-[34px]",
				"text-[28px]",
				"text-[24px]",
				"text-[20px]",
				"text-[18px]",
				"text-[16px]",
		  ];

	return sizes[Math.min(level - 1, sizes.length - 1)];
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use parseText instead
 */
export const parseAnswer = (answer: string): ParsedTextItem[] => {
	return parseText(answer, {
		detectHeadings: false,
		detectCodeBlocks: false,
		detectQuotes: false,
		detectCommaLists: false,
	});
};

/**
 * Legacy render function for backward compatibility
 * @deprecated Use renderParsedText instead
 */
export const renderAnswer = (
	answer: string,
	isMobile: boolean = false
): React.ReactElement[] => {
	const parsedItems = parseAnswer(answer);
	return renderParsedText(parsedItems, "", isMobile);
};
