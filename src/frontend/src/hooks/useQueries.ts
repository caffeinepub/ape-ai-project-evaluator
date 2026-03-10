import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Evaluation, Project } from "../backend.d";
import { useActor } from "./useActor";

export function useMyProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["myProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProject(projectId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Project | null>({
    queryKey: ["project", projectId?.toString()],
    queryFn: async () => {
      if (!actor || projectId === undefined) return null;
      return actor.getProject(projectId);
    },
    enabled: !!actor && !isFetching && projectId !== undefined,
    refetchInterval: (query) => {
      const project = query.state.data;
      if (!project) return false;
      const status = project.status;
      if (status === "pending" || status === "evaluating") {
        return 5000;
      }
      return false;
    },
  });
}

export function useEvaluation(projectId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<Evaluation | null>({
    queryKey: ["evaluation", projectId?.toString()],
    queryFn: async () => {
      if (!actor || projectId === undefined) return null;
      return actor.getEvaluation(projectId);
    },
    enabled: !!actor && !isFetching && projectId !== undefined,
  });
}

export function useSubmitProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      purpose,
      techStack,
      expectedOutput,
      blobIds,
    }: {
      title: string;
      description: string;
      purpose: string;
      techStack: string;
      expectedOutput: string;
      blobIds: string[];
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const projectId = await actor.submitProject(
        title,
        description,
        purpose,
        techStack,
        expectedOutput,
        blobIds,
      );
      await actor.triggerEvaluation(projectId);
      return projectId;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myProjects"] });
    },
  });
}

export function useTriggerEvaluation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.triggerEvaluation(projectId);
    },
    onSuccess: (_data, projectId) => {
      void queryClient.invalidateQueries({
        queryKey: ["project", projectId.toString()],
      });
    },
  });
}
