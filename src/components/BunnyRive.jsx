// BunnyRive component

import React, { useEffect, useState } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-webgl2";

/* Props:
   - src: path string (use "/pebble.riv" when placed in public/)
   - stateMachine: expected state machine name (we'll default to "pebble")
   - defaultInput: expected input name for hover (we'll default to "hover")
   - width / height: pixel sizes
*/

function supportsWebGL2() {
  try {
    const c = document.createElement("canvas");
    return !!(c && (c.getContext("webgl2") || c.getContext("experimental-webgl2")));
  } catch {
    return false;
  }
}

export default function BunnyRive({
  src = "/pebble.riv",
  stateMachine = "pebble",
  defaultInput = "hover",
  width = 320,
  height = 320,
}) {
  const [webglOk, setWebglOk] = useState(null);

  useEffect(() => {
    setWebglOk(supportsWebGL2());
  }, []);

  if (webglOk === null) return <div className="text-center text-gray-500">Checking WebGL2 support…</div>;
  if (!webglOk)
    return (
      <div className="p-3 max-w-md mx-auto text-center text-red-600 bg-red-50 rounded-lg shadow-md">
        <strong>WebGL2 not available</strong>
        <div className="mt-2 text-sm">
          Feathering/blur requires the WebGL2 Rive renderer. Use latest Chrome/Edge with hardware acceleration ON.
        </div>
      </div>
    );

  return (
    <RiveRenderer
      src={src}
      requestedSM={stateMachine}
      requestedInput={defaultInput}
      width={width}
      height={height}
    />
  );
}

/* ---------- Inner component that mounts the Rive hooks (only when WebGL2 OK) ---------- */

function RiveRenderer({ src, requestedSM, requestedInput, width, height }) {
  const [smName, setSmName] = useState(requestedSM || undefined);
  const [inName, setInName] = useState(requestedInput || undefined);

  // Initialize Rive with stateMachines: smName (may be undefined initially; useRive accepts undefined)
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: smName,
    autoplay: true,
  });

  // Hook into the input (may be boolean/trigger/number)
  const hoverInput = useStateMachineInput(rive, smName, inName);

  // Auto-detection logic without logging
  useEffect(() => {
    if (!rive) return;

    // If requested state machine missing, auto-fallback to first state machine
    if (smName && !rive.stateMachineNames.includes(smName)) {
      const fallback = rive.stateMachineNames && rive.stateMachineNames[0];
      if (fallback) {
        setSmName(fallback);
        return;
      }
    }

    // Try to read inputs for current state machine
    if (smName) {
      try {
        const inputs = rive.stateMachineInputs(smName);
        // Auto-select input if none or mismatch
        if ((!inName || !inputs.find((i) => i.name === inName)) && Array.isArray(inputs) && inputs.length > 0) {
          const pick = inputs.find((i) => i.type === "boolean") || inputs.find((i) => i.type === "trigger") || inputs[0];
          if (pick) {
            setInName(pick.name);
          }
        }
      } catch (err) {
        // Could not read stateMachineInputs, do nothing.
      }
    }
  }, [rive, smName, inName]);

  // Safe handlers: support boolean & trigger
  function handleEnter() {
    if (!hoverInput) {
      return;
    }
    if (typeof hoverInput.fire === "function") hoverInput.fire(); // trigger
    else if ("value" in hoverInput) hoverInput.value = true; // boolean
  }

  function handleLeave() {
    if (!hoverInput) return;
    if ("value" in hoverInput) hoverInput.value = false;
  }

  function handleClick() {
    if (!hoverInput) return;
    // for click animation maybe there is a separate "click" input; we only demo hover here.
    if (typeof hoverInput.fire === "function") hoverInput.fire();
    else if ("value" in hoverInput) hoverInput.value = !hoverInput.value;
  }

  return (
    <div style={{ width, maxWidth: width, margin: "0 auto" }}>
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        style={{
          width,
          height,
          margin: "0 auto",
          cursor: "pointer",
          background: "transparent",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Rive artboard goes here */}
        <RiveComponent style={{ width: "100%", height: "100%" }} />
      </div>

      
        {/*
      <div style={{ marginTop: 8, textAlign: "center", fontSize: 12, color: "#666" }}>
        <div>State Machine: <strong>{smName || "—"}</strong> · Input: <strong>{inName || "—"}</strong></div>
        <div style={{ marginTop: 6 }}>Open DevTools → Console for more debug logs</div>
      </div>
      */}

    </div>

  );
}