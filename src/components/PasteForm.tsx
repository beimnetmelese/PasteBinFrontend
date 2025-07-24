import { useState } from "react";
import { createSnippet } from "../api/paste";
import { SnippetCreate } from "../types/paste";

export default function PasteForm() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("plaintext");
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("");
  const [oneTime, setOneTime] = useState(false);
  const [slug, setSlug] = useState("");
  const [copied, setCopied] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const data: SnippetCreate = {
      plain_text: text,
      language: lang,
      one_time_view: oneTime,
    };

    if (password) data.password = password;
    if (expiry) data.expiry_time = expiry;

    try {
      const res = await createSnippet(data);
      setSlug(res.data.slug);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to create paste. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageOptions = [
    { value: "plaintext", label: "Plain Text" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sql", label: "SQL" },
    { value: "json", label: "JSON" },
    { value: "markdown", label: "Markdown" },
    { value: "yaml", label: "YAML" },
    { value: "xml", label: "XML" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              CodePaste
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Share code snippets quickly and securely
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Code
                  </label>
                  <span className="text-xs text-gray-500">
                    {text.length} characters
                  </span>
                </div>
                <textarea
                  id="code"
                  className="w-full text-black px-4 py-3 font-mono text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Paste your code here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={12}
                  spellCheck="false"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm text-black font-medium text-gray-700 mb-1"
                  >
                    Syntax Highlighting
                  </label>
                  <select
                    id="language"
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                  >
                    {languageOptions.map((option) => (
                      <option
                        className="text-black"
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="expiry"
                    className="block text-sm text-black font-medium text-gray-700 mb-1"
                  >
                    Expiration
                  </label>
                  <input
                    id="expiry"
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    type="datetime-local"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-black text-sm font-medium text-gray-700 mb-1"
                  >
                    Password Protection (optional)
                  </label>
                  <input
                    id="password"
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="Set a password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end md:justify-start space-x-4 pt-6">
                  <div className="flex items-center">
                    <input
                      id="one-time"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={oneTime}
                      onChange={(e) => setOneTime(e.target.checked)}
                    />
                    <label
                      htmlFor="one-time"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      One-time view
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !text.trim()}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${
                    isSubmitting || !text.trim()
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Paste"
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            {slug && (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  Paste created successfully!
                </h3>
                <p className="text-green-700 mb-3">
                  Your paste is now available at:
                </p>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/view/${slug}`}
                    className="flex-1 px-3 py-2 bg-white border border-green-200 rounded-l-md text-sm text-green-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/view/${slug}`
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                  >
                    {copied ? (
                      <>
                        <svg
                          className="-ml-0.5 mr-1.5 h-4 w-4 text-green-500"
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
                        Copied
                      </>
                    ) : (
                      <>
                        <svg
                          className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-green-600">
                  {password
                    ? "Note: This paste is password protected."
                    : oneTime
                    ? "Note: This paste will be deleted after first view."
                    : expiry
                    ? `Note: This paste will expire on ${new Date(
                        expiry
                      ).toLocaleString()}.`
                    : "Note: This paste has no expiration."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By creating a paste, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
