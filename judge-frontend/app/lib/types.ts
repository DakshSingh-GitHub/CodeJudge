export interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty?: string;
    input_format?: string;
    output_format?: string;
    sample_test_cases?: Array<{ input: string; output: string }>;
    constraints?: Record<string, unknown>;
}
