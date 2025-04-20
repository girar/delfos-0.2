// File: src/routes/delfos/game/components/dragPreview.ts

/**
 * This module provides functions to create, update, and remove a custom drag preview.
 * The preview element is styled with rounded corners (via border-radius) and overflow: hidden.
 * 
 * NOTE: This file is part of the Tarot game components located in the route-specific folder
 * (src/routes/delfos/game/components/). Ensure that imports from other game components use a relative path.
 */

let customPreviewEl: HTMLElement | null = null;

/**
 * Creates and attaches a custom drag preview element to the body.
 * @param imageUrl - The URL to use for the preview image.
 * @param width - The desired width (default: 140px).
 * @param height - The desired height (default: 210px).
 * @returns The created HTMLElement.
 */
export function createCustomPreview(imageUrl: string, width = 140, height = 210): HTMLElement {
  // Create a container with the desired styling.
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.borderRadius = '0.7rem';
  container.style.overflow = 'hidden';
  container.style.zIndex = '10000';
  container.style.pointerEvents = 'none';
  container.style.opacity = '1';

  // Create and append the image.
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.width = '100%';
  img.style.height = '100%';
  container.appendChild(img);

  document.body.appendChild(container);
  customPreviewEl = container;
  return container;
}

/**
 * Updates the position of the custom drag preview element so that it follows the mouse.
 * @param pageX - The current X coordinate of the pointer.
 * @param pageY - The current Y coordinate of the pointer.
 */
export function updateCustomPreviewPosition(pageX: number, pageY: number): void {
  if (customPreviewEl) {
    const offsetX = customPreviewEl.clientWidth / 2;
    const offsetY = customPreviewEl.clientHeight / 2;
    customPreviewEl.style.left = `${pageX - offsetX}px`;
    customPreviewEl.style.top = `${pageY - offsetY}px`;
  }
}

/**
 * Removes the custom drag preview element from the DOM.
 */
export function removeCustomPreview(): void {
  if (customPreviewEl) {
    customPreviewEl.remove();
    customPreviewEl = null;
  }
}
