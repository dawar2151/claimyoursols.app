# Claim Your SOLs

##  Reclaim Your Locked SOL on the Solana Blockchain

When you hold SPL tokens on Solana, the blockchain reserves a small amount of SOL as rent. Even after you sell or stop using those tokens, the rent remains locked — unless you **close** those unused token accounts.

**Solana Account Cleaner** helps you scan, close, and recover your SOL safely and securely.

---

##  Built with [Next.js](https://nextjs.org/)

This is a Next.js-based web app designed for Solana users to easily reclaim SOL from unused SPL token accounts.

---

##  Features

-  **Automatic Discovery**  
  Finds unused SPL/SPL22 token accounts in your wallet.

- **Rent Recovery**  
  Reclaims SOL held as rent for inactive token accounts.

- **Secure by Design**  
  Direct wallet integration — *no private keys required*.

- **Transparent Fees**  
  Clear overview of recoverable SOL and service fee (10%).

- **Referral System**  
  Earn rewards in SOL by inviting others to use the tool.

---

## Environment Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Required: Wallet address to receive service fees
NEXT_PUBLIC_FEE_RECIPIENT=
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_CLOSE_ACCOUNT_FEE=
```

---

## Getting Started

1. **Install dependencies**  
   ```bash
   npm install
   ```

2. **Set up environment variables**  
   - Create `.env.local` in your project root  
   - Add your fee recipient wallet  
   - (Optional) Configure your RPC endpoint

3. **Run the development server**  
   ```bash
   npm run dev
   ```

4. **Open in browser**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## How It Works

1. **Connect Your Wallet**  
   Use Phantom, Solflare, or any Solana wallet to scan your account.

2. **Review Unused Accounts**  
   Get a list of unused SPL token accounts and the SOL they hold.

3. **Select & Close**  
   Choose the accounts you want to close.

4. **Reclaim Your SOL**  
   Receive your rent refund directly to your wallet  
   *(A 10% service fee is applied per closed account)*

---