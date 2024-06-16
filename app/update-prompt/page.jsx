// UpdatePrompt.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import from next/router for client-side routing

import Form from "@components/Form";

const UpdatePrompt = () => {
  const router = useRouter();
  const [promptId, setPromptId] = useState(null);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch promptId from query params on client-side
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setPromptId(id);
    } else {
      console.warn("Missing id parameter in query");
    }
  }, []);

  useEffect(() => {
    // Fetch prompt details when promptId changes and only on client-side
    if (promptId) {
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

      getPromptDetails();
    }
  }, [promptId]); // Dependency array ensures this effect runs when promptId changes

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
