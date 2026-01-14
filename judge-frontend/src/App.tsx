import { useState } from "react";
import { fetchProblemById } from "./api";
import ProblemSelector from "./components/ProblemSelector";
import ProblemViewer from "./components/ProblemViewer";

export default function App() {
    const [selectedProblem, setSelectedProblem] = useState(null);

    async function handleSelect(id: string) {
        if (!id) {
            setSelectedProblem(null);
            return;
        }
        const data = await fetchProblemById(id);
        setSelectedProblem(data);
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Mini Online Judge</h1>
            <ProblemSelector onSelect={handleSelect} />
            <ProblemViewer problem={selectedProblem} />
        </div>
    );
}
