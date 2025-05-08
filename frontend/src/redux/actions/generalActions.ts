/** @format */

export const handleCopy = async (
  text: string
): Promise<{ status: boolean; message: string }> => {
  try {
    await navigator.clipboard.writeText(text);
    return { status: true, message: "Copied to clipboard" };
  } catch (err) {
    return { status: false, message: "Unable to copy" };
  }
};

