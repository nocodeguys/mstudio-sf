import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: "https://screwfast.uk",
  image: {
    domains: ["images.unsplash.com"],
  },
  // Comment out the Astro i18n config since we're using Starlight's
  // i18n: {
  //   defaultLocale: "pl",
  //   locales: ["pl", "en", "fr"],
  //   fallback: {
  //     en: "pl",
  //     fr: "pl",
  //   },
  //   routing: {
  //     prefixDefaultLocale: false,
  //   },
  // },
  prefetch: true,
  integrations: [
    react(),
    sitemap({
    i18n: {
      defaultLocale: "pl", // All urls that don't contain `en` after `https://screwfast.uk/` will be treated as default locale, i.e. `pl`
      locales: {
        pl: "pl", // The `defaultLocale` value must present in `locales` keys
        en: "en",
        fr: "fr", // Add French locale
      },
    },
  }), starlight({
    title: "ScrewFast Docs",
    defaultLocale: "root",
    // https://github.com/withastro/starlight/blob/main/packages/starlight/CHANGELOG.md
    // If no Astro and Starlight i18n configurations are provided, the built-in default locale is used in Starlight and a matching Astro i18n configuration is generated/used.
    // If only a Starlight i18n configuration is provided, an equivalent Astro i18n configuration is generated/used.
    // If only an Astro i18n configuration is provided, the Starlight i18n configuration is updated to match it.
    // If both an Astro and Starlight i18n configurations are provided, an error is thrown.
    locales: {
      root: {
        label: "Polski",
        lang: "pl",
      },
      en: { label: "English", lang: "en" },
      fr: { label: "Français", lang: "fr" }, // Add French locale
    },
    // https://starlight.astro.build/guides/sidebar/
    sidebar: [
      {
        label: "Szybki Start",
        translations: {
          en: "Quick Start Guides",
        },
        autogenerate: { directory: "guides" },
      },
      {
        label: "Tools & Equipment",
        items: [
          { label: "Tool Guides", link: "tools/tool-guides/" },
          { label: "Equipment Care", link: "tools/equipment-care/" },
        ],
      },
      {
        label: "Construction Services",
        autogenerate: { directory: "construction" },
      },
      {
        label: "Advanced Topics",
        autogenerate: { directory: "advanced" },
      },
    ],
    social: {
      github: "https://github.com/mearashadowfax/ScrewFast",
    },
    disable404Route: true,
    customCss: ["./src/assets/styles/starlight.css"],
    favicon: "/favicon.ico",
    components: {
      SiteTitle: "./src/components/ui/starlight/SiteTitle.astro",
      Head: "./src/components/ui/starlight/Head.astro",
      MobileMenuFooter: "./src/components/ui/starlight/MobileMenuFooter.astro",
      ThemeSelect: "./src/components/ui/starlight/ThemeSelect.astro",
    },
    head: [
      {
        tag: "meta",
        attrs: {
          property: "og:image",
          content: "https://screwfast.uk" + "/social.webp",
        },
      },
      {
        tag: "meta",
        attrs: {
          property: "twitter:image",
          content: "https://screwfast.uk" + "/social.webp",
        },
      },
    ],
  }), compressor({
    gzip: false,
    brotli: true,
  }), mdx()],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});