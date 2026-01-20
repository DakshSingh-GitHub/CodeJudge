import { getCachedProblems, setCachedProblems, getCachedProblemById, setCachedProblemById } from "./cache";

const BASE_URL = "https://code-judge-5fgd.vercel.app";

export async function getProblems() {
	const cached = getCachedProblems();
	if (cached) {
		// Fetch in background to update cache for next time
		fetch(`${BASE_URL}/problems`)
			.then(res => res.json())
			.then(data => setCachedProblems(data))
			.catch(console.error);
		return cached;
	}

	const res = await fetch(`${BASE_URL}/problems`);
	const data = await res.json();
	setCachedProblems(data);
	return data;
}

export async function getProblemById(id: string) {
	const cached = getCachedProblemById(id);
	if (cached) {
		// Fetch in background to update cache
		fetch(`${BASE_URL}/problems/${id}`)
			.then(res => res.json())
			.then(data => setCachedProblemById(id, data))
			.catch(console.error);
		return cached;
	}

	const res = await fetch(`${BASE_URL}/problems/${id}`);
	const data = await res.json();
	setCachedProblemById(id, data);
	return data;
}

export async function submitCode(problemId: string, code: string) {
	const res = await fetch(`${BASE_URL}/submit`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			problem_id: problemId,
			code: code,
		})
	});

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error || "Sumbission failed");
	}

	return res.json();
}
