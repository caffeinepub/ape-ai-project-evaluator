import { HttpAgent } from "@icp-sdk/core/agent";
import type { Identity } from "@icp-sdk/core/agent";
import { useCallback, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useInternetIdentity } from "./useInternetIdentity";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

interface UploadedFile {
  file: File;
  hash: string;
}

async function createStorageClient(
  identity: Identity,
  backendCanisterId: string,
  projectId: string,
  storageGatewayUrl: string,
  host: string,
): Promise<StorageClient> {
  const agent = await HttpAgent.create({
    identity,
    host,
  });

  return new StorageClient(
    "default",
    storageGatewayUrl,
    backendCanisterId,
    projectId,
    agent,
  );
}

export function useBlobStorage() {
  const { identity } = useInternetIdentity();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadFiles = useCallback(
    async (files: File[]): Promise<string[]> => {
      if (!identity) throw new Error("Not authenticated");

      setUploadState({ isUploading: true, progress: 0, error: null });

      try {
        const config = await loadConfig();
        // Access config fields safely
        const configAny = config as unknown as Record<string, string>;
        const backendCanisterId = configAny.backend_canister_id || "";
        const projectId = configAny.project_id || "";
        const storageGatewayUrl = configAny.storage_gateway_url || "";
        const host = configAny.backend_host || "https://icp-api.io";

        const storageClient = await createStorageClient(
          identity,
          backendCanisterId,
          projectId,
          storageGatewayUrl,
          host,
        );

        const hashes: string[] = [];
        const newUploadedFiles: UploadedFile[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const bytes = new Uint8Array(await file.arrayBuffer());
          const { hash } = await storageClient.putFile(bytes, (pct) => {
            const overallProgress = Math.round(
              ((i + pct / 100) / files.length) * 100,
            );
            setUploadState((prev) => ({ ...prev, progress: overallProgress }));
          });
          hashes.push(hash);
          newUploadedFiles.push({ file, hash });
        }

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);
        setUploadState({ isUploading: false, progress: 100, error: null });
        return hashes;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
        setUploadState({ isUploading: false, progress: 0, error: message });
        throw error;
      }
    },
    [identity],
  );

  const removeFile = useCallback((hash: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.hash !== hash));
  }, []);

  const reset = useCallback(() => {
    setUploadedFiles([]);
    setUploadState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    uploadFiles,
    removeFile,
    reset,
    uploadedFiles,
    isUploading: uploadState.isUploading,
    progress: uploadState.progress,
    uploadError: uploadState.error,
  };
}
