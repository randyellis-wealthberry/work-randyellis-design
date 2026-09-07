import type { Metadata } from "next";
import Link from "next/link";
import { isStripeConfigured } from "@/lib/stripe";
import { retrievePurchase, downloadUrl } from "@/lib/skill/purchase";
import { signDownloadGrant } from "@/lib/skill/download-token";
import { SKILL_MODULES } from "@/lib/data/skill-catalog";
import { SECTION, LABEL, ROW } from "@/components/case-study/section-chrome";
import { SECONDARY_BUTTON } from "@/components/ui/button-styles";
import { WEBSITE_URL } from "@/lib/constants";
import { SuccessTracker } from "./success-tracker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Skill.md modules",
  robots: { index: false, follow: false },
  alternates: { canonical: "/skill" },
};

type Props = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

/**
 * Where a buyer lands after Stripe, and where their receipt link brings them
 * back. Verifies the session with Stripe on every visit and mints a fresh
 * download grant, so this page, not the email, is the durable copy.
 */
export default async function SkillSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;

  if (!sessionId) {
    return (
      <Shell title="No purchase to show.">
        <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          This page needs the link from your receipt, which carries your
          checkout reference. Open that link, or start again from the modules.
        </p>
        <BackLink />
      </Shell>
    );
  }

  if (!isStripeConfigured()) {
    return (
      <Shell title="Downloads are not open yet.">
        <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          Checkout is not configured on this deployment. If you have paid, reply
          to your receipt email and the files will be sent by hand.
        </p>
        <BackLink />
      </Shell>
    );
  }

  let purchase;
  try {
    purchase = await retrievePurchase(sessionId);
  } catch (error) {
    console.error("[skill/success] retrieve failed", error);
    return (
      <Shell title="That checkout reference did not resolve.">
        <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          Stripe did not recognise the reference in this link. If you copied it
          from an email, check that the whole address came across. If it did,
          reply to the receipt and the files will be sent by hand.
        </p>
        <BackLink />
      </Shell>
    );
  }

  if (!purchase.paid) {
    return (
      <Shell title="Payment has not completed.">
        <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          Stripe has not confirmed this payment yet. If you have just paid, wait
          a moment and reload. If checkout was cancelled, nothing was charged.
        </p>
        <BackLink />
      </Shell>
    );
  }

  const modules = SKILL_MODULES.filter((m) => purchase.modules.includes(m.id));
  const token = signDownloadGrant({
    sid: purchase.sessionId,
    skills: purchase.modules,
  });

  return (
    <Shell
      title={
        modules.length === 1
          ? `${modules[0].name} is yours.`
          : `${modules.length} modules are yours.`
      }
    >
      <SuccessTracker
        modules={purchase.modules}
        sessionId={purchase.sessionId}
      />
      <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
        Each module is one <code className="font-mono text-sm">SKILL.md</code>{" "}
        file. Save it as{" "}
        <code className="font-mono text-sm">
          .claude/skills/&lt;module&gt;/SKILL.md
        </code>{" "}
        in your project, or wherever your agent keeps skills, and it is
        installed. Nothing else to configure.
      </p>

      <section className={SECTION} aria-labelledby="files-heading">
        <h2 id="files-heading" className={LABEL}>
          Your files
        </h2>
        <dl className="mt-6">
          {modules.map((module) => (
            <div key={module.id} className={ROW}>
              <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                <span className="block font-medium text-zinc-900 dark:text-white">
                  {module.name}
                </span>
                <span className="font-mono text-xs">{module.id}/SKILL.md</span>
              </dt>
              <dd className="mt-3 sm:mt-0">
                <a
                  href={downloadUrl(WEBSITE_URL, token, module.id)}
                  className={SECONDARY_BUTTON}
                  download={`${module.id}-SKILL.md`}
                >
                  Download SKILL.md
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[62ch] text-xs text-zinc-500 dark:text-zinc-400">
          These links are good for thirty days. This page is good for as long as
          the receipt exists: bookmark it, or keep the email Stripe sent, and
          come back for a fresh link or an updated file.
        </p>
      </section>

      <section className={SECTION} aria-labelledby="license-heading">
        <h2 id="license-heading" className={LABEL}>
          What you may do with it
        </h2>
        <p className="mt-6 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          Licensed to you, or to the team you bought it for. Install it in every
          project you like, edit it to fit your product, and keep the edits. Do
          not republish the file or resell it. When a new version is published,
          this page serves it.
        </p>
      </section>

      <div className="mt-20 border-t border-zinc-900 pt-10 dark:border-zinc-100">
        <p className="max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          If a file will not open, reply to the receipt email. If you want the
          modules applied to your product with Randy in the room, the two-week
          diagnostic ends with a SKILL.md written for it.
        </p>
        <div className="mt-6">
          <Link href="/skill#engagement" className={SECONDARY_BUTTON}>
            About the diagnostic
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="pb-8">
      <p className="mb-3 text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
        Skill.md
      </p>
      <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
        {title}
      </h1>
      {children}
    </main>
  );
}

function BackLink() {
  return (
    <div className="mt-8">
      <Link href="/skill#modules" className={SECONDARY_BUTTON}>
        Back to the modules
      </Link>
    </div>
  );
}
