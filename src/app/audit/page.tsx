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
import AIConfigModal from "@/components/audit/AIConfigModal";
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
  const [isAIConfigModalOpen, setIsAIConfigModalOpen] = useState(false);
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
      setIsAIConfigModalOpen(false);

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
              body {
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: #1A1A1A;
                color: #E5E5E5;
              }
              h1 {
                color: #E5E5E5;
                border-bottom: 1px solid #333;
                padding-bottom: 0.5em;
              }
              h2 {
                color: #FF8B3E;
                margin-top: 1.5em;
              }
              pre {
                background: #252526;
                padding: 16px;
                border-radius: 4px;
                overflow-x: auto;
                border: 1px solid #333;
              }
              code {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 0.9em;
              }
              p {
                margin: 1em 0;
              }
              ul, ol {
                padding-left: 2em;
              }
              a {
                color: #FF8B3E;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
              blockquote {
                border-left: 4px solid #FF8B3E;
                margin: 1em 0;
                padding-left: 1em;
                color: #CCCCCC;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
              }
              th, td {
                border: 1px solid #333;
                padding: 8px;
                text-align: left;
              }
              th {
                background: #252526;
              }
            </style>
          </head>
          <body>
            <div id="content"></div>
            <button id="saveAsImage" style="
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 8px 16px;
              background: #252526;
              color: #FF8B3E;
              border: 1px solid rgba(255,139,62,0.2);
              border-radius: 6px;
              cursor: pointer;
              font-family: system-ui;
              transition: all 0.2s;
            ">Save as Image</button>
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
    // Close AI config modal if open
    setIsAIConfigModalOpen(false);
  };

  const handleMultiFileAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload contract files first");
      return;
    }

    try {
      setIsAnalyzing(true);
      setIsAIConfigModalOpen(false);

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
      setIsAIConfigModalOpen(false);
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
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 cyber-grid-bg"></div>
      
      {/* Scan Line Effect */}
      <div className="absolute inset-0 scan-line"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-24 h-24 bg-neon-cyan/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-neon-magenta/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="absolute top-4 right-4 text-cyber-text-secondary font-cyber text-sm">
        <span className="text-neon-cyan">[</span>SYSTEM<span className="text-neon-cyan">]</span> ETH_TICKER_ACTIVE
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-bold font-cyber-heading mb-6">
            <span className="text-glow-cyan">SMART</span> <span className="text-glow-magenta">CONTRACT</span>
            <br />
            <span className="text-glow-lime">SECURITY</span>
          </h1>
          <p className="text-cyber-text-secondary text-lg font-cyber">
            <span className="text-neon-cyan">[</span>AI_POWERED<span className="text-neon-cyan">]</span> 
            Securing your blockchain future with real-time analysis
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <p className="text-cyber-text-secondary text-center mb-8 font-cyber">
            <span className="text-neon-cyan">[</span>SELECT_MODE<span className="text-neon-cyan">]</span> 
            Choose your preferred method to analyze smart contracts
          </p>

          <div className="cyber-card p-2">
            <div className="bg-cyber-black/60 rounded-lg p-2 flex gap-2">
              {[
                {
                  id: "address",
                  label: "ADDRESS",
                  icon: WalletIcon,
                  desc: "Analyze deployed contracts",
                  color: "neon-cyan"
                },
                {
                  id: "single-file",
                  label: "SINGLE_FILE",
                  icon: FileIcon,
                  desc: "Audit a single contract file",
                  color: "neon-lime"
                },
                {
                  id: "multi-files",
                  label: "MULTI_FILES",
                  icon: FilesIcon,
                  desc: "Analyze multiple contract files",
                  color: "neon-magenta"
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`
                    flex-1 py-4 px-4 rounded-lg
                    transition-all duration-300 ease-out
                    group hover:scale-105
                    ${
                      activeTab === tab.id
                        ? `bg-${tab.color}/20 border-2 border-${tab.color} shadow-${tab.color}`
                        : "hover:bg-cyber-gray/50 border-2 border-transparent"
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-3">
                    <tab.icon
                      className={`w-8 h-8 transition-all duration-300
                        ${
                          activeTab === tab.id
                            ? `text-${tab.color} text-glow-${tab.color}`
                            : "text-cyber-text-muted group-hover:text-cyber-text-secondary"
                        }`}
                    />
                    <span
                      className={`font-bold font-cyber-heading text-sm transition-all duration-300
                      ${
                        activeTab === tab.id
                          ? `text-${tab.color} text-glow-${tab.color}`
                          : "text-cyber-text-muted group-hover:text-cyber-text-secondary"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span className="text-xs text-cyber-text-muted group-hover:text-cyber-text-secondary font-cyber text-center">
                      {tab.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cyber-card p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/50 to-neon-cyan/0" />

          <div className="mb-8">
            <h2 className="text-3xl font-bold font-cyber-heading text-glow-cyan mb-4">
              {activeTab === "address" && "[ENTER_CONTRACT_ADDRESS]"}
              {activeTab === "single-file" && "[UPLOAD_CONTRACT_FILE]"}
              {activeTab === "multi-files" && "[UPLOAD_CONTRACT_FILES]"}
            </h2>
            <p className="text-cyber-text-secondary font-cyber text-lg">
              {activeTab === "address" &&
                "Enter the deployed contract address to start analysis"}
              {activeTab === "single-file" &&
                "Upload a single Solidity contract file (.sol)"}
              {activeTab === "multi-files" &&
                "Upload multiple related contract files"}
            </p>
          </div>

          {activeTab === "address" && (
            <div className="flex items-center gap-6">
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="0x..."
                className="flex-1 h-14 bg-cyber-black border-2 border-neon-cyan rounded-lg px-6
                         text-cyber-text-primary placeholder-cyber-text-muted font-cyber
                         focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan
                         hover:border-neon-cyan/70
                         transition-all duration-300 text-lg
                         focus:bg-cyber-dark/50"
              />
              <button
                onClick={handleCheck}
                disabled={loading}
                className="h-14 inline-flex items-center gap-3 px-8
                         btn-cyber text-lg font-bold font-cyber-heading
                         hover:scale-105 transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-glow-cyan">[SCANNING]</span>
                  </>
                ) : (
                  <>
                    <span className="text-glow-cyan">[CHECK_CONTRACT]</span>
                    <svg
                      className="w-6 h-6 text-glow-cyan"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
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
                <div className="border-t border-[#333333] mt-4 pt-4">
                  <h3 className="text-gray-300 text-sm font-medium mb-2">
                    Analysis Reports:
                  </h3>
                  <div className="space-y-2">
                    {analysisFiles.map((file) => (
                      <div
                        key={file.path}
                        className="bg-[#252526] p-3 rounded-lg border border-[#333333]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            {file.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleViewReport(file.content, file.name)
                              }
                              className="text-gray-400 text-sm hover:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-[#333333] transition-colors duration-150"
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
                              className="text-gray-400 text-sm hover:text-gray-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-[#333333] transition-colors duration-150"
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
                              className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-[#333333] transition-colors duration-150"
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
                onClick={() => setIsAIConfigModalOpen(true)}
                className="self-end h-14 inline-flex items-center gap-3 px-8
                         btn-cyber text-lg font-bold font-cyber-heading
                         hover:scale-105 transition-all duration-300"
              >
                <span className="text-glow-cyan">[ANALYZE_CONTRACT]</span>
                <svg
                  className="w-6 h-6 text-glow-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <AIConfigModal
                isOpen={isAIConfigModalOpen}
                onClose={() => setIsAIConfigModalOpen(false)}
                onStartAnalysis={handleStartAnalysis}
              />

              {isAnalyzing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-[#1E1E1E] rounded-lg p-8 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4">
                      <div className="absolute inset-0 border-4 border-t-[#FF8B3E] border-r-[#FF8B3E]/50 border-b-[#FF8B3E]/30 border-l-[#FF8B3E]/10 rounded-full animate-spin" />
                      <div className="absolute inset-2 bg-[#1E1E1E] rounded-full flex items-center justify-center">
                        <Image
                          src="/mush.png"
                          alt="Loading"
                          width={40}
                          height={40}
                          className="animate-bounce-slow"
                        />
                      </div>
                    </div>
                    <p className="text-[#E5E5E5] text-lg mb-2">
                      Analyzing Contract
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      This may take a few moments...
                    </p>
                    <button
                      onClick={handleCancelAnalysis}
                      className="px-4 py-2 bg-[#252526] text-[#FF8B3E] rounded-md 
                               border border-[#FF8B3E]/20
                               hover:bg-[#FF8B3E]/10 transition-colors
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
            <div className="flex flex-col gap-6">
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-neon-magenta rounded-lg p-12 bg-cyber-black/50 hover:border-neon-magenta/70 hover:bg-cyber-dark/30 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center gap-6">
                  <FilesIcon className="w-16 h-16 text-neon-magenta text-glow-magenta group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-center">
                    <p className="text-cyber-text-primary text-xl font-cyber mb-2">
                      <span className="text-neon-magenta">[</span>DRAG_AND_DROP<span className="text-neon-magenta">]</span>
                      <br />Contract files here
                    </p>
                    <p className="text-cyber-text-muted font-cyber">or</p>
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
                      className="h-12 inline-flex items-center gap-3 px-6
                      btn-cyber text-base font-bold font-cyber-heading
                      hover:scale-105 transition-all duration-300
                      cursor-pointer"
                    >
                      <span className="text-glow-magenta">[BROWSE_FILES]</span>
                      <svg className="w-5 h-5 text-glow-magenta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </span>
                  </label>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="text-cyber-text-secondary font-cyber">
                    <span className="text-neon-magenta">[</span>SELECTED_FILES<span className="text-neon-magenta">]</span>
                  </div>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center justify-between p-4 bg-cyber-dark border-2 border-neon-magenta/30 rounded-lg hover:border-neon-magenta/60 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <FileIcon className="w-5 h-5 text-neon-magenta text-glow-magenta" />
                          <span className="text-cyber-text-primary font-cyber">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(file.path)}
                          className="text-cyber-text-muted hover:text-cyber-danger transition-colors duration-300 p-2 hover:bg-cyber-danger/10 rounded"
                        >
                          <svg
                            className="w-5 h-5"
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
                    onClick={() => setIsAIConfigModalOpen(true)}
                    className="self-end h-14 inline-flex items-center gap-3 px-8
                             btn-cyber text-lg font-bold font-cyber-heading
                             hover:scale-105 transition-all duration-300"
                  >
                    <span className="text-glow-cyan">[ANALYZE_CONTRACT]</span>
                    <svg
                      className="w-6 h-6 text-glow-cyan"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {analysisFiles.length > 0 && (
                    <div className="border-t-2 border-neon-cyan mt-6 pt-6">
                      <h3 className="text-cyber-text-primary text-lg font-bold font-cyber-heading mb-4">
                        <span className="text-neon-cyan">[</span>ANALYSIS_REPORTS<span className="text-neon-cyan">]</span>
                      </h3>
                      <div className="space-y-3">
                        {analysisFiles.map((file) => (
                          <div
                            key={file.path}
                            className="cyber-card p-4 hover:scale-105 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-cyber-text-primary font-cyber">
                                {file.name}
                              </span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    handleViewReport(file.content, file.name)
                                  }
                                  className="text-neon-cyan hover:text-glow-cyan flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neon-cyan/10 transition-all duration-300 font-cyber text-sm"
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
                                  [VIEW]
                                </button>
                                <button
                                  onClick={() => handleDownloadReport(file)}
                                  className="text-neon-lime hover:text-glow-lime flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neon-lime/10 transition-all duration-300 font-cyber text-sm"
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
                                  [DOWNLOAD]
                                </button>
                                <button
                                  onClick={() => handleRemoveReport(file.path)}
                                  className="text-cyber-danger hover:text-glow-danger p-2 rounded-lg hover:bg-cyber-danger/10 transition-all duration-300"
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

              <AIConfigModal
                isOpen={isAIConfigModalOpen}
                onClose={() => setIsAIConfigModalOpen(false)}
                onStartAnalysis={handleMultiFileAnalysis}
              />

              {isAnalyzing && (
                <div className="fixed inset-0 bg-cyber-black/90 backdrop-blur-md z-50 flex items-center justify-center">
                  <div className="cyber-card p-12 flex flex-col items-center max-w-md mx-4">
                    <div className="relative w-32 h-32 mb-8">
                      <div className="absolute inset-0 border-4 border-t-neon-cyan border-r-neon-cyan/50 border-b-neon-cyan/30 border-l-neon-cyan/10 rounded-full animate-spin" />
                      <div className="absolute inset-4 bg-cyber-dark rounded-full flex items-center justify-center">
                        <Image
                          src="/mush.png"
                          alt="Loading"
                          width={48}
                          height={48}
                          className="animate-bounce-slow"
                        />
                      </div>
                    </div>
                    <p className="text-cyber-text-primary text-2xl font-bold font-cyber-heading mb-3 text-glow-cyan">
                      [ANALYZING_CONTRACT]
                    </p>
                    <p className="text-cyber-text-secondary text-lg font-cyber mb-8 text-center">
                      <span className="text-neon-cyan">[</span>PROCESSING<span className="text-neon-cyan">]</span> 
                      This may take a few moments...
                    </p>
                    <button
                      onClick={handleCancelAnalysis}
                      className="px-8 py-4 bg-cyber-danger/20 text-cyber-danger border-2 border-cyber-danger rounded-lg
                               hover:bg-cyber-danger/30 hover:text-glow-danger transition-all duration-300
                               font-bold font-cyber-heading hover:scale-105"
                    >
                      [CANCEL_ANALYSIS]
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

      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-smart-orange/0 via-smart-orange/30 to-smart-orange/0" />
    </div>
  );
}
