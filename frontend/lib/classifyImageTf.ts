export type TfPrediction = { className: string; probability: number };

/**
 * Lazy-loads TensorFlow.js + MobileNet and returns top image labels (client-side only).
 */
export async function classifyImageMobilenet(
  file: File,
  topK = 3,
): Promise<TfPrediction[]> {
  if (typeof window === "undefined") return [];
  const [tf, mobilenet] = await Promise.all([
    import("@tensorflow/tfjs"),
    import("@tensorflow-models/mobilenet"),
  ]);
  await tf.ready();

  const url = URL.createObjectURL(file);
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });

  try {
    const model = await mobilenet.load({ version: 2, alpha: 1.0 });
    return await model.classify(img, topK);
  } finally {
    URL.revokeObjectURL(url);
  }
}
