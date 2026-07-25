'use client';

import { FC, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Result {
  created: number;
  skipped: number;
  invalid: number;
  errors: { row: number; reason: string }[];
}

const box: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  background: 'rgba(255,255,255,0.025)',
  padding: 20,
};

/** Bulk-add specialists from a CSV (the same columns as Export CSV, so an
 *  export → edit → re-import round-trip works). Paste the sheet or pick a
 *  file; duplicate rows (same name + contact) are skipped server-side. */
const AdminDoctorImport: FC = () => {
  const router = useRouter();
  const [csv, setCsv] = useState('');
  const [publish, setPublish] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result ?? ''));
    reader.readAsText(f);
  };

  const submit = async () => {
    if (!csv.trim() || busy) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/admin/doctors/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ csv, publish }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'import_failed');
      } else {
        setResult(data as Result);
        router.refresh();
      }
    } catch {
      setError('network_error');
    } finally {
      setBusy(false);
    }
  };

  const label: React.CSSProperties = {
    fontSize: 13,
    color: 'rgba(245,242,240,0.6)',
    marginBottom: 8,
    display: 'block',
  };

  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 720 }}>
      <div style={box}>
        <span style={label}>
          Columns (header row required): <code>name</code>, <code>profession</code>,{' '}
          <code>city</code>, <code>area</code>, <code>contact</code>,{' '}
          <code>instagram</code>, <code>bio</code>, <code>photo</code>. Only{' '}
          <code>name</code> is mandatory — profession defaults to “cosmetologist”,
          area to “center”. An <code>id</code> column is ignored (ids are assigned
          automatically). Same layout as Export CSV.
        </span>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder={
            'name,profession,city,area,contact\nאביטל סודרי,cosmetologist,לוד,center,0525496416'
          }
          rows={10}
          spellCheck={false}
          style={{
            width: '100%',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 13,
            lineHeight: 1.5,
            padding: 12,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(0,0,0,0.25)',
            color: '#f5f2f0',
            resize: 'vertical',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 14,
            flexWrap: 'wrap',
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={(e) => onFile(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              padding: '10px 18px',
              borderRadius: 30,
              border: '1px solid rgba(245,242,240,0.2)',
              background: 'transparent',
              color: 'rgba(245,242,240,0.85)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Choose file…
          </button>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'rgba(245,242,240,0.75)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            Publish imported entries immediately
          </label>
          <button
            type="button"
            onClick={submit}
            disabled={busy || !csv.trim()}
            style={{
              marginInlineStart: 'auto',
              padding: '12px 26px',
              borderRadius: 30,
              background: busy || !csv.trim() ? 'rgba(223,186,116,0.4)' : '#dfba74',
              color: '#08080a',
              fontSize: 14,
              fontWeight: 500,
              border: 'none',
              cursor: busy || !csv.trim() ? 'default' : 'pointer',
            }}
          >
            {busy ? 'Importing…' : 'Import'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ ...box, borderColor: 'rgba(220,120,120,0.5)', color: '#e6a2a2' }}>
          Import failed: {error}
        </div>
      )}

      {result && (
        <div style={{ ...box, borderColor: 'rgba(223,186,116,0.4)' }}>
          <strong style={{ color: '#dfba74' }}>
            {result.created} added
          </strong>
          {result.skipped > 0 && (
            <span style={{ color: 'rgba(245,242,240,0.7)' }}>
              {' · '}
              {result.skipped} skipped (duplicates)
            </span>
          )}
          {result.invalid > 0 && (
            <span style={{ color: '#e6a2a2' }}>
              {' · '}
              {result.invalid} invalid
            </span>
          )}
          {result.errors.length > 0 && (
            <ul style={{ margin: '12px 0 0', paddingInlineStart: 18, fontSize: 13 }}>
              {result.errors.map((e) => (
                <li key={e.row} style={{ color: 'rgba(245,242,240,0.6)' }}>
                  Row {e.row}: {e.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDoctorImport;
