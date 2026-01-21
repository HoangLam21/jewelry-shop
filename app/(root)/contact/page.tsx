import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="text-dark100_light500">
      {/* HERO */}
      <section className="h-[220px] md:h-[300px] bg-gradient-to-b from-[#EDF1F3] to-white dark:from-dark-200 dark:to-dark-100 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-light tracking-widest text-4xl sm:text-5xl md:text-6xl lg:text-[72px]">
            CONTACT
          </h1>

          <div className="flex justify-center items-center gap-2 mt-4 text-sm">
            <Link href="/" className="hover:text-primary-100 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-5 h-5 text-dark100_light500" />
            <span className="text-primary-100">Contact</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        {/* CONTACT INFO + FORM */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* INFO */}
          <div className="space-y-6">
            <h2 className="text-2xl jost font-normal">CONTACT INFO</h2>
            <p className="text-sm sm:text-base opacity-80">
              Tortor dignissim convallis aenean et tortor at risus viverra
              adipiscing.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {[{ title: "OFFICE" }, { title: "MANAGEMENT" }].map(
                (item, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="jost text-lg underline">{item.title}</h3>
                    <p>730 Glenstone Ave 65802, Springfield, US</p>
                    <p>+123 222 333 44</p>
                    <p>+123 666 777 88</p>
                    <p>ministore@yourinfo.com</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* FORM */}
          <div className="space-y-6">
            <h2 className="text-2xl jost font-normal">ANY QUESTIONS?</h2>
            <p className="text-sm sm:text-base opacity-80">
              Use the form below to get in touch with us.
            </p>

            <form className="space-y-4">
              {[
                { type: "text", placeholder: "Your full name", required: true },
                { type: "email", placeholder: "Your email", required: true },
                { type: "tel", placeholder: "Phone number" },
                { type: "text", placeholder: "Subject" },
              ].map((field, idx) => (
                <input
                  key={idx}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full p-3 border border-gray-300 bg-transparent focus:border-primary-100 outline-none transition"
                />
              ))}

              <textarea
                placeholder="Write your message"
                required
                className="w-full p-3 border border-gray-300 bg-transparent focus:border-primary-100 outline-none transition min-h-[120px]"
              />

              <button
                type="submit"
                className="inline-block bg-primary-100 text-white px-8 py-3 text-sm tracking-wide transition hover:opacity-90"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        {/* STORES */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/assets/images/lang-store-int-2021-1634058186.avif"
              alt="Our store"
              width={640}
              height={529}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl jost font-normal">OUR STORES</h2>
            <p className="text-sm sm:text-base opacity-80">
              You can also directly buy products from our stores.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {["USA", "FRANCE"].map((country, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="jost text-lg underline">{country}</h3>
                  <p>730 Glenstone Ave 65802, Springfield, US</p>
                  <p>+123 222 333 44</p>
                  <p>+123 666 777 88</p>
                  <p>ministore@yourinfo.com</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
