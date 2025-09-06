import { formatEtherBalance, formatSupply } from '@/utils/format';
import { useRouter } from 'next/navigation';
import { getExplorerUrl } from '@/utils/chainServices';

interface ContractBasicInfo {
  exists: boolean;
  chainId?: bigint;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: string;
  implementation?: string;
  isProxy?: boolean;
  proxyType?: string;
  contractType?: 'ERC20' | 'ERC721' | 'ERC1155' | 'Unknown';
  balance?: string;
  owner?: string;
  labels?: string[];
  projectName?: string;
}

interface ContractInfoCardProps {
  chainInfo: ContractBasicInfo;
  chain: string;
  address: string;
}

export default function ContractInfoCard({ chainInfo, chain, address }: ContractInfoCardProps) {
  const router = useRouter();

  const handleViewSource = () => {
    const params = new URLSearchParams({
      address,
      chain,
      ...(chainInfo.implementation && { implementation: chainInfo.implementation }),
      ...(chainInfo.name && { tokenName: chainInfo.name })
    });
    window.open(`/audit/source?${params.toString()}`, '_blank');
  };

  return (
    <div className="cyber-card overflow-hidden mb-8 
                   hover:scale-105 transition-all duration-300 relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 
                     opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between px-8 py-6 bg-cyber-dark border-b-2 border-neon-cyan">
          <div className="flex items-center gap-4">
            <span className="text-cyber-text-primary font-bold font-cyber-heading text-xl capitalize text-glow-cyan">{chain}</span>
            <span className="text-cyber-text-secondary font-cyber text-sm">
              <span className="text-neon-cyan">[</span>CHAIN_ID<span className="text-neon-cyan">]</span> {chainInfo.chainId?.toString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {chainInfo.projectName && (
              <span className="px-3 py-2 text-sm font-bold font-cyber text-neon-cyan bg-neon-cyan/20 rounded-lg text-glow-cyan">
                {chainInfo.projectName}
              </span>
            )}
            {chainInfo.labels?.map((label, index) => (
              <span key={index} className="px-3 py-2 text-sm font-bold font-cyber text-neon-lime bg-neon-lime/20 rounded-lg text-glow-lime">
                {label}
              </span>
            ))}
            {!chainInfo.projectName && (!chainInfo.labels?.length) && chainInfo.contractType && (
              <span className="px-3 py-2 text-sm font-bold font-cyber text-neon-orange bg-neon-orange/20 rounded-lg text-glow-orange">
                {chainInfo.contractType}
              </span>
            )}
            {chainInfo.isProxy && (
              <a
                href={`${getExplorerUrl(chain, chainInfo.implementation!)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold font-cyber text-neon-magenta bg-neon-magenta/20 rounded-lg hover:bg-neon-magenta/30 transition-all duration-300 text-glow-magenta hover:scale-105"
              >
                <span>[PROXY_CONTRACT]</span>
                <span className="text-neon-magenta/70 font-cyber">
                  ({chainInfo.implementation?.slice(0, 6)}...{chainInfo.implementation?.slice(-4)})
                </span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 gap-8">
          {chainInfo.name && (
            <div>
              <label className="block text-sm text-cyber-text-secondary font-cyber mb-3">
                <span className="text-neon-cyan">[</span>NAME<span className="text-neon-cyan">]</span>
              </label>
              <div className="text-cyber-text-primary font-bold font-cyber text-lg text-glow-cyan">{chainInfo.name}</div>
            </div>
          )}
          {chainInfo.symbol && (
            <div>
              <label className="block text-sm text-cyber-text-secondary font-cyber mb-3">
                <span className="text-neon-lime">[</span>SYMBOL<span className="text-neon-lime">]</span>
              </label>
              <div className="text-cyber-text-primary font-bold font-cyber text-lg text-glow-lime">{chainInfo.symbol}</div>
            </div>
          )}
          {chainInfo.decimals !== undefined && (
            <div>
              <label className="block text-sm text-cyber-text-secondary font-cyber mb-3">
                <span className="text-neon-orange">[</span>DECIMALS<span className="text-neon-orange">]</span>
              </label>
              <div className="text-cyber-text-primary font-bold font-cyber text-lg text-glow-orange">{chainInfo.decimals}</div>
            </div>
          )}
          {chainInfo.totalSupply && (
            <div>
              <label className="block text-sm text-cyber-text-secondary font-cyber mb-3">
                <span className="text-neon-magenta">[</span>TOTAL_SUPPLY<span className="text-neon-magenta">]</span>
              </label>
              <div className="text-cyber-text-primary font-bold font-cyber text-lg text-glow-magenta">
                {formatSupply(chainInfo.totalSupply, chainInfo.decimals)} {chainInfo.symbol}
              </div>
            </div>
          )}
          {chainInfo.balance && (
            <div>
              <label className="block text-sm text-cyber-text-secondary font-cyber mb-3">
                <span className="text-cyber-success">[</span>CONTRACT_BALANCE<span className="text-cyber-success">]</span>
              </label>
              <div className="text-cyber-text-primary font-bold font-cyber text-lg text-glow-success">
                {formatEtherBalance(chainInfo.balance)} ETH
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t-2 border-neon-cyan flex items-center justify-end gap-4">
          <a
            href={getExplorerUrl(chain, address)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 inline-flex items-center gap-3 px-6
                     bg-cyber-dark text-cyber-text-secondary text-base font-cyber
                     border-2 border-cyber-light-gray rounded-lg
                     transition-all duration-300 hover:scale-105
                     hover:bg-cyber-gray hover:border-neon-cyan hover:text-glow-cyan"
          >
            <span className="font-bold">[VIEW_EXPLORER]</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            onClick={handleViewSource}
            className="h-12 inline-flex items-center gap-3 px-6
                     btn-cyber text-base font-bold font-cyber-heading
                     hover:scale-105 transition-all duration-300"
          >
            <span className="text-glow-cyan">[VIEW_SOURCE]</span>
            <svg className="w-5 h-5 text-glow-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 