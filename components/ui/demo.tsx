"use client";

import { LocalizedLink } from "@/components/localized-link";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Camera,
  Pin,
  Play,
  Sparkles,
} from "lucide-react";
import Logo from "../../public/brand/lux_aura_care_logo.png";
import { FooterBackgroundGradient, TextHoverEffect } from "@/components/ui/hover-footer";
import { siteMeta } from "@/lib/site-data";
import { T } from "@/components/translated-text";
import Image from "next/image";

function HoverFooter() {
  const footerLinks = [
    {
      title: "Discover",
      links: [
        { label: "Self-Care Rituals", href: "/blog?category=self-care" },
        { label: "Skincare Guides", href: "/blog?category=skincare" },
        { label: "Body & Glow", href: "/blog?category=body-glow" },
        { label: "Spa & Relax", href: "/blog?category=spa-relax" },
      ],
    },
    {
      title: "Shop & Support",
      links: [
        { label: "Amazon Favorites", href: "/favorites" },
        { label: "Latest Articles", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
        { label: "Newsletter", href: "#newsletter", pulse: true },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-accent-gold" aria-hidden="true" />,
      text: siteMeta.contactEmail,
      href: `mailto:${siteMeta.contactEmail}`,
    },
    {
      icon: <Phone size={18} className="text-accent-gold" aria-hidden="true" />,
      text: "+491776931916",
      href: "tel:+491776931916",
    },
    {
      icon: <MapPin size={18} className="text-accent-gold" aria-hidden="true" />,
      text: "Wroclaw, Poland",
    },
  ];

  const socialLinks = [
    { icon: <Pin size={20} />, label: "Pinterest", href: "#" },
    { icon: <Camera size={20} />, label: "Instagram", href: "#" },
    { icon: <Play size={20} />, label: "YouTube", href: "#" },
  ];

  return (
    <footer className="relative mx-4 mb-6 mt-10 h-fit overflow-hidden rounded-3xl border border-border-subtle bg-surface-glass shadow-theme-lg backdrop-blur-xl md:mx-8">
      <div className="relative z-40 mx-auto max-w-7xl p-8 md:p-14">
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <Image src={Logo} className="w-8 rounded-full opacity-80" alt="logo" />
              <span className="font-heading text-3xl text-text-primary"><T text={"Lux Aura Care"} /></span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              <T text={"Editorial self-care platform curated to help Pinterest readers move from inspiration to confident product choices."} />
            </p>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent-gold">
              <Sparkles className="size-4" aria-hidden="true" />
              <T text={"Calm luxury. Better routines."} />
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-6 text-lg font-semibold text-text-primary"><T text={section.title} /></h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <LocalizedLink href={link.href} className="text-text-secondary transition-colors hover:text-accent-gold">
                      <T text={link.label} />
                    </LocalizedLink>
                    {link.pulse ? (
                      <span className="absolute right-[-10px] top-0 h-2 w-2 animate-pulse rounded-full bg-accent-gold" />
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-6 text-lg font-semibold text-text-primary"><T text={"Contact"} /></h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  {item.icon}
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-accent-gold">
                      <T text={item.text} />
                    </a>
                  ) : (
                    <span><T text={item.text} /></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-8 border-t border-border-default" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <div className="flex space-x-6 text-text-secondary">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="transition-colors hover:text-accent-gold"
              >
                {icon}
              </a>
            ))}
          </div>

          <p className="text-center text-text-secondary md:text-left">
            © {new Date().getFullYear()} <T text={"Lux Aura Care. All rights reserved."} />
          </p>
        </div>
      </div>

      <div className="-mb-36 -mt-52 hidden h-[30rem] lg:flex">
        <TextHoverEffect text="Lux Aura" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
