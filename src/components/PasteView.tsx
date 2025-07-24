import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSnippet } from "../api/paste";
import { SnippetResponse } from "../types/paste";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function PasteView() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<SnippetResponse | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getSnippet(slug!, password);
      const decrypted = res.data.decrypted;

      if (decrypted === "Password required or incorrect") {
        setRequiresPassword(true);
        setError(
          "This paste is password protected. Please enter the password."
        );
        setData(null);
        return;
      }

      if (!decrypted) {
        setError(
          "This paste is either expired or was already viewed (one-time view)."
        );
        setData(null);
        return;
      }

      setData(res.data);
      setError("");
      setRequiresPassword(false);
      setSubmitted(true);

      // Handle expiration countdown
      if (res.data.expiry_time) {
        const expiryTime = new Date(res.data.expiry_time).getTime();
        const updateCountdown = () => {
          const now = new Date().getTime();
          const diff = expiryTime - now;
          if (diff <= 0) {
            setCountdown("Expired");
            return;
          }
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / 1000 / 60) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          setCountdown(`Expires in ${hours}h ${minutes}m ${seconds}s`);
        };
        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
      }
    } catch (err) {
      setError("Unable to fetch paste. Check the link or try again later.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = async () => {
    if (data?.decrypted) {
      await navigator.clipboard.writeText(data.decrypted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    if (data?.decrypted) {
      const blob = new Blob([data.decrypted], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}.${data.language || "txt"}`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              CodePaste
            </span>
          </h1>
          <p className="text-lg text-gray-600">View and share code snippets</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Input */}
              {requiresPassword && !submitted && (
                <div className="mb-8">
                  <div className="text-center mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      Password Required
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This paste is protected. Please enter the password to view
                      it.
                    </p>
                  </div>
                  <form onSubmit={handleSubmitPassword} className="space-y-4">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Paste
                    </button>
                  </form>
                </div>
              )}

              {/* Paste Content */}
              {data?.decrypted && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mt-1">
                          Created at:{" "}
                          {new Date(data.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {data.language && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {data.language}
                          </span>
                        )}
                        {data.one_time_view && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            One-time view
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Now outside the code display */}
                  <div className="flex flex-wrap gap-3 justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        {copied ? (
                          <>
                            <svg
                              className="-ml-0.5 mr-2 h-5 w-5 text-green-500"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg
                              className="-ml-0.5 mr-2 h-5 w-5 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            Copy Code
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <svg
                          className="-ml-0.5 mr-2 h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download
                      </button>
                    </div>
                    {countdown && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {countdown}
                      </div>
                    )}
                  </div>

                  {/* Code Viewer */}
                  <div className="relative">
                    <SyntaxHighlighter
                      language={data.language || "text"}
                      style={atomDark}
                      customStyle={{
                        margin: 0,
                        padding: "1.5rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        backgroundColor: "#1e1e1e",
                        maxHeight: "70vh",
                        overflow: "auto",
                      }}
                      showLineNumbers
                      wrapLines
                    >
                      {data.decrypted}
                    </SyntaxHighlighter>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href="/"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      <svg
                        className="mr-1 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create your own paste
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
