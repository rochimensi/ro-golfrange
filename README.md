# R&O Golf Range

A self-service kiosk application for managing golf ball basket purchases at the driving range. This app streamlines the customer experience by allowing golfers to purchase baskets, redeem vouchers, and access SportClub benefits through an intuitive touch-screen interface.

## 🎯 What Problem Does It Solve?

The R&O Golf Range app addresses several challenges faced by driving ranges:

- **Reduced Staff Dependency**: Enables self-service purchases, allowing customers to buy ball baskets without requiring staff assistance
- **Streamlined Operations**: Automates pricing calculations for different customer types (members vs. guests) and basket sizes
- **24/7 Availability**: Customers can make purchases even when staff is not immediately available
- **Payment Flexibility**: Supports both cash and bank transfer payments, displaying transfer alias and account details
- **Voucher & Membership Management**: Handles voucher redemptions and SportClub member benefits automatically
- **Auto-Servicio Mode**: Allows unattended operation during off-hours with clear payment instructions

## ✨ Features

### Customer Features
- **Basket Purchases**: Buy baskets of 30, 60, or 100 golf balls
- **Differential Pricing**: Automatic pricing for members (SOCIO) and guests (INVITADO)
- **Payment Methods**: 
  - Cash payments
  - Bank transfer with displayed alias, account holder, and payment platform details
- **Voucher Redemption**: Redeem vouchers for 20 free balls (daily use)
- **SportClub Integration**: Members can claim 30 free balls weekly
- **Purchase Confirmation**: Confirmation screen with purchase details

### Admin Features
- **Admin Panel**: Secure PIN-protected admin access
- **Auto-Servicio Mode**: Toggle self-service mode that:
  - Hides cash payment option
  - Shows transfer-only payment instructions
  - Displays customer guidance messages

### User Experience
- **Touch-Optimized UI**: Designed for tablet/kiosk use with large buttons and clear navigation
- **Responsive Design**: Works on various screen sizes
- **Real-time Clock**: Displays current time and operating hours
- **WhatsApp Integration**: Quick access to contact and catalog via WhatsApp
- **Spanish Language**: Fully localized interface

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ro-golfrange
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:
```env
NEXT_PUBLIC_ADMIN_PIN=1234
```

### Running the Application

#### Development Mode

Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

#### Development Mode (LAN Access)

To access the app from other devices on your local network:
```bash
npm run dev:lan
```

The app will be accessible at `http://<your-ip>:3000`

#### Production Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_ADMIN_PIN` | 4-digit PIN for admin panel access | `1234` | No |
| `NEXT_PUBLIC_OPERATING_HOURS` | Operating hours text displayed in floating buttons | `Todos los días de 8hs a 18hs` | No |

### Payment Configuration

Payment details are configured in `src/lib/constants.ts`:
- Transfer alias: `ro.golfrange`
- Transfer account holder: `Antonio Omar Peralta`
- Transfer label: `Mercado Pago`

To modify these, edit the constants file directly.

## 📱 Usage

### For Customers

1. **Purchase a Basket**:
   - Select "Comprar canasto"
   - Choose customer type (SOCIO or INVITADO)
   - Select basket size (30, 60, or 100 balls)
   - Choose payment method (Cash or Transfer)
   - Complete payment and receive confirmation screen

2. **Redeem Voucher**:
   - Select "Voucher"
   - Confirm redemption for 20 free balls
   - Present voucher to staff for validation

3. **SportClub Benefits**:
   - Select "SportClub"
   - Scan the displayed QR code with SportClub app
   - Confirm to receive 30 free balls

### For Administrators

1. Access admin panel by clicking the settings icon (⚙️) in the top-left corner
2. Enter the 4-digit PIN (default: `1234` or set via `NEXT_PUBLIC_ADMIN_PIN`)
3. Toggle Auto-Servicio mode as needed

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons
- **QR Codes**: qrcode.react (for WhatsApp catalog and SportClub verification)
- **Fonts**: Geist Sans, Geist Mono, Bakbak One

## 📁 Project Structure

```
ro-golfrange/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── admin/        # Admin panel
│   │   ├── purchase/     # Basket purchase flow
│   │   ├── voucher/      # Voucher redemption
│   │   ├── sportclub/    # SportClub benefits
│   │   └── thank-you/    # Purchase confirmation
│   ├── components/       # React components
│   │   ├── Clock.tsx
│   │   ├── FloatingButtons.tsx
│   │   └── WhatsAppIcon.tsx
│   └── lib/              # Utilities and constants
│       ├── constants.ts  # App configuration
│       ├── types.ts      # TypeScript types
│       └── useAutoServicio.ts  # Auto-servicio hook
├── public/               # Static assets
└── package.json
```

## 🔧 Configuration

### Pricing

Pricing is configured in `src/lib/types.ts`:

**Member Prices (SOCIO)**:
- 30 balls: $6,000
- 60 balls: $10,000
- 100 balls: $14,000

**Guest Prices (INVITADO)**:
- 30 balls: $8,000
- 60 balls: $12,000
- 100 balls: $16,000

### Operating Hours

Operating hours text is displayed in the floating buttons component. Configure via `NEXT_PUBLIC_OPERATING_HOURS` environment variable (default: "Todos los días de 8hs a 18hs").

## 📝 License

Private project for R&O Golf Range / Academia Omar Peralta

## 🤝 Support

For issues or questions, contact via WhatsApp through the app's floating button or reach out to the development team.
