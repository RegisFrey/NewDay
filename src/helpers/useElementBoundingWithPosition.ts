/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ref } from 'vue'
import { ResizeObserverOptions, useResizeObserver, MaybeElementRef } from '@vueuse/core'

/**
 * Reactive size and position of an HTML element.
 * (Default contentRect in ResizeObserver doesn't include real top/y left/x values)
 *
 * @see   {@link https://vueuse.js.org/useElementSize}
 * @see   {@link https://vueuse.js.org/useElementBounding}
 * @param target
 * @param callback
 * @param options
 */
export function useElementBoundingWithPosition(
  target: MaybeElementRef,
  options: ResizeObserverOptions = {},
) {
  const height = ref(0)
  const bottom = ref(0)
  const left = ref(0)
  const right = ref(0)
  const top = ref(0)
  const width = ref(0)
  const x = ref(0)
  const y = ref(0)

  useResizeObserver(
    target,
    ([entry]) => {
      const boundingClientRect = entry.target.getBoundingClientRect()
      height.value = boundingClientRect.height
      bottom.value = boundingClientRect.bottom
      left.value = boundingClientRect.left
      right.value = boundingClientRect.right
      top.value = boundingClientRect.top
      width.value = boundingClientRect.width
      x.value = boundingClientRect.x
      y.value = boundingClientRect.y
    },
    options,
  )

  return {
    x,
    y,
    top,
    right,
    bottom,
    left,
    width,
    height,
  }
}
