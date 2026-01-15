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
        <div className="flex h-screen">
            <div className="w-1/2"></div>
            <div className="w-1/2 flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-4">Mini Online Judge</h1>
                <div className="flex-grow flex flex-col">
                    <div className="h-1/2 overflow-y-auto">
                        <ProblemSelector onSelect={handleSelect} />
                    </div>
                    <div className="h-1/2 overflow-y-auto">
                        <ProblemViewer problem={selectedProblem} />
                    </div>
                </div>
            </div>
        </div>
    );
}
