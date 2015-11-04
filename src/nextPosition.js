export default function nextPosition({start, end}, value, nextValue) {
  const expectedShrinkage = end - start;
  const actualShrinkage = value.length - nextValue.length;
  return Math.max(0, start + (expectedShrinkage - actualShrinkage));
}
