import { Suspense } from "react";
import RefundSol from "./components/claimyoursol/RefundSol";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefundSol />
    </Suspense>
  );
}
