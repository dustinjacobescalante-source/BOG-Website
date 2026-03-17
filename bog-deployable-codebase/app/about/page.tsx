import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10 py-20">
        <div className="absolute inset-0">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo background"
            fill
            className="object-contain opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Brotherhood of Growth
          </h1>
          <p className="mt-4 text-lg text-zinc-300">
            Discipline • Brotherhood • Ownership • Growth
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-3xl font-black text-white">WHO THIS IS FOR</h2>
          <h3 className="mb-4 text-2xl font-bold text-red-400">Men Who</h3>
          <ul className="space-y-3 text-lg text-zinc-300">
            <li>• Show up consistently</li>
            <li>• Value discipline</li>
            <li>• Want to grow mentally, physically, and spiritually</li>
            <li>• Prioritize family first</li>
          </ul>

          <h2 className="mb-6 mt-10 text-3xl font-black text-white">WHO THIS IS NOT FOR</h2>
          <ul className="space-y-3 text-lg text-zinc-300">
            <li>• Chronic complainers</li>
            <li>• Ego-driven leaders</li>
            <li>• Men looking for status</li>
            <li>• Men who are self-centered</li>
          </ul>

          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-zinc-400">
            <p>• Interested?</p>
            <p>• Speak with a current member — meetings are by invite only</p>
            <p>• Based out of: Aransas Pass, Texas</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-white/10 bg-black p-8 text-center">
            <h2 className="mb-6 text-4xl font-black text-[#b08b62]">WHAT WE ARE</h2>
            <p className="mx-auto max-w-md text-lg leading-relaxed text-zinc-300">
              Buffalo Dog is a standards-driven brotherhood for men committed to
              discipline, leadership, faith, and service to your community.
            </p>

            <div className="mt-8 space-y-4 text-lg text-zinc-200">
              <div className="border-t border-white/20 pt-4">We are not a social club.</div>
              <div className="border-t border-white/20 pt-4">We are not a networking group.</div>
              <div className="border-t border-white/20 pt-4">We are not therapy.</div>
              <div className="border-t border-white/20 pt-4 font-semibold">
                We build men who can be trusted.
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900 text-center">
            <div className="p-8">
              <h2 className="mb-6 text-4xl font-black text-[#b08b62]">OUR FOUNDATION</h2>
              <div className="space-y-2 text-xl font-semibold text-zinc-100">
                <p>Discipline Over Excuses</p>
                <p>Truth Over Approval</p>
                <p>Accountability Without Ego</p>
                <p>Family First</p>
                <p>Faith as an Anchor</p>
                <p>Service Without Recognition</p>
              </div>
              <p className="mt-8 text-3xl font-black uppercase leading-tight text-white">
                Are you ready to chase the storm?
              </p>
            </div>

            <div className="relative h-40">
              <Image
                src="/assets/storm-road.jpeg"
                alt="Storm road"
                fill
                className="object-cover opacity-70"
              />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <Image
            src="/assets/Buffalo.png"
            alt="Buffalo Dog"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative flex h-full flex-col justify-between p-8">
            <div className="text-right text-6xl font-black leading-none text-white/90">
              BUFFALO
              <br />
              DOG
            </div>

            <div className="space-y-4">
              <p className="text-5xl font-black uppercase leading-tight text-white">
                Challenge yourself
                <br />
                be better so that
                <br />
                you can be better
                <br />
                for others
              </p>

              <div className="pt-4 text-center">
                <div className="mb-3 text-lg font-bold uppercase tracking-[0.2em] text-zinc-300">
                  BOG
                </div>
                <button className="rounded-2xl border border-white px-6 py-3 text-lg font-bold text-white">
                  Apply to Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8">
          <Image
            src="/assets/Buffalo.png"
            alt="Mission background"
            fill
            className="object-cover opacity-10"
          />
          <div className="relative">
            <h2 className="mb-8 text-5xl font-black leading-none text-white">
              OUR
              <br />
              MISSION
            </h2>

            <div className="space-y-6 text-xl font-semibold text-zinc-200">
              <div className="border-t border-white/20 pt-4">★ Honor God</div>
              <div className="border-t border-white/20 pt-4">★ Serve Quietly</div>
              <div className="border-t border-white/20 pt-4">★ Lead Boldly</div>
              <div className="border-t border-white/20 pt-4">★ Train Consistently</div>
              <div className="border-t border-white/20 pt-4">★ Protect Family</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black p-8">
          <div className="mb-8 bg-[#9d7a55] px-6 py-8 text-center">
            <h2 className="text-5xl font-black leading-none text-white">
              WHAT WE
              <br />
              DO
            </h2>
          </div>

          <div className="space-y-6 text-lg text-zinc-200">
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

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-8 text-5xl font-black leading-none text-white">
            HOW IT WORKS
          </h2>

          <div className="space-y-8 text-zinc-200">
            <div>
              <h3 className="text-2xl font-bold text-white">Observation Period (30–90 Days)</h3>
              <ul className="mt-3 space-y-2 text-lg">
                <li>• Listen more than you speak</li>
                <li>• Learn the Code</li>
                <li>• Earn trust</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Probation (Pup Status)</h3>
              <ul className="mt-3 space-y-2 text-lg">
                <li>• No voice in decisions yet</li>
                <li>• Demonstrate consistency</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Earned Rank Progression</h3>
              <p className="mt-3 text-lg">
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
      </section>
    </div>
  );
}
