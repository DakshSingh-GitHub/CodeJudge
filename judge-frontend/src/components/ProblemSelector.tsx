
import { useEffect, useState } from "react";
import { fetchProblems } from "../api";

interface Problem {
    id: string;
    title: string;
}

export default function ProblemSelector({ onSelect }: { onSelect: (id: string) => void }) {
    const [problems, setProblems] = useState<Problem[]>([]);
    useEffect(() => {
        fetchProblems()
            .then(data => {
                setProblems(data.problems || []);
            })
    })
    return (
        <select onChange={(e) => onSelect(e.target.value)}>
            <option value="">Select a problem</option>
            {problems.map(p => (
                <option key={p.id} value={p.id}>
                    {p.title}
                </option>
            ))}
        </select>
    );
}
