'use client';

import { FC, ReactNode } from 'react';
import type { ProductContent, BenefitItem, StatItem, StepItem, PackItem } from '@/products';
import styles from './admin-form.module.scss';

interface Props {
  value: ProductContent;
  onChange: (next: ProductContent) => void;
  dir?: 'ltr' | 'rtl';
}

const set = <K extends keyof ProductContent>(
  v: ProductContent,
  k: K,
  next: ProductContent[K]
): ProductContent => ({ ...v, [k]: next });

const LocaleContentEditor: FC<Props> = ({ value, onChange, dir = 'ltr' }) => {
  const upd = <K extends keyof ProductContent>(k: K, n: ProductContent[K]) =>
    onChange(set(value, k, n));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} dir={dir}>
      <div className={styles.grid}>
        <Field label="Name *">
          <input
            className={styles.input}
            value={value.name}
            onChange={(e) => upd('name', e.target.value)}
            required
            dir={dir}
          />
        </Field>
        <Field label="Eyebrow">
          <input
            className={styles.input}
            value={value.eyebrow}
            onChange={(e) => upd('eyebrow', e.target.value)}
            dir={dir}
          />
        </Field>
        <Field label="Tagline" wide>
          <input
            className={styles.input}
            value={value.tagline}
            onChange={(e) => upd('tagline', e.target.value)}
            dir={dir}
          />
        </Field>
        <Field label="Short description (catalog card)" wide>
          <textarea
            className={styles.textarea}
            value={value.shortDescription}
            onChange={(e) => upd('shortDescription', e.target.value)}
            rows={2}
            dir={dir}
          />
        </Field>
        <Field label="Description (hero)" wide>
          <textarea
            className={styles.textarea}
            value={value.description}
            onChange={(e) => upd('description', e.target.value)}
            rows={4}
            dir={dir}
          />
        </Field>
      </div>

      <SectionBlock title="Key facts (one per line)">
        <LineListField
          value={value.keyFacts ?? []}
          onChange={(v) => upd('keyFacts', v.length ? v : undefined)}
          dir={dir}
          rows={5}
          placeholder="One declarative fact per line — surfaces at the top of the product page and in JSON-LD."
        />
      </SectionBlock>

      <SectionBlock title="Stats (header strip)">
        <RepeatableRows<StatItem>
          items={value.stats}
          onChange={(v) => upd('stats', v)}
          template={{ value: '', label: '' }}
          fields={[
            { key: 'value', label: 'Value', width: '40%' },
            { key: 'label', label: 'Label', width: '60%' },
          ]}
          dir={dir}
        />
      </SectionBlock>

      <SectionBlock title="Benefits (cards)">
        <RepeatableRows<BenefitItem>
          items={value.benefits}
          onChange={(v) => upd('benefits', v)}
          template={{ title: '', text: '' }}
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'text', label: 'Text', multiline: true },
          ]}
          dir={dir}
        />
      </SectionBlock>

      <SectionBlock title="Formula — ingredients">
        <Field label="Intro">
          <textarea
            className={styles.textarea}
            value={value.ingredientsIntro}
            onChange={(e) => upd('ingredientsIntro', e.target.value)}
            rows={2}
            dir={dir}
          />
        </Field>
        <Field label="Ingredients (one per line)">
          <LineListField
            value={value.ingredients}
            onChange={(v) => upd('ingredients', v)}
            dir={dir}
            rows={6}
            placeholder="One ingredient per line."
          />
        </Field>
      </SectionBlock>

      <SectionBlock title="System / Steps (optional)">
        <Field label="Section title">
          <input
            className={styles.input}
            value={value.stepsTitle ?? ''}
            onChange={(e) => upd('stepsTitle', e.target.value || undefined)}
            placeholder="e.g. The 3-Step System"
            dir={dir}
          />
        </Field>
        <RepeatableRows<StepItem>
          items={value.steps ?? []}
          onChange={(v) => upd('steps', v.length ? v : undefined)}
          template={{ num: '', title: '', text: '' }}
          fields={[
            { key: 'num', label: '#', width: '10%' },
            { key: 'title', label: 'Title', width: '35%' },
            { key: 'text', label: 'Text', multiline: true },
          ]}
          dir={dir}
        />
      </SectionBlock>

      <SectionBlock title="Kit / Pack (optional)">
        <Field label="Section title">
          <input
            className={styles.input}
            value={value.packTitle ?? ''}
            onChange={(e) => upd('packTitle', e.target.value || undefined)}
            placeholder="e.g. What's in the box"
            dir={dir}
          />
        </Field>
        <RepeatableRows<PackItem>
          items={value.pack ?? []}
          onChange={(v) => upd('pack', v.length ? v : undefined)}
          template={{ qty: '', title: '', text: '' }}
          fields={[
            { key: 'qty', label: 'Qty', width: '12%' },
            { key: 'title', label: 'Title', width: '34%' },
            { key: 'text', label: 'Text', multiline: true },
          ]}
          dir={dir}
        />
      </SectionBlock>

      <OptionalTitleAndItems
        title="Application protocol (optional)"
        value={value.protocol}
        onChange={(v) => upd('protocol', v)}
        dir={dir}
        placeholder="One step per line — concrete volumes and timing."
      />
      <OptionalTitleAndItems
        title="After-care recommendations (optional)"
        value={value.aftercare}
        onChange={(v) => upd('aftercare', v)}
        dir={dir}
        placeholder="One recommendation per line."
      />
      <OptionalTitleAndItems
        title="Contraindications (optional)"
        value={value.contraindications}
        onChange={(v) => upd('contraindications', v)}
        dir={dir}
        placeholder="One item per line."
      />

      <SectionBlock title="Indications chips">
        <Field label="Section title">
          <input
            className={styles.input}
            value={value.chipsTitle}
            onChange={(e) => upd('chipsTitle', e.target.value)}
            dir={dir}
          />
        </Field>
        <Field label="Chips (one per line)">
          <LineListField
            value={value.chips}
            onChange={(v) => upd('chips', v)}
            dir={dir}
            rows={4}
            placeholder="Short tag-like indications, one per line."
          />
        </Field>
      </SectionBlock>

      <SectionBlock title="CTA band">
        <div className={styles.grid}>
          <Field label="Title" wide>
            <input
              className={styles.input}
              value={value.ctaTitle}
              onChange={(e) => upd('ctaTitle', e.target.value)}
              dir={dir}
            />
          </Field>
          <Field label="Text" wide>
            <textarea
              className={styles.textarea}
              value={value.ctaText}
              onChange={(e) => upd('ctaText', e.target.value)}
              rows={2}
              dir={dir}
            />
          </Field>
        </div>
      </SectionBlock>
    </div>
  );
};

