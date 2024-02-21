/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2024 observerly

/*****************************************************************************************************************/

export function sanitizeString(unsanitizedInput: string): string {
  // Remove any special characters that can cause issues with the FITS standard:
  const sanitisedOutput = unsanitizedInput
    // Replace non-UTF-8 characters, apostrophes, newlines, and carriage returns with an empty string
    .replace(/[^\x00-\x7F]|'|\n|\r/g, '')
    // Remove special characters e.g., !@#$%^&*():
    .replace(/[!@#$%^&*()]/g, '')

  // Remove any leading or trailing whitespace
  return sanitisedOutput.trim()
}

/*****************************************************************************************************************/
