"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Importing from next/router instead of next/navigation

import Form from "@components/Form";

const UpdatePrompt = () => {
  const router = useRouter();
  const [promptId, setPromptId] = useState(null); // State to hold promptId
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Function to get prompt details
    const getPromptDetails = async () => {
      try {
        const response = await fetch(`/api/prompt/${promptId}`);
        if (response.ok) {
          const data = await response.json();
          setPost({
            prompt: data.prompt,
            tag: data.tag,
          });
        } else {
          throw new Error("Failed to fetch prompt details");
        }
      } catch (error) {
        console.error("Error fetching prompt details:", error);
      }
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  useEffect(() => {
    // Fetch promptId from query params
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setPromptId(id);
    } else {
      console.warn("Missing id parameter in query");
    }
  }, []);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) {
      alert("Missing PromptId!");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/"); // Redirect to homepage on success
      } else {
        throw new Error("Failed to update prompt");
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type='Edit'
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default UpdatePrompt;
