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
        <div style={{ marginTop: "1rem" }}>
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>

            {problem.input_format && (
                <>
                    <h4>Input Format</h4>
                    <p>{problem.input_format}</p>
                </>
            )}

            {problem.output_format && (
                <>
                    <h4>Output Format</h4>
                    <p>{problem.output_format}</p>
                </>
            )}

            {problem.constraints && (
                <>
                    <h4>Constraints</h4>
                    <pre>{JSON.stringify(problem.constraints, null, 2)}</pre>
                </>
            )}
        </div>
    );
}