function Field({
  label,
  hint,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={`${styles.field} ${wide ? styles.wide : ''}`}
    >
      <span className={styles.fieldLabel}>{label}</span>
      {children}
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </label>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function LineListField({
  value,
  onChange,
  rows = 4,
  placeholder,
  dir,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  rows?: number;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <textarea
      className={styles.textarea}
      rows={rows}
      placeholder={placeholder}
      dir={dir}
      value={value.join('\n')}
      onChange={(e) =>
        onChange(
          e.target.value
            .split('\n')
            .map((l) => l.replace(/\s+$/, ''))
            // keep blanks during typing so the cursor doesn't jump; trim
            // empties only when reading back at submit time.
        )
      }
      onBlur={(e) =>
        onChange(
          e.target.value
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l.length > 0)
        )
      }
    />
  );
}

interface RepeatableField<T> {
  key: keyof T & string;
  label: string;
  multiline?: boolean;
  width?: string;
}

function RepeatableRows<T extends object>({
  items,
  onChange,
  template,
  fields,
  dir,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  template: T;
  fields: RepeatableField<T>[];
  dir?: 'ltr' | 'rtl';
}) {
  const update = (i: number, k: keyof T, v: string) => {
    const next = items.slice();
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  const add = () => onChange([...items, { ...template }]);
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const move = (i: number, delta: -1 | 1) => {
    const j = i + delta;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((row, i) => (
        <div
          key={i}
          className={styles.row}
          style={{
            gridTemplateColumns: fields.map((f) => f.width ?? '1fr').join(' '),
          }}
        >
          {fields.map((f) => (
            <label
              key={String(f.key)}
              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'rgba(245,242,240,0.5)',
                }}
              >
                {f.label}
              </span>
              {f.multiline ? (
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={String(row[f.key] ?? '')}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  dir={dir}
                />
              ) : (
                <input
                  className={styles.input}
                  value={String(row[f.key] ?? '')}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  dir={dir}
                />
              )}
            </label>
          ))}
          <div
            className={styles.rowActions}
            style={{ gridColumn: '1 / -1' }}
          >
            <button
              type="button"
              className={styles.iconBtn}
              disabled={i === 0}
              onClick={() => move(i, -1)}
              aria-label="Move up"
              title="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              disabled={i === items.length - 1}
              onClick={() => move(i, 1)}
              aria-label="Move down"
              title="Move down"
            >
              ↓
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              onClick={() => remove(i)}
              aria-label="Remove"
              title="Remove"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={add}>
        + Add row
      </button>
    </div>
  );
}

function OptionalTitleAndItems({
  title,
  value,
  onChange,
  dir,
  placeholder,
}: {
  title: string;
  value?: { title: string; items: string[] };
  onChange: (next: { title: string; items: string[] } | undefined) => void;
  dir?: 'ltr' | 'rtl';
  placeholder?: string;
}) {
  const v = value ?? { title: '', items: [] };
  const update = (next: { title: string; items: string[] }) => {
    if (!next.title.trim() && next.items.length === 0) {
      onChange(undefined);
    } else {
      onChange(next);
    }
  };
  return (
    <SectionBlock title={title}>
      <Field label="Section title">
        <input
          className={styles.input}
          value={v.title}
          onChange={(e) => update({ ...v, title: e.target.value })}
          dir={dir}
        />
      </Field>
      <Field label="Items (one per line)">
        <LineListField
          value={v.items}
          onChange={(items) => update({ ...v, items })}
          dir={dir}
          rows={4}
          placeholder={placeholder}
        />
      </Field>
    </SectionBlock>
  );
}

export default LocaleContentEditor;
