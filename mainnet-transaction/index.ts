import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    clusterApiUrl,
    Keypair
  } from "@solana/web3.js";
import { config } from 'dotenv';
config();

  (async () => {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  
    // Sender's wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('privateKey environment variable is not set');
    }
    const fromWallet = Keypair.fromSecretKey(new Uint8Array(

    ));
  
    // Receiver's wallet
    const toKey = process.env.TO_KEY;
    if (!toKey) {
        throw new Error('TO_KEY environment variable is not set');
    }
    const toWallet = new PublicKey(toKey);
  
    // Amount to send (in lamports)
    const amountToSend = .01 * LAMPORTS_PER_SOL; // 1 SOL
  
    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toWallet,
        lamports: amountToSend
      })
    );
  
    // Sign transaction
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.sign(fromWallet);
  
    // Send transaction
    const txid = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
  
    console.log(`Transaction sent with signature ${txid}`);
  })();