import React from "react";
import { Metadata } from "next";
import { Mail, MessageSquare, Clock, Globe } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { siteMeta } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Contact Us | ${siteMeta.name}`,
  description: "Get in touch with the Lux Aura Care team for inquiries, partnerships, or support.",
};

export default function ContactPage() {
  const contactFeatures = [
    {
      icon: <Mail className="text-accent-gold" size={24} />,
      title: "Direct Email",
      description: siteMeta.contactEmail,
      link: `mailto:${siteMeta.contactEmail}`,
    },
    {
      icon: <MessageSquare className="text-accent-gold" size={24} />,
      title: "Partnerships",
      description: "Interested in collaborating? Let's talk about how we can work together.",
    },
    {
      icon: <Clock className="text-accent-gold" size={24} />,
      title: "Response Time",
      description: "We typically respond within 24-48 business hours.",
    },
    {
      icon: <Globe className="text-accent-gold" size={24} />,
      title: "Support Area",
      description: "Based in Poland, supporting ritual seekers worldwide.",
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-heading text-4xl font-bold text-text-primary md:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Have a question about a ritual, a product recommendation, or just want to say hello? 
            We're here to help you on your journey to a more polished life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {contactFeatures.map((feature, i) => (
                <div 
                  key={i} 
                  className="rounded-2xl border border-border-subtle bg-surface-raised p-6 backdrop-blur-sm transition-colors hover:border-border-subtle"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold/10">
                    {feature.icon}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-text-primary">{feature.title}</h3>
                  {feature.link ? (
                    <a 
                      href={feature.link} 
                      className="text-text-secondary transition-colors hover:text-accent-gold"
                    >
                      {feature.description}
                    </a>
                  ) : (
                    <p className="text-text-secondary">{feature.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-border-subtle bg-surface-glass p-8 backdrop-blur-xl md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary">Send us a message</h2>
                <p className="text-text-secondary">Fill out the form below and we'll get back to you shortly.</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-accent-gold/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-accent-gold/5 blur-[120px]" />
      </div>
    </main>
  );
}
