# APE: AI Project Evaluator

## Current State

New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add

**Backend:**
- User authentication and authorization (login/register)
- Project submission storage: title, description, purpose/use case, tech stack, expected output, uploaded files
- File upload support (ZIP, individual files) via blob-storage
- HTTP outcall to an AI API (Gemini) to analyze submitted projects
- Evaluation report storage: project summary, strengths, weaknesses, edge cases, efficiency suggestions, improvement suggestions, category scores
- API endpoints: submit project, get projects list, get evaluation by project ID

**Frontend:**
- Landing page with hero section explaining the platform
- Authentication: login and register forms
- Project submission form: title, description, purpose, tech stack, expected output, file upload
- Evaluation status page: shows "analyzing..." while AI processes
- Evaluation report view: structured display of all report sections with score table
- Dashboard: list of user's submitted projects with status (pending/evaluated)

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

1. Select Caffeine components: `authorization`, `blob-storage`, `http-outcalls`
2. Generate Motoko backend:
   - Project data type (id, userId, title, description, purpose, techStack, expectedOutput, fileIds, status, createdAt)
   - Evaluation data type (id, projectId, summary, strengths, weaknesses, edgeCases, efficiencySuggestions, improvementSuggestions, scores, totalScore, createdAt)
   - submitProject(title, description, purpose, techStack, expectedOutput) -> ProjectId
   - getMyProjects() -> [Project]
   - getEvaluation(projectId) -> ?Evaluation
   - triggerEvaluation(projectId) -> async, calls AI HTTP outcall, stores result
3. Frontend implementation:
   - Landing/hero page
   - Auth pages (login, register)
   - Dashboard listing submitted projects
   - Project submission multi-step form
   - Evaluation report page with structured sections and score table
   - Loading/pending state while AI evaluates
