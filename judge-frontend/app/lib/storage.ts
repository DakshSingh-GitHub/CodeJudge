export interface Submission {
    id: string;
    problemId: string;
    problemTitle: string;
    code: string;
    final_status: string;
    summary: {
        passed: number;
        total: number;
    };
    total_duration: number;
    timestamp: number;
}

const STORAGE_KEY = "code_judge_submissions";

export function saveSubmission(submission: Omit<Submission, "id" | "timestamp">) {
    if (typeof window === "undefined") return;

    const submissions = getSubmissions();
    const newSubmission: Submission = {
        ...submission,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
    };

    submissions.unshift(newSubmission);
    // Keep only last 50 submissions to avoid bloating localStorage
    const trimmedSubmissions = submissions.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSubmissions));
    return newSubmission;
}

export function getSubmissions(): Submission[] {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse submissions from localStorage", e);
        return [];
    }
}

export function getSubmissionsByProblemId(problemId: string): Submission[] {
    return getSubmissions().filter((s) => s.problemId === problemId);
}
