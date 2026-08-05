export type ReferenceRecord = {
  /**
   * Stable identifier used by article referenceIds.
   */
  id: string;

  /**
   * Complete citation text exactly as it should appear.
   * Do not include the URL in this field.
   */
  citation: string;

  /**
   * Optional destination for the referenced work.
   */
  url?: string;

  /**
   * Optional visible link text.
   * Defaults to the full URL when omitted.
   */
  linkLabel?: string;
};
