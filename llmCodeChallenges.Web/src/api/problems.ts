export interface Problem {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  language: string;
  markdownContent: string;
}

export interface PublishProblemRequest {
  name: string;
  description?: string;
  tags: string[];
  language: string;
  markdownFile: File;
  archiveFile: File;
}

const API_BASE_URL = '/backend';

export const problemsApi = {
  async getAll(): Promise<Problem[]> {
    const response = await fetch(`${API_BASE_URL}/problems`);
        if (!response.ok) {
            throw new Error(`Failed to fetch problems: ${response.statusText}`);
    }
    return response.json();
  },

  async getById(id: string): Promise<Problem> {
        const response = await fetch(`${API_BASE_URL}/problems/${id}`);
        if (!response.ok) {
      throw new Error(`Failed to fetch problem: ${response.statusText}`);
    }
    return response.json();
  },

  async create(payload: PublishProblemRequest): Promise<Problem> {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("language", payload.language);
    formData.append("tags", JSON.stringify(payload.tags));
    if (payload.description) {
      formData.append("description", payload.description);
    }
    formData.append("markdown", payload.markdownFile);
    formData.append("archive", payload.archiveFile);

    const response = await fetch(`${API_BASE_URL}/problems`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let message = `Failed to publish problem: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody?.title) message = errorBody.title;
        else if (errorBody?.detail) message = errorBody.detail;
      } catch {
        // ignore parsing issues; fall back to default message
      }
      throw new Error(message);
    }

    return response.json();
  },
};
