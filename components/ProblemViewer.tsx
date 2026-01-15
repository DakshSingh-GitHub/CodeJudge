interface Problem {
    title: string;
    description: string;
    input_format?: string;
    output_format?: string;
    constraints?: Record<string, unknown>;
}

interface ProblemViewerProps {
    problem: Problem | null;
}


export default function ProblemViewer({ problem }: ProblemViewerProps) {
    if (!problem) return null;

    return (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
            <h2 className="text-xl font-bold">{problem.title}</h2>
            <p className="mt-2">{problem.description}</p>

            {problem.input_format && (
                <>
                    <h4 className="text-lg font-semibold mt-4">Input Format</h4>
                    <p className="mt-1">{problem.input_format}</p>
                </>
            )}

            {problem.output_format && (
                <>
                    <h4 className="text-lg font-semibold mt-4">Output Format</h4>
                    <p className="mt-1">{problem.output_format}</p>
                </>
            )}

            {problem.constraints && (
                <>
                    <h4 className="text-lg font-semibold mt-4">Constraints</h4>
                    <pre className="mt-1 p-2 bg-gray-100 rounded-md">
                        {JSON.stringify(problem.constraints, null, 2)}
                    </pre>
                </>
            )}
        </div>
    );
}
