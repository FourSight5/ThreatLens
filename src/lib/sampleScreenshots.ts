// ThreatLens Realistic Screenshot Mockups for Demonstration & Testing
// Embedded as high-fidelity SVG Data URLs

export interface ScreenshotSampleItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'phishing_sso' | 'instagram' | 'x_support' | 'mod_apk' | 'official';
  badge: string;
  badgeColor: string;
  targetCandidate: string;
  dataUrl: string;
}

export const SCREENSHOT_SAMPLES: ScreenshotSampleItem[] = [
  {
    id: 'sample_phishing_sso',
    title: 'Spoofed Enterprise SSO Portal',
    subtitle: 'Homoglyph URL threatl3ns.xyz with corporate login harvester',
    category: 'phishing_sso',
    badge: '🚨 Critical Phishing',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    targetCandidate: 'https://threatl3ns-login-portal.xyz/auth?step=verify',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
      <rect width="800" height="520" fill="%23f1f5f9"/>
      <!-- Browser Chrome Window -->
      <rect x="20" y="20" width="760" height="480" rx="16" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/>
      <path d="M 20 36 A 16 16 0 0 1 36 20 L 764 20 A 16 16 0 0 1 780 36 L 780 70 L 20 70 Z" fill="%23e2e8f0"/>
      <!-- Window Dots -->
      <circle cx="44" cy="45" r="6" fill="%23ef4444"/>
      <circle cx="64" cy="45" r="6" fill="%23f59e0b"/>
      <circle cx="84" cy="45" r="6" fill="%2310b981"/>
      <!-- Address Bar -->
      <rect x="120" y="32" width="560" height="28" rx="8" fill="%23ffffff" stroke="%23fca5a5" stroke-width="2"/>
      <text x="135" y="51" font-family="monospace" font-size="12" font-weight="bold" fill="%23b91c1c">⚠️ https://threatl3ns-login-portal.xyz/auth?step=verify</text>
      <!-- Page Content: Cloned SSO -->
      <rect x="230" y="110" width="340" height="350" rx="16" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="1.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))"/>
      <!-- Cloned Logo -->
      <rect x="375" y="135" width="50" height="50" rx="12" fill="%234f46e5"/>
      <text x="390" y="167" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23ffffff">TL</text>
      <text x="315" y="215" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230f172a">ThreatLens SSO Portal</text>
      <text x="270" y="235" font-family="sans-serif" font-size="11" fill="%2364748b">Session Expired • Re-authenticate your corporate credentials</text>
      <!-- Form Fields -->
      <text x="260" y="270" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23334155">Corporate Analyst Email</text>
      <rect x="260" y="280" width="280" height="34" rx="8" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1"/>
      <text x="272" y="302" font-family="sans-serif" font-size="12" fill="%2394a3b8">analyst@company.com</text>
      <text x="260" y="335" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23334155">Master Password / Security Key</text>
      <rect x="260" y="345" width="280" height="34" rx="8" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1"/>
      <text x="272" y="367" font-family="sans-serif" font-size="14" fill="%2394a3b8">••••••••••••••••</text>
      <!-- Submit Button -->
      <rect x="260" y="395" width="280" height="38" rx="8" fill="%234f46e5"/>
      <text x="360" y="419" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff">Verify &amp; Sign In</text>
      <!-- Security Watermark -->
      <rect x="20" y="470" width="760" height="30" fill="%23fee2e2"/>
      <text x="180" y="490" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23991b1b">⚠️ SUSPICIOUS PHISHING FORM: Address bar homoglyph "3" &amp; unverified domain</text>
    </svg>`,
  },
  {
    id: 'sample_instagram_scam',
    title: 'Counterfeit Instagram Airdrop Profile',
    subtitle: 'Lookalike handle @threatlens_promo_rewards with bit.ly redirect',
    category: 'instagram',
    badge: '🚨 Critical Scam',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    targetCandidate: 'https://www.instagram.com/threatlens_promo_rewards/',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
      <rect width="800" height="520" fill="%23fafafa"/>
      <!-- Mobile Container -->
      <rect x="200" y="15" width="400" height="490" rx="28" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.06))"/>
      <!-- Header -->
      <text x="330" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">threatlens_promo_rewards</text>
      <!-- Profile Avatar -->
      <circle cx="265" cy="115" r="35" fill="%23e0e7ff"/>
      <text x="250" y="123" font-family="sans-serif" font-size="20" font-weight="bold" fill="%234338ca">TL</text>
      <!-- Stats -->
      <text x="345" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">14</text>
      <text x="338" y="122" font-family="sans-serif" font-size="10" fill="%2364748b">posts</text>
      <text x="420" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">1,205</text>
      <text x="410" y="122" font-family="sans-serif" font-size="10" fill="%2364748b">followers</text>
      <text x="500" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">89</text>
      <text x="490" y="122" font-family="sans-serif" font-size="10" fill="%2364748b">following</text>
      <!-- Bio -->
      <text x="235" y="175" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">ThreatLens Community Airdrop ✔️</text>
      <text x="235" y="195" font-family="sans-serif" font-size="11" fill="%23334155">Official ThreatLens Security token drop! Celebrating $20M Series A!</text>
      <text x="235" y="213" font-family="sans-serif" font-size="11" fill="%23334155">Claim commemorative security tokens by linking your Web3 wallet:</text>
      <text x="235" y="235" font-family="sans-serif" font-size="12" font-weight="bold" fill="%232563eb">🔗 bit.ly/tlens-airdrop</text>
      <!-- Buttons -->
      <rect x="235" y="255" width="150" height="30" rx="8" fill="%230284c7"/>
      <text x="295" y="275" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23ffffff">Follow</text>
      <rect x="395" y="255" width="150" height="30" rx="8" fill="%23f1f5f9"/>
      <text x="450" y="275" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23334155">Message</text>
      <!-- Grid Posts -->
      <rect x="235" y="305" width="100" height="95" rx="4" fill="%23dbeafe"/>
      <text x="245" y="355" font-family="sans-serif" font-size="10" font-weight="bold" fill="%231e40af">🎁 500 TLENS</text>
      <rect x="345" y="305" width="100" height="95" rx="4" fill="%23fce7f3"/>
      <text x="355" y="355" font-family="sans-serif" font-size="10" font-weight="bold" fill="%239d174d">🔥 FREE CLAIM</text>
      <rect x="455" y="305" width="100" height="95" rx="4" fill="%23fee2e2"/>
      <text x="465" y="355" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23991b1b">⚠️ 24H LEFT</text>
      <!-- Warning Banner -->
      <rect x="200" y="455" width="400" height="50" rx="0" fill="%23fee2e2"/>
      <text x="215" y="475" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23991b1b">DETECTED THREAT: Fake verification emoji + Shortened wallet lure</text>
      <text x="215" y="492" font-family="sans-serif" font-size="9" fill="%23b91c1c">bit.ly/tlens-airdrop redirects to unverified smart contract drainer</text>
    </svg>`,
  },
  {
    id: 'sample_support_bot',
    title: 'Rogue Customer Support Account',
    subtitle: 'Direct Message credential solicitation on X (@threatlens_support_bot)',
    category: 'x_support',
    badge: '⚠️ Suspicious Persona',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    targetCandidate: '@threatlens_support_bot',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
      <rect width="800" height="520" fill="%23ffffff"/>
      <!-- Header Banner -->
      <rect x="150" y="20" width="500" height="130" fill="%23312e81"/>
      <text x="300" y="90" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff">ThreatLens Global Support</text>
      <!-- Avatar -->
      <circle cx="210" cy="150" r="38" fill="%234f46e5" stroke="%23ffffff" stroke-width="4"/>
      <text x="198" y="158" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23ffffff">TL</text>
      <!-- Bio -->
      <text x="170" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">ThreatLens 24/7 Support Bot</text>
      <text x="170" y="235" font-family="monospace" font-size="13" fill="%2364748b">@threatlens_support_bot</text>
      <text x="170" y="265" font-family="sans-serif" font-size="12" fill="%23334155">Official automated ticket resolution bot for ThreatLens enterprise customers.</text>
      <text x="170" y="285" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23b91c1c">Having login or session lock issues? DM your master security key for instant ticket resolution.</text>
      <text x="170" y="315" font-family="sans-serif" font-size="11" fill="%2364748b">📅 Joined October 2026 • 📍 Delaware, USA • 👥 142 Followers</text>
      <!-- Pinned Post -->
      <rect x="170" y="340" width="460" height="110" rx="12" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="1.5"/>
      <text x="185" y="365" font-family="sans-serif" font-size="10" font-weight="bold" fill="%236366f1">📌 PINNED TWEET</text>
      <text x="185" y="390" font-family="sans-serif" font-size="12" fill="%231e293b">"Customer Notice: Security desk is receiving high volume. Submit ticket numbers along with your master recovery phrase to expedite review."</text>
      <!-- Warning -->
      <rect x="150" y="470" width="500" height="35" rx="8" fill="%23fef3c7"/>
      <text x="170" y="492" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2392400e">⚠️ ROGUE BOT DETECTED: Credential solicitation via Direct Message</text>
    </svg>`,
  },
  {
    id: 'sample_mod_apk',
    title: 'Trojanized Mod APK Download Page',
    subtitle: 'Sideloaded APK mirror with predatory Android permissions',
    category: 'mod_apk',
    badge: '🚨 Trojanized APK',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    targetCandidate: 'com.threatlens.guard.mod',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
      <rect width="800" height="520" fill="%230f172a"/>
      <!-- Sideload Portal Card -->
      <rect x="100" y="30" width="600" height="460" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/>
      <!-- App Header -->
      <rect x="130" y="60" width="70" height="70" rx="16" fill="%236366f1"/>
      <text x="147" y="105" font-family="sans-serif" font-size="28" font-weight="bold" fill="%23ffffff">TL</text>
      <text x="220" y="85" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff">ThreatLens Guard Pro Mod APK v2.4</text>
      <text x="220" y="105" font-family="monospace" font-size="12" fill="%2338bdf8">com.threatlens.guard.mod • Unlocked All Features</text>
      <text x="220" y="125" font-family="sans-serif" font-size="11" fill="%2394a3b8">Developer: DarkNexus / Anonymous Modder • 23,400 Downloads</text>
      <!-- Download Button -->
      <rect x="130" y="155" width="220" height="40" rx="8" fill="%2310b981"/>
      <text x="175" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff">⬇️ Download APK (42 MB)</text>
      <!-- Permissions Manifest -->
      <rect x="130" y="215" width="540" height="190" rx="12" fill="%230f172a" stroke="%23ef4444" stroke-width="1"/>
      <text x="150" y="240" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f87171">⚠️ PREDATORY PERMISSIONS REQUESTED BY MOD PACKAGE:</text>
      <text x="160" y="270" font-family="monospace" font-size="11" fill="%23fca5a5">• android.permission.BIND_ACCESSIBILITY_SERVICE (Screen Overlays &amp; Keystroke Logging)</text>
      <text x="160" y="295" font-family="monospace" font-size="11" fill="%23fca5a5">• android.permission.RECEIVE_SMS (2FA Passcode Interception)</text>
      <text x="160" y="320" font-family="monospace" font-size="11" fill="%23fca5a5">• android.permission.SYSTEM_ALERT_WINDOW (Phishing Login Overlay on Apps)</text>
      <text x="160" y="345" font-family="monospace" font-size="11" fill="%23fca5a5">• android.permission.RECORD_AUDIO (Ambient Eavesdropping)</text>
      <text x="160" y="380" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23ef4444">CRITICAL WARNING: This package injects spyware and bypasses Google Play Protect.</text>
      <!-- Footer Note -->
      <rect x="100" y="450" width="600" height="40" rx="0" fill="%237f1d1d"/>
      <text x="160" y="475" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23fecaca">MALICIOUS MODDED APK: Cloned bundle namespace with spyware permissions</text>
    </svg>`,
  },
  {
    id: 'sample_official_domain',
    title: 'Official Authoritative Domain Portal',
    subtitle: 'Verified baseline asset threatlens.io (Expected: 0 Risk)',
    category: 'official',
    badge: '🛡️ Verified Baseline',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    targetCandidate: 'https://threatlens.io',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
      <rect width="800" height="520" fill="%23f8fafc"/>
      <rect x="20" y="20" width="760" height="480" rx="16" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/>
      <path d="M 20 36 A 16 16 0 0 1 36 20 L 764 20 A 16 16 0 0 1 780 36 L 780 70 L 20 70 Z" fill="%23e2e8f0"/>
      <circle cx="44" cy="45" r="6" fill="%23ef4444"/>
      <circle cx="64" cy="45" r="6" fill="%23f59e0b"/>
      <circle cx="84" cy="45" r="6" fill="%2310b981"/>
      <!-- Verified Address Bar -->
      <rect x="120" y="32" width="560" height="28" rx="8" fill="%23ffffff" stroke="%2310b981" stroke-width="2"/>
      <text x="135" y="51" font-family="monospace" font-size="12" font-weight="bold" fill="%23047857">🔒 https://threatlens.io (ThreatLens Security Inc. [US] • EV SSL Verified)</text>
      <!-- Hero -->
      <rect x="50" y="100" width="700" height="360" rx="16" fill="%23f1f5f9"/>
      <text x="100" y="160" font-family="sans-serif" font-size="28" font-weight="extrabold" fill="%230f172a">ThreatLens AI Enterprise Defense</text>
      <text x="100" y="195" font-family="sans-serif" font-size="14" fill="%23475569">Next-Generation Digital Risk Protection &amp; Brand Impersonation Defense</text>
      <rect x="100" y="230" width="180" height="42" rx="10" fill="%234f46e5"/>
      <text x="135" y="256" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff">Launch Platform</text>
      <!-- Baseline Banner -->
      <rect x="20" y="470" width="760" height="30" fill="%23d1fae5"/>
      <text x="180" y="490" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23065f46">VERIFIED ENTERPRISE BASELINE: Zero False Positives • Exact official match</text>
    </svg>`,
  },
];
