# Zodiark: Astral Awakening - Telegram Mini App

A production-ready Telegram Mini App for Zodiark's early seeker reward campaign with auto-language detection, countdown timer, and redeem flow.

## 🚀 Features

- **Telegram Mini App Integration**: Auto-detects user from Telegram WebApp SDK
- **Auto Language Detection**: Supports English, Spanish, and Portuguese based on Telegram user settings
- **Countdown Timer**: Dynamic countdown to launch date (17th at 00:00 Madrid time)
- **Redeem Flow**: Claim rewards via backend API with success/error handling
- **Tracker Integration**: lkTracker events for analytics
- **Responsive Design**: Single-screen, no-scroll layouts optimized for mobile
- **Cosmic Theme**: Dark, immersive design inspired by Zodiark universe

## 📋 Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- i18next (internationalization)
- Luxon (timezone handling)
- React Router DOM
- Telegram WebApp SDK

## 🛠️ Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: Override launch date for testing (ISO 8601 format)
# VITE_LAUNCH_OVERRIDE_ISO=2025-01-17T00:00:00+01:00

# Optional: Enable test mode (prevents search engine indexing)
# Set to "true" for preview/staging deployments
VITE_TEST_MODE=false
```

### Test Mode

When `VITE_TEST_MODE=true`:
- A red banner appears at the top indicating "TEST MODE"
- `<meta name="robots" content="noindex, nofollow">` is added to prevent search engine indexing
- Useful for Netlify preview deployments or staging environments

**Important**: Always set `VITE_TEST_MODE=false` (or remove it) for production deployments.

## 🌐 Language Support

The app automatically detects the user's language from Telegram and supports:

- **English** (en) - Default
- **Spanish** (es)
- **Portuguese** (pt)

**Debug Override**: Add `?lang=en` (or `es`, `pt`) to URL to override auto-detection during development.

## ⏱️ Countdown Logic

The countdown timer targets the **17th of each month at 00:00 Madrid time (Europe/Madrid timezone)**.

**Edge Case**: If the current date/time is past this month's 17th at 00:00, the countdown targets next month's 17th.

**Override**: Set `VITE_LAUNCH_OVERRIDE_ISO` environment variable to hard-code a specific launch date for testing.

## 🔗 Redeem API

### Endpoint

```
POST /redeem
```

### Request

```json
{
  "tg_id": "123456789",
  "lang": "en",
  "clicked_at": "2025-01-15T10:30:00Z"
}
```

### Response

**Success (200 OK)**:
```json
{
  "granted": ["Currency Pack", "Special Egg", "Bonus Items"]
}
```

**Not OK (200 OK)**:
```json
{
  "reason": "ALREADY_OWN_77"
}
```

**Error Codes**:
- `MISSING_PARAMS`: Required data missing
- `ALREADY_OWN_77`: User already claimed reward
- Other: Generic error message shown

### Client Behavior

1. User clicks "Claim Reward" on Game Page
2. App validates Telegram user ID exists
3. POST to `/redeem` with timeout of 10 seconds
4. Result stored in `sessionStorage.redeemResult`
5. Navigate to `/{lang}/thank-you`
6. Thank Page reads and clears stored result
7. Display success with granted items OR friendly error message

## 📊 Tracker Integration (lkTracker)

### Setup

Replace the placeholder script URL in `index.html` with the actual lkTracker URL provided by the agency:

```html
<script id="lktracker-script" src="[AGENCY_PROVIDED_LKTRACKER_URL]" async></script>
```

### Events

The following events are tracked:

| Event | Trigger |
|-------|---------|
| `lp_page_view` | Game Page fully loaded (i18n ready + Telegram handshake) |
| `lp_click_button` | User clicks "Claim Reward" button |
| `typ_page_view` | Thank Page loaded |
| `typ_go_service` | User clicks link to open bot on Thank Page |
| `typ_cancel` | User clicks "Try Again" button |

**Note**: Events are idempotent (no duplicates on re-render) and queued if tracker not yet loaded.

## 🧪 Testing in Telegram

1. Create a Telegram bot via [@BotFather](https://t.me/botfather)
2. Set up a Mini App in bot settings with your app URL
3. Test the following scenarios:
   - Auto language detection (change Telegram language)
   - Countdown display
   - Claim Reward flow (mock `/redeem` endpoint)
   - Thank Page success and error states
   - Tracker events (check console logs)

### Mock `/redeem` for Local Testing

You can create a simple mock server or use a tool like [Mockoon](https://mockoon.com/) to simulate the `/redeem` endpoint locally.

## 🚢 Deployment

### Netlify (Recommended)

1. Connect your Git repository to Netlify
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Environment variables: Set any `VITE_*` variables in Netlify dashboard
4. Deploy

The `netlify.toml` and `public/_redirects` files handle SPA routing automatically.

## 📁 Project Structure

```
src/
├── assets/           # Images, logos, SVGs
├── components/       # React components
│   ├── Countdown.tsx
│   ├── RewardStrip.tsx
│   ├── Timeline.tsx
│   ├── SocialLinks.tsx
│   └── ui/          # shadcn components
├── i18n/            # i18next config
├── locales/         # Translation files (en.json, es.json, pt.json)
├── pages/           # Page components
│   ├── GamePage.tsx
│   └── ThankPage.tsx
├── telegram/        # Telegram SDK helpers
│   └── telegram.ts
├── utils/           # Utilities
│   ├── api.ts       # Redeem API
│   ├── countdown.ts # Countdown logic
│   └── tracker.ts   # lkTracker wrapper
├── App.tsx          # Main app with routing
├── index.css        # Global styles + design system
└── main.tsx         # Entry point
```

## 🎨 Design System

The app uses a cosmic dark theme with:

- **Primary**: Deep cosmic purple
- **Accent**: Golden orange (#FFA300 from brand guidelines)
- **Background**: Dark purple gradient
- **Effects**: Glowing shadows, gradient text, smooth animations

All colors are defined as HSL semantic tokens in `src/index.css` and extended in `tailwind.config.ts`.

## 🔐 Security

- No sensitive data logged to console
- Telegram user data validated before API calls
- API timeout (10s) prevents hanging requests
- sessionStorage used for temporary data (auto-cleared)

## 📄 License

© 2025 Zodiark: Astral Awakening. All rights reserved.

---

## 🆘 Support

For issues or questions, contact the Zodiark development team.
