
const BASE_URL = 'http://localhost:5000';

export async function fetchProblems() {
    const res = await fetch(`${BASE_URL}/problems`);
    return res.json();
}

export async function fetchProblemById(id:any) {
    const res = await fetch(`${BASE_URL}/problems/${id}`);
    return res.json();
}
