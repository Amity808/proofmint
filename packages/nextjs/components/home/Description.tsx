import Link from "next/link";
import ImageWithGradient from "./ImageWithGradient";

const Description = () => {
  const featureCards = [
    {
      icon: "token",
      title: "Blockchain-Powered NFT Receipts",
      description:
        "Receive unique NFT receipts issued by ProofMint (0x045962833e855095DbE8B061d0e7E929a3f5C55c) on the blockchain for ownership proof.",
    },
    {
      icon: "recycling",
      title: "Track Recycling on Blockchain",
      description:
        "Monitor your electronics' lifecycle with AI insights, stored securely on the blockchain, supporting sustainable e-waste management.",
    },
    {
      icon: "swap_horiz",
      title: "Easy Blockchain Transfers",
      description:
        "Transfer ownership seamlessly using fast blockchain transactions when reselling or gifting electronics.",
    },
    {
      icon: "security",
      title: "Secure Blockchain Platform",
      description: "Blockchain-powered security ensures tamper-proof transactions for all your devices.",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-20">
        {featureCards.map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-brand-primary hover:shadow-brand-secondary transition-all hover:-translate-y-1 border border-brand-primary/10"
          >
            <span className="material-symbols-outlined text-brand-primary text-4xl mb-4">{card.icon}</span>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{card.title}</h3>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 brand-gradient-multi p-6 md:p-12 rounded-3xl shadow-brand-primary">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-white">
            Revolutionizing Electronics on Blockchain
          </h2>
          <p className="text-lg mb-6 md:mb-8 text-white/90">
            Our blockchain-powered platform ensures secure transactions, verifiable NFT ownership via ProofMint, and
            responsible recycling tracking with AI-ready infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/marketplace">
              <button className="px-6 py-3 bg-white text-brand-primary rounded-full hover:bg-white/90 hover:scale-105 transition-all font-semibold shadow-lg">
                Shop Now
              </button>
            </Link>
            <Link href="/about">
              <button className="px-6 py-3 border-2 border-white text-white rounded-full hover:bg-white/10 hover:scale-105 transition-all font-semibold">
                Learn More
              </button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
          <ImageWithGradient
            src="https://images.unsplash.com/photo-1654892968823-ea564870a96f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxibG9ja2NoYWluJTIwY2VydGlmaWNhdGUlMjBkaWdpdGFsJTIwcmVjZWlwdCUyME5GVHxlbnwwfDB8fGJsdWV8MTc1NDM3Njc3OHww&ixlib=rb-4.1.0&q=85"
            alt="Blockchain-powered Digital NFT receipt certificate - Photo by 2H Media on Unsplash"
            className="w-full"
            gradientOpacity="visible"
          />
        </div>
      </div>
    </main>
  );
};

export default Description;
