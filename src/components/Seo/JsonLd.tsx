import { FC } from 'react';

interface Props {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

/** Injects a JSON-LD <script>. Safe-encodes the closing tag to avoid breakouts. */
const JsonLd: FC<Props> = ({ data, id }) => (
  <script
    type="application/ld+json"
    id={id}
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
);

export default JsonLd;
