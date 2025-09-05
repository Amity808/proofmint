import Link from "next/link";
import { CiMail } from "react-icons/ci";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-6 lg:p-12">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center space-x-2" aria-label="ProofMint Home">
            <h1 className="text-xl font-bold">ProofMint</h1>
          </Link>
          <div className="flex items-center text-[#3C4D35]">
            <div className="mr-2">
              <CiMail size={24} />
            </div>
            <a href="mailto:contact@proofmint.com" className="text-base" aria-label="Email ProofMint support">
              contact@proofmint.com
            </a>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4">
          <p className="text-[#3C4D35] font-semibold text-base">Quick Links</p>
          <div className="flex flex-col gap-2">
            <Link href="/marketplace" className="text-[#3C4D35] hover:text-brand-primary">
              Marketplace
            </Link>
            <Link href="/nft-receipts" className="text-[#3C4D35] hover:text-brand-primary">
              NFT Receipts
            </Link>
            <Link href="/recycling" className="text-[#3C4D35] hover:text-brand-primary">
              Recycling
            </Link>
            <Link href="/track" className="text-[#3C4D35] hover:text-brand-primary">
              Track Items
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-4">
          <p className="text-[#3C4D35] font-semibold text-base">Connect with Us</p>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ProofMint on LinkedIn"
              className="text-[#3C4D35] hover:text-brand-primary"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ProofMint on Twitter"
              className="text-[#3C4D35] hover:text-brand-primary"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ProofMint on Facebook"
              className="text-[#3C4D35] hover:text-brand-primary"
            >
              <FaFacebook size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <div className="flex justify-center gap-8 mb-4">
          <Link href="/terms" className="text-[#3C4D35] text-base hover:text-green-600">
            Terms of Use
          </Link>
          <Link href="/privacy" className="text-[#3C4D35] text-base hover:text-green-600">
            Privacy Policy
          </Link>
        </div>
        <p className="text-[#3C4D35] text-sm">© {new Date().getFullYear()} ProofMint</p>
      </div>
    </footer>
  );
};

export default Footer;
