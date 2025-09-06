import React, { StrictMode } from "react";
import Example from "./App.backgroundremoved";
import KombaiWrapper from "./KombaiWrapper";
import "./styles/brand.css";
import "./styles/globals.css";
import ErrorBoundary from "@kombai/react-error-boundary";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <KombaiWrapper>
        <Example />
      </KombaiWrapper>
    </ErrorBoundary>
  </StrictMode>,
);
