import { useParams, Link } from "react-router-dom";
import { mockProblems } from "../mock";
import Header from "../components/Header";
import MarkdownIt from "markdown-it";
import { useMemo, useCallback } from "react";

const md = new MarkdownIt();

function Problem() {
  const { id } = useParams<{ id: string }>();
  const problemId = parseInt(id || "1", 10);

  const problem = useMemo(() => {
    return mockProblems.find((p) => p.id === problemId);
  }, [problemId]);

  const htmlContent = useMemo(() => {
    if (!problem) return "";
    return md.render(problem.markdownContent);
  }, [problem]);

  const copyChallengeCommand = useCallback(() => {
    const command = `lcc fetch ${problemId}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(command).catch(() => {
        console.warn("Failed to copy challenge command");
      });
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = command;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }, [problemId]);

  if (!problem) {
    return (
      <div
        className="relative flex h-auto min-h-screen w-full flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
      >
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold mb-4">Problem Not Found</h1>
            <Link to="/" className="text-[#1380ec] hover:underline">
              Back to Problems
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <Header />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex items-center gap-4 p-4">
              <Link
                to="/"
                className="text-[#9dabb9] hover:text-white transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
                Back to Problems
              </Link>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-sm rounded bg-[#283039] text-[#9dabb9]">
                  {problem.language}
                </span>
                {problem.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-sm rounded bg-[#1c2127] text-[#9dabb9]">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-white text-3xl font-bold mt-4 mb-2">{problem.title}</h1>
              <p className="text-[#9dabb9] text-base mb-6">{problem.description}</p>
            </div>

            <div className="p-4">
              <div
                className="markdown-body text-white"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            <div className="p-4 mt-6">
              <button
                onClick={copyChallengeCommand}
                className="w-full flex items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1380ec] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0d6ecc] transition-colors"
              >
                <span>Copy Challenge Command</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Problem;
