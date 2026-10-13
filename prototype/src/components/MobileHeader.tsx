import Link from "next/link";

export function MobileHeader({
  title,
  back,
  action,
}: {
  title: string;
  back?: { href: string; label: string };
  action?: { href: string; label: string };
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-[var(--m-bg)]/90 px-5 pb-2 pt-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        {back && (
          <Link href={back.href} className="m-press -ml-2 flex size-11 items-center justify-center rounded-full text-cobalt" aria-label={back.label}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
        )}
        <span className="truncate text-[17px] font-semibold">{title}</span>
      </div>
      {action && (
        <Link href={action.href} className="m-press -mr-2 rounded-full px-3 py-2 text-[16px] font-semibold text-cobalt">
          {action.label}
        </Link>
      )}
    </header>
  );
}
