import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
  clusterApiUrl,
} from "@solana/web3.js";

(async () => {
  const fromKeypair = Keypair.generate();
  const toKeypair = Keypair.generate();

  const connection = new Connection(
    "http://127.0.0.1:8899",
    "confirmed"
  );

  const airdropSignature = await connection.requestAirdrop(
    fromKeypair.publicKey,
    LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(airdropSignature);

  const lamportsToSend = 1_000_000;

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({ 
    units: 1000000 
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ 
    microLamports: 1 
  });

  const recentBlockhash = await connection.getLatestBlockhash();
  const transferTransaction = new Transaction({ recentBlockhash: recentBlockhash.blockhash, feePayer: fromKeypair.publicKey})
  .add(modifyComputeUnits)
  .add(addPriorityFee)
  .add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: lamportsToSend,
    })
  );

  const fees = await transferTransaction.getEstimatedFee(connection);
  console.log(`Estimated SOL transfer cost: ${fees} lamports`);

  const signature = await sendAndConfirmTransaction(connection, transferTransaction, [
    fromKeypair,
  ]);
  
  console.log(`Transaction sent with signature: ${signature}`);

  const result = await connection.getParsedTransaction(signature);
  console.log(result);

  console.log(toKeypair.publicKey);
  console.log(fromKeypair.publicKey);

})();

