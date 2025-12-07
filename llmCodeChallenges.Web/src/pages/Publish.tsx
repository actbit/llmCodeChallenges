import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { problemsApi } from "../api/problems";

function Publish() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTags = async () => {
      setLoadingTags(true);
      try {
        const problems = await problemsApi.getAll();
        if (cancelled) return;
        setAllTags(Array.from(new Set(problems.flatMap((p) => p.tags))).sort());
        setTagError(null);
      } catch (err) {
        if (cancelled) return;
        setTagError(
          err instanceof Error ? err.message : "Failed to load tags. You can still continue without them."
        );
      } finally {
        if (!cancelled) {
          setLoadingTags(false);
        }
      }
    };

    fetchTags();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const isFormValid = Boolean(title.trim() && language.trim() && zipFile && markdownFile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setStatus("Please fill in all required fields.");
      return;
    }

    try {
      setStatus("Generating preview...");
      const markdownContent = await markdownFile!.text();
      setStatus(null);
      navigate("/publish/preview", {
        state: {
          title: title.trim(),
          language: language.trim(),
          tags: selectedTags,
          zipName: zipFile?.name,
          markdownName: markdownFile?.name,
          zipFile,
          markdownFile,
          markdownContent,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus("Failed to read markdown file for preview. " + message);
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
                Publish Challenge
              </p>
              <p className="text-[#9dabb9] text-sm font-normal leading-normal">
                Upload assets and details to publish a new coding challenge.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-white text-base font-medium leading-normal">
                    Title<span className="text-[#f87171] ml-1">*</span>
                  </span>
                  <input
                    placeholder="Enter challenge title"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1c2127] focus:border-[#3b4754] h-14 placeholder:text-[#9dabb9] px-4 text-base font-normal leading-normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    id="0"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-white text-base font-medium leading-normal">
                    Language<span className="text-[#f87171] ml-1">*</span>
                  </span>
                  <input
                    placeholder="e.g. Python, JavaScript"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1c2127] focus:border-[#3b4754] h-14 placeholder:text-[#9dabb9] px-4 text-base font-normal leading-normal"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    required
                    id="1"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-white text-base font-medium leading-normal">
                    Challenge Archive (zip)<span className="text-[#f87171] ml-1">*</span>
                  </span>
                  <input
                    type="file"
                    accept=".zip"
                    className="text-white text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#283039] file:px-4 file:py-2 file:text-white file:cursor-pointer"
                    onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                    required
                  />
                  {zipFile && (
                    <span className="text-[#9dabb9] text-sm">Selected: {zipFile.name}</span>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-white text-base font-medium leading-normal">
                    Problem Statement (markdown)<span className="text-[#f87171] ml-1">*</span>
                  </span>
                  <input
                    type="file"
                    accept=".md,.markdown,text/markdown"
                    className="text-white text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#283039] file:px-4 file:py-2 file:text-white file:cursor-pointer"
                    onChange={(e) => setMarkdownFile(e.target.files?.[0] || null)}
                    required
                  />
                  {markdownFile && (
                    <span className="text-[#9dabb9] text-sm">Selected: {markdownFile.name}</span>
                  )}
                </label>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-white text-base font-medium leading-normal">
                  Tags <span className="text-[#9dabb9] text-sm font-normal">(optional)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {loadingTags && (
                    <span className="text-[#9dabb9] text-sm">Loading tags from server...</span>
                  )}
                  {tagError && <span className="text-[#f87171] text-sm">{tagError}</span>}
                  {allTags.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                          active
                            ? "bg-[#1380ec] border-[#1380ec] text-white"
                            : "bg-[#1c2127] border-[#3b4754] text-[#9dabb9] hover:bg-[#283039]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  {!loadingTags && !tagError && allTags.length === 0 && (
                    <span className="text-[#9dabb9] text-sm">No tags available.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1380ec] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0d6ecc] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Preview Content
                </button>
                {status && <p className="text-[#9dabb9] text-sm">{status}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Publish;

