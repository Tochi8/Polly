import Button from "@/components/ui/Button";
import Link from "next/link";
import "./globals.css";


const iconSpace = null;

export default function Home() {
  return (
    <>
    <div>

      <div className="bg-ink p-4">

        <div> 
          {iconSpace} <span>Polly</span >
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink">
          Voting <br />
          that communities <br /> 
          <span className="text-4xl font-extrabold text-lime">can trust.</span></h1>
       

        <p className="text-sm text-gray-500 font-medium mt-2">
          Manipulation-proof polls for <br />
          social communities that care about genuine <br />
          results. 
        </p>

      </div>

      <div>

        <div className=" flex cards mt-2 gap-2">
          <div className="border border-gray-100 rounded-2xl bg-ink p-4">
            {iconSpace}
            <p className="text-sm text-white font-bold">Eliminate fake votes</p>
          </div>

          <div className="border border-gray-100 rounded-2xl bg-lime p-4"> 
            {iconSpace}
            <p className="text-sm text-ink font-bold">One-time voting links</p>
          </div>

          <div className="border border-gray-100 rounded-2xl bg-surface p-4">
            {iconSpace}
            <p className="text-sm text-ink font-bold">Whitelist only votes</p>
          </div>

          <div className="border border-gray-100 rounded-2xl bg-surface p-4">
            {iconSpace}
            <p className="text-sm text-ink font-bold">Live results</p>
          </div>
        </div>

        <Button 
        variant="lime"
        type="button"
        fullWidth
        >
          Get Started 
        </Button>

        <Link href="/app/adnin/polls">Go to Poll Form</Link>
      </div>

      <div>
        {iconSpace} <p className="text-sm text-gray-500 font-medium">Discord - Telegram - X</p>
      </div>
    </div>
    </>
  );
}
