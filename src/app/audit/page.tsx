"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { checkContractOnChains } from "@/utils/blockchain";
import { getRpcUrl } from "@/utils/chainServices";
import type { ChainContractInfo, ContractFile } from "@/types/blockchain";
import ContractInfoCard from "@/components/audit/ContractInfoCard";
import Image from "next/image";
import Link from "next/link";
import {
  FileIcon,
  FilesIcon,
  WalletIcon,
  SecurityIcon,
  SecurityAnalysisIcon,
  MultiChainIcon,
  CodeIcon,
  AIIcon,
} from "@/components/Icons";
import Editor from "@monaco-editor/react";
import { analyzeContract } from "@/services/audit/contractAnalyzer";
import { useAIConfig, getModelName, getAIConfig } from "@/utils/ai";
import html2canvas from "html2canvas";
import {
  findMainContract,
  mergeContractContents,
} from "@/utils/contractFilters";

type TabType = "address" | "single-file" | "multi-files";

export default function AuditPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [chainInfo, setChainInfo] = useState<ChainContractInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("address");
  const [contractCode, setContractCode] = useState("");
  const [analysisFiles, setAnalysisFiles] = useState<ContractFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { config } = useAIConfig();
  const [editorContent, setEditorContent] =
    useState(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VaultLogic {
    address public owner; // slot 0
    bytes32 private password; // slot 1

    constructor(bytes32 _password) public {
        owner = msg.sender;
        password = _password;
    }

    function changeOwner(bytes32 _password, address newOwner) public {
        if (password == _password) {
            owner = newOwner;
        } else {
            revert("password error");
        }
    }
}

contract Vault {
    address public owner; // slot 0
    VaultLogic logic; // slot 1
    mapping(address => uint256) deposites; // slot 2
    bool public canWithdraw = false; // slot 3

    constructor(address _logicAddress) public {
        logic = VaultLogic(_logicAddress);
        owner = msg.sender;
    }

    fallback() external {
        (bool result,) = address(logic).delegatecall(msg.data);
        if (result) {
            this;
        }
    }

    receive() external payable { }

    function deposite() public payable {
        deposites[msg.sender] += msg.value;
    }

    function isSolve() external view returns (bool) {
        if (address(this).balance == 0) {
            return true;
        }
    }

    function openWithdraw() external {
        if (owner == msg.sender) {
            canWithdraw = true;
        } else {
            revert("not owner");
        }
    }

    function withdraw() public {
        if (canWithdraw && deposites[msg.sender] >= 0) {
            (bool result,) = msg.sender.call{ value: deposites[msg.sender] }("");
            if (result) {
                deposites[msg.sender] = 0;
            }
        }
    }
}`);

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<ContractFile[]>([]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();

    if (value && !value.startsWith("0x")) {
      value = "0x" + value;
    }

    setAddress(value);
  };

  const handleCheck = async () => {
    let formattedAddress = address.trim();
    if (formattedAddress && !formattedAddress.startsWith("0x")) {
      formattedAddress = "0x" + formattedAddress;
    }

    if (!ethers.isAddress(formattedAddress)) {
      toast.error("Invalid contract address");
      return;
    }

    try {
      setLoading(true);
      setChainInfo(null);
      const info = await checkContractOnChains(formattedAddress);
      setChainInfo(info);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch contract information");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    try {
      if (!editorContent.trim()) {
        toast.error("Please enter contract code");
        return;
      }

      setIsAnalyzing(true);

      const controller = new AbortController();
      setAbortController(controller);

      const contractFile = {
        name: "Contract.sol",
        path: "Contract.sol",
        content: editorContent,
      };

      const result = await analyzeContract({
        files: [contractFile],
        contractName: "Contract",
        signal: controller.signal,
      });

      let analysisContent = result.report.analysis;
      if (!analysisContent.match(/^#\s+/m)) {
        analysisContent = `# Smart Contract Security Analysis Report\n\n${analysisContent}`;
      }

      let languageCfg = getAIConfig(config).language;
      languageCfg = languageCfg === "english" ? "" : `-${languageCfg}`;
      let withSuperPrompt = getAIConfig(config).superPrompt
        ? "-SuperPrompt"
        : "";

      const reportFileName = `report-analysis-${getModelName(
        getAIConfig(config)
      )}${languageCfg}${withSuperPrompt}.md`;

      const reportFile = {
        name: reportFileName,
        path: reportFileName,
        content: analysisContent,
      };

      setAnalysisFiles((prev) => {
        const filesWithoutCurrentModelReport = prev.filter(
          (f) => f.path !== reportFileName
        );
        return [...filesWithoutCurrentModelReport, reportFile];
      });

      toast.success("Analysis completed");
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        toast.success("Analysis cancelled");
      } else {
        console.error("Error in analysis:", error);
        toast.error("Error during analysis");
      }
    } finally {
      setIsAnalyzing(false);
      setAbortController(null);
    }
  };

  const handleCancelAnalysis = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleViewReport = (content: string, fileName: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
              
              body {
                font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
                line-height: 1.6;
                max-width: 900px;
                margin: 0 auto;
                padding: 30px;
                background: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%);
                color: #00FFFF;
                position: relative;
                overflow-x: auto;
              }
              
              /* Cyberpunk grid background */
              body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                  linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
                background-size: 20px 20px;
                pointer-events: none;
                z-index: -1;
              }
              
              /* Floating particles */
              body::after {
                content: '';
                position: fixed;
                top: 20px;
                left: 10px;
                width: 2px;
                height: 2px;
                background: #00FFFF;
                border-radius: 50%;
                animation: pulse 2s infinite;
                z-index: -1;
              }
              
              @keyframes pulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
              }
              
              h1 {
                color: #00FFFF;
                border-bottom: 2px solid #00FFFF;
                padding-bottom: 0.5em;
                margin-bottom: 1em;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                animation: neon-flicker 3s infinite alternate;
              }
              
              @keyframes neon-flicker {
                0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3); }
                50% { text-shadow: 0 0 5px rgba(0, 255, 255, 0.8), 0 0 15px rgba(0, 255, 255, 0.6); }
              }
              
              h2 {
                color: #FF6B35;
                margin-top: 1.5em;
                margin-bottom: 0.8em;
                text-shadow: 0 0 8px rgba(255, 107, 53, 0.4);
                border-left: 3px solid #FF6B35;
                padding-left: 15px;
              }
              
              h3 {
                color: #39FF14;
                margin-top: 1.2em;
                margin-bottom: 0.6em;
                text-shadow: 0 0 6px rgba(57, 255, 20, 0.4);
              }
              
              pre {
                background: linear-gradient(135deg, #1A1A1A, #2A2A2A);
                padding: 20px;
                border-radius: 8px;
                overflow-x: auto;
                border: 1px solid rgba(0, 255, 255, 0.3);
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(0, 255, 255, 0.05);
                position: relative;
              }
              
              pre::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, #00FFFF, transparent);
                animation: scan-sweep 3s infinite;
              }
              
              @keyframes scan-sweep {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              
              code {
                font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
                font-size: 0.9em;
                color: #FF6B35;
                background: rgba(255, 107, 53, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                text-shadow: 0 0 4px rgba(255, 107, 53, 0.3);
              }
              
              p {
                margin: 1em 0;
                color: #CCCCCC;
                text-shadow: 0 0 2px rgba(204, 204, 204, 0.1);
              }
              
              ul, ol {
                padding-left: 2em;
                color: #CCCCCC;
              }
              
              li {
                margin: 0.5em 0;
                text-shadow: 0 0 2px rgba(204, 204, 204, 0.1);
              }
              
              a {
                color: #00FFFF;
                text-decoration: none;
                text-shadow: 0 0 4px rgba(0, 255, 255, 0.3);
                transition: all 0.3s ease;
              }
              
              a:hover {
                text-decoration: underline;
                text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
                color: #39FF14;
              }
              
              blockquote {
                border-left: 4px solid #FF6B35;
                margin: 1em 0;
                padding-left: 1em;
                color: #CCCCCC;
                background: rgba(255, 107, 53, 0.05);
                padding: 15px;
                border-radius: 0 8px 8px 0;
                box-shadow: 0 0 10px rgba(255, 107, 53, 0.1);
              }
              
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                background: rgba(0, 255, 255, 0.05);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
              }
              
              th, td {
                border: 1px solid rgba(0, 255, 255, 0.3);
                padding: 12px;
                text-align: left;
              }
              
              th {
                background: linear-gradient(135deg, #1A1A1A, #2A2A2A);
                color: #00FFFF;
                text-shadow: 0 0 4px rgba(0, 255, 255, 0.3);
                font-weight: 600;
              }
              
              td {
                color: #CCCCCC;
              }
              
              strong {
                color: #39FF14;
                text-shadow: 0 0 4px rgba(57, 255, 20, 0.3);
              }
              
              em {
                color: #FF6B35;
                font-style: italic;
                text-shadow: 0 0 4px rgba(255, 107, 53, 0.3);
              }
            </style>
          </head>
          <body>
            <div id="content"></div>
            <button id="saveAsImage" style="
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 12px 20px;
              background: linear-gradient(135deg, #1A1A1A, #2A2A2A);
              color: #00FFFF;
              border: 1px solid rgba(0, 255, 255, 0.3);
              border-radius: 8px;
              cursor: pointer;
              font-family: 'JetBrains Mono', monospace;
              font-weight: 500;
              transition: all 0.3s ease;
              box-shadow: 0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.05);
              text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
            " onmouseover="this.style.background='linear-gradient(135deg, #2A2A2A, #3A3A3A)'; this.style.boxShadow='0 0 30px rgba(0, 255, 255, 0.4), inset 0 0 30px rgba(0, 255, 255, 0.1)'" onmouseout="this.style.background='linear-gradient(135deg, #1A1A1A, #2A2A2A)'; this.style.boxShadow='0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.05)'">Save as Image</button>
            <script>
              document.getElementById('content').innerHTML = marked.parse(\`${content.replace(
                /`/g,
                "\\`"
              )}\`);
              
              document.getElementById('saveAsImage').addEventListener('click', async () => {
                const content = document.getElementById('content');
                try {
                  const canvas = await html2canvas(content, {
                    backgroundColor: '#1A1A1A',
                    scale: 2,
                    useCORS: true,
                    logging: false
                  });
                  
                  const link = document.createElement('a');
                  link.download = '${fileName.replace(".md", "")}.png';
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                } catch (error) {
                  console.error('Error generating image:', error);
                }
              });
            </script>
          </body>
        </html>
      `);
    }
  };

  const handleDownloadReport = (file: ContractFile) => {
    const blob = new Blob([file.content], { type: "text/markdown" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRemoveFile = (path: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.path !== path));
    // Reset analysis files when removing a file
    setAnalysisFiles([]);
    // Reset analyzing state and abort controller if needed
    if (isAnalyzing) {
      if (abortController) {
        abortController.abort();
      }
      setIsAnalyzing(false);
      setAbortController(null);
    }
  };

  const handleMultiFileAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload contract files first");
      return;
    }

    try {
      setIsAnalyzing(true);

      const controller = new AbortController();
      setAbortController(controller);

      // Analyze all uploaded files together
      const result = await analyzeContract({
        files: uploadedFiles,
        contractName:
          findMainContract(uploadedFiles, false)?.name.replace(".sol", "") ||
          "MultiContract",
        signal: controller.signal,
        isMultiFile: true,
      });

      let analysisContent = result.report.analysis;
      if (!analysisContent.match(/^#\s+/m)) {
        analysisContent = `# Smart Contract Security Analysis Report\n\n${analysisContent}`;
      }

      // Generate report filename with model info
      let languageCfg = getAIConfig(config).language;
      languageCfg = languageCfg === "english" ? "" : `-${languageCfg}`;
      let withSuperPrompt = getAIConfig(config).superPrompt
        ? "-SuperPrompt"
        : "";

      const reportFileName = `report-analysis-${getModelName(
        getAIConfig(config)
      )}${languageCfg}${withSuperPrompt}.md`;

      const reportFile = {
        name: reportFileName,
        path: reportFileName,
        content: analysisContent,
      };

      setAnalysisFiles((prev) => {
        const filesWithoutCurrentModelReport = prev.filter(
          (f) => f.path !== reportFileName
        );
        return [...filesWithoutCurrentModelReport, reportFile];
      });

      toast.success("Analysis completed");
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
      setAbortController(null);
    }
  };

  const handleRemoveReport = (path: string) => {
    setAnalysisFiles((prev) => prev.filter((file) => file.path !== path));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    try {
      // Reset analysis states
      setAnalysisFiles([]);
      setIsAnalyzing(false);
      if (abortController) {
        abortController.abort();
        setAbortController(null);
      }

      // Reset input value so the same file can be selected again
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      const contractFiles: ContractFile[] = await Promise.all(
        files.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name,
            path: file.name,
            content: content,
          };
        })
      );
      
      // Update file list, overwrite existing files with the same name
      setUploadedFiles(prevFiles => {
        const newFiles = [...prevFiles];
        
        contractFiles.forEach(newFile => {
          const existingIndex = newFiles.findIndex(f => f.name === newFile.name);
          if (existingIndex !== -1) {
            // If file exists, replace it
            newFiles[existingIndex] = newFile;
          } else {
            // If file doesn't exist, add it
            newFiles.push(newFile);
          }
        });
        
        return newFiles;
      });

      toast.success(`Successfully uploaded ${files.length} file(s)`);
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process files');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-black via-cyber-dark to-cyber-black"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid opacity-20"></div>
      
      {/* Floating particles effect */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-neon-magenta rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-neon-lime rounded-full animate-pulse delay-2000"></div>
      
      <div className="absolute top-4 right-4 cyber-text-secondary animate-neon-flicker">
        The ticker is ETH
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold cyber-text-primary mb-4 animate-neon-pulse">
            Smart Contract <span className="text-neon-cyan animate-neon-flicker">Security</span>
          </h1>
          <p className="cyber-text-secondary text-lg">
            Powered by AI, securing your blockchain future with real-time
            analysis
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="cyber-text-secondary text-center mb-6">
            Choose your preferred method to analyze smart contracts
          </p>

          <div className="cyber-card p-1 rounded-xl">
            <div className="bg-cyber-black/60 rounded-lg p-1 flex gap-1">
              {[
                {
                  id: "address",
                  label: "Address",
                  icon: WalletIcon,
                  desc: "Analyze deployed contracts",
                },
                {
                  id: "single-file",
                  label: "Single File",
                  icon: FileIcon,
                  desc: "Audit a single contract file",
                },
                {
                  id: "multi-files",
                  label: "Multi Files",
                  icon: FilesIcon,
                  desc: "Analyze multiple contract files",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    flex-1 py-3 px-4 rounded-lg
                    transition-all duration-300 ease-out
                    group hover:scale-105
                    ${
                      activeTab === tab.id
                        ? "cyber-card shadow-neon-cyan/20"
                        : "hover:bg-neon-cyan/5"
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <tab.icon
                      className={`w-6 h-6 transition-all duration-300
                        ${
                          activeTab === tab.id
                            ? "text-neon-cyan animate-neon-pulse"
                            : "text-cyber-text-muted group-hover:text-neon-cyan"
                        }`}
                    />
                    <span
                      className={`font-medium transition-all duration-300
                      ${
                        activeTab === tab.id
                          ? "text-neon-cyan animate-neon-pulse"
                          : "text-cyber-text-muted group-hover:text-neon-cyan"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span className="text-xs cyber-text-muted group-hover:text-cyber-text-secondary">
                      {tab.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="cyber-card rounded-xl p-8 mb-8 relative overflow-hidden
            before:absolute before:inset-0 before:p-[1px] before:-m-[1px] before:bg-gradient-to-r before:from-neon-cyan/0 before:via-neon-cyan/20 before:to-neon-cyan/0 before:rounded-xl before:-z-10
            after:absolute after:inset-0 after:p-[1px] after:-m-[1px] after:bg-gradient-to-b after:from-neon-cyan/10 after:via-neon-cyan/0 after:to-neon-cyan/5 after:rounded-xl after:-z-10"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/30 to-neon-cyan/0" />

          <div className="mb-6">
            <h2 className="text-2xl font-medium cyber-text-primary mb-2 animate-neon-pulse">
              {activeTab === "address" && "Enter Contract Address"}
              {activeTab === "single-file" && "Upload Contract File"}
              {activeTab === "multi-files" && "Upload Contract Files"}
            </h2>
            <p className="cyber-text-secondary">
              {activeTab === "address" &&
                "Enter the deployed contract address to start analysis"}
              {activeTab === "single-file" &&
                "Upload a single Solidity contract file (.sol)"}
              {activeTab === "multi-files" &&
                "Upload multiple related contract files"}
            </p>
          </div>

          {activeTab === "address" && (
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter contract address (0x...)"
                className="flex-1 h-11 cyber-input rounded-lg px-4
                         placeholder-cyber-text-muted 
                         focus:outline-none
                         transition-all duration-300 ease-in-out text-base"
              />
              <button
                onClick={handleCheck}
                disabled={loading}
                className="h-11 inline-flex items-center gap-2 px-5
                         cyber-button text-base font-normal rounded-lg
                         transition-all duration-300
                         hover:scale-105
                         whitespace-nowrap
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-neon-cyan" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="animate-neon-pulse">Checking...</span>
                  </>
                ) : (
                  <>
                    <span className="animate-neon-pulse">Check Contract</span>
                    <svg
                      className="w-4 h-4 animate-neon-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "single-file" && (
            <div className="flex flex-col gap-3">
              <Editor
                height="400px"
                defaultLanguage="sol"
                theme="vs-dark"
                value={editorContent}
                onChange={(value) => {
                  const newContent = value || "";
                  if (newContent !== contractCode) {
                    setAnalysisFiles([]);
                  }
                  setEditorContent(newContent);
                  setContractCode(newContent);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  roundedSelection: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                }}
              />

              {analysisFiles.length > 0 && (
                <div className="border-t border-neon-cyan/30 mt-4 pt-4">
                  <h3 className="cyber-text-primary text-sm font-medium mb-2 animate-neon-pulse">
                    Analysis Reports:
                  </h3>
                  <div className="space-y-2">
                    {analysisFiles.map((file) => (
                      <div
                        key={file.path}
                        className="cyber-card p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="cyber-text-primary text-sm animate-neon-pulse">
                            {file.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleViewReport(file.content, file.name)
                              }
                              className="cyber-text-secondary text-sm hover:text-neon-cyan flex items-center gap-1 px-2 py-1 rounded hover:bg-neon-cyan/10 transition-all duration-150 hover:scale-105"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => handleDownloadReport(file)}
                              className="cyber-text-secondary text-sm hover:text-neon-lime flex items-center gap-1 px-2 py-1 rounded hover:bg-neon-lime/10 transition-all duration-150 hover:scale-105"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Download
                            </button>
                            <button
                              onClick={() => handleRemoveReport(file.path)}
                              className="cyber-text-secondary hover:text-cyber-danger p-1 rounded hover:bg-cyber-danger/10 transition-all duration-150 hover:scale-105"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleStartAnalysis}
                className="self-end h-11 inline-flex items-center gap-2 px-5
                         cyber-button text-base font-normal rounded-lg
                         transition-all duration-300
                         hover:scale-105
                         whitespace-nowrap"
              >
                <span className="animate-neon-pulse">Analyze Contract</span>
                <svg
                  className="w-4 h-4 animate-neon-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {isAnalyzing && (
                <div className="fixed inset-0 bg-cyber-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="cyber-card rounded-lg p-8 flex flex-col items-center relative overflow-hidden">
                    {/* Animated scan line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-sweep"></div>
                    
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 border-4 border-t-neon-cyan border-r-neon-cyan/50 border-b-neon-cyan/30 border-l-neon-cyan/10 rounded-full animate-spin" />
                      <div className="absolute inset-2 bg-cyber-black rounded-full flex items-center justify-center">
                        <Image
                          src="/smart-audit-logo.svg"
                          alt="Smart Audit Loading"
                          width={40}
                          height={40}
                          className="animate-bounce-slow filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                        />
                      </div>
                    </div>
                    <p className="cyber-text-primary text-lg mb-2 animate-neon-pulse">
                      Analyzing Contract
                    </p>
                    <p className="cyber-text-secondary text-sm mb-4">
                      This may take a few moments...
                    </p>
                    <button
                      onClick={handleCancelAnalysis}
                      className="px-4 py-2 cyber-button rounded-md 
                               hover:scale-105 transition-all duration-300
                               font-medium"
                    >
                      Cancel Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "multi-files" && (
            <div className="flex flex-col gap-4">
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border border-dashed border-neon-cyan/30 rounded-lg p-8 cyber-card hover:border-neon-cyan/60 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3">
                  <FilesIcon className="w-12 h-12 text-neon-cyan animate-neon-pulse" />
                  <div className="text-center">
                    <p className="cyber-text-primary mb-1 animate-neon-pulse">
                      Drag and drop contract files here
                    </p>
                    <p className="cyber-text-muted text-sm">or</p>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept=".sol"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <span
                      className="h-9 inline-flex items-center gap-2 px-4
                      cyber-button text-sm font-normal rounded-lg
                      transition-all duration-300
                      hover:scale-105
                      cursor-pointer"
                    >
                      Browse files
                    </span>
                  </label>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-sm cyber-text-secondary animate-neon-pulse">Selected files:</div>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center justify-between p-3 cyber-card rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-4 h-4 text-neon-cyan animate-neon-pulse" />
                          <span className="cyber-text-primary text-sm animate-neon-pulse">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.path)}
                          className="cyber-text-secondary hover:text-cyber-danger transition-colors hover:scale-110"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <>
                  <button
                    onClick={handleMultiFileAnalysis}
                    className="self-end h-11 inline-flex items-center gap-2 px-5
                             cyber-button text-base font-normal rounded-lg
                             transition-all duration-300
                             hover:scale-105
                             whitespace-nowrap"
                  >
                    <span className="animate-neon-pulse">Analyze Contract</span>
                    <svg
                      className="w-4 h-4 animate-neon-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {analysisFiles.length > 0 && (
                    <div className="border-t border-neon-cyan/30 mt-4 pt-4">
                      <h3 className="cyber-text-secondary text-sm font-medium mb-2">
                        Analysis Reports:
                      </h3>
                      <div className="space-y-2">
                        {analysisFiles.map((file) => (
                          <div
                            key={file.path}
                            className="cyber-card p-3 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <span className="cyber-text-secondary text-sm">
                                {file.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleViewReport(file.content, file.name)
                                  }
                                  className="cyber-text-muted text-sm hover:text-neon-cyan flex items-center gap-1 px-2 py-1 rounded hover:bg-neon-cyan/10 transition-colors duration-150"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  View
                                </button>
                                <button
                                  onClick={() => handleDownloadReport(file)}
                                  className="cyber-text-muted text-sm hover:text-neon-cyan flex items-center gap-1 px-2 py-1 rounded hover:bg-neon-cyan/10 transition-colors duration-150"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                  </svg>
                                  Download
                                </button>
                                <button
                                  onClick={() => handleRemoveReport(file.path)}
                                  className="cyber-text-muted hover:text-cyber-danger p-1 rounded hover:bg-cyber-danger/10 transition-colors duration-150"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}


              {isAnalyzing && (
                <div className="fixed inset-0 bg-cyber-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="cyber-card rounded-lg p-8 flex flex-col items-center relative overflow-hidden">
                    {/* Animated scan line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scan-sweep"></div>
                    
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 border-4 border-t-neon-cyan border-r-neon-cyan/50 border-b-neon-cyan/30 border-l-neon-cyan/10 rounded-full animate-spin" />
                      <div className="absolute inset-2 bg-cyber-black rounded-full flex items-center justify-center">
                        <Image
                          src="/smart-audit-logo.svg"
                          alt="Smart Audit Loading"
                          width={40}
                          height={40}
                          className="animate-bounce-slow"
                        />
                      </div>
                    </div>
                    <p className="cyber-text-primary text-lg mb-2 animate-neon-pulse">
                      Analyzing Contract
                    </p>
                    <p className="cyber-text-secondary text-sm mb-4">
                      This may take a few moments...
                    </p>
                    <button
                      onClick={handleCancelAnalysis}
                      className="px-4 py-2 cyber-button text-neon-orange rounded-md 
                               border border-neon-orange/20
                               hover:bg-neon-orange/10 transition-colors
                               font-medium"
                    >
                      Cancel Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {activeTab === "address" &&
          chainInfo &&
          Object.entries(chainInfo).map(
            ([chain, info]) =>
              info?.exists && (
                <ContractInfoCard
                  key={chain}
                  chainInfo={info}
                  chain={chain}
                  address={address}
                />
              )
          )}
      </main>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/30 to-neon-cyan/0" />
    </div>
  );
}
