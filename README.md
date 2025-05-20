# Medical Claims Processing UI

A modern, dark-themed web application for secure, fast, and user-friendly medical claims processing. Built with Next.js, shadcn/ui, Zustand, and TypeScript, this project streamlines healthcare claim management for providers and patients alike.

**Live Site:** [aarogyaui.jaypatel.software](https://aarogyaui.jaypatel.software)

---

## Features

- 🌑 **Dark Mode Only:** Elegant, accessible, and visually consistent dark UI
- 🏥 **Medical Claims Dashboard:** Simplified view of claims with status, patient info, and service dates
- 📄 **Document Upload & Processing:** Upload medical documents, track processing status, and view extracted data
- 🧑‍⚕️ **Enhanced Data Extraction:**
  - Confidence-based grouping of extracted data
  - Clear categorization of medical information
  - Improved accuracy with confidence scoring
- 🔒 **Authentication:** Secure login and registration with JWT-based auth
- ⚡ **Fast & Responsive:** Built with Next.js App Router, shadcn/ui, and Tailwind CSS for a snappy experience
- 🪝 **Global State:** Uses Zustand for authentication and shared UI state
- 🧩 **Reusable Components:** Modular, atomic UI with shadcn/ui and custom components
- 🛡️ **Error & Loading States:** Universal skeletons, spinners, and alerts for robust UX
- 🎬 **Animated Landing Page:** Framer Motion and Tailwind animations for a polished first impression

---

## Recent Updates

### API Contract Migration (Latest)
- **Enhanced Data Extraction:**
  - New line-by-line extraction with confidence scoring
  - Improved handling of key-value pairs
  - Better amount classification and date formatting
  - Metadata tracking for processing statistics

- **Dashboard Improvements:**
  - Simplified claims list with essential information
  - Focus on patient name and service date
  - Status-based filtering
  - Pagination for better performance

- **Document Preview:**
  - Clear messaging for PDF documents
  - Direct download option for all document types
  - Improved image preview support

---

## Tech Stack

- [Next.js (App Router)](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/) (for landing page animations)
- [Sonner](https://sonner.emilkowal.ski/) (for toasts)
- [Lucide Icons](https://lucide.dev/)

---

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/medical-claim-processing-ui.git
   cd medical-claim-processing-ui
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or yarn or pnpm
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Project Structure

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — Reusable UI components (shadcn/ui-based and custom)
- `src/lib/apiService.ts` — Centralized API service layer (all backend calls)
- `src/store/authStore.ts` — Zustand store for authentication and global state
- `public/` — Static assets (including demo video)

---

## Deployment

This site is deployed at [aarogyaui.jaypatel.software](https://aarogyaui.jaypatel.software).

To deploy your own version, use [Vercel](https://vercel.com/) or any platform that supports Next.js:

```bash
vercel deploy
```

---

## Credits

- UI inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

## License

MIT
