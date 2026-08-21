import { serializeJsonLd, type JsonLdObject } from "@/lib/seo/json-ld";

/**
 * Renders schema.org JSON-LD from a React Server Component so it is present
 * in the initial HTML (D-10).
 *
 * Data blocks are not executed, so CSP script-src does not apply.
 */
export function JsonLd({
  data,
  id,
}: {
  data: JsonLdObject | JsonLdObject[];
  id?: string;
}) {
  return (
    <script
      type="application/ld+json"
      {...(id && { id })}
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
