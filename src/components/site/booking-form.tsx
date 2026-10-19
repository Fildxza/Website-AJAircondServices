import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, Minus, Pencil, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BOOKING_MAX_NOTES,
  BOOKING_MAX_UNITS,
  areaIds,
  bookingLink,
  buildBookingMessage,
  clampQuantity,
  emptyDraft,
  serviceIds,
  unitIds,
  unitName,
  unitPrice,
  validateBooking,
  type AreaId,
  type BookingDraft,
  type BookingErrors,
  type ServiceId,
  type UnitId,
} from "@/content/booking";
import { fill } from "@/content/copy";
import { useLanguage } from "@/lib/language";
import { useBooking } from "./booking-context";
import { WhatsAppButton } from "./primitives";

type Option<V extends string> = { value: V; label: string };

/** Single-choice group made of native radio inputs, so arrow keys and screen readers work without extra code. */
function ChipGroup<V extends string>({
  legend,
  badge,
  name,
  options,
  value,
  onChange,
  error,
  help,
}: {
  legend: string;
  badge: string;
  name: string;
  options: readonly Option<V>[];
  value: V | null;
  onChange: (next: V) => void;
  error?: string | undefined;
  help?: string | undefined;
}) {
  const errorId = `${name}-error`;
  const helpId = `${name}-help`;
  return (
    <fieldset
      aria-describedby={[error && errorId, help && helpId].filter(Boolean).join(" ") || undefined}
    >
      <legend className="flex w-full items-baseline gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {legend}
        <span className="text-[0.65rem] font-semibold normal-case tracking-normal text-brand-ink">
          {badge}
        </span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option, i) => {
          const id = `${name}-${i}`;
          return (
            <div key={option.value}>
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center rounded-full border bg-white px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/60 active:scale-[0.97] peer-checked:border-cta peer-checked:bg-cta peer-checked:text-white peer-focus-visible:shadow-[0_0_0_2px_#231f1d,0_0_0_5px_#fff]",
                  error ? "border-destructive" : "border-border",
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {help && (
        <p id={helpId} className="mt-2 text-xs text-muted-foreground">
          {help}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}

type Step = "details" | "review";

/**
 * WhatsApp-assisted booking request. It validates the required fields, shows the exact message, and
 * lets the customer choose Amirul or Admin. Nothing is sent, saved or tracked, and no total is worked out.
 */
export function BookingForm() {
  const { lang, t } = useLanguage();
  const f = t.form;
  const uid = useId();
  const { prefill } = useBooking();

  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [step, setStep] = useState<Step>("details");
  const [flash, setFlash] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // A "Choose this unit" / symptom / "Ask about my area" button elsewhere on the page pre-fills the form.
  useEffect(() => {
    if (!prefill) return;
    setDraft((d) => ({
      ...d,
      unit: prefill.unit ?? d.unit,
      service: prefill.service ?? d.service,
      notes: prefill.notes && !d.notes ? prefill.notes : d.notes,
    }));
    setErrors({});
    setStep("details");
    setFlash(true);
    const timer = window.setTimeout(() => setFlash(false), 1600);
    return () => window.clearTimeout(timer);
  }, [prefill]);

  const update = (patch: Partial<BookingDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      if (patch.unit) delete next.unit;
      if (patch.service) delete next.service;
      if (patch.area) delete next.area;
      return next;
    });
  };

  const serviceOptions: Option<ServiceId>[] = serviceIds.map((id) => ({
    value: id,
    label: f.serviceLabels[id],
  }));
  const unitOptions: Option<UnitId>[] = unitIds.map((id) => ({ value: id, label: unitName(id) }));
  const areaOptions: Option<AreaId>[] = areaIds.map((a) => ({ value: a, label: a }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateBooking(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStep("review");
    requestAnimationFrame(() => reviewRef.current?.focus());
  };

  const reset = () => {
    setDraft(emptyDraft);
    setErrors({});
    setStep("details");
  };

  const message = buildBookingMessage(lang, draft);
  const price = draft.unit ? unitPrice(draft.unit) : undefined;
  const installing = draft.service === "install";
  const hasErrors = Object.keys(errors).length > 0;

  const steps: { id: Step | "send"; label: string }[] = [
    { id: "details", label: f.stepDetails },
    { id: "review", label: f.stepCheck },
    { id: "send", label: f.stepSend },
  ];
  const activeIndex = step === "details" ? 0 : 1;

  return (
    <div
      ref={formRef}
      data-booking-form
      className={cn(
        "rounded-2xl bg-white p-6 text-foreground shadow-lift transition-shadow duration-500 sm:p-8",
        flash && "ring-4 ring-white/80",
      )}
    >
      <h3 className="font-display text-2xl font-black uppercase leading-tight">{f.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{f.intro}</p>

      <ol
        className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-bold uppercase tracking-wider"
        aria-label={f.title}
      >
        {steps.map((s, i) => (
          <li
            key={s.id}
            aria-current={i === activeIndex ? "step" : undefined}
            className={cn(
              "flex items-center gap-2",
              i <= activeIndex ? "text-brand-ink" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "grid h-6 w-6 place-items-center rounded-full text-[0.7rem] transition-colors duration-300",
                i < activeIndex
                  ? "bg-cta text-white"
                  : i === activeIndex
                    ? "border-2 border-cta"
                    : "border border-border",
              )}
            >
              {i < activeIndex ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
            </span>
            {s.label}
            {i < steps.length - 1 && (
              <span className="hidden h-px w-5 bg-border sm:block" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {step === "details" ? (
        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-6">
          {hasErrors && (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="rounded-xl border border-destructive bg-red-50 px-4 py-3 text-sm font-semibold text-destructive"
            >
              {f.errors.summary}
            </div>
          )}
          <ChipGroup
            legend={f.unit}
            badge={f.required}
            name={`${uid}-unit`}
            options={unitOptions}
            value={draft.unit}
            onChange={(unit) => update({ unit })}
            error={errors.unit ? f.errors.unit : undefined}
          />
          <fieldset>
            <legend className="flex w-full items-baseline gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {f.quantity}
              <span className="text-[0.65rem] font-semibold normal-case tracking-normal text-brand-ink">
                {f.required}
              </span>
            </legend>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-white p-1">
              <button
                type="button"
                aria-label={f.quantityLess}
                disabled={draft.quantity <= 1}
                onClick={() => update({ quantity: clampQuantity(draft.quantity - 1) })}
                className="grid h-11 w-11 place-items-center rounded-full transition-all duration-200 hover:bg-brand-soft active:scale-90 disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <output
                aria-live="polite"
                aria-label={f.quantity}
                className="min-w-10 text-center font-display text-lg font-black"
              >
                {draft.quantity}
              </output>
              <button
                type="button"
                aria-label={f.quantityMore}
                disabled={draft.quantity >= BOOKING_MAX_UNITS}
                onClick={() => update({ quantity: clampQuantity(draft.quantity + 1) })}
                className="grid h-11 w-11 place-items-center rounded-full transition-all duration-200 hover:bg-brand-soft active:scale-90 disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </fieldset>
          <ChipGroup
            legend={f.service}
            badge={f.required}
            name={`${uid}-service`}
            options={serviceOptions}
            value={draft.service}
            onChange={(service) => update({ service })}
            error={errors.service ? f.errors.service : undefined}
          />
          <ChipGroup
            legend={f.area}
            badge={f.required}
            name={`${uid}-area`}
            options={areaOptions}
            value={draft.area}
            onChange={(area) => update({ area })}
            error={errors.area ? f.errors.area : undefined}
            help={f.areaHelp}
          />
          <div>
            <label
              htmlFor={`${uid}-notes`}
              className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              {f.notes}
              <span className="text-[0.65rem] font-semibold normal-case tracking-normal text-brand-ink">
                {f.optional}
              </span>
            </label>
            <textarea
              id={`${uid}-notes`}
              rows={3}
              maxLength={BOOKING_MAX_NOTES}
              value={draft.notes}
              onChange={(e) => update({ notes: e.target.value })}
              placeholder={f.notesPlaceholder}
              className="mt-3 w-full resize-y rounded-2xl border border-border bg-white px-4 py-3 text-base placeholder:text-muted-foreground/70"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground" aria-hidden>
              {fill(f.notesCount, { n: draft.notes.length, max: BOOKING_MAX_NOTES })}
            </p>
          </div>

          <div aria-live="polite" className="min-h-0">
            {installing ? (
              <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm">{f.installNote}</p>
            ) : (
              price !== undefined &&
              draft.unit && (
                <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm">
                  {fill(f.priceNote, { unit: unitName(draft.unit), price })}
                </p>
              )
            )}
          </div>

          <button
            type="submit"
            className="btn-shine inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-cta px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-[0_12px_24px_-12px_rgb(217_54_0/0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-lift active:scale-[0.98] sm:w-auto"
          >
            {f.review}
          </button>
        </form>
      ) : (
        <div className="mt-6">
          <h4
            ref={reviewRef}
            tabIndex={-1}
            className="font-display text-xl font-black uppercase outline-none"
          >
            {f.reviewTitle}
          </h4>
          <p className="mt-2 text-sm text-muted-foreground">{f.reviewIntro}</p>
          <div className="mt-4 rounded-2xl bg-brand-soft p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-ink">
              {f.messageLabel}
            </p>
            <p
              data-testid="booking-message"
              className="mt-3 whitespace-pre-line rounded-2xl rounded-tr-md bg-white p-4 text-sm leading-relaxed shadow-soft"
            >
              {message}
            </p>
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {f.sendVia}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton href={bookingLink("amirul", message)}>
              {fill(t.cta.whatsappName, { name: t.contact.amirul })}
              <span className="sr-only"> {t.a11y.opensWhatsApp}</span>
            </WhatsAppButton>
            <WhatsAppButton href={bookingLink("admin", message)} variant="outline">
              {fill(t.cta.whatsappName, { name: t.contact.admin })}
              <span className="sr-only"> {t.a11y.opensWhatsApp}</span>
            </WhatsAppButton>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand-ink"
            >
              <Pencil className="h-4 w-4" aria-hidden /> {f.edit}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-brand-ink"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> {f.startOver}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
