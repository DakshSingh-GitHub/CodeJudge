const BASE_URL = "https://code-judge-5fgd.vercel.app";

export async function getProblems() {
    const res = await fetch(`${BASE_URL}/problems`);
    return res.json();
}

export async function getProblemById(id: any) {
    const res = await fetch(`${BASE_URL}/problems/${id}`);
    return res.json();
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
