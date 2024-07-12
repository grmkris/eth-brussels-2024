import React, { useEffect, useRef } from "react";
import paper from "paper";

export const Grid = () => {
  const canvasRef = useRef(null);
  const zoomRef = useRef(1);
  const startDrag = useRef(null);
  const iconsRef = useRef({}); // To store icons by their grid positions

  useEffect(() => {
    paper.setup(canvasRef.current);

    const gridSize = 20;

    const canvasWidth = paper.view.size.width;
    const canvasHeight = paper.view.size.height;

    for (let x = 0; x <= canvasWidth; x += gridSize) {
      const start = new paper.Point(x, 0);
      const end = new paper.Point(x, canvasHeight);
      const path = new paper.Path.Line(start, end);
      path.strokeColor = "white";
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
      const start = new paper.Point(0, y);
      const end = new paper.Point(canvasWidth, y);
      const path = new paper.Path.Line(start, end);
      path.strokeColor = "white";
    }

    const handleWheel = (event) => {
      event.preventDefault();
      const oldZoom = zoomRef.current;
      const newZoom = oldZoom * (event.deltaY < 0 ? 1.1 : 0.9);
      zoomRef.current = newZoom;

      const mousePosition = new paper.Point(event.offsetX, event.offsetY);
      const viewPosition = paper.view.viewToProject(mousePosition);

      paper.view.zoom = newZoom;
      const newViewPosition = paper.view.viewToProject(mousePosition);
      paper.view.center = paper.view.center.add(
        viewPosition.subtract(newViewPosition),
      );
    };

    const handleMouseDown = (event) => {
      startDrag.current = new paper.Point(event.offsetX, event.offsetY);
    };

    const handleMouseDrag = (event) => {
      if (startDrag.current) {
        const currentDrag = new paper.Point(event.offsetX, event.offsetY);
        const dragOffset = startDrag.current.subtract(currentDrag);
        paper.view.center = paper.view.center.add(
          dragOffset.divide(zoomRef.current),
        );
        startDrag.current = currentDrag;
      }
    };

    const handleMouseUp = () => {
      startDrag.current = null;
    };

    const handleClick = (event) => {
      const clickPosition = new paper.Point(event.offsetX, event.offsetY);
      const projectPosition = paper.view.viewToProject(clickPosition);

      const row = Math.floor(projectPosition.y / gridSize);
      const column = Math.floor(projectPosition.x / gridSize);

      console.log(`Row: ${row}, Column: ${column}`);
      const key = `${row},${column}`;
      if (iconsRef.current[key]) {
        // Remove icon
        iconsRef.current[key].remove();
        delete iconsRef.current[key];
      } else {
        // Add icon
        const icon = new paper.Path.Circle({
          center: new paper.Point(
            column * gridSize + gridSize / 2,
            row * gridSize + gridSize / 2,
          ),
          radius: gridSize / 4,
          fillColor: "red",
        });
        iconsRef.current[key] = icon;
      }
    };

    canvasRef.current.addEventListener("wheel", handleWheel);
    canvasRef.current.addEventListener("mousedown", handleMouseDown);
    canvasRef.current.addEventListener("mousemove", handleMouseDrag);
    canvasRef.current.addEventListener("mouseup", handleMouseUp);
    canvasRef.current.addEventListener("mouseleave", handleMouseUp);
    canvasRef.current.addEventListener("click", handleClick);

    // Clean up event listeners on unmount
    return () => {
      canvasRef.current.removeEventListener("wheel", handleWheel);
      canvasRef.current.removeEventListener("mousedown", handleMouseDown);
      canvasRef.current.removeEventListener("mousemove", handleMouseDrag);
      canvasRef.current.removeEventListener("mouseup", handleMouseUp);
      canvasRef.current.removeEventListener("mouseleave", handleMouseUp);
      canvasRef.current.removeEventListener("click", handleClick);
      paper.project.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      resize="true"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};
