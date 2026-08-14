import { ZOOM } from "@/app/lib/theme";

const FOOTER_LINKS = [
  "Privacy & Legal Policies",
  "About Ads",
  "Cookie Preferences",
  "Trust Center",
  "Acceptable Use Guidelines",
  "Legal & Compliance",
];

/** The language list the zoom.us footer offers. */
const LANGUAGES = [
  "English",
  "Deutsch",
  "Español",
  "Français",
  "Português",
  "简体中文",
  "繁體中文",
  "日本語",
  "한국어",
  "Русский",
  "Italiano",
  "Tiếng Việt",
  "Polski",
  "Türkçe",
  "Bahasa Indonesia",
  "Nederlands",
  "Svenska",
];

/** The zoom.us page footer: copyright, policy links, language picker. */
export default function PortalFooter() {
  return (
    <footer
      className="border-t px-8 py-6 text-xs"
      style={{ borderColor: ZOOM.border, backgroundColor: ZOOM.page }}
    >
      <div className="flex items-center justify-between gap-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span style={{ color: ZOOM.muted }}>
            Copyright ©2026 Zoom Communications, Inc. All rights reserved.
          </span>

          {FOOTER_LINKS.map((item) => (
            <span
              key={item}
              className="cursor-pointer hover:underline"
              style={{ color: ZOOM.blue }}
            >
              {item}
            </span>
          ))}
        </div>

        <select
          defaultValue="English"
          aria-label="Language"
          className="h-8 shrink-0 rounded-lg border bg-white px-2 text-xs outline-none"
          style={{ borderColor: ZOOM.field }}
        >
          {LANGUAGES.map((language) => (
            <option key={language}>{language}</option>
          ))}
        </select>
      </div>
    </footer>
  );
}
