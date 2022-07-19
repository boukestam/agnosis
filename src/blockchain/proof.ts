export async function calculateProof(input: {
  [key: string]: any;
}): Promise<[[string, string], [[string, string], [string, string]], [string, string], string[]]> {
  console.log('Creating proof...');

  const { proof, publicSignals } = await (window as any).snarkjs.groth16.fullProve(
    input,
    process.env.PUBLIC_URL + '/sokoban.wasm',
    process.env.PUBLIC_URL + '/sokoban_final.zkey',
  );

  const s = await (window as any).snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

  return JSON.parse('[' + s + ']');
}
