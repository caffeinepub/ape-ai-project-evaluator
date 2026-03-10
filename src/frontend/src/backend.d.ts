import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Evaluation {
    id: bigint;
    weaknesses: Array<string>;
    improvementSuggestions: Array<string>;
    strengths: Array<string>;
    scores: Array<CategoryScore>;
    createdAt: bigint;
    maxTotalScore: bigint;
    totalScore: bigint;
    summary: string;
    edgeCases: Array<string>;
    projectId: bigint;
    efficiencySuggestions: Array<string>;
}
export interface CategoryScore {
    maxScore: bigint;
    score: bigint;
    category: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Project {
    id: bigint;
    status: Variant_evaluated_pending_evaluating_failed;
    title: string;
    expectedOutput: string;
    userId: Principal;
    blobIds: Array<string>;
    createdAt: bigint;
    description: string;
    purpose: string;
    techStack: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_evaluated_pending_evaluating_failed {
    evaluated = "evaluated",
    pending = "pending",
    evaluating = "evaluating",
    failed = "failed"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllEvaluations(): Promise<Array<Evaluation>>;
    getCallerUserRole(): Promise<UserRole>;
    getEvaluation(projectId: bigint): Promise<Evaluation | null>;
    getMyProjects(): Promise<Array<Project>>;
    getProject(projectId: bigint): Promise<Project | null>;
    isCallerAdmin(): Promise<boolean>;
    submitProject(title: string, description: string, purpose: string, techStack: string, expectedOutput: string, blobIds: Array<string>): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    triggerEvaluation(projectId: bigint): Promise<void>;
}
