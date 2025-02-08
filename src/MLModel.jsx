import * as tf from "@tensorflow/tfjs";

export const trainModel = async (years, values) => {

  if (!years || !values || years.length === 0 || values.length === 0) {
    console.error("Invalid training data.");
    return null;
  }

  // Normalize years
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const normYears = years.map(y => (y - minYear) / (maxYear - minYear));

  // Normalize values
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const normValues = values.map(v => (v - minValue) / (maxValue - minValue));

  console.log("Normalized data sample:", normYears.slice(0, 5), normValues.slice(0, 5));

  const xs = tf.tensor2d(normYears.map(y => [y])); 
  const ys = tf.tensor2d(normValues.map(v => [v])); 

  // Improve Model: More layers for better learning
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: "relu", inputShape: [1] }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam(0.01) });

  let history;
  try {
    history = await model.fit(xs, ys, { epochs: 500 });
    console.log("Model trained successfully.");
  } catch (error) {
    console.error("Model training failed:", error);
    return null;
  }

  // Return model and MSE loss from training
  return {
    model,
    minValue,
    maxValue,
    mseLoss: history.history.loss[history.history.loss.length - 1] // Get final loss value
  };
};

// Predict future values using the trained model
export const predictFutureValues = async ({ model, minValue, maxValue }, futureYears, minYear, maxYear) => {
  if (!model) {
    console.error("No model available for predictions.");
    return Array(futureYears.length).fill(NaN);
  }

  console.log("Predicting for years:", futureYears);

  // Normalize future years based on training data
  const normFutureYears = futureYears.map(y => (y - minYear) / (maxYear - minYear));

  try {
    const futureXs = tf.tensor2d(normFutureYears.map(y => [y]));

    console.log("Input tensor shape for prediction:", futureXs.shape);

    const predictions = model.predict(futureXs);
    const normPredArray = await predictions.array(); // Get normalized predictions

    // Denormalize predictions
    const denormalizedPredictions = normPredArray.map(p => p[0] * (maxValue - minValue) + minValue);

    console.log("Predictions (denormalized):", denormalizedPredictions.slice(0, 5), "...");

    return denormalizedPredictions;
  } catch (error) {
    console.error("Prediction failed:", error);
    return Array(futureYears.length).fill(NaN);
  }
};


