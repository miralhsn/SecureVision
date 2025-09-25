export default function About() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <h2 className="text-3xl font-semibold md:text-4xl">About SecureVision</h2>
        <p className="mt-4 max-w-2xl text-white/70">
          Our mission is to make physical spaces safer through intelligent, responsible AI. We blend security expertise with a premium product experience.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="glass rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-medium">Team</h3>
            <p className="mt-2 text-sm text-white/70">We are engineers, designers, and operators who have built large-scale platforms across industries.</p>
          </div>
          <div className="glass rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-medium">Contact</h3>
            <form className="mt-4 grid gap-3">
              <input className="w-full rounded-md border border-white/10 bg-black/30 px-4 py-2 outline-none placeholder:text-white/40" placeholder="Your name" />
              <input className="w-full rounded-md border border-white/10 bg-black/30 px-4 py-2 outline-none placeholder:text-white/40" placeholder="Email" />
              <textarea className="w-full rounded-md border border-white/10 bg-black/30 px-4 py-2 outline-none placeholder:text-white/40" rows={4} placeholder="Message" />
              <button type="button" className="rounded-md bg-brand-600 px-5 py-2 text-sm font-medium hover:bg-brand-500">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}


