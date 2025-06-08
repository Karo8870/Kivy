const M = new Float32Array([
  1.059184514635691, -0.003127324496318, -50.172578429907901,
  -0.001023940476662, 1.095574527794295, -62.407247451892545, 0.000003413292905,
  -0.000003864663043, 1.0
]);

const width = 1920;
const height = 1080;

export function transformCoordinates(x: number, y: number) {
  const point = [x, y, 1];

  const transformedX = M[0] * point[0] + M[1] * point[1] + M[2];
  const transformedY = M[3] * point[0] + M[4] * point[1] + M[5];
  const transformedW = M[6] * point[0] + M[7] * point[1] + M[8];

  if (Math.abs(transformedW) < 1e-8) {
    return [0, 0];
  }

  let newX = transformedX / transformedW;
  let newY = transformedY / transformedW;

  newX = Math.min(Math.max(0, newX), width - 1);
  newY = Math.min(Math.max(0, newY), height - 1);

  return [newX, newY];
}
