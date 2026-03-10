import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  FileCode,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitProject } from "../hooks/useQueries";

const ACCEPTED_EXTENSIONS = [
  ".zip",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".py",
  ".java",
  ".go",
  ".rs",
  ".cpp",
  ".c",
  ".html",
  ".css",
  ".json",
  ".md",
  ".txt",
  ".sh",
];

interface FormValues {
  title: string;
  description: string;
  purpose: string;
  techStack: string;
  expectedOutput: string;
}

const initialValues: FormValues = {
  title: "",
  description: "",
  purpose: "",
  techStack: "",
  expectedOutput: "",
};

function FileItem({
  file,
  onRemove,
}: {
  file: { file: File; hash: string };
  onRemove: (hash: string) => void;
}) {
  const size = `${(file.file.size / 1024).toFixed(1)} KB`;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md border border-border/50 group"
    >
      <FileCode className="w-4 h-4 text-primary flex-shrink-0" />
      <span className="text-xs text-foreground font-mono flex-1 truncate">
        {file.file.name}
      </span>
      <span className="text-xs text-muted-foreground flex-shrink-0">
        {size}
      </span>
      <button
        type="button"
        onClick={() => onRemove(file.hash)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function SubmitPage() {
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();
  const submitProject = useSubmitProject();
  const {
    uploadFiles,
    removeFile,
    uploadedFiles,
    isUploading,
    progress,
    uploadError,
  } = useBlobStorage();

  const [form, setForm] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: Partial<FormValues> = {};
    if (!form.title.trim()) newErrors.title = "Project title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!form.techStack.trim()) newErrors.techStack = "Tech stack is required";
    if (!form.expectedOutput.trim())
      newErrors.expectedOutput = "Expected output is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleField = (field: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArr = Array.from(files);
      const valid = fileArr.filter((f) => {
        const ext = `.${f.name.split(".").pop() || ""}`;
        return (
          ACCEPTED_EXTENSIONS.includes(ext.toLowerCase()) ||
          f.name.endsWith(".zip")
        );
      });
      if (valid.length === 0) {
        toast.error(
          "No valid files selected. Supported: .zip, .js, .ts, .py, .java, and more.",
        );
        return;
      }
      try {
        await uploadFiles(valid);
        toast.success(
          `${valid.length} file${valid.length > 1 ? "s" : ""} uploaded`,
        );
      } catch {
        toast.error(uploadError || "File upload failed");
      }
    },
    [uploadFiles, uploadError],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      await processFiles(e.dataTransfer.files);
    },
    [processFiles],
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        await processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const blobIds = uploadedFiles.map((f) => f.hash);
      const projectId = await submitProject.mutateAsync({
        ...form,
        blobIds,
      });
      toast.success("Project submitted! AI evaluation started.");
      void navigate({
        to: "/project/$id",
        params: { id: projectId.toString() },
      });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-sm mx-auto"
        >
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4 opacity-70" />
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-sm text-muted-foreground mb-6">
            You need to be signed in to submit a project.
          </p>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  const isBusy = isSubmitting || isUploading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          type="button"
          onClick={() => void navigate({ to: "/dashboard" })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold font-display">Submit Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in your project details and upload your code for AI evaluation.
        </p>
      </motion.div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* Project Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-1.5"
        >
          <Label htmlFor="title" className="text-sm font-medium">
            Project Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            data-ocid="submit.input"
            placeholder="e.g. Student Grade Management System"
            value={form.title}
            onChange={(e) => handleField("title", e.target.value)}
            disabled={isBusy}
            className={`bg-input border-border focus:border-primary focus:ring-primary/20 ${errors.title ? "border-destructive" : ""}`}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-1.5"
        >
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            data-ocid="submit.textarea"
            placeholder="Describe what your project does and how it works..."
            value={form.description}
            onChange={(e) => handleField("description", e.target.value)}
            disabled={isBusy}
            rows={4}
            className={`bg-input border-border focus:border-primary focus:ring-primary/20 resize-none ${errors.description ? "border-destructive" : ""}`}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description}</p>
          )}
        </motion.div>

        {/* Purpose */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-1.5"
        >
          <Label htmlFor="purpose" className="text-sm font-medium">
            Purpose / Use Case <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="purpose"
            placeholder="What problem does this project solve? Who are the users?"
            value={form.purpose}
            onChange={(e) => handleField("purpose", e.target.value)}
            disabled={isBusy}
            rows={3}
            className={`bg-input border-border focus:border-primary focus:ring-primary/20 resize-none ${errors.purpose ? "border-destructive" : ""}`}
          />
          {errors.purpose && (
            <p className="text-xs text-destructive">{errors.purpose}</p>
          )}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-1.5"
        >
          <Label htmlFor="techStack" className="text-sm font-medium">
            Technology Stack <span className="text-destructive">*</span>
          </Label>
          <Input
            id="techStack"
            placeholder="e.g. React, Node.js, MongoDB, Express"
            value={form.techStack}
            onChange={(e) => handleField("techStack", e.target.value)}
            disabled={isBusy}
            className={`bg-input border-border focus:border-primary focus:ring-primary/20 ${errors.techStack ? "border-destructive" : ""}`}
          />
          <p className="text-xs text-muted-foreground">
            Separate technologies with commas
          </p>
          {errors.techStack && (
            <p className="text-xs text-destructive">{errors.techStack}</p>
          )}
        </motion.div>

        {/* Expected Output */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-1.5"
        >
          <Label htmlFor="expectedOutput" className="text-sm font-medium">
            Expected Output <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="expectedOutput"
            placeholder="What should the project produce or accomplish? Describe the expected results..."
            value={form.expectedOutput}
            onChange={(e) => handleField("expectedOutput", e.target.value)}
            disabled={isBusy}
            rows={3}
            className={`bg-input border-border focus:border-primary focus:ring-primary/20 resize-none ${errors.expectedOutput ? "border-destructive" : ""}`}
          />
          {errors.expectedOutput && (
            <p className="text-xs text-destructive">{errors.expectedOutput}</p>
          )}
        </motion.div>

        {/* File Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Label className="text-sm font-medium">
            Project Files{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>

          {/* Drop Zone */}
          <label
            data-ocid="submit.dropzone"
            htmlFor="file-upload-input"
            onDrop={(e) => void handleDrop(e)}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer block ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 hover:bg-accent/30"
            } ${isBusy ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input
              id="file-upload-input"
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_EXTENSIONS.join(",")}
              onChange={(e) => void handleFileInput(e)}
              className="sr-only"
            />
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground font-medium mb-1">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported: .zip, .js, .ts, .py, .java, .go, .html, .css, and more
            </p>
          </label>

          {/* Upload progress */}
          {isUploading && (
            <div data-ocid="submit.loading_state" className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading files...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-muted" />
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <p className="text-xs text-destructive">{uploadError}</p>
          )}

          {/* Upload button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="submit.upload_button"
            asChild
            disabled={isBusy}
            className="gap-1.5 border-border text-muted-foreground hover:text-foreground"
          >
            <label htmlFor="file-upload-input" className="cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              Add Files
            </label>
          </Button>

          {/* Uploaded files list */}
          <AnimatePresence>
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <p className="text-xs text-muted-foreground">
                  {uploadedFiles.length} file
                  {uploadedFiles.length > 1 ? "s" : ""} ready
                </p>
                {uploadedFiles.map((f) => (
                  <FileItem key={f.hash} file={f} onRemove={removeFile} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="pt-2"
        >
          <Button
            type="submit"
            size="lg"
            data-ocid="submit.submit_button"
            disabled={isBusy}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span data-ocid="submit.loading_state">
                  Submitting & Starting Evaluation...
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Submit for Evaluation
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI evaluation will start immediately after submission
          </p>
        </motion.div>
      </form>
    </div>
  );
}
