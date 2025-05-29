
"use client";

import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, AlertCircle, Loader2, Sparkles, FileImage } from "lucide-react";
import Image from "next/image";
import { analyzeUserDesignAction } from "@/lib/actions/design-analysis";
import type { SuggestDesignImprovementsOutput } from "@/ai/flows/suggest-design-improvements"; // Ensure this type is correctly defined and exported

interface AnalysisResult {
  flaws: string[];
  suggestions: string[];
  improvements: SuggestDesignImprovementsOutput['improvements'];
}

interface ImageUploadFormProps {
  onAnalysisComplete: (results: AnalysisResult) => void;
  onAnalysisStart: () => void;
  onAnalysisError: (error: string) => void;
}

export function ImageUploadForm({ onAnalysisComplete, onAnalysisStart, onAnalysisError }: ImageUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB. Please upload a smaller image.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError("Invalid file type. Please upload a JPG, PNG, or WebP image.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please select an image file.");
      return;
    }
    if (!previewUrl) {
      setError("Image preview not available. Please re-select the image.");
      return;
    }

    setIsUploading(true);
    setError(null);
    onAnalysisStart();

    try {
      const result = await analyzeUserDesignAction(previewUrl, description);
      if ("error" in result) {
        setError(result.error);
        onAnalysisError(result.error);
      } else {
        onAnalysisComplete(result);
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
      onAnalysisError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <UploadCloud className="h-7 w-7 text-primary" />
          Upload Your Design
        </CardTitle>
        <CardDescription>
          Submit your design image (JPG, PNG, WebP, max 5MB) and an optional description to get AI-powered feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="design-image">Design Image</Label>
            <Input
              id="design-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="file:text-sm file:font-medium file:text-primary file:bg-primary-foreground hover:file:bg-primary/10"
              disabled={isUploading}
            />
          </div>

          {previewUrl && (
            <div className="mt-4 p-2 border rounded-md bg-muted/50 flex justify-center items-center">
              <Image
                src={previewUrl}
                alt="Design preview"
                width={400}
                height={300}
                className="rounded-md object-contain max-h-[300px]"
                data-ai-hint="design preview"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="design-description">Design Description (Optional)</Label>
            <Textarea
              id="design-description"
              placeholder="e.g., A landing page for a tech startup, focusing on a clean and modern aesthetic."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Providing context helps the AI give more relevant feedback.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isUploading || !file}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Design
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
