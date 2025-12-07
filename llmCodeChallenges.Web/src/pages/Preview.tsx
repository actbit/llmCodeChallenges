import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MarkdownIt from "markdown-it";
import { problemsApi } from "../api/problems";

type PreviewState = {
  title?: string;
  language?: string;
  tags?: string[];
  zipName?: string | null;
  markdownName?: string | null;
  markdownContent?: string | null;
  zipFile?: File | null;
  markdownFile?: File | null;
};

const md = new MarkdownIt();

function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as PreviewState;
  const [status, setStatus] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (
      !state.title ||
      !state.language ||
      !state.zipName ||
      !state.markdownName ||
      !state.markdownContent ||
      !state.zipFile ||
      !state.markdownFile
    ) {
      navigate("/publish", { replace: true });
    }
  }, [state, navigate]);

  const markdownHtml = useMemo(() => {
    return state.markdownContent ? md.render(state.markdownContent) : "";
  }, [state.markdownContent]);

  const handlePublish = async () => {
    if (!state.title || !state.language || !state.zipFile || !state.markdownFile) {
      setStatus("Missing required data. Please go back and try again.");
      return;
    }

    try {
      setPublishing(true);
      setStatus("Publishing challenge...");
      const created = await problemsApi.create({
        name: state.title,
        language: state.language,
        tags: state.tags || [],
        markdownFile: state.markdownFile,
        archiveFile: state.zipFile,
      });

      setStatus(null);
      navigate(`/challenge/${created.id}`, { replace: true });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to publish challenge.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-col gap-2 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                Preview Content
              </p>
              <p className="text-[#9dabb9] text-sm font-normal leading-normal">
                Review the details before publishing your coding challenge.
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-[#1c2127] border border-[#3b4754] rounded-lg p-4">
                <p className="text-white text-lg font-semibold mb-2">Overview</p>
                <p className="text-[#9dabb9] text-sm mb-1">
                  <span className="text-white font-medium">Title:</span> {state.title || "-"}
                </p>
                <p className="text-[#9dabb9] text-sm mb-1">
                  <span className="text-white font-medium">Language:</span>{" "}
                  {state.language || "-"}
                </p>
                <p className="text-[#9dabb9] text-sm mb-1">
                  <span className="text-white font-medium">Archive:</span> {state.zipName || "-"}
                </p>
                <p className="text-[#9dabb9] text-sm">
                  <span className="text-white font-medium">Markdown:</span>{" "}
                  {state.markdownName || "-"}
                </p>
              </div>

              <div className="bg-[#1c2127] border border-[#3b4754] rounded-lg p-4">
                <p className="text-white text-lg font-semibold mb-2">Tags</p>
                {state.tags && state.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {state.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg bg-[#283039] text-[#9dabb9] text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#9dabb9] text-sm">No tags selected.</p>
                )}
              </div>

              <div className="bg-[#1c2127] border border-[#3b4754] rounded-lg p-4">
                <p className="text-white text-lg font-semibold mb-2">Problem Statement Preview</p>
                {markdownHtml ? (
                  <div
                    className="markdown-body text-white"
                    dangerouslySetInnerHTML={{ __html: markdownHtml }}
                  />
                ) : (
                  <p className="text-[#9dabb9] text-sm">No markdown content to display.</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border border-[#3b4754] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#283039] transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex min-w-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1380ec] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0d6ecc] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {publishing ? "Publishing..." : "Publish Challenge"}
                </button>
              </div>
              {status && <p className="text-[#9dabb9] text-sm pt-2">{status}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
