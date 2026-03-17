import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950">
          <div className="h-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),linear-gradient(180deg,#1a1a1a_0%,#0d0d0d_100%)] p-8">
            <h2 className="text-4xl font-black uppercase leading-none text-white">
              Who This Is For
            </h2>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-[#b08b62]">Men Who</h3>
              <ul className="mt-4 space-y-3 text-2xl leading-tight text-zinc-100">
                <li>• Show up consistently</li>
                <li>• Value discipline</li>
                <li>• Want to grow mentally, physically, and spiritually</li>
                <li>• Prioritize family first</li>
              </ul>
            </div>

            <div className="mt-12">
              <h3 className="text-4xl font-black uppercase leading-none text-white">
                Who This Is Not For
              </h3>
              <ul className="mt-4 space-y-3 text-2xl leading-tight text-zinc-100">
                <li>• Chronic complainers</li>
                <li>• Ego-driven leaders</li>
                <li>• Men looking for status</li>
                <li>• Men who are self-centered</li>
              </ul>
            </div>

            <div className="mt-12 border-t border-white/10 pt-6 text-base leading-7 text-zinc-300">
              <p>• Interested?</p>
              <p>• Speak with a current member — meetings are by invite only</p>
              <p>• Based out of: Aransas Pass, Texas</p>
              <p>• Club email and social contact available through leadership</p>
            </div>

            <div className="mt-6 flex gap-4 text-zinc-200">
              <div className="rounded-full border border-white/10 px-4 py-2">Call</div>
              <div className="rounded-full border border-white/10 px-4 py-2">Visit</div>
              <div className="rounded-full border border-white/10 px-4 py-2">Email</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black p-8 text-center">
            <h2 className="text-5xl font-black uppercase tracking-tight text-[#b08b62]">
              What We Are
            </h2>
            <p className="mx-auto mt-6 max-w-md text-xl leading-relaxed text-zinc-100">
              Buffalo Dog is a standards-driven brotherhood for men committed to
              discipline, leadership, faith, and service to your community.
            </p>

            <div className="mt-8 space-y-4 text-2xl text-zinc-200">
              <div className="border-t border-white/20 pt-4">We are not a social club.</div>
              <div className="border-t border-white/20 pt-4">We are not a networking group.</div>
              <div className="border-t border-white/20 pt-4">We are not therapy.</div>
              <div className="border-t border-white/20 pt-4 font-semibold text-white">
                We build men who can be trusted.
              </div>
            </div>

            <div className="mt-8 text-4xl">↓</div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900">
            <div className="bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_30%)] p-8 text-center">
              <h2 className="text-5xl font-black uppercase tracking-tight text-[#b08b62]">
                Our Foundation
              </h2>

              <div className="mt-6 space-y-2 text-2xl font-semibold text-zinc-100">
                <p>Discipline Over Excuses</p>
                <p>Truth Over Approval</p>
                <p>Accountability Without Ego</p>
                <p>Family First</p>
                <p>Faith as an Anchor</p>
                <p>Service Without Recognition</p>
              </div>

              <p className="mt-8 text-4xl font-black uppercase leading-tight text-white">
                Are You Ready To Chase The Storm?
              </p>
            </div>

            <div className="relative h-40">
              <Image
                src="/assets/storm-road.jpeg"
                alt="Storm road"
                fill
                className="object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo Dog"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/35" />

          <div className="relative flex h-full min-h-[760px] flex-col justify-between p-8">
            <div className="text-right text-6xl font-black uppercase leading-none text-white">
              Buffalo
              <br />
              Dog
            </div>

            <div>
              <p className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
                Challenge
                <br />
                Yourself
                <br />
                Be Better So That
                <br />
                You Can Be Better
                <br />
                For Others
              </p>

              <div className="mt-10 text-center">
                <div className="mb-3 text-lg font-bold uppercase tracking-[0.25em] text-zinc-300">
                  BOG
                </div>
                <Link
                  href="/contact"
                  className="inline-block rounded-2xl border border-white px-8 py-4 text-xl font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
                >
                  Apply To Join
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10">
          <Image
            src="/assets/Buffalo.png"
            alt="Mission"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative p-8">
            <h2 className="text-6xl font-black uppercase leading-none text-white">
              Our
              <br />
              Mission
            </h2>

            <div className="mt-10 space-y-6 text-2xl font-semibold text-zinc-100">
              <div className="border-t border-white/20 pt-4">★ Honor God</div>
              <div className="border-t border-white/20 pt-4">★ Serve Quietly</div>
              <div className="border-t border-white/20 pt-4">★ Lead Boldly</div>
              <div className="border-t border-white/20 pt-4">★ Train Consistently</div>
              <div className="border-t border-white/20 pt-4">★ Protect Family</div>
            </div>

            <div className="mt-12 text-6xl font-black uppercase leading-none text-white/20">
              BOG
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
          <div className="bg-[#9d7a55] px-8 py-10 text-center">
            <h2 className="text-6xl font-black uppercase leading-none text-white">
              What We
              <br />
              Do
            </h2>
          </div>

          <div className="p-8">
            <div className="mb-6 text-2xl font-bold text-white">Monthly Structure</div>

            <div className="space-y-6 text-xl text-zinc-200">
              <div>Scripture & Opening Prayer</div>
              <div>Habit Accountability</div>
              <div>Code Recitation</div>
              <div>Hard Truth Discussion</div>
              <div>Leadership Development</div>
              <div>Service Planning</div>
            </div>

            <p className="mt-10 text-center text-3xl font-black uppercase leading-tight text-white">
              We meet to sharpen.
              <br />
              We leave with action.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10">
          <Image
            src="/assets/wolf-eyes.jpeg"
            alt="How it works"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative p-8">
            <h2 className="text-6xl font-black uppercase leading-none text-white">
              How It Works
            </h2>

            <div className="mt-8 space-y-8 text-zinc-100">
              <div>
                <h3 className="text-3xl font-bold text-white">Observation Period (30–90 Days)</h3>
                <ul className="mt-3 space-y-2 text-2xl">
                  <li>• Listen more than you speak</li>
                  <li>• Learn the Code</li>
                  <li>• Earn trust</li>
                </ul>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">Probation (Pup Status)</h3>
                <ul className="mt-3 space-y-2 text-2xl">
                  <li>• No voice in decisions yet</li>
                  <li>• Demonstrate consistency</li>
                </ul>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white">Earned Rank Progression</h3>
                <p className="mt-3 text-2xl leading-relaxed">
                  Lone Wolf – Observing
                  <br />
                  Beta – Worker
                  <br />
                  Delta – Standard Keeper
                  <br />
                  Alpha – Responsibility Carrier
                  <br />
                  Council – Elders & Advisors
                </p>
              </div>

              <p className="pt-4 text-3xl font-black uppercase leading-tight text-white">
                No position is given.
                <br />
                Time, consistency, and character earn it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
